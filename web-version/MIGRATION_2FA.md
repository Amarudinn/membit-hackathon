# Migration Guide: Adding 2FA to Existing Installation

If you're updating from the old version (without 2FA) to the new version (with 2FA), follow these steps:

## 📋 Prerequisites

- Existing Twitter Bot installation
- Python 3.8+
- Node.js & npm
- Access to VPS/server (if deployed)

## 🔄 Migration Steps

### 1. Backup Current Data

```bash
# Backup your .env file
cp web-version/.env web-version/.env.backup

# Backup prompt template (if customized)
cp web-version/prompt_template.txt web-version/prompt_template.txt.backup
```

### 2. Pull Latest Code

```bash
cd membit-hackathon
git pull origin main
```

Or download the latest code manually.

### 3. Install New Dependencies

**Backend:**
```bash
cd web-version
pip install -r requirements.txt
```

New packages added:
- `pyotp==2.9.0` - TOTP generation
- `qrcode==7.4.2` - QR code generation
- `bcrypt==4.1.2` - Password hashing
- `Pillow==10.2.0` - Image processing

**Frontend:**
```bash
cd frontend
npm install
```

New package added:
- `react-router-dom` - Routing for auth pages

### 4. Verify Files

Check that these new files exist:

```
web-version/
├─ auth_manager.py          ✓ New
├─ AUTH_SETUP.md            ✓ New
├─ MIGRATION_2FA.md         ✓ New (this file)
│
└─ frontend/src/
   └─ components/
      ├─ SetupPage.jsx      ✓ New
      ├─ SetupPage.css      ✓ New
      ├─ LoginPage.jsx      ✓ New
      ├─ LoginPage.css      ✓ New
      └─ Dashboard.jsx      ✓ New
```

### 5. Stop Running Servers

If bot is currently running:

```bash
# Press Ctrl+C in both terminals
# Or if using screen:
screen -r backend
# Press Ctrl+C
screen -r frontend
# Press Ctrl+C
```

### 6. Restart Servers

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

### 7. Complete 2FA Setup

1. Open browser: `http://localhost:5173` (or your VPS IP)
2. You'll see **"First Time Setup"** page
3. Follow the setup wizard:
   - Create username & password
   - Scan QR code with authenticator app
   - Download backup codes
   - Verify with 6-digit code
4. Done! You're logged in.

## ✅ What's Preserved

Your existing configuration is **automatically preserved**:

- ✅ API Keys (Membit, Gemini, Twitter)
- ✅ Bot settings (schedule, retries, tweet length)
- ✅ Custom prompt template
- ✅ Bot statistics (tweets count, etc.)
- ✅ Image generation settings

## 🆕 What's New

After migration, you'll have:

- 🔐 **2FA Login** - Username + Password + TOTP
- 📱 **Authenticator App** - Google Authenticator, Authy, etc.
- 🔑 **Backup Codes** - 10 emergency codes
- 🚪 **Logout Button** - End session securely
- 👤 **User Display** - Shows logged-in username
- 🔒 **Protected Routes** - All API endpoints require auth
- 🛡️ **Session Management** - 24-hour sessions

## 🔍 Verification

After migration, verify everything works:

### 1. Check Login
- ✅ Can login with username/password/TOTP
- ✅ Invalid credentials are rejected
- ✅ Backup codes work

### 2. Check Dashboard
- ✅ Bot controls work (Start/Stop/Run Once)
- ✅ Statistics display correctly
- ✅ Settings can be changed
- ✅ Logs appear in terminal

### 3. Check Bot Functionality
- ✅ Can start bot
- ✅ Bot posts tweets successfully
- ✅ Can stop bot
- ✅ Run Once works

### 4. Check Logout
- ✅ Logout button works
- ✅ Redirects to login page
- ✅ Can't access dashboard after logout

## 🐛 Troubleshooting

### "Module not found" errors

**Solution:** Reinstall dependencies
```bash
cd web-version
pip install -r requirements.txt

cd frontend
npm install
```

### Frontend shows blank page

**Solution:** Check browser console (F12)
- If "react-router-dom not found" → `npm install`
- If other errors → Check terminal for build errors

### Backend errors on startup

**Solution:** Check Python version
```bash
python --version  # Should be 3.8+
```

If old version, use:
```bash
python3 app.py
```

### Can't access setup page

**Causes:**
- Backend not running
- Frontend not running
- Port blocked by firewall

**Solution:**
```bash
# Check if servers are running
curl http://localhost:5000/api/auth/status
curl http://localhost:5173

# If VPS, check firewall
sudo ufw status
sudo ufw allow 5000/tcp
sudo ufw allow 5173/tcp
```

### "Setup already completed" but I want to reset

**Solution:** Delete auth config
```bash
cd web-version
rm auth_config.json
# Restart backend
```

**Warning:** This will delete your 2FA setup. You'll need to setup again.

## 🔙 Rollback (If Needed)

If you encounter issues and want to rollback:

### Option 1: Use Backup

```bash
# Restore .env
cp web-version/.env.backup web-version/.env

# Restore prompt
cp web-version/prompt_template.txt.backup web-version/prompt_template.txt

# Checkout old version
git checkout <previous-commit-hash>

# Reinstall old dependencies
cd web-version
pip install -r requirements.txt

cd frontend
npm install
```

### Option 2: Disable Auth (Not Recommended)

If you want to keep new code but disable auth temporarily:

Edit `web-version/app.py`:
```python
# Comment out @login_required decorators
# @login_required  # <-- Add # before this
def get_status():
    ...
```

**Warning:** This removes all security! Only for testing.

## 📞 Need Help?

1. Read `AUTH_SETUP.md` for detailed 2FA guide
2. Check backend logs (terminal running `python app.py`)
3. Check frontend logs (browser console F12)
4. Check `MIGRATION_2FA.md` (this file)

## 🎉 Success!

If you can:
- ✅ Login with 2FA
- ✅ Access dashboard
- ✅ Start/stop bot
- ✅ Post tweets

**Congratulations!** Migration successful. Your bot is now secured with 2FA! 🔐

---

**Next Steps:**
- Save your backup codes in a secure location
- Test logout/login flow
- Consider setting up production deployment (nginx, SSL)
- Read `AUTH_SETUP.md` for advanced features
