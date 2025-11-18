# 🌐 Twitter Bot - Modern Web Dashboard (Vite + React)

Automatic Twitter bot with modern web dashboard built with **Vite + React** for posting tweets based on trending topics from Membit using Google Gemini AI.

## ✨ Main Features

### 🎮 Control Panel
- **Start Bot** - Run bot with automatic scheduler
- **Stop Bot** - Stop bot (immediately responsive)
- **Run Once** - Test posting 1 tweet
- **Status Indicator** - Red/green circle in top right corner

### 📊 Real-time Monitoring
- **Statistics Cards** - Total tweets, success count, error count
- **Activity Logs** - Color-coded logs (info, success, warning, error)
- **Last Tweet Preview** - View last tweet with link to Twitter
- **Auto-scroll Logs** - Logs automatically scroll down

### ⚙️ Settings Management
- **API Keys Tab** - Configure Membit, Gemini, Twitter API
- **Configuration Tab** - Schedule hours, max retries, tweet length
- **Prompt Tab** - Customize prompt template for AI
- **Password Toggle** - Show/hide API keys
- **Persistent Storage** - Settings saved in `.env` file

### 📖 Complete Guide
- **Guide Button** - Access guide from dashboard
- **2 Guide Tabs:**
  - **How to Use** - Setup, configuration, operations
  - **Rate Limits** - Twitter API limits info & best practices
- **GitHub-style Markdown** - Tables, code blocks, info boxes
- **External Links** - Icon ↗ for external links

## 📋 Prerequisites

### Software
- Python 3.8 or higher
- pip (Python package manager)
- Modern browser (Chrome, Firefox, Edge, Safari)

### API Keys
- **Membit API Key** - [Register here](https://membit.ai/integration)
- **Google Gemini API Key** - [Register here](https://aistudio.google.com/app/apikey)
- **Twitter API Credentials** - [Developer Portal](https://developer.twitter.com)
  - API Key (Consumer Key)
  - API Secret (Consumer Secret)
  - Access Token
  - Access Token Secret

### Flask Configuration
- **RandomKeygen** - [Generate here](https://randomkeygen.com/)

- Or `python -c "import secrets; print(secrets.token_hex(32))"`


**📖 Twitter API Setup Guide:** See [TWITTER_SETUP.md](TWITTER_SETUP.md) for complete steps.

**⚠️ Twitter Rate Limits:** See [TWITTER_RATE_LIMITS.md](TWITTER_RATE_LIMITS.md) for important information about API limitations.

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/Amarudinn/membit-hackathon.git
cd membit-hackathon/web-version
```
### 2. Use Virtual Environments

```bash
# Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Backend Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt
```

### 4. Setup Environment Variables

Copy the `.env.example` file to `.env`:

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Edit the `.env` file and fill in your credentials:

```env
# API Keys
MEMBIT_API_KEY=your_membit_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Twitter API
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_SECRET=your_twitter_access_secret_here

# Bot Configuration
SCHEDULE_HOURS=6
MAX_RETRIES=3
MAX_TWEET_LENGTH=250

# Flask Configuration
SECRET_KEY=your-secret-key
```

### 5. Install Frontend Dependencies

```bash
# Navigate to frontend folder
cd frontend

# Install Node.js dependencies
npm install
```

### 6. Run Frontend Dev Server

```bash
# In web-version/frontend folder
cd frontend
npm run dev
```

Frontend will run at `http://localhost:5173`

### 7. Open Browser & Setup API Keys

Access dashboard at: **http://localhost:5173**

**First Time Setup:**
1. Dashboard will display warning if API keys are not configured yet
2. Click **"⚙️ Settings"** button
3. Go to **"API Keys"** tab
4. Fill in all API keys:
   - **Membit API Key** - From Membit
   - **Gemini API Key** - From Google AI Studio
   - **Twitter API Key** - Consumer Key from Twitter
   - **Twitter API Secret** - Consumer Secret from Twitter
   - **Twitter Access Token** - Access Token from Twitter
   - **Twitter Access Secret** - Access Token Secret from Twitter
5. (Optional) **"Configuration"** tab - Adjust schedule, retries, tweet length
6. (Optional) **"Prompt"** tab - Customize prompt template for AI
7. Click **"Save All Settings"**
8. Bot is ready to use!

**💡 Tips:**
- Use eye icon (👁️) to show/hide password
- All settings are saved in `.env` file
- Read complete guide by clicking **"📖 Panduan"** button

## 🎮 How to Use

### Control Panel

**Status Indicator** (top right corner of Control Panel):
- 🔴 **Stopped** - Bot is not running
- 🟢 **Running** - Bot is running automatically

**Control Buttons:**

1. **▶️ Start Bot**
   - Start bot with automatic scheduler
   - Bot will post every X hours (according to SCHEDULE_HOURS)
   - Status changes to "Running" (green)
   - Displays "Next Run" time

2. **⏹️ Stop Bot**
   - Stop the running bot
   - Bot stops immediately (responsive, max 1 second)
   - Status changes to "Stopped" (red)
   - Safe: does not post tweet after stop

3. **⏩ Run Once**
   - Post 1 tweet now (for testing)
   - Does not affect schedule
   - Good for testing before starting automatic mode

### Monitoring Dashboard

**Statistics Cards:**
- **Total Tweets** - Total tweets posted
- **Success** - Number of successful tweets (green)
- **Errors** - Number of failures (red)

**Activity Logs:**
- 🔵 **Info** - General information (blue)
- ✅ **Success** - Successful operation (green)
- ⚠️ **Warning** - Warning (yellow)
- ❌ **Error** - Error/failed (red)
- Auto-scroll to latest log
- Max 100 log entries

**Last Tweet Card:**
- Last tweet content
- Posting timestamp
- Link to tweet on Twitter (click to open)

### Settings

**API Keys Tab:**
- Input all API credentials
- Password input with show/hide toggle
- Validation before save

**Configuration Tab:**
- **Schedule Hours** (1-24) - Posting interval (recommended: 6)
- **Max Retries** (1-10) - Number of retries if failed (recommended: 3)
- **Max Tweet Length** (100-280) - Maximum tweet length (recommended: 250)

**Prompt Tab:**
- Customize prompt template for Gemini AI
- Required variables: `{trending_data}`, `{max_tweet_length}`
- Example prompt provided
- Tips for creating effective prompts

### Guide

Click **"📖 Panduan"** button to access:

**"How to Use" Tab:**
- Initial setup (API keys)
- Bot configuration
- Customize prompt template
- Bot operations
- Monitoring & troubleshooting

**"Rate Limits" Tab:**
- Twitter API limits info (50 tweets/24 hours)
- How to avoid rate limit
- Best practices
- Troubleshooting error 429

## ⚙️ Configuration

### Via Environment Variables (`.env`)

| Variable | Default | Description |
|----------|---------|-----------|
| `SCHEDULE_HOURS` | `6` | Posting time interval (in hours) |
| `MAX_RETRIES` | `3` | Number of retry attempts if failed |
| `MAX_TWEET_LENGTH` | `250` | Maximum tweet length (characters) |
| `SECRET_KEY` | - | Flask secret key for session |

### Changing AI Prompt

**Via Dashboard (Recommended):**
1. Click **"⚙️ Settings"**
2. **"Prompt"** tab
3. Edit prompt template
4. Click **"Save All Settings"**

**Via File:**
- Edit `prompt_template.txt` in `web-version` folder
- Restart bot to apply changes

**Required Variables:**
- `{trending_data}` - Trend data from Membit
- `{max_tweet_length}` - Maximum tweet length

## 🐛 Troubleshooting

### Bot Cannot Start

**Problem:** "Start Bot" button disabled

**Cause:** API keys not configured yet

**Solution:**
1. Click **"⚙️ Settings"**
2. **"API Keys"** tab
3. Fill in all API keys
4. Click **"Save All Settings"**
5. Button will be enabled automatically

### Error 401 Unauthorized (Twitter)

**Cause:**
- Twitter permissions still "Read only"
- Access Token generated before changing permissions

**Solution:**
1. Read [TWITTER_SETUP.md](TWITTER_SETUP.md) for complete guide
2. Set permissions to "Read and Write"
3. Regenerate Access Token & Secret
4. Update in Settings

### Error 429 Too Many Requests

**Cause:** Already posted > 50 tweets in 24 hours

**Solution:**
1. Stop bot
2. Wait 15 minutes
3. Adjust schedule: Settings → Configuration → Schedule Hours = 6 or more
4. Read [TWITTER_RATE_LIMITS.md](TWITTER_RATE_LIMITS.md) for details

### Port 5000 Already in Use

**Solution:** Change port in `app.py`:

```python
socketio.run(app, host='0.0.0.0', port=8080, debug=False)
```

### WebSocket Connection Failed

**Solution:** Allow port in firewall:

```bash
# Windows
netsh advfirewall firewall add rule name="Flask" dir=in action=allow protocol=TCP localport=5000

# Linux
sudo ufw allow 5000
```

### Dashboard Not Loading

**Checklist:**
1. ✅ Flask server running? (check terminal)
2. ✅ Port 5000 not blocked?
3. ✅ Dependencies installed? (`pip install -r requirements.txt`)
4. ✅ Browser console has errors? (F12 → Console)

### Settings Not Saved

**Cause:** `.env` file is not writable

**Solution:**
1. Check `.env` file exists in `web-version` folder
2. Make sure file can be edited (check permissions)
3. Restart bot after save

### Tweet Too Long

**Cause:** Prompt template does not include `{max_tweet_length}`

**Solution:**
1. Settings → Prompt tab
2. Make sure `{max_tweet_length}` is in prompt
3. Add instruction "MAXIMUM {max_tweet_length} characters"
4. Save settings

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

## 📄 License

MIT License - Feel free to use and modify as needed.
