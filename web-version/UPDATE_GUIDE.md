# Update Guide - Upgrading to 2FA Version

This guide is for users who are already running the old version (without 2FA) on VPS and want to update to the latest version with 2FA.

### 1. Update Code from Git

```bash
# Navigate to project folder
cd ~/membit-hackathon

# Stash local changes (if any)
git stash

# Pull latest code
git pull origin main

# If there's a conflict, resolve first or reset:
# git reset --hard origin/main
```

### 2. Use Virtual Environments

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install New Dependencies

```bash
# Navigate to web-version
cd web-version

# Install Python dependencies
pip3 install -r requirements.txt

# Navigate to frontend
cd frontend

# Install Node dependencies
npm install
```

### 4. Clear Cache

```bash
# Still in frontend folder
rm -rf node_modules/.vite
rm -rf dist
```

### 5. Restart Services

```bash
# Start backend
screen -r backend
cd ~/membit-hackathon/web-version
python3 app.py
# Press Ctrl+A then D to detach

# Start frontend
screen -r frontend
cd ~/membit-hackathon/web-version/frontend
npm run dev
# Press Ctrl+A then D to detach
```
