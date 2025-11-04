# ⚠️ Panduan Twitter API Rate Limits

## Apa itu Rate Limit?

Rate limit adalah batasan jumlah tweet yang bisa diposting dalam periode waktu tertentu. Twitter memberlakukan ini untuk mencegah spam dan penyalahgunaan API.

## 📊 Batasan Twitter API Free Tier

### Batas Harian
- **50 tweets per 24 jam**

### Batas Bulanan  
- **1,500 tweets per bulan**

### Reset Time
- Rate limit akan reset setiap **15 menit**
- Jika kena limit, tunggu 15 menit sebelum mencoba lagi

## 🚨 Error 429 - Too Many Requests

### Apa Artinya?
Error ini muncul ketika Anda sudah mencapai batas maksimal posting dalam periode waktu tertentu.

### Penyebab Umum:
1. ❌ Posting terlalu sering (interval < 3 jam)
2. ❌ Spam tombol "Run Once" untuk testing
3. ❌ Bot retry berkali-kali saat error
4. ❌ Kombinasi bot + manual tweet melebihi 50/hari

### Konsekuensi:
- ⚠️ Request ditolak sampai rate limit reset
- ⚠️ Jika terus spam, akun bisa di-suspend
- ⚠️ API access bisa dicabut sementara

## ✅ Cara Menghindari Rate Limit

### 1. Set Schedule yang Aman

**Rekomendasi interval posting:**

| Interval | Tweets/Hari | Tweets/Bulan | Status |
|----------|-------------|--------------|--------|
| 24 jam   | 1           | 30           | ✅ Sangat Aman |
| 12 jam   | 2           | 60           | ✅ Aman |
| 8 jam    | 3           | 90           | ✅ Aman |
| **6 jam**| **4**       | **120**      | ✅ **Recommended** |
| 4 jam    | 6           | 180          | ⚠️ Hati-hati |
| 2 jam    | 12          | 360          | ❌ Berisiko |
| 1 jam    | 24          | 720          | ❌ Pasti kena limit |

**Setting Recommended:**
```env
SCHEDULE_HOURS=6
```

Dengan setting ini:
- 4 tweets per hari
- 120 tweets per bulan
- Masih ada buffer 930 tweets untuk manual posting
- Aman dari rate limit

### 2. Jangan Spam "Run Once"

**❌ JANGAN:**
- Spam click "Run Once" berkali-kali
- Test bot dengan interval < 15 menit
- Retry manual saat kena error 429

**✅ LAKUKAN:**
- Test "Run Once" maksimal 2-3x per hari
- Tunggu minimal 15 menit antar test
- Gunakan schedule otomatis untuk posting rutin

### 3. Hitung Total Tweets Harian

**Formula:**
```
Total Tweets/Hari = (24 / SCHEDULE_HOURS) + Manual Tweets
```

**Contoh:**
- Bot: `SCHEDULE_HOURS=6` → 4 tweets/hari
- Manual: 3 tweets/hari
- **Total: 7 tweets/hari** ✅ (masih di bawah 50)

**Pastikan total tidak melebihi 50 tweets/hari!**

### 4. Monitor Usage

**Cek di Twitter Developer Portal:**
1. Login ke https://developer.twitter.com/en/portal/dashboard
2. Pilih project/app Anda
3. Klik tab "Usage"
4. Lihat grafik daily/monthly usage

**Cek di Bot Dashboard:**
- Total Tweets: Lihat statistik di dashboard
- Success Count: Berapa tweet berhasil diposting
- Error Count: Berapa kali gagal

## 🛑 Apa yang Harus Dilakukan Saat Kena Rate Limit?

### Langkah 1: Stop Bot
- **Web Version:** Click tombol "Stop Bot"
- **Terminal Version:** Tekan `Ctrl+C`

### Langkah 2: Tunggu 15 Menit
Jangan coba posting lagi sampai rate limit reset (15 menit).

### Langkah 3: Cek Usage
Login ke Twitter Developer Portal dan cek berapa tweets sudah diposting hari ini.

### Langkah 4: Adjust Schedule
Jika sering kena limit, naikkan `SCHEDULE_HOURS`:

**Web Version:**
1. Click "Settings"
2. Tab "Configuration"  
3. Ubah `Schedule Hours` menjadi 6 atau lebih
4. Click "Save All Settings"

**Terminal Version:**
1. Edit file `.env`
2. Ubah `SCHEDULE_HOURS=6`
3. Save file

### Langkah 5: Restart Bot
Setelah 15 menit dan adjust schedule, restart bot.

## 💡 Tips Menghindari Suspend

### 1. Jangan Retry Saat Error 429
Jika bot kena error 429, **STOP** - jangan retry berkali-kali. Ini bisa dianggap spam oleh Twitter.

### 2. Gunakan Interval Wajar
Posting setiap 6-8 jam lebih natural daripada setiap 1-2 jam.

### 3. Variasi Konten
Pastikan tweet tidak terlalu repetitif. Bot sudah menggunakan AI untuk variasi konten.

### 4. Kombinasi Bot + Manual
- Bot: 4 tweets/hari (schedule 6 jam)
- Manual: Maksimal 10-15 tweets/hari
- Total: 14-19 tweets/hari (aman)

### 5. Monitor Regularly
Cek usage setiap hari untuk memastikan tidak mendekati limit.

## 📈 Upgrade Options

Jika 50 tweets/hari tidak cukup:

### Basic Tier ($100/bulan)
- 3,000 tweets/bulan
- 10,000 tweets/bulan (write)
- Rate limits lebih tinggi

### Pro Tier ($5,000/bulan)
- 300,000 tweets/bulan
- Rate limits jauh lebih tinggi
- Advanced features

**Info:** https://developer.twitter.com/en/portal/products

## 🎯 Best Practices Summary

✅ **DO:**
- Set `SCHEDULE_HOURS=6` atau lebih
- Monitor usage di Developer Portal
- Tunggu 15 menit jika kena rate limit
- Hitung total tweets (bot + manual) per hari
- Stop bot jika error 429

❌ **DON'T:**
- Spam "Run Once" untuk testing
- Set interval < 3 jam
- Retry berkali-kali saat error 429
- Posting > 50 tweets/hari
- Ignore error messages

## 📚 Resources

- [Twitter API Documentation](https://developer.twitter.com/en/docs/twitter-api)
- [Rate Limits Reference](https://developer.twitter.com/en/docs/twitter-api/rate-limits)
- [Developer Portal](https://developer.twitter.com/en/portal/dashboard)
- [API Pricing](https://developer.twitter.com/en/portal/products)

---

**💡 Ingat:** Lebih baik posting 4 tweets berkualitas per hari daripada spam 50 tweets dan kena suspend!

**🎯 Recommended Setting:** `SCHEDULE_HOURS=6` (4 tweets/hari = 120 tweets/bulan)
