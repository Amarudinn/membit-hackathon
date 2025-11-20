# 2FA Authentication Setup Guide

This Twitter Bot now includes **Two-Factor Authentication (2FA)** using TOTP (Time-based One-Time Password) for enhanced security.

## 🔐 What is 2FA?

2FA adds an extra layer of security by requiring:
1. **Something you know** - Username & Password
2. **Something you have** - Your phone with authenticator app

Even if someone steals your password, they can't access the bot without your phone.

## 📱 Prerequisites

You need an authenticator app on your phone:
- **Google Authenticator** (iOS/Android) - Recommended
- **Microsoft Authenticator** (iOS/Android)
- **Authy** (iOS/Android)
- **1Password** (iOS/Android/Desktop)
- **Bitwarden** (iOS/Android/Desktop)

## 🚀 First-Time Setup

### Step 1: Install Dependencies

```bash
# Backend dependencies
cd web-version
pip install -r requirements.txt

# Frontend dependencies
cd frontend
npm install
```

### Step 2: Start Servers

**Terminal 1 - Backend:**
```bash
cd web-version
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd web-version/frontend
npm run dev
```

### Step 3: Access Setup Page

Open browser: `http://localhost:5173` (or `http://YOUR_VPS_IP:5173`)

You'll be automatically redirected to the setup page.

### Step 4: Create Credentials

1. Enter **Username** (min 3 characters)
2. Enter **Password** (min 8 characters)
3. Confirm password
4. Click **"Continue"**

### Step 5: Scan QR Code

1. Open your authenticator app
2. Tap **"Add account"** or **"+"**
3. Choose **"Scan QR code"**
4. Scan the QR code displayed on screen
5. The app will show: **"Twitter Bot (your-username)"**

**Can't scan?** Use manual entry:
- Account name: `Twitter Bot`
- Key: `[shown below QR code]`
- Type: Time-based

### Step 6: Save Backup Codes

**IMPORTANT:** Download and save your backup codes!

- Click **"Download Backup Codes"**
- Save the file in a secure location
- These codes can be used if you lose your phone
- Each code can only be used once

Example backup codes:
```
A3F2B9C1
D8E5F1A2
B7C4D9E3
...
```

### Step 7: Verify Setup

1. Click **"Continue to Verification"**
2. Open your authenticator app
3. Find **"Twitter Bot"** entry
4. Enter the 6-digit code (e.g., `482719`)
5. Click **"Complete Setup"**

✅ **Setup Complete!** You'll be automatically logged in.

## 🔑 Daily Login

### Normal Login

1. Open `http://localhost:5173` (or your VPS IP)
2. Enter **Username**
3. Enter **Password**
4. Open authenticator app
5. Enter the current **6-digit code**
6. Click **"Sign In"**

**Note:** The code changes every 30 seconds. If it doesn't work, wait for the next code.

### Using Backup Codes

If you lost your phone:

1. Enter **Username**
2. Enter **Password**
3. Instead of 6-digit code, enter one of your **backup codes** (e.g., `A3F2B9C1`)
4. Click **"Sign In"**

**Important:** Each backup code can only be used once. After using all 10 codes, you'll need to regenerate them.

## 🔧 Advanced Features

### Change Password

1. Login to dashboard
2. Click **"Settings"** → **"Security"** tab
3. Enter current password
4. Enter new password
5. Enter 6-digit TOTP code
6. Click **"Change Password"**

### Regenerate Backup Codes

If you've used all backup codes or want fresh ones:

1. Login to dashboard
2. Click **"Settings"** → **"Security"** tab
3. Click **"Regenerate Backup Codes"**
4. Enter password
5. Enter 6-digit TOTP code
6. Download new codes

**Warning:** Old backup codes will be invalidated!

### Logout

Click **"Logout"** button in header to end your session.

## 🆘 Troubleshooting

### "Invalid verification code"

**Causes:**
- Code expired (wait for next code)
- Phone time not synced with server
- Wrong code entered

**Solutions:**
1. Wait for the next code (30 seconds)
2. Check phone time settings (enable auto-sync)
3. Try a backup code instead

### "Setup already completed"

You've already set up 2FA. Go to login page instead.

### Lost Phone & No Backup Codes

**Emergency Reset (VPS/Server Access Required):**

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Navigate to project
cd /path/to/web-version

# Delete auth config
rm auth_config.json

# Restart backend
# Press Ctrl+C to stop, then:
python app.py
```

**Warning:** This will delete all authentication data. You'll need to setup again.

### Code Not Working After Scanning QR

**Check:**
1. Phone time is synced (Settings → Date & Time → Auto)
2. Scanned the correct QR code
3. App shows "Twitter Bot" entry
4. Code is 6 digits

**Try:**
- Use manual entry instead of QR scan
- Use a different authenticator app
- Check if code is for correct account

### Session Expired

Sessions last **24 hours**. After that, you'll need to login again.

To change session duration, edit `app.py`:
```python
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)  # Change 24 to desired hours
```

## 🔒 Security Best Practices

### DO:
✅ Use a strong password (8+ characters, mix of letters/numbers/symbols)
✅ Save backup codes in a secure location (password manager, encrypted file)
✅ Enable auto-sync for phone time
✅ Use a reputable authenticator app
✅ Logout when done using the bot
✅ Keep your VPS/server secure (SSH keys, firewall)

### DON'T:
❌ Share your username/password
❌ Share your TOTP secret key
❌ Share your backup codes
❌ Use the same password as other services
❌ Take screenshots of QR code (save backup codes instead)
❌ Leave session logged in on public computers

## 📊 Technical Details

### Authentication Flow

```
1. User visits site
   ↓
2. Check: Setup completed?
   ├─ No → Redirect to /setup
   └─ Yes → Check: Logged in?
       ├─ No → Redirect to /login
       └─ Yes → Show /dashboard

3. Login Process:
   ├─ Verify username (exact match)
   ├─ Verify password (bcrypt hash)
   └─ Verify TOTP code (30-second window)
       ├─ Valid → Create session (24h)
       └─ Invalid → Try backup codes
           ├─ Valid → Create session + remove used code
           └─ Invalid → Login failed
```

### Files Created

```
web-version/
├─ auth_manager.py           # Backend auth logic
├─ auth_config.json          # Credentials (gitignored)
├─ app.py                    # Updated with auth routes
│
└─ frontend/src/
   ├─ components/
   │  ├─ SetupPage.jsx       # First-time setup UI
   │  ├─ SetupPage.css
   │  ├─ LoginPage.jsx       # Login UI
   │  ├─ LoginPage.css
   │  └─ Dashboard.jsx       # Protected dashboard
   └─ App.jsx                # Updated with routing
```

### Security Features

- **Password Hashing:** bcrypt with salt (cost factor 12)
- **TOTP:** 30-second window, 6-digit codes
- **Backup Codes:** 10 codes, hashed, single-use
- **Session:** Encrypted cookie, 24-hour expiry
- **Protected Routes:** All API endpoints require authentication
- **Protected WebSocket:** SocketIO events check session

### API Endpoints

```
POST /api/auth/setup                    # Initial setup
POST /api/auth/verify-setup             # Verify TOTP during setup
POST /api/auth/login                    # Login
POST /api/auth/logout                   # Logout
POST /api/auth/change-password          # Change password
POST /api/auth/regenerate-backup-codes  # Regenerate backup codes
GET  /api/auth/status                   # Check auth status
```

## 🌐 VPS Deployment

### Firewall Configuration

```bash
# Allow ports
sudo ufw allow 5000/tcp  # Backend
sudo ufw allow 5173/tcp  # Frontend (dev)
sudo ufw allow 22/tcp    # SSH

# Check status
sudo ufw status
```

### Using Screen (Recommended)

Keep servers running after SSH disconnect:

```bash
# Backend
screen -S backend
cd web-version
python app.py
# Press Ctrl+A then D to detach

# Frontend
screen -S frontend
cd web-version/frontend
npm run dev
# Press Ctrl+A then D to detach

# List screens
screen -ls

# Reattach
screen -r backend
screen -r frontend
```

### Production Build (Optional)

For production, build frontend and serve static files:

```bash
# Build frontend
cd web-version/frontend
npm run build

# Serve with Flask (update app.py to serve dist/)
# Or use nginx as reverse proxy
```

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Check `AUTH_SETUP.md` for troubleshooting
3. Check backend logs (terminal running `python app.py`)
4. Check browser console (F12 → Console)
5. Try emergency reset (if you have server access)

## 🔄 Updates

### Updating from Non-Auth Version

If you're updating from the old version without 2FA:

1. Pull latest code
2. Install new dependencies: `pip install -r requirements.txt`
3. Install frontend deps: `cd frontend && npm install`
4. Restart both servers
5. Access site → You'll see setup page
6. Complete setup process

Your existing bot configuration (API keys, settings) will be preserved.

---

**Remember:** Keep your credentials, backup codes, and TOTP secret secure! 🔐
