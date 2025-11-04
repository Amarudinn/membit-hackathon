# 🐦 Twitter API Setup Guide

Panduan lengkap untuk mendapatkan Twitter API credentials dan mengkonfigurasi bot.

## 📋 Prasyarat

- Akun Twitter yang aktif (tidak di suspend)

## 🚀 Langkah 1: Daftar Twitter Developer Account

### 1.1 Akses Developer Portal

1. Buka [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Login dengan akun Twitter Anda
3. Jika belum punya Developer Account, klik **"Sign up for Free Account"**

### 1.2 Lengkapi Aplikasi Developer

1. Pilih **"Hobbyist"** atau **"Professional"** (pilih sesuai kebutuhan)
2. Isi informasi yang diminta:
   - **What's your name?** - Nama Anda
   - **What country are you based in?** - Negara Anda
   - **What's your use case?** - Pilih "Making a bot"
3. Jelaskan use case Anda (contoh):
   ```
   I'm building an automated Twitter bot that posts about Web3 trends 
   using AI-generated content. The bot will post tweets based on trending 
   topics from Membit API and generate content using Google Gemini AI.
   ```
4. Setujui Terms of Service
5. Verifikasi email Anda
6. Tunggu approval (biasanya instant untuk Free tier)

## 🔧 Langkah 2: Buat Twitter App

### 2.1 Create New App

1. Di Developer Portal, klik **"+ Create App"** atau **"Create Project"**
2. Isi informasi app:
   - **App name:** Nama unik untuk bot Anda (contoh: "Web3TrendBot")
   - **Description:** Deskripsi singkat bot
3. Klik **"Next"** atau **"Create"**

### 2.2 Simpan API Keys (Consumer Keys)

Setelah app dibuat, Anda akan melihat:
- ✅ **API Key** (Consumer Key)
- ✅ **API Secret Key** (Consumer Secret)
- ✅ **Bearer Token**

**PENTING:** Copy dan simpan API Key & API Secret di tempat aman!

```
API Key: xxxxxxxxxxxxxxxxxxxx
API Secret: yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

## 🔑 Langkah 3: Set App Permissions

### 3.1 Ubah Permissions ke "Read and Write"

1. Di app Anda, klik tab **"Settings"**
2. Scroll ke bagian **"App permissions"**
3. Klik **"Edit"**
4. Pilih **"Read and Write"** (BUKAN "Read only")
5. Klik **"Save"**

**⚠️ PENTING:** Permissions harus "Read and Write" agar bot bisa posting tweet!

### 3.2 Verifikasi Permissions

Pastikan tertulis:
```
App permissions: Read and Write
```

## 🎫 Langkah 4: Generate Access Token & Secret

### 4.1 Generate Token

1. Klik tab **"Keys and tokens"**
2. Scroll ke bagian **"Access Token and Secret"**
3. Klik **"Generate"** (atau "Regenerate" jika sudah ada)
4. Copy **Access Token** dan **Access Token Secret**

**⚠️ PENTING:** Generate token SETELAH set permissions ke "Read and Write"!

### 4.2 Simpan Credentials

Anda sekarang punya 4 credentials:

```
API Key:              xxxxxxxxxxxxxxxxxxxx
API Secret:           yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
Access Token:         1234567890-zzzzzzzzzzzzzzzzzzz
Access Token Secret:  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

**Simpan semua di tempat aman!**

## 🔧 Langkah 5: Konfigurasi Bot

### 5.1 Buka Web Dashboard

1. Jalankan bot:
   ```bash
   cd web-version
   python app.py
   ```
2. Buka browser: `http://localhost:5000`

### 5.2 Input API Keys

1. Klik tombol **"⚙️ Settings"**
2. Pilih tab **"API Keys"**
3. Isi semua fields:
   - **Twitter API Key:** Paste API Key dari step 2.2
   - **Twitter API Secret:** Paste API Secret dari step 2.2
   - **Twitter Access Token:** Paste Access Token dari step 4.1
   - **Twitter Access Secret:** Paste Access Token Secret dari step 4.1
4. Klik **"Save All Settings"**

### 5.3 Test Connection

1. Klik tombol **"⏩ Run Once"**
2. Lihat logs di dashboard
3. Jika berhasil, akan muncul:
   ```
   ✅ Tweet posted successfully! ID: 1234567890
   ```

## ✅ Checklist Setup

Pastikan semua langkah sudah dilakukan:

- [ ] Developer Account approved
- [ ] App sudah dibuat
- [ ] API Key & Secret sudah disimpan
- [ ] Permissions set ke "Read and Write"
- [ ] Access Token & Secret sudah di-generate (SETELAH set permissions)
- [ ] Semua 4 credentials sudah di-input ke dashboard
- [ ] Test "Run Once" berhasil

## 🔍 Troubleshooting

### Error: 401 Unauthorized

**Penyebab:**
- Permissions masih "Read only"
- Access Token di-generate SEBELUM ubah permissions
- Credentials salah atau ada spasi

**Solusi:**
1. Cek permissions di Settings → App permissions
2. Jika "Read only", ubah ke "Read and Write"
3. **Regenerate** Access Token & Secret (WAJIB setelah ubah permissions)
4. Copy paste ulang ke dashboard
5. Test lagi dengan "Run Once"

### Error: 403 Forbidden

**Penyebab:**
- App belum approved
- Account suspended
- Rate limit exceeded

**Solusi:**
1. Cek email dari Twitter
2. Verifikasi account jika diminta
3. Tunggu approval jika masih pending
4. Cek rate limits di Developer Portal

### Error: 429 Too Many Requests

**Penyebab:**
- Sudah posting terlalu banyak (> 50 tweets/24 jam)

**Solusi:**
1. Tunggu 15 menit
2. Cek usage di Developer Portal
3. Adjust schedule di Settings → Configuration
4. Baca `TWITTER_RATE_LIMITS.md` untuk detail

### Credentials Tidak Tersimpan

**Penyebab:**
- File `.env` tidak writable
- Permission error

**Solusi:**
1. Cek file `.env` ada di folder `web-version`
2. Pastikan file bisa di-edit
3. Restart bot setelah save

## 📚 Resources

- [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
- [Twitter API Documentation](https://developer.twitter.com/en/docs/twitter-api)
- [API Rate Limits](https://developer.twitter.com/en/docs/twitter-api/rate-limits)
- [App Permissions Guide](https://developer.twitter.com/en/docs/authentication/oauth-1-0a/obtaining-user-access-tokens)

## 💡 Tips

1. **Simpan Credentials Aman:**
   - Jangan share di public
   - Jangan commit ke Git
   - Gunakan `.env` file

2. **Test Dulu:**
   - Gunakan "Run Once" untuk test
   - Jangan langsung "Start Bot"
   - Cek logs untuk error

3. **Monitor Usage:**
   - Cek Developer Portal regularly
   - Track daily/monthly usage
   - Adjust schedule jika perlu

4. **Backup Credentials:**
   - Simpan di password manager
   - Atau di file terenkripsi
   - Jangan lupa!

---

**🎉 Selamat! Bot Anda siap digunakan!**

Jika ada masalah, baca troubleshooting di atas atau cek dokumentasi lengkap di `README.md`.
