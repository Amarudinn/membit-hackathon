import os
import sys
from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime
import threading
import time
from membit_client import MembitClient
from gemini_client import GeminiClient
from twitter_client import TwitterClient

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
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

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
bot_config = {}

# Load prompt from file if exists
def load_prompt_config():
    """Load prompt template from file"""
    prompt_file = Path(__file__).parent / 'prompt_template.txt'
    if prompt_file.exists():
        with open(prompt_file, 'r', encoding='utf-8') as f:
            bot_config['prompt_template'] = f.read()
    else:
        # Default prompt
        bot_config['prompt_template'] = """Anda adalah seorang social media manager yang ahli. Tugas Anda adalah melihat data tren dari Membit berikut:

{trending_data}

Pilih SATU topik paling menarik terkait 'Web3', dan membuat draf tweet yang informatif dalam Bahasa Indonesia. 

PENTING: 
- Tweet MAKSIMAL {max_tweet_length} karakter (termasuk spasi dan hashtag)
- Harus singkat, padat, dan menarik
- Akhiri dengan hashtag #Web3
- Jawab HANYA dengan draf tweet, tanpa pengantar apa pun"""

def save_prompt_config():
    """Save prompt template to file"""
    prompt_file = Path(__file__).parent / 'prompt_template.txt'
    with open(prompt_file, 'w', encoding='utf-8') as f:
        f.write(bot_config.get('prompt_template', ''))

# Load prompt on startup
load_prompt_config()

scheduler_thread = None
stop_scheduler = False

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
            
            # Get trending data
            emit_log('Fetching trending data from Membit...', 'info')
            trending_data = membit.get_trending_topics()
            
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
            
            # Post tweet
            emit_log('Posting to Twitter...', 'info')
            result = twitter.post_tweet(tweet_text)
            
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
                emit_log('⏳ Retrying in 5 seconds...', 'warning')
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

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/api/status')
def get_status():
    """Get bot status"""
    return jsonify(bot_status)

@app.route('/api/config', methods=['GET', 'POST'])
def handle_config():
    """Get or update bot configuration"""
    if request.method == 'POST':
        try:
            data = request.json
            
            # Update environment variables
            os.environ['SCHEDULE_HOURS'] = str(data.get('schedule_hours', 6))
            os.environ['MAX_RETRIES'] = str(data.get('max_retries', 3))
            os.environ['MAX_TWEET_LENGTH'] = str(data.get('max_tweet_length', 250))
            
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
        'prompt_template': bot_config.get('prompt_template', '')
    })

@app.route('/api/prompt', methods=['POST'])
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
        
        emit_log('Prompt template updated and saved', 'success')
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/keys', methods=['GET', 'POST'])
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
def get_logs():
    """Get log history"""
    return jsonify(log_history)

@socketio.on('start_bot')
def handle_start_bot():
    """Start the bot"""
    global scheduler_thread, stop_scheduler, bot_status
    
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
    
    emit_log('🚀 Bot started successfully', 'success')
    emit('status_update', bot_status)

@socketio.on('stop_bot')
def handle_stop_bot():
    """Stop the bot"""
    global stop_scheduler, bot_status
    
    if not bot_status['running']:
        emit('error', {'message': 'Bot is not running'})
        return
    
    stop_scheduler = True
    bot_status['running'] = False
    bot_status['next_run'] = None
    
    emit_log('🛑 Bot stopped by user', 'warning')
    emit('status_update', bot_status)

@socketio.on('run_once')
def handle_run_once():
    """Run tweet generation once"""
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
        print('1. Open http://localhost:5000 in your browser')
        print('2. Click "Settings" button')
        print('3. Go to "API Keys" tab')
        print('4. Enter your API keys')
        print('5. Click "Save All Settings"')
        print('\nMissing keys:', ', '.join(missing_keys))
        print('='*60 + '\n')

if __name__ == '__main__':
    print('🚀 Starting Twitter Bot Web Interface...')
    print('📱 Open http://localhost:5000 in your browser')
    print('🛑 Press Ctrl+C to stop')
    
    # Check if initial setup is needed
    check_initial_setup()
    
    socketio.run(app, host='0.0.0.0', port=5000, debug=False)
