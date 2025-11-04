# 🤖 Twitter Bot - Python Version

Bot Twitter otomatis versi CLI yang modern untuk posting tweet berdasarkan trending topics dari Membit menggunakan AI Google Gemini.

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

**📖 Panduan Setup Twitter API:** Lihat [TWITTER_SETUP.md](/web-version/TWITTER_SETUP.md) untuk langkah lengkap.
  
**⚠️ Twitter Rate Limits:** Lihat [TWITTER_RATE_LIMITS.md](/web-version/TWITTER_RATE_LIMITS.md) untuk info penting tentang batasan API.

## 🚀 Quick Start

### 1. Clone

```bash
git clone https://github.com/Amarudinn/membit-hackathon.git
```

### 2. Masuk ke Folder Web Version

```bash
cd python-version
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

## Cara Menddapatkan API Keys

### Membit API Key

1. Daftar di [Membit.ai](https://membit.ai/integration)
2. Buat API Key di dashboard
3. Copy API Key ke `.env`

### Google Gemini API Key

1. Pergi ke [Google AI Studio](https://membit.ai/integration)
2. Klik "Create API Key"
3. Copy API Key ke `.env`

### Twitter API Credentials

[TWITTER_SETUP.md](/web-version/TWITTER_SETUP.md)

## ▶️ Cara Menggunakan

### Jalankan Bot

```bash
python main.py
```

Bot akan langsung menjalankan sekali, lalu otomatis berjalan setiap 6 jam.

### Stop Bot

Tekan `Ctrl+C` untuk menghentikan bot dengan graceful shutdown.

## ⚙️ Konfigurasi

### Via Environment Variables (`.env`)

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `SCHEDULE_HOURS` | `6` | Interval waktu posting (dalam jam) |
| `MAX_RETRIES` | `3` | Jumlah percobaan ulang jika gagal |
| `MAX_TWEET_LENGTH` | `250` | Panjang maksimal tweet (karakter) |

**Contoh:**

```env
SCHEDULE_HOURS=6        # Post setiap 6 jam
MAX_RETRIES=3           # Retry sampai 3x
MAX_TWEET_LENGTH=250    # Tweet maksimal 250 karakter
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
- API Key Membit salah
- Koneksi internet bermasalah

**Solusi:**
- Cek `MEMBIT_API_KEY` di file `.env`
- Test koneksi internet

### ❌ Error: "Failed to generate content with Gemini"

**Penyebab:**
- API Key Gemini salah atau expired
- Quota API Gemini habis

**Solusi:**
- Cek `GEMINI_API_KEY` di file `.env`
- Cek quota di [Google AI Studio](https://membit.ai/integration)

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

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

## 📄 License

MIT License - Silakan digunakan dan dimodifikasi sesuai kebutuhan.

---
