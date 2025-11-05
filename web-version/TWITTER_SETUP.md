# 🐦 Twitter API Setup Guide

Complete guide to get Twitter API credentials.

## 📋 Prerequisites

- Active Twitter account (not suspended)

## 🚀 Step 1: Register Twitter Developer Account

### 1.1 Access Developer Portal

1. Open [Twitter Developer Portal](https://developer.twitter.com/)
2. Login with your Twitter account
3. If you don't have a Developer Account yet, click **"Sign up for Free Account"**

### 1.2 Complete Developer Application

1. Explain your use case (example):
   ```
   I'm building an automated Twitter bot that posts about Web3 trends 
   using AI-generated content. The bot will post tweets based on trending 
   topics from Membit API and generate content using Google Gemini AI.
   ```
2. Agree to Terms of Service

## 🔧 Step 2: Create Twitter App

### 2.1 Create New App

1. Click on the Gear icon (⚙️) or **App settings**
   
   ![App Settings](/images/App-Settings.png)

2. In the **Settings > User authentication not set up** section, click **Set Up**
   
   ![Set Up](/images/Developer-Set-Up.png)

3. In the **App permissions** section, change to **Read and write**
   
   ![App Permissions](/images/App-Permissions.png)

4. In the **Type of App** section, select **Web App, Automated App or Bot**
   
   ![Type of App](/images/Type-of-App.png)

5. In the **App Info** section, fill in anything, example: `https://google.com`
   
   ![App Info](/images/App-Info.png)

6. Click **Save**

### 2.2 Get API KEY and Access Token

1. Go to **Keys and tokens**

2. In the **Consumer Keys** section, click **Regenerate**

3. Save **API Key** & **API Key Secret** in a safe place

4. In the **Authentication Tokens > Access Token and Secret** section, click **Generate**

5. Save **Access Token** & **Access Token Secret** in a safe place

### 2.3 Save Credentials

You now have 4 credentials:

```
API Key:              xxxxxxxxxxxxxxxxxxxx
API Secret:           yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
Access Token:         1234567890-zzzzzzzzzzzzzzzzzzz
Access Token Secret:  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

**Save all in a safe place!**

## 📚 Resources

- [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
- [Twitter API Documentation](https://developer.twitter.com/en/docs/twitter-api)
- [API Rate Limits](https://developer.twitter.com/en/docs/twitter-api/rate-limits)
- [App Permissions Guide](https://developer.twitter.com/en/docs/authentication/oauth-1-0a/obtaining-user-access-tokens)

---

**🎉 Congratulations! Your bot is ready to use!**

If there are any problems, read the complete documentation at [README.md](README.md).
