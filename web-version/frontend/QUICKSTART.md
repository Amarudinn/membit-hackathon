# ⚡ Quick Start Guide

## 🚀 Start Development in 3 Steps

### Step 1: Install Dependencies (First Time Only)

```bash
npm install
```

### Step 2: Start Backend (Terminal 1)

```bash
cd ..
python app.py
```

✅ Backend running at `http://localhost:5000`

### Step 3: Start Frontend (Terminal 2)

```bash
npm run dev
```

✅ Frontend running at `http://localhost:5173`

## 🌐 Open Dashboard

Open browser: **http://localhost:5173**

## 🎯 First Time Setup

1. Click **Settings** button
2. Go to **API Keys** tab
3. Enter your API keys:
   - Membit API Key
   - Gemini API Key
   - Twitter API Key
   - Twitter API Secret
   - Twitter Access Token
   - Twitter Access Secret
4. Click **Save All Settings**
5. Click **Start Bot** to begin!

## 📝 Notes

- Frontend auto-reloads on file changes (HMR)
- Backend needs manual restart if you change Python files
- WebSocket connects automatically
- All API calls are proxied through Vite

## 🐛 Troubleshooting

### Backend not starting?
- Check if port 5000 is available
- Install dependencies: `pip install -r requirements.txt`
- Install CORS: `pip install flask-cors`

### Frontend not loading?
- Check if port 5173 is available
- Clear cache: `rm -rf node_modules && npm install`
- Check browser console for errors

### WebSocket not connecting?
- Make sure backend is running first
- Check firewall settings
- Verify proxy config in `vite.config.js`

## 🎉 You're Ready!

Start building amazing Twitter bots! 🤖✨
