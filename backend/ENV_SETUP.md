# Environment Variables Setup Guide

This guide explains how to securely set up API keys for image analysis without exposing them in your public repository.

## 🔒 Security Best Practices

- **NEVER commit `.env` files to Git** - They're already in `.gitignore`
- **NEVER hardcode API keys** in source code
- **Always use environment variables** for sensitive data
- **Use `.env.example`** as a template (safe to commit)

## 📋 Setup Steps

### 1. Local Development

1. **Copy the example file:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit `.env` and add your API keys:**
   ```env
   VISION_API_PROVIDER=openai
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

3. **The `.env` file is automatically loaded** by the backend (via `dotenv`)

### 2. Production (Render.com)

1. **Go to your Render.com dashboard**
2. **Select your backend service**
3. **Go to "Environment" tab**
4. **Add environment variables:**
   - `VISION_API_PROVIDER` = `openai` (or `google`, `aws`, `mock`)
   - `OPENAI_API_KEY` = `sk-your-actual-key-here`
   - (Or `GOOGLE_VISION_API_KEY` if using Google)

5. **Save and redeploy** - Render will automatically restart with new env vars

## 🎯 Supported Vision APIs

### Option 1: OpenAI Vision API (Recommended)

**Pros:**
- Best accuracy for clothing detection
- Easy to set up
- Good documentation

**Setup:**
1. Get API key from https://platform.openai.com/api-keys
2. Set in `.env`:
   ```env
   VISION_API_PROVIDER=openai
   OPENAI_API_KEY=sk-your-key-here
   ```

**Cost:** ~$0.01-0.03 per image

### Option 2: Google Cloud Vision API

**Pros:**
- Good accuracy
- Generous free tier
- Fast

**Setup:**
1. Enable Vision API in Google Cloud Console
2. Create API key at https://console.cloud.google.com/apis/credentials
3. Set in `.env`:
   ```env
   VISION_API_PROVIDER=google
   GOOGLE_VISION_API_KEY=your-key-here
   ```

**Cost:** First 1,000 requests/month free, then $1.50 per 1,000

### Option 3: Mock (Default)

**Pros:**
- No API key needed
- No cost
- Works immediately

**Cons:**
- Lower accuracy (uses filename heuristics)
- Good for testing only

**Setup:**
- No setup needed - works by default
- Or explicitly set: `VISION_API_PROVIDER=mock`

## 🔍 Verifying Setup

1. **Check backend logs** when starting:
   ```
   🚀 Server running on http://localhost:3000
   🖼️  Image analysis endpoint: http://localhost:3000/api/image-analysis/analyze
   ```

2. **Test with a simple request:**
   ```bash
   curl -X POST http://localhost:3000/api/image-analysis/analyze \
     -H "Content-Type: application/json" \
     -d '{"imageBase64":"base64-encoded-image-here"}'
   ```

3. **Check for errors:**
   - If you see "OPENAI_API_KEY not set", the env var isn't loaded
   - If you see "OpenAI API error", check your API key is valid

## 🚨 Troubleshooting

### "API key not set" error
- Make sure `.env` file exists in `backend/` directory
- Check the variable name matches exactly (case-sensitive)
- Restart the backend server after changing `.env`

### "API error" from provider
- Verify your API key is correct
- Check your API account has credits/quota
- For OpenAI: Check usage at https://platform.openai.com/usage

### Still using mock analysis
- Check `VISION_API_PROVIDER` is set correctly
- Check backend logs for initialization messages
- Make sure backend is restarted after env changes

## 📝 Example `.env` File

```env
# Server
PORT=3000
NODE_ENV=production

# Vision API (choose one)
VISION_API_PROVIDER=openai
OPENAI_API_KEY=sk-proj-abc123xyz789...

# Or use Google
# VISION_API_PROVIDER=google
# GOOGLE_VISION_API_KEY=AIzaSyAbc123xyz789...

# Or use mock (no key needed)
# VISION_API_PROVIDER=mock
```

## 🔐 Security Reminders

- ✅ `.env` is in `.gitignore` - safe to use
- ✅ `.env.example` is safe to commit (no real keys)
- ❌ Never commit `.env` files
- ❌ Never share API keys in chat/email
- ❌ Never hardcode keys in source code

