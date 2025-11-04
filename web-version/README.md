# 🌐 Twitter Bot - Web Dashboard Version

Bot Twitter otomatis dengan web dashboard yang modern untuk posting tweet berdasarkan trending topics dari Membit menggunakan AI Google Gemini.

## ✨ Fitur Utama

### 🎮 Control Panel
- **Start Bot** - Jalankan bot dengan scheduler otomatis
- **Stop Bot** - Hentikan bot (langsung responsive)
- **Run Once** - Test posting 1 tweet
- **Status Indicator** - Circle merah/hijau di pojok kanan atas

### 📊 Monitoring Real-time
- **Statistics Cards** - Total tweets, success count, error count
- **Activity Logs** - Color-coded logs (info, success, warning, error)
- **Last Tweet Preview** - Lihat tweet terakhir dengan link ke Twitter
- **Auto-scroll Logs** - Logs otomatis scroll ke bawah

### ⚙️ Settings Management
- **API Keys Tab** - Konfigurasi Membit, Gemini, Twitter API
- **Configuration Tab** - Schedule hours, max retries, tweet length
- **Prompt Tab** - Customize prompt template untuk AI
- **Password Toggle** - Show/hide API keys
- **Persistent Storage** - Settings tersimpan di `.env` file

### 📖 Panduan Lengkap
- **Button Panduan** - Akses panduan dari dashboard
- **2 Tab Panduan:**
  - **Cara Menggunakan** - Setup, konfigurasi, operasional
  - **Rate Limits** - Info Twitter API limits & best practices
- **GitHub-style Markdown** - Tables, code blocks, info boxes
- **External Links** - Icon ↗ untuk link eksternal

## 📋 Prasyarat

### Software
- Python 3.8 atau lebih tinggi
- pip (Python package manager)
- Browser modern (Chrome, Firefox, Edge, Safari)

### API Keys
- **Membit API Key** - [Daftar di sini](https://membit.ai/integration)
- **Google Gemini API Key** - [Daftar di sini](https://aistudio.google.com/app/apikey)
- **Twitter API Credentials** - [Developer Portal](https://developer.twitter.com)
  - API Key (Consumer Key)
  - API Secret (Consumer Secret)
  - Access Token
  - Access Token Secret

**📖 Panduan Setup Twitter API:** Lihat [TWITTER_SETUP.md](TWITTER_SETUP.md) untuk langkah lengkap.

**⚠️ Twitter Rate Limits:** Lihat [TWITTER_RATE_LIMITS.md](TWITTER_RATE_LIMITS.md) untuk info penting tentang batasan API.

## 🚀 Quick Start

### 1. Clone

```bash
git clone https://github.com/Amarudinn/membit-hackathon.git
```

### 2. Masuk ke Folder Web Version

```bash
cd web-version
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Setup Environment Variables

Copy file `.env.example` menjadi `.env`:

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Edit file `.env` dan isi dengan credentials Anda:

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

### 4. Jalankan Web Server

```bash
python app.py
```

### 5. Buka Browser & Setup API Keys

Akses dashboard di: **http://localhost:5000**

**First Time Setup:**
1. Dashboard akan menampilkan warning jika API keys belum dikonfigurasi
2. Click tombol **"⚙️ Settings"**
3. Masuk ke tab **"API Keys"**
4. Isi semua API keys:
   - **Membit API Key** - Dari Membit
   - **Gemini API Key** - Dari Google AI Studio
   - **Twitter API Key** - Consumer Key dari Twitter
   - **Twitter API Secret** - Consumer Secret dari Twitter
   - **Twitter Access Token** - Access Token dari Twitter
   - **Twitter Access Secret** - Access Token Secret dari Twitter
5. (Optional) Tab **"Configuration"** - Sesuaikan schedule, retries, tweet length
6. (Optional) Tab **"Prompt"** - Customize prompt template untuk AI
7. Click **"Save All Settings"**
8. Bot siap digunakan!

**💡 Tips:**
- Gunakan icon mata (👁️) untuk show/hide password
- Semua settings tersimpan di file `.env`
- Baca panduan lengkap dengan click tombol **"📖 Panduan"**

## 🎮 Cara Menggunakan

### Control Panel

**Status Indicator** (pojok kanan atas Control Panel):
- 🔴 **Stopped** - Bot tidak berjalan
- 🟢 **Running** - Bot berjalan otomatis

**Tombol Kontrol:**

1. **▶️ Start Bot**
   - Mulai bot dengan scheduler otomatis
   - Bot akan posting setiap X jam (sesuai SCHEDULE_HOURS)
   - Status berubah jadi "Running" (hijau)
   - Menampilkan "Next Run" time

2. **⏹️ Stop Bot**
   - Hentikan bot yang sedang berjalan
   - Bot langsung berhenti (responsive, max 1 detik)
   - Status berubah jadi "Stopped" (merah)
   - Aman: tidak posting tweet setelah stop

3. **⏩ Run Once**
   - Posting 1 tweet sekarang (untuk testing)
   - Tidak mempengaruhi schedule
   - Bagus untuk test sebelum start automatic mode

### Monitoring Dashboard

**Statistics Cards:**
- **Total Tweets** - Total tweet yang sudah diposting
- **Success** - Jumlah tweet berhasil (hijau)
- **Errors** - Jumlah kali gagal (merah)

**Activity Logs:**
- 🔵 **Info** - Informasi umum (biru)
- ✅ **Success** - Operasi berhasil (hijau)
- ⚠️ **Warning** - Peringatan (kuning)
- ❌ **Error** - Error/gagal (merah)
- Auto-scroll ke log terbaru
- Max 100 log entries

**Last Tweet Card:**
- Isi tweet terakhir
- Timestamp posting
- Link ke tweet di Twitter (click untuk buka)

### Settings

**API Keys Tab:**
- Input semua API credentials
- Password input dengan toggle show/hide
- Validasi sebelum save

**Configuration Tab:**
- **Schedule Hours** (1-24) - Interval posting (recommended: 6)
- **Max Retries** (1-10) - Jumlah retry jika gagal (recommended: 3)
- **Max Tweet Length** (100-280) - Panjang maksimal tweet (recommended: 250)

**Prompt Tab:**
- Customize prompt template untuk Gemini AI
- Variables wajib: `{trending_data}`, `{max_tweet_length}`
- Contoh prompt disediakan
- Tips membuat prompt efektif

### Panduan

Click tombol **"📖 Panduan"** untuk akses:

**Tab "Cara Menggunakan":**
- Setup awal (API keys)
- Konfigurasi bot
- Customize prompt template
- Operasional bot
- Monitoring & troubleshooting

**Tab "Rate Limits":**
- Info Twitter API limits (50 tweets/24 jam)
- Cara menghindari rate limit
- Best practices
- Troubleshooting error 429

## ⚙️ Konfigurasi

### Via Environment Variables (`.env`)

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `SCHEDULE_HOURS` | `6` | Interval waktu posting (dalam jam) |
| `MAX_RETRIES` | `3` | Jumlah percobaan ulang jika gagal |
| `MAX_TWEET_LENGTH` | `250` | Panjang maksimal tweet (karakter) |
| `SECRET_KEY` | - | Flask secret key untuk session |

### Mengubah Prompt AI

**Via Dashboard (Recommended):**
1. Click **"⚙️ Settings"**
2. Tab **"Prompt"**
3. Edit prompt template
4. Click **"Save All Settings"**

**Via File:**
- Edit `prompt_template.txt` di folder `web-version`
- Restart bot untuk apply changes

**Variables Wajib:**
- `{trending_data}` - Data tren dari Membit
- `{max_tweet_length}` - Panjang maksimal tweet

## 🔌 API Endpoints

### WebSocket Events

**Client → Server:**
| Event | Description |
|-------|-------------|
| `connect` | Client connected (auto-send status & logs) |
| `start_bot` | Start the bot with scheduler |
| `stop_bot` | Stop the bot (responsive, max 1s) |
| `run_once` | Run single tweet generation |

**Server → Client:**
| Event | Data | Description |
|-------|------|-------------|
| `log` | `{message, level, timestamp}` | Log message (real-time) |
| `status_update` | `{running, last_run, next_run, stats}` | Bot status update |
| `error` | `{message}` | Error message |

## 🐛 Troubleshooting

### Bot Tidak Bisa Start

**Problem:** Button "Start Bot" disabled

**Penyebab:** API keys belum dikonfigurasi

**Solusi:**
1. Click **"⚙️ Settings"**
2. Tab **"API Keys"**
3. Isi semua API keys
4. Click **"Save All Settings"**
5. Button akan enabled otomatis

### Error 401 Unauthorized (Twitter)

**Penyebab:**
- Twitter permissions masih "Read only"
- Access Token di-generate sebelum ubah permissions

**Solusi:**
1. Baca [TWITTER_SETUP.md](TWITTER_SETUP.md) untuk panduan lengkap
2. Set permissions ke "Read and Write"
3. Regenerate Access Token & Secret
4. Update di Settings

### Error 429 Too Many Requests

**Penyebab:** Sudah posting > 50 tweets dalam 24 jam

**Solusi:**
1. Stop bot
2. Tunggu 15 menit
3. Adjust schedule: Settings → Configuration → Schedule Hours = 6 atau lebih
4. Baca [TWITTER_RATE_LIMITS.md](TWITTER_RATE_LIMITS.md) untuk detail

### Port 5000 Already in Use

**Solusi:** Ubah port di `app.py`:

```python
socketio.run(app, host='0.0.0.0', port=8080, debug=False)
```

### WebSocket Connection Failed

**Solusi:** Allow port di firewall:

```bash
# Windows
netsh advfirewall firewall add rule name="Flask" dir=in action=allow protocol=TCP localport=5000

# Linux
sudo ufw allow 5000
```

### Dashboard Not Loading

**Checklist:**
1. ✅ Flask server berjalan? (cek terminal)
2. ✅ Port 5000 tidak diblokir?
3. ✅ Dependencies terinstall? (`pip install -r requirements.txt`)
4. ✅ Browser console ada error? (F12 → Console)

### Settings Tidak Tersimpan

**Penyebab:** File `.env` tidak writable

**Solusi:**
1. Cek file `.env` ada di folder `web-version`
2. Pastikan file bisa di-edit (check permissions)
3. Restart bot setelah save

### Tweet Terlalu Panjang

**Penyebab:** Prompt template tidak include `{max_tweet_length}`

**Solusi:**
1. Settings → Prompt tab
2. Pastikan ada `{max_tweet_length}` di prompt
3. Tambahkan instruksi "MAKSIMAL {max_tweet_length} karakter"
4. Save settings

## 🚀 Deploy ke Production

### 💻 Windows Installation

#### Prerequisites
```powershell
# Install Python 3.8+ dari https://www.python.org/downloads/
# Pastikan "Add Python to PATH" dicentang saat install
```

#### Installation Steps

1. **Clone Repository**
   ```powershell
   git clone https://github.com/your-repo/twitter-bot.git
   cd twitter-bot\web-version
   ```

2. **Create Virtual Environment**
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```powershell
   pip install -r requirements.txt
   ```

4. **Setup Environment**
   ```powershell
   copy .env.example .env
   notepad .env
   ```
   Isi semua API keys di file `.env`

5. **Run Bot**
   ```powershell
   python app.py
   ```

6. **Access Dashboard**
   - Buka browser: `http://localhost:5000`

#### Run as Windows Service (Optional)

**Using NSSM (Non-Sucking Service Manager):**

1. Download NSSM dari https://nssm.cc/download
2. Extract dan buka Command Prompt as Administrator
3. Install service:
   ```powershell
   cd C:\path\to\nssm\win64
   nssm install TwitterBot "C:\path\to\python.exe" "C:\path\to\web-version\app.py"
   nssm set TwitterBot AppDirectory "C:\path\to\web-version"
   nssm start TwitterBot
   ```

**Manage Service:**
```powershell
# Start service
nssm start TwitterBot

# Stop service
nssm stop TwitterBot

# Remove service
nssm remove TwitterBot confirm
```

### 🐧 VPS Linux Ubuntu Installation

#### Prerequisites
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3 and pip
sudo apt install python3 python3-pip python3-venv git -y
```

#### Installation Steps

1. **Clone Repository**
   ```bash
   cd /opt
   sudo git clone https://github.com/your-repo/twitter-bot.git
   cd twitter-bot/web-version
   ```

2. **Create Virtual Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup Environment**
   ```bash
   cp .env.example .env
   nano .env
   ```
   Isi semua API keys, lalu save (Ctrl+X, Y, Enter)

5. **Test Run**
   ```bash
   python app.py
   ```
   Akses dari browser: `http://your-server-ip:5000`

#### Setup Systemd Service

1. **Create Service File**
   ```bash
   sudo nano /etc/systemd/system/twitter-bot.service
   ```

2. **Add Configuration**
   ```ini
   [Unit]
   Description=Twitter Bot Web Dashboard
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/opt/twitter-bot/web-version
   Environment="PATH=/opt/twitter-bot/web-version/venv/bin"
   ExecStart=/opt/twitter-bot/web-version/venv/bin/python app.py
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

3. **Enable and Start Service**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable twitter-bot
   sudo systemctl start twitter-bot
   ```

4. **Check Status**
   ```bash
   sudo systemctl status twitter-bot
   ```

5. **View Logs**
   ```bash
   sudo journalctl -u twitter-bot -f
   ```

#### Setup Nginx Reverse Proxy

1. **Install Nginx**
   ```bash
   sudo apt install nginx -y
   ```

2. **Create Nginx Config**
   ```bash
   sudo nano /etc/nginx/sites-available/twitter-bot
   ```

3. **Add Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

4. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/twitter-bot /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Setup SSL with Let's Encrypt (Optional)**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com
   ```

#### Firewall Configuration

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
sudo ufw status
```

#### Useful Commands

```bash
# Restart bot
sudo systemctl restart twitter-bot

# Stop bot
sudo systemctl stop twitter-bot

# View logs
sudo journalctl -u twitter-bot -f

# Check status
sudo systemctl status twitter-bot

# Update bot
cd /opt/twitter-bot
sudo git pull
sudo systemctl restart twitter-bot
```

## 🔒 Security Tips

1. **Change SECRET_KEY** - Gunakan secret key yang kuat
2. **Use HTTPS** - Deploy dengan SSL certificate
3. **Add Authentication** - Tambahkan login jika deploy public
4. **Firewall** - Batasi akses ke port tertentu
5. **Environment Variables** - Jangan commit `.env` ke git

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

## 📄 License

MIT License - Silakan digunakan dan dimodifikasi sesuai kebutuhan.
