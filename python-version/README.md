# 🤖 Twitter Bot - Python Version

Modern CLI version automatic Twitter bot for posting tweets based on trending topics from Membit using Google Gemini AI.

## 📋 Prerequisites

### Software
- Python 3.8 or higher
- pip (Python package manager)

### API Keys
- **Membit API Key** - [Register here](https://membit.ai/integration)
- **Google Gemini API Key** - [Register here](https://aistudio.google.com/app/apikey)
- **Twitter API Credentials** - [Developer Portal](https://developer.twitter.com)
  - API Key (Consumer Key)
  - API Secret (Consumer Secret)
  - Access Token
  - Access Token Secret

**📖 Twitter API Setup Guide:** See [TWITTER_SETUP.md](/web-version/TWITTER_SETUP.md) for complete steps.
  
**⚠️ Twitter Rate Limits:** See [TWITTER_RATE_LIMITS.md](/web-version/TWITTER_RATE_LIMITS.md) for important information about API limitations.

## 🚀 Quick Start

### 1. Clone

```bash
git clone https://github.com/Amarudinn/membit-hackathon.git
```

### 2. Enter the Web Version Folder

```bash
cd python-version
```

### 3. Install Dependencies

```bash
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
SECRET_KEY=your-secret-key-change-this-in-production
```

## How to Get API Keys

### Membit API Key

1. Register at [Membit.ai](https://membit.ai/integration)
2. Create API Key in dashboard
3. Copy API Key to `.env`

### Google Gemini API Key

1. Go to [Google AI Studio](https://membit.ai/integration)
2. Click "Create API Key"
3. Copy API Key to `.env`

### Twitter API Credentials

[TWITTER_SETUP.md](/web-version/TWITTER_SETUP.md)

## ▶️ How to Use

### Run the Bot

```bash
python main.py
```

The bot will run once immediately, then automatically run every 6 hours.

### Stop Bot

Press `Ctrl+C` to stop the bot with graceful shutdown.

## ⚙️ Configuration

### Via Environment Variables (`.env`)

| Variable | Default | Description |
|----------|---------|-----------|
| `SCHEDULE_HOURS` | `6` | Posting time interval (in hours) |
| `MAX_RETRIES` | `3` | Number of retry attempts if failed |
| `MAX_TWEET_LENGTH` | `250` | Maximum tweet length (characters) |

**Example:**

```env
SCHEDULE_HOURS=6        # Post every 6 hours
MAX_RETRIES=3           # Retry up to 3x
MAX_TWEET_LENGTH=250    # Tweet maximum 250 characters
```

### Changing AI Prompt

Edit the prompt in `main.py` in the `create_and_post_tweet()` function (around line 80):

**Indonesian (Default):**
```python
prompt = f"""Anda adalah seorang social media manager yang ahli. Tugas Anda adalah melihat data tren dari Membit berikut:

{trending_data}

Pilih SATU topik paling menarik terkait 'Web3', dan membuat draf tweet yang informatif dalam Bahasa Indonesia. 

PENTING: 
- Tweet MAKSIMAL {max_tweet_length} karakter (termasuk spasi dan hashtag)
- Harus singkat, padat, dan menarik
- Akhiri dengan hashtag #Web3
- Jawab HANYA dengan draf tweet, tanpa pengantar apa pun"""
```

**English Version:**
```python
prompt = f"""You are an expert social media manager. Your task is to view trend data from Membit:

{trending_data}

Select ONE most interesting topic related to 'Web3', and create an informative tweet draft in English.

IMPORTANT:
- Tweet MAX {max_tweet_length} characters (including spaces and hashtags)
- Must be short, concise, and engaging
- End with hashtag #Web3
- Answer ONLY with the tweet draft, without any introduction"""
```

## 🐛 Troubleshooting

### ❌ Error: "Failed to fetch Membit data"

**Cause:**
- Membit API Key is wrong
- Internet connection problem

**Solution:**
- Check `MEMBIT_API_KEY` in `.env` file
- Test internet connection

### ❌ Error: "Failed to generate content with Gemini"

**Cause:**
- Gemini API Key is wrong or expired
- Gemini API quota exhausted

**Solution:**
- Check `GEMINI_API_KEY` in `.env` file
- Check quota at [Google AI Studio](https://membit.ai/integration)

### ❌ Error: "Failed to post tweet"

**Cause:**
- Twitter credentials are wrong
- App permissions are not Read and Write
- Duplicate tweet (Twitter doesn't allow same consecutive tweets)
- Rate limit exceeded

**Solution:**
- Check all credentials in `.env`
- Make sure App permissions = **Read and write** in Developer Portal
- Wait a few minutes if rate limit
- Change prompt so tweets are more varied

### ⚠️ Warning: "ALTS creds ignored"

**This is normal!** Warning from Google SDK, does not affect bot function. Already suppressed in code.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

## 📄 License

MIT License - Feel free to use and modify as needed.

---
