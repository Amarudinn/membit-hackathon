# 🐦 Twitter API Setup Guide

Panduan lengkap untuk mendapatkan Twitter API credentials.

## 📋 Prasyarat

- Akun Twitter yang aktif (tidak di-suspend)

## 🚀 Langkah 1: Daftar Twitter Developer Account

### 1.1 Akses Developer Portal

1. Buka [Twitter Developer Portal](https://developer.twitter.com/)
2. Login dengan akun Twitter Anda
3. Jika belum punya Developer Account, klik **"Sign up for Free Account"**

### 1.2 Lengkapi Aplikasi Developer

1. Jelaskan use case Anda (contoh):
   ```
   I'm building an automated Twitter bot that posts about Web3 trends 
   using AI-generated content. The bot will post tweets based on trending 
   topics from Membit API and generate content using Google Gemini AI.
   ```
2. Setujui Terms of Service

## 🔧 Langkah 2: Buat Twitter App

### 2.1 Create New App

1. Klik pada icon Gear (⚙️) atau **App settings**
   
   ![App Settings](/images/App-Settings.png)

2. Pada bagian **Settings > User authentication not set up**, klik **Set Up**
   
   ![Set Up](/images/Developer-Set-Up.png)

3. Pada bagian **App permissions** ubah jadi **Read and write**
   
   ![App Permissions](/images/App-Permissions.png)

4. Pada bagian **Type of App** pilih **Web App, Automated App or Bot**
   
   ![Type of App](/images/Type-of-App.png)

5. Pada bagian **App Info** isi bebas, contoh: `https://google.com`
   
   ![App Info](/images/App-Info.png)

6. Klik **Save**

### 2.2 Ambil API KEY dan Access Token

1. Pergi ke **Keys and tokens**

2. Pada bagian **Consumer Keys** klik **Regenerate**

3. Simpan **API Key** & **API Key Secret** di tempat yang aman

4. Pada bagian **Authentication Tokens > Access Token and Secret** klik **Generate**

5. Simpan **Access Token** & **Access Token Secret** di tempat yang aman

### 2.3 Simpan Credentials

Anda sekarang punya 4 credentials:

```
API Key:              xxxxxxxxxxxxxxxxxxxx
API Secret:           yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
Access Token:         1234567890-zzzzzzzzzzzzzzzzzzz
Access Token Secret:  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

**Simpan semua di tempat aman!**

## 📚 Resources

- [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
- [Twitter API Documentation](https://developer.twitter.com/en/docs/twitter-api)
- [API Rate Limits](https://developer.twitter.com/en/docs/twitter-api/rate-limits)
- [App Permissions Guide](https://developer.twitter.com/en/docs/authentication/oauth-1-0a/obtaining-user-access-tokens)

---

**🎉 Selamat! Bot Anda siap digunakan!**

Jika ada masalah, baca troubleshooting di atas atau cek dokumentasi lengkap di [README.md](README.md).
