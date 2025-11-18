# ⚠️ Twitter API Rate Limits Guide

## What is Rate Limit?

Rate limit is a restriction on the number of tweets that can be posted within a certain time period. Twitter enforces this to prevent spam and API abuse.

## Twitter API Free Tier Limits

### Daily Limit
- **50 tweets per 24 hours**

### Monthly Limit  
- **1,500 tweets per month**

### Reset Time
- Rate limit will reset every **15 minutes**
- If you hit the limit, wait 15 minutes before trying again

## Error 429 - Too Many Requests

### What Does It Mean?
This error appears when you have reached the maximum posting limit within a certain time period.

### Common Causes:
1. ❌ Posting too frequently (interval < 3 hours)
2. ❌ Spamming "Run Once" button for testing
3. ❌ Bot retrying multiple times on error
4. ❌ Combination of bot + manual tweets exceeding 50/day

### Consequences:
- ⚠️ Requests rejected until rate limit resets
- ⚠️ If you continue spamming, account can be suspended
- ⚠️ API access can be temporarily revoked

## ✅ How to Avoid Rate Limit

### 1. Set Safe Schedule

**Recommended posting interval:**

| Interval | Tweets/Day | Tweets/Month | Status |
|----------|------------|--------------|--------|
| 24 hours | 1          | 30           | ✅ Very Safe |
| 12 hours | 2          | 60           | ✅ Safe |
| 8 hours  | 3          | 90           | ✅ Safe |
| **6 hours**| **4**    | **120**      | ✅ **Recommended** |
| 4 hours  | 6          | 180          | ⚠️ Be Careful |
| 2 hours  | 12         | 360          | ❌ Risky |
| 1 hour   | 24         | 720          | ❌ Will hit limit |

**Recommended Setting:**
```env
SCHEDULE_HOURS=6
```

With this setting:
- 4 tweets per day
- 120 tweets per month
- Still have buffer of 930 tweets for manual posting
- Safe from rate limit

### 2. Don't Spam "Run Once"

**❌ DON'T:**
- Spam click "Run Once" multiple times
- Test bot with interval < 15 minutes
- Manually retry when hitting error 429

**✅ DO:**
- Test "Run Once" maximum 2-3x per day
- Wait at least 15 minutes between tests
- Use automatic schedule for routine posting

### 3. Calculate Total Daily Tweets

**Formula:**
```
Total Tweets/Day = (24 / SCHEDULE_HOURS) + Manual Tweets
```

**Example:**
- Bot: `SCHEDULE_HOURS=6` → 4 tweets/day
- Manual: 3 tweets/day
- **Total: 7 tweets/day** ✅ (still below 50)

**Make sure total does not exceed 50 tweets/day!**

### 4. Monitor Usage

**Check in Twitter Developer Portal:**
1. Login to https://developer.twitter.com/en/portal/dashboard
2. Select your project/app
3. Click "Usage" tab
4. View daily/monthly usage graph

**Check in Bot Dashboard:**
- Total Tweets: View statistics in dashboard
- Success Count: How many tweets successfully posted
- Error Count: How many times failed

## What to Do When You Hit Rate Limit?

### Step 1: Stop Bot
- **Web Version:** Click "Stop Bot" button

### Step 2: Wait 15 Minutes
Don't try posting again until rate limit resets (15 minutes).

### Step 3: Check Usage
Login to Twitter Developer Portal and check how many tweets have been posted today.

### Step 4: Adjust Schedule
If you frequently hit the limit, increase `SCHEDULE_HOURS`:

**Web Version:**
1. Click "Settings"
2. "Configuration" tab  
3. Change `Schedule Hours` to 6 or more
4. Click "Save All Settings"

### Step 5: Restart Bot
After 15 minutes and adjusting schedule, restart bot.

## Tips to Avoid Suspension

### 1. Don't Retry on Error 429
If bot hits error 429, **STOP** - don't retry multiple times. This can be considered spam by Twitter.

### 2. Use Reasonable Interval
Posting every 6-8 hours is more natural than every 1-2 hours.

### 3. Content Variation
Make sure tweets are not too repetitive. Bot already uses AI for content variation.

### 4. Bot + Manual Combination
- Bot: 4 tweets/day (6 hour schedule)
- Manual: Maximum 10-15 tweets/day
- Total: 14-19 tweets/day (safe)

### 5. Monitor Regularly
Check usage daily to ensure not approaching limit.

## Upgrade Options

If 50 tweets/day is not enough:

### Basic Tier ($100/month)
- 3,000 tweets/month
- 10,000 tweets/month (write)
- Higher rate limits

### Pro Tier ($5,000/month)
- 300,000 tweets/month
- Much higher rate limits
- Advanced features

**Info:** https://developer.twitter.com/en/portal/products

## Best Practices Summary

✅ **DO:**
- Set `SCHEDULE_HOURS=6` or more
- Monitor usage in Developer Portal
- Wait 15 minutes if you hit rate limit
- Calculate total tweets (bot + manual) per day
- Stop bot if error 429

❌ **DON'T:**
- Spam "Run Once" for testing
- Set interval < 3 hours
- Retry multiple times on error 429
- Post > 50 tweets/day
- Ignore error messages

## Resources

- [Twitter API Documentation](https://developer.twitter.com/en/docs/twitter-api)
- [Rate Limits Reference](https://developer.twitter.com/en/docs/twitter-api/rate-limits)
- [Developer Portal](https://developer.twitter.com/en/portal/dashboard)
- [API Pricing](https://developer.twitter.com/en/portal/products)

---

**Remember:** Better to post 4 quality tweets per day than spam 50 tweets and get suspended!

**Recommended Setting:** `SCHEDULE_HOURS=6` (4 tweets/day = 120 tweets/month)
