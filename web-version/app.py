import os
import sys
from flask import Flask, render_template, jsonify, request, session
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime, timedelta
import threading
import time
from functools import wraps
from membit_client import MembitClient
from gemini_client import GeminiClient
from twitter_client import TwitterClient
from auth_manager import AuthManager

# Suppress Gemini warnings
os.environ['GRPC_VERBOSITY'] = 'ERROR'
os.environ['GLOG_minloglevel'] = '2'

# Load environment variables from .env file
from pathlib import Path
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path, override=True)

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)
CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Initialize Auth Manager
auth_manager = AuthManager()

# Global variables
bot_status = {
    'running': False,
    'last_run': None,
    'next_run': None,
    'total_tweets': 0,
    'success_count': 0,
    'error_count': 0,
    'last_tweet': None,
    'last_error': None
}

# Store logs in memory (max 100 entries)
log_history = []
MAX_LOGS = 100

# Store bot configuration
bot_config = {
    'enable_image': False,
    'image_style': 'digital art',
    'image_width': 1200,
    'image_height': 675,
    'membit_use_trending': True,   # Always enabled (required)
    'membit_use_cluster_info': False,  # Optional, default unchecked
    'membit_use_posts': False  # Optional, default unchecked
}

# Load prompt from file if exists
def load_prompt_config():
    """Load prompt template from file"""
    prompt_file = Path(__file__).parent / 'prompt_template.txt'
    if prompt_file.exists():
        with open(prompt_file, 'r', encoding='utf-8') as f:
            bot_config['prompt_template'] = f.read()
    else:
        # Default prompt
        bot_config['prompt_template'] = """Anda adalah seorang social media manager yang ahli di bidang Web3 dan cryptocurrency. 

Analisis data trending dari Membit berikut:
{trending_data}

Tugas Anda:
1. Pilih SATU topik paling menarik dan relevan dari data di atas
2. Prioritaskan topik yang sedang trending atau memiliki pergerakan signifikan
3. Buat tweet informatif dan engaging dalam Bahasa Inggris

Aturan PENTING:
- Tweet MAKSIMAL {max_tweet_length} karakter (termasuk spasi dan hashtag)
- Singkat, padat, dan menarik
- Fokus pada insight atau fakta menarik
- Gunakan tone profesional tapi tetap casual
- Akhiri dengan 1-2 hashtag relevan (contoh: #Web3, #Crypto, #DeFi, #NFT, #Oracle, #Layer2, dll sesuai topik)
- Jawab HANYA dengan tweet final, tanpa penjelasan atau pengantar apapun"""

def save_prompt_config():
    """Save prompt template to file"""
    prompt_file = Path(__file__).parent / 'prompt_template.txt'
    with open(prompt_file, 'w', encoding='utf-8') as f:
        f.write(bot_config.get('prompt_template', ''))

# Load prompt on startup
load_prompt_config()

scheduler_thread = None
stop_scheduler = False

# Auth decorator
def login_required(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in'):
            return jsonify({'error': 'Authentication required', 'auth_required': True}), 401
        return f(*args, **kwargs)
    return decorated_function

def emit_log(message, level='info'):
    """Emit log message to frontend"""
    global log_history
    
    log_entry = {
        'message': message,
        'level': level,
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    # Add to history
    log_history.append(log_entry)
    
    # Keep only last MAX_LOGS entries
    if len(log_history) > MAX_LOGS:
        log_history = log_history[-MAX_LOGS:]
    
    # Emit to connected clients
    socketio.emit('log', log_entry)

def create_and_post_tweet():
    """Main function to create and post tweet"""
    global bot_status, stop_scheduler
    
    max_retries = int(os.getenv('MAX_RETRIES', 3))
    max_tweet_length = int(os.getenv('MAX_TWEET_LENGTH', 250))
    
    emit_log('Starting tweet generation...', 'info')
    
    for attempt in range(max_retries):
        # Check if bot was stopped
        if stop_scheduler:
            emit_log('Bot stopped, cancelling tweet generation', 'warning')
            return
        
        try:
            if attempt > 0:
                emit_log(f'Retry attempt {attempt + 1}/{max_retries}', 'warning')
            
            # Initialize clients
            emit_log('Initializing clients...', 'info')
            
            # Debug: Check if API keys are loaded
            gemini_key = os.getenv('GEMINI_API_KEY')
            if not gemini_key:
                raise Exception("GEMINI_API_KEY not found in environment variables")
            
            membit = MembitClient(os.getenv('MEMBIT_API_KEY'))
            gemini = GeminiClient(gemini_key)
            twitter = TwitterClient(
                api_key=os.getenv('TWITTER_API_KEY'),
                api_secret=os.getenv('TWITTER_API_SECRET'),
                access_token=os.getenv('TWITTER_ACCESS_TOKEN'),
                access_secret=os.getenv('TWITTER_ACCESS_SECRET')
            )
            
            # Check if bot was stopped
            if stop_scheduler:
                emit_log('Bot stopped, cancelling tweet generation', 'warning')
                return
            
            # Get data from Membit based on user settings
            emit_log('Fetching data from Membit...', 'info')
            
            membit_data_parts = []
            cluster_label = None
            
            # 1. Trending Topics (clusters_search) - Always enabled
            if True:  # Always fetch trending topics (required)
                emit_log('→ Getting trending topics...', 'info')
                try:
                    trending = membit.get_trending_topics(query="Web3", limit=10)
                    membit_data_parts.append(f"TRENDING TOPICS:\n{trending}")
                    emit_log('Got trending topics', 'success')
                    
                    # Try to extract first cluster label for deep dive
                    # Format: label="Cluster Name Here"
                    try:
                        import re
                        # Find first occurrence of label="..."
                        match = re.search(r'label="([^"]+)"', trending)
                        if match:
                            cluster_label = match.group(1)
                            emit_log(f'Found cluster label: {cluster_label}', 'info')
                    except Exception as e:
                        emit_log(f'⚠️ Failed to extract cluster label: {str(e)}', 'warning')
                except Exception as e:
                    emit_log(f'⚠️ Failed to get trending topics: {str(e)}', 'warning')
            
            # 2. Cluster Details (clusters_info)
            if bot_config.get('membit_use_cluster_info', False):
                emit_log('Getting cluster details...', 'info')
                try:
                    if cluster_label:
                        cluster_info = membit.get_cluster_info(label=cluster_label, limit=10)
                        membit_data_parts.append(f"\nDETAILED CONTEXT:\n{cluster_info}")
                        emit_log(f'Got details for cluster: {cluster_label}', 'success')
                    else:
                        emit_log('⚠️ No cluster label found, skipping deep dive', 'warning')
                        emit_log('💡 Tip: Enable Trending Topics to get cluster labels', 'info')
                except Exception as e:
                    emit_log(f'⚠️ Failed to get cluster details: {str(e)}', 'warning')
            
            # 3. Posts Search (posts_search)
            if bot_config.get('membit_use_posts', False):
                emit_log('Getting community posts...', 'info')
                try:
                    posts = membit.search_posts(query="Web3", limit=5)
                    membit_data_parts.append(f"\nCOMMUNITY POSTS:\n{posts}")
                    emit_log('Got community posts', 'success')
                except Exception as e:
                    emit_log(f'⚠️ Failed to get posts: {str(e)}', 'warning')
            
            # Combine all data
            if membit_data_parts:
                trending_data = "\n\n".join(membit_data_parts)
            else:
                # Trending failed (should not happen often)
                emit_log('⚠️ Failed to fetch Membit data. Using fallback.', 'warning')
                trending_data = "Web3 and cryptocurrency trending topics"
            
            # Check if bot was stopped
            if stop_scheduler:
                emit_log('Bot stopped, cancelling tweet generation', 'warning')
                return
            
            # Generate tweet
            emit_log('Generating tweet with Gemini AI...', 'info')
            
            # Use custom prompt template from config
            prompt_template = bot_config.get('prompt_template', '')
            
            if not prompt_template:
                raise Exception("Prompt template not configured. Please set it in Settings.")
            
            # Validate prompt template
            if '{max_tweet_length}' not in prompt_template:
                emit_log('Warning: Prompt template missing {max_tweet_length} variable. Gemini may generate long tweets.', 'warning')
            
            # Format prompt with variables
            try:
                prompt = prompt_template.format(
                    trending_data=trending_data,
                    max_tweet_length=max_tweet_length
                )
            except KeyError as e:
                raise Exception(f"Invalid prompt template. Missing variable: {e}")
            
            emit_log(f'Using custom prompt (template: {len(prompt_template)} chars, formatted: {len(prompt)} chars)', 'info')
            
            tweet_text = gemini.generate_content(prompt)
            tweet_text = tweet_text.strip().strip('"').strip("'")
            
            # Validate length
            if len(tweet_text) > 280:
                emit_log(f'Tweet too long ({len(tweet_text)} chars), regenerating...', 'warning')
                continue
            
            emit_log(f'Generated tweet ({len(tweet_text)} chars): {tweet_text}', 'success')
            
            # Check if bot was stopped before posting
            if stop_scheduler:
                emit_log('Bot stopped, cancelling tweet posting', 'warning')
                return
            
            # Generate and upload image if enabled
            media_ids = None
            if bot_config.get('enable_image', False):
                try:
                    emit_log('Generating image with AI...', 'info')
                    
                    # Generate image prompt from tweet
                    image_prompt = gemini.generate_image_prompt(tweet_text)
                    emit_log(f'Image prompt: {image_prompt}', 'info')
                    
                    # Generate image
                    image_gen = ImageGenerator()
                    image_path = image_gen.generate_image(
                        prompt=image_prompt,
                        width=bot_config.get('image_width', 1200),
                        height=bot_config.get('image_height', 675),
                        style=bot_config.get('image_style', 'digital art')
                    )
                    emit_log(f'Image generated: {image_path}', 'success')
                    
                    # Upload to Twitter
                    emit_log('Uploading image to Twitter...', 'info')
                    media_id = twitter.upload_media(image_path)
                    media_ids = [media_id]
                    emit_log('Image uploaded successfully', 'success')
                    
                    # Cleanup
                    image_gen.cleanup()
                    
                except Exception as img_error:
                    emit_log(f'Failed to generate/upload image: {str(img_error)}', 'warning')
                    emit_log('Continuing with text-only tweet...', 'info')
                    media_ids = None
            
            # Post tweet
            if media_ids:
                emit_log('Posting tweet with image to Twitter...', 'info')
            else:
                emit_log('Posting tweet to Twitter...', 'info')
            result = twitter.post_tweet(tweet_text, media_ids=media_ids)
            
            # Update status
            bot_status['last_run'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            bot_status['total_tweets'] += 1
            bot_status['success_count'] += 1
            bot_status['last_tweet'] = {
                'text': tweet_text,
                'id': result.get('id'),
                'url': f"https://twitter.com/i/web/status/{result.get('id')}",
                'timestamp': bot_status['last_run']
            }
            
            emit_log(f'Tweet posted successfully! ID: {result.get("id")}', 'success')
            socketio.emit('status_update', bot_status)
            return
            
        except Exception as e:
            error_msg = str(e)
            emit_log(f'Error: {error_msg}', 'error')
            bot_status['error_count'] += 1
            bot_status['last_error'] = {
                'message': error_msg,
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            if attempt < max_retries - 1:
                emit_log('Retrying in 5 seconds...', 'warning')
                # Sleep in small intervals to allow stopping
                for _ in range(5):
                    if stop_scheduler:
                        emit_log('Bot stopped during retry wait', 'warning')
                        return
                    time.sleep(1)
            else:
                emit_log('Max retries reached. Giving up.', 'error')
                socketio.emit('status_update', bot_status)
                return

def scheduler_loop():
    """Scheduler loop for auto-posting"""
    global stop_scheduler, bot_status
    
    schedule_hours = int(os.getenv('SCHEDULE_HOURS', 6))
    
    while not stop_scheduler:
        create_and_post_tweet()
        
        if stop_scheduler:
            break
        
        # Calculate next run
        next_run_time = datetime.now().timestamp() + (schedule_hours * 3600)
        bot_status['next_run'] = datetime.fromtimestamp(next_run_time).strftime('%Y-%m-%d %H:%M:%S')
        socketio.emit('status_update', bot_status)
        
        emit_log(f'Next run in {schedule_hours} hours', 'info')
        
        # Sleep in small intervals to allow stopping
        for _ in range(schedule_hours * 3600):
            if stop_scheduler:
                break
            time.sleep(1)

# ============================================================================
# AUTHENTICATION ROUTES
# ============================================================================

@app.route('/api/auth/status')
def auth_status():
    """Check authentication status"""
    return jsonify({
        'setup_completed': auth_manager.is_setup_completed(),
        'logged_in': session.get('logged_in', False),
        'username': session.get('username') if session.get('logged_in') else None
    })

@app.route('/api/auth/setup', methods=['POST'])
def auth_setup():
    """Initial setup - create username, password, and 2FA"""
    try:
        # Check if already setup
        if auth_manager.is_setup_completed():
            return jsonify({'success': False, 'error': 'Setup already completed'}), 400
        
        data = request.json
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        success, qr_code, totp_secret, backup_codes, error = auth_manager.setup_auth(username, password)
        
        if success:
            return jsonify({
                'success': True,
                'qr_code': qr_code,
                'totp_secret': totp_secret,
                'backup_codes': backup_codes
            })
        else:
            return jsonify({'success': False, 'error': error}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/auth/verify-setup', methods=['POST'])
def auth_verify_setup():
    """Verify TOTP code during setup"""
    try:
        data = request.json
        totp_code = data.get('totp_code', '').strip()
        
        success, error = auth_manager.verify_setup(totp_code)
        
        if success:
            # Setup completed, user must login manually
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': error}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def auth_login():
    """Login with username, password, and TOTP code"""
    try:
        data = request.json
        username = data.get('username', '').strip()
        password = data.get('password', '')
        totp_code = data.get('totp_code', '').strip()
        
        success, error = auth_manager.verify_login(username, password, totp_code)
        
        if success:
            session['logged_in'] = True
            session['username'] = username
            session.permanent = True
            
            emit_log(f'User {username} logged in', 'info')
            
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': error}), 401
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/auth/logout', methods=['POST'])
def auth_logout():
    """Logout current user"""
    username = session.get('username', 'Unknown')
    session.clear()
    emit_log(f'User {username} logged out', 'info')
    return jsonify({'success': True})

@app.route('/api/auth/change-password', methods=['POST'])
@login_required
def auth_change_password():
    """Change password"""
    try:
        data = request.json
        old_password = data.get('old_password', '')
        new_password = data.get('new_password', '')
        totp_code = data.get('totp_code', '').strip()
        
        success, error = auth_manager.change_password(old_password, new_password, totp_code)
        
        if success:
            emit_log('Password changed successfully', 'success')
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': error}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/auth/regenerate-backup-codes', methods=['POST'])
@login_required
def auth_regenerate_backup_codes():
    """Regenerate backup codes"""
    try:
        data = request.json
        password = data.get('password', '')
        totp_code = data.get('totp_code', '').strip()
        
        success, backup_codes, error = auth_manager.regenerate_backup_codes(password, totp_code)
        
        if success:
            emit_log('Backup codes regenerated', 'success')
            return jsonify({'success': True, 'backup_codes': backup_codes})
        else:
            return jsonify({'success': False, 'error': error}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================================================
# MAIN ROUTES
# ============================================================================

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/api/status')
@login_required
def get_status():
    """Get bot status"""
    return jsonify(bot_status)

@app.route('/api/config', methods=['GET', 'POST'])
@login_required
def handle_config():
    """Get or update bot configuration"""
    if request.method == 'POST':
        try:
            data = request.json
            
            # Update environment variables
            os.environ['SCHEDULE_HOURS'] = str(data.get('schedule_hours', 6))
            os.environ['MAX_RETRIES'] = str(data.get('max_retries', 3))
            os.environ['MAX_TWEET_LENGTH'] = str(data.get('max_tweet_length', 250))
            
            # Update image config in memory
            bot_config['enable_image'] = data.get('enable_image', False)
            bot_config['image_style'] = data.get('image_style', 'digital art')
            bot_config['image_width'] = int(data.get('image_width', 1200))
            bot_config['image_height'] = int(data.get('image_height', 675))
            
            # Update Membit data source config
            bot_config['membit_use_trending'] = True  # Always enabled (required)
            bot_config['membit_use_cluster_info'] = data.get('membit_use_cluster_info', False)
            bot_config['membit_use_posts'] = data.get('membit_use_posts', False)
            
            # Update .env file
            env_path = Path(__file__).parent / '.env'
            with open(env_path, 'r') as f:
                lines = f.readlines()
            
            with open(env_path, 'w') as f:
                for line in lines:
                    if line.startswith('SCHEDULE_HOURS='):
                        f.write(f"SCHEDULE_HOURS={data.get('schedule_hours', 6)}\n")
                    elif line.startswith('MAX_RETRIES='):
                        f.write(f"MAX_RETRIES={data.get('max_retries', 3)}\n")
                    elif line.startswith('MAX_TWEET_LENGTH='):
                        f.write(f"MAX_TWEET_LENGTH={data.get('max_tweet_length', 250)}\n")
                    else:
                        f.write(line)
            
            # Don't emit log here, let frontend handle it
            return jsonify({'success': True})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})
    
    # GET request
    return jsonify({
        'schedule_hours': int(os.getenv('SCHEDULE_HOURS', 6)),
        'max_retries': int(os.getenv('MAX_RETRIES', 3)),
        'max_tweet_length': int(os.getenv('MAX_TWEET_LENGTH', 250)),
        'prompt_template': bot_config.get('prompt_template', ''),
        'enable_image': bot_config.get('enable_image', False),
        'image_style': bot_config.get('image_style', 'digital art'),
        'image_width': bot_config.get('image_width', 1200),
        'image_height': bot_config.get('image_height', 675),
        'membit_use_trending': bot_config.get('membit_use_trending', True),
        'membit_use_cluster_info': bot_config.get('membit_use_cluster_info', False),
        'membit_use_posts': bot_config.get('membit_use_posts', False)
    })

@app.route('/api/prompt', methods=['POST'])
@login_required
def update_prompt():
    """Update prompt template"""
    try:
        data = request.json
        new_prompt = data.get('prompt_template', '')
        
        if not new_prompt:
            return jsonify({'success': False, 'error': 'Prompt template cannot be empty'})
        
        # Update in memory
        bot_config['prompt_template'] = new_prompt
        
        # Save to file for persistence
        save_prompt_config()
        
        emit_log('Updated and saved', 'success')
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/keys', methods=['GET', 'POST'])
@login_required
def handle_keys():
    """Get or update API keys"""
    if request.method == 'POST':
        try:
            data = request.json
            
            # Update environment variables
            if data.get('membit_key'):
                os.environ['MEMBIT_API_KEY'] = data['membit_key']
            if data.get('gemini_key'):
                os.environ['GEMINI_API_KEY'] = data['gemini_key']
            if data.get('twitter_key'):
                os.environ['TWITTER_API_KEY'] = data['twitter_key']
            if data.get('twitter_secret'):
                os.environ['TWITTER_API_SECRET'] = data['twitter_secret']
            if data.get('twitter_token'):
                os.environ['TWITTER_ACCESS_TOKEN'] = data['twitter_token']
            if data.get('twitter_access_secret'):
                os.environ['TWITTER_ACCESS_SECRET'] = data['twitter_access_secret']
            
            # Update .env file
            env_path = Path(__file__).parent / '.env'
            
            # Read existing content or create new
            env_content = {}
            if env_path.exists():
                with open(env_path, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#') and '=' in line:
                            key, value = line.split('=', 1)
                            env_content[key] = value
            
            # Update with new values
            if data.get('membit_key'):
                env_content['MEMBIT_API_KEY'] = data['membit_key']
            if data.get('gemini_key'):
                env_content['GEMINI_API_KEY'] = data['gemini_key']
            if data.get('twitter_key'):
                env_content['TWITTER_API_KEY'] = data['twitter_key']
            if data.get('twitter_secret'):
                env_content['TWITTER_API_SECRET'] = data['twitter_secret']
            if data.get('twitter_token'):
                env_content['TWITTER_ACCESS_TOKEN'] = data['twitter_token']
            if data.get('twitter_access_secret'):
                env_content['TWITTER_ACCESS_SECRET'] = data['twitter_access_secret']
            
            # Write back to file
            with open(env_path, 'w', encoding='utf-8') as f:
                f.write("# Flask Configuration\n")
                f.write(f"SECRET_KEY={env_content.get('SECRET_KEY', 'change-this-secret-key')}\n\n")
                
                f.write("# Bot Configuration\n")
                f.write(f"SCHEDULE_HOURS={env_content.get('SCHEDULE_HOURS', '6')}\n")
                f.write(f"MAX_RETRIES={env_content.get('MAX_RETRIES', '3')}\n")
                f.write(f"MAX_TWEET_LENGTH={env_content.get('MAX_TWEET_LENGTH', '250')}\n\n")
                
                f.write("# API Keys\n")
                f.write(f"MEMBIT_API_KEY={env_content.get('MEMBIT_API_KEY', '')}\n")
                f.write(f"GEMINI_API_KEY={env_content.get('GEMINI_API_KEY', '')}\n")
                f.write(f"TWITTER_API_KEY={env_content.get('TWITTER_API_KEY', '')}\n")
                f.write(f"TWITTER_API_SECRET={env_content.get('TWITTER_API_SECRET', '')}\n")
                f.write(f"TWITTER_ACCESS_TOKEN={env_content.get('TWITTER_ACCESS_TOKEN', '')}\n")
                f.write(f"TWITTER_ACCESS_SECRET={env_content.get('TWITTER_ACCESS_SECRET', '')}\n")
            
            # Reload environment variables
            load_dotenv(dotenv_path=env_path, override=True)
            
            # Don't emit log here, let frontend handle it
            return jsonify({'success': True})
        except Exception as e:
            emit_log(f'❌ Failed to save API keys: {str(e)}', 'error')
            return jsonify({'success': False, 'error': str(e)})
    
    # GET request - return masked keys for security
    return jsonify({
        'membit_key': mask_key(os.getenv('MEMBIT_API_KEY', '')),
        'gemini_key': mask_key(os.getenv('GEMINI_API_KEY', '')),
        'twitter_key': mask_key(os.getenv('TWITTER_API_KEY', '')),
        'twitter_secret': mask_key(os.getenv('TWITTER_API_SECRET', '')),
        'twitter_token': mask_key(os.getenv('TWITTER_ACCESS_TOKEN', '')),
        'twitter_access_secret': mask_key(os.getenv('TWITTER_ACCESS_SECRET', ''))
    })

def mask_key(key):
    """Return full key (will be masked by password input type in browser)"""
    return key if key else ''

@app.route('/api/logs')
@login_required
def get_logs():
    """Get log history"""
    return jsonify(log_history)

@socketio.on('start_bot')
def handle_start_bot():
    """Start the bot"""
    global scheduler_thread, stop_scheduler, bot_status
    
    # Check authentication
    if not session.get('logged_in'):
        emit('error', {'message': 'Authentication required'})
        return
    
    if bot_status['running']:
        emit('error', {'message': 'Bot is already running'})
        return
    
    # Validate API keys before starting
    required_keys = {
        'MEMBIT_API_KEY': 'Membit',
        'GEMINI_API_KEY': 'Gemini',
        'TWITTER_API_KEY': 'Twitter API Key',
        'TWITTER_API_SECRET': 'Twitter API Secret',
        'TWITTER_ACCESS_TOKEN': 'Twitter Access Token',
        'TWITTER_ACCESS_SECRET': 'Twitter Access Secret'
    }
    
    missing_keys = []
    for key, name in required_keys.items():
        if not os.getenv(key):
            missing_keys.append(name)
    
    if missing_keys:
        error_msg = f"Cannot start bot. Missing API keys: {', '.join(missing_keys)}. Please configure them in Settings."
        emit_log(f'❌ {error_msg}', 'error')
        emit('error', {'message': error_msg})
        return
    
    bot_status['running'] = True
    stop_scheduler = False
    
    scheduler_thread = threading.Thread(target=scheduler_loop, daemon=True)
    scheduler_thread.start()
    
    emit('status_update', bot_status)

@socketio.on('stop_bot')
def handle_stop_bot():
    """Stop the bot"""
    global stop_scheduler, bot_status
    
    # Check authentication
    if not session.get('logged_in'):
        emit('error', {'message': 'Authentication required'})
        return
    
    if not bot_status['running']:
        emit('error', {'message': 'Bot is not running'})
        return
    
    stop_scheduler = True
    bot_status['running'] = False
    bot_status['next_run'] = None
    
    emit_log('Bot stopped by user', 'warning')
    emit('status_update', bot_status)

@socketio.on('run_once')
def handle_run_once():
    """Run tweet generation once"""
    # Check authentication
    if not session.get('logged_in'):
        emit('error', {'message': 'Authentication required'})
        return
    
    # Validate API keys before running
    required_keys = {
        'MEMBIT_API_KEY': 'Membit',
        'GEMINI_API_KEY': 'Gemini',
        'TWITTER_API_KEY': 'Twitter API Key',
        'TWITTER_API_SECRET': 'Twitter API Secret',
        'TWITTER_ACCESS_TOKEN': 'Twitter Access Token',
        'TWITTER_ACCESS_SECRET': 'Twitter Access Secret'
    }
    
    missing_keys = []
    for key, name in required_keys.items():
        if not os.getenv(key):
            missing_keys.append(name)
    
    if missing_keys:
        error_msg = f"Cannot run bot. Missing API keys: {', '.join(missing_keys)}. Please configure them in Settings."
        emit_log(f'❌ {error_msg}', 'error')
        emit('error', {'message': error_msg})
        return
    
    emit_log('Running single tweet generation...', 'info')
    threading.Thread(target=create_and_post_tweet, daemon=True).start()

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    # Send current status
    emit('status_update', bot_status)
    
    # Send log history to new client
    for log_entry in log_history:
        emit('log', log_entry)
    
    emit_log('🔌 Connected to server', 'info')

def check_initial_setup():
    """Check if initial setup is needed"""
    required_keys = ['MEMBIT_API_KEY', 'GEMINI_API_KEY', 'TWITTER_API_KEY']
    missing_keys = [key for key in required_keys if not os.getenv(key)]
    
    if missing_keys:
        print('\n' + '='*60)
        print('⚠️  INITIAL SETUP REQUIRED')
        print('='*60)
        print('\nSome API keys are missing. Please configure them via web interface:')
        print('1. Open http://localhost:5173 in your browser')
        print('2. Click "Settings" button')
        print('3. Go to "API Keys" tab')
        print('4. Enter your API keys')
        print('5. Click "Save"')
        print('\nMissing keys:', ', '.join(missing_keys))
        print('='*60 + '\n')

if __name__ == '__main__':
    import logging
    
    # Suppress Flask/Werkzeug logs
    log = logging.getLogger('werkzeug')
    log.setLevel(logging.ERROR)
    
    print('='*50)
    print('🚀 Backend Running')
    print('='*50)
    print('📱 http://localhost:5000')
    print('🛑 Press Ctrl+C to stop')
    print('='*50)
    
    # Check if initial setup is needed
    check_initial_setup()
    
    socketio.run(app, host='0.0.0.0', port=5000, debug=False, log_output=False)
