# 🤖 Twitter Bot - Python Version

Implementasi Python murni dari workflow n8n untuk otomasi tweet real-time menggunakan Membit dan Google Gemini AI.

## ✨ Fitur

- 🔄 **Auto-posting** - Tweet otomatis setiap N jam (default: 6 jam)
- 📊 **Trending Data** - Mengambil data tren dari Membit API
- 🤖 **AI-Powered** - Generate tweet dengan Google Gemini 2.5 Flash
- 🎨 **Beautiful UI** - Terminal interface dengan warna dan animasi
- ⚙️ **Configurable** - Mudah dikonfigurasi via `.env`
- 🔁 **Auto-retry** - Retry otomatis jika gagal (default: 3x)
- 📏 **Character Limit** - Validasi panjang tweet otomatis

## 📋 Prasyarat

- Python 3.8 atau lebih tinggi
- API Key Membit ([Daftar di sini](https://membit.ai))
- API Key Google Gemini ([Daftar di sini](https://makersuite.google.com/app/apikey))
- Twitter API credentials ([Developer Portal](https://developer.twitter.com/))

## 🚀 Quick Start

### 1. Masuk ke Folder Python Version

```bash
cd python-version
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Setup Environment Variables

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

# Bot Configuration (Optional)
SCHEDULE_HOURS=6
MAX_RETRIES=3
MAX_TWEET_LENGTH=250
```

### 4. Jalankan Bot

```bash
python main.py
```

Bot akan langsung menjalankan sekali, lalu otomatis berjalan setiap 6 jam.

## � Cara Menddapatkan API Keys

### Membit API Key

1. Daftar di [Membit.ai](https://membit.ai)
2. Buat API Key di dashboard
3. Copy API Key ke `.env`

### Google Gemini API Key

1. Pergi ke [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Klik "Create API Key"
3. Copy API Key ke `.env`

### Twitter API Credentials

1. Pergi ke [Twitter Developer Portal](https://developer.twitter.com/)
2. Buat aplikasi baru (Create App)
3. **App permissions**: Pilih **Read and write**
4. **Type of App**: Pilih **Web App, Automated App or Bot**
5. Di tab **Keys and tokens**:
   - Copy **API Key** dan **API Secret**
   - Generate **Access Token** dan **Access Secret**
6. Paste semua credentials ke file `.env`

## ▶️ Cara Menggunakan

### Jalankan Bot

```bash
python main.py
```

Bot akan:
1. ✅ Menampilkan banner dan konfigurasi
2. ✅ Langsung menjalankan sekali saat start
3. ✅ Berjalan otomatis setiap N jam (sesuai `SCHEDULE_HOURS`)
4. ✅ Menampilkan progress dengan animasi dan warna

### Stop Bot

Tekan `Ctrl+C` untuk menghentikan bot dengan graceful shutdown.

## 📁 Struktur Project

```
python-version/
├── main.py              # Entry point & scheduler dengan UI
├── membit_client.py     # Membit MCP API client
├── gemini_client.py     # Google Gemini 2.5 Flash client
├── twitter_client.py    # Twitter API v2 client
├── requirements.txt     # Python dependencies
├── .env.example         # Template environment variables
├── .env                 # Your credentials (create this)
├── .gitignore          # Git ignore file
└── README.md           # Dokumentasi ini
```

## ⚙️ Konfigurasi

### Via Environment Variables (`.env`)

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `SCHEDULE_HOURS` | `6` | Interval waktu posting (dalam jam) |
| `MAX_RETRIES` | `3` | Jumlah percobaan ulang jika gagal |
| `MAX_TWEET_LENGTH` | `250` | Panjang maksimal tweet (karakter) |

**Contoh:**

```env
SCHEDULE_HOURS=1        # Post setiap 1 jam
MAX_RETRIES=5           # Retry sampai 5x
MAX_TWEET_LENGTH=200    # Tweet maksimal 200 karakter
```

### Mengubah Prompt AI

Edit prompt di `main.py` pada fungsi `create_and_post_tweet()` (sekitar baris 80):

**Bahasa Indonesia (Default):**
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

**Penyebab:**
- API Key Membit salah atau expired
- Koneksi internet bermasalah
- Membit API sedang down

**Solusi:**
- Cek `MEMBIT_API_KEY` di file `.env`
- Test koneksi internet
- Coba jalankan `python test_membit.py` untuk debug

### ❌ Error: "Failed to generate content with Gemini"

**Penyebab:**
- API Key Gemini salah atau expired
- Quota API Gemini habis
- Model name tidak tersedia

**Solusi:**
- Cek `GEMINI_API_KEY` di file `.env`
- Cek quota di [Google AI Studio](https://makersuite.google.com)
- Jalankan `python test_gemini.py` untuk melihat model yang tersedia

### ❌ Error: "Failed to post tweet"

**Penyebab:**
- Twitter credentials salah
- App permissions tidak Read and Write
- Tweet duplikat (Twitter tidak izinkan tweet sama berturut-turut)
- Rate limit exceeded

**Solusi:**
- Cek semua credentials di `.env`
- Pastikan App permissions = **Read and write** di Developer Portal
- Tunggu beberapa menit jika rate limit
- Ubah prompt agar tweet lebih bervariasi

### ⚠️ Warning: "ALTS creds ignored"

**Ini normal!** Warning dari Google SDK, tidak mempengaruhi fungsi bot. Sudah di-suppress di kode.

## 🆚 Python vs n8n Version

| Aspek | n8n Version | Python Version |
|-------|-------------|----------------|
| **Setup** | Butuh VPS + Docker | Cukup Python + pip |
| **Interface** | ✅ Visual workflow editor | 🎨 Beautiful terminal UI |
| **Maintenance** | Auto-restart dengan Docker | Perlu systemd/PM2 |
| **Kustomisasi** | Terbatas pada nodes | 🔧 Full control kode |
| **Resource** | ~500MB RAM | ~100MB RAM |
| **Deployment** | VPS required | Bisa di laptop/PC |
| **Learning Curve** | Mudah (drag & drop) | Perlu basic Python |
| **Debugging** | Terbatas | ✅ Full access logs |

**Rekomendasi:**
- Gunakan **n8n** jika: Anda suka visual editor dan punya VPS
- Gunakan **Python** jika: Anda suka coding dan ingin kontrol penuh

## � Deplooy ke Production

### Option 1: Systemd Service (Linux)

Buat file `/etc/systemd/system/twitter-bot.service`:

```ini
[Unit]
Description=Twitter Bot - Membit x Gemini
After=network.target

[Service]
Type=simple
User=your_user
WorkingDirectory=/path/to/python-version
Environment="PATH=/usr/bin:/usr/local/bin"
ExecStart=/usr/bin/python3 main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable dan jalankan:

```bash
sudo systemctl daemon-reload
sudo systemctl enable twitter-bot
sudo systemctl start twitter-bot
sudo systemctl status twitter-bot
```

Lihat logs:

```bash
sudo journalctl -u twitter-bot -f
```

### Option 2: PM2 (Cross-platform)

Install PM2:

```bash
npm install -g pm2
```

Jalankan bot:

```bash
pm2 start main.py --name twitter-bot --interpreter python3
pm2 save
pm2 startup
```

Monitor:

```bash
pm2 status
pm2 logs twitter-bot
```

### Option 3: Docker

Buat `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Run bot
CMD ["python", "main.py"]
```

Build dan run:

```bash
docker build -t twitter-bot .
docker run -d --env-file .env --name twitter-bot --restart unless-stopped twitter-bot
```

Lihat logs:

```bash
docker logs -f twitter-bot
```

### Option 4: Windows Task Scheduler

1. Buat file `run_bot.bat`:

```batch
@echo off
cd /d "C:\path\to\python-version"
python main.py
```

2. Buka **Task Scheduler**
3. Create Basic Task
4. Trigger: **At startup**
5. Action: **Start a program** → pilih `run_bot.bat`
6. Finish

## 📊 Monitoring

### Cek Status Bot

```bash
# Systemd
sudo systemctl status twitter-bot

# PM2
pm2 status

# Docker
docker ps | grep twitter-bot
```

### Lihat Logs

```bash
# Systemd
sudo journalctl -u twitter-bot -f

# PM2
pm2 logs twitter-bot

# Docker
docker logs -f twitter-bot
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

## 📄 License

MIT License - Silakan digunakan dan dimodifikasi sesuai kebutuhan.

---

**Made with ❤️ for Web3 Community**
