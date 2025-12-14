# 🔒 Secure API Key Management

Your repository is **public**, but your API keys are **secure**! Here's how it works:

## ✅ How It's Secure

1. **API keys are stored in environment variables** (never in code)
2. **`.env` files are in `.gitignore`** (never committed)
3. **Backend handles all API calls** (keys never sent to frontend)
4. **`.env.example` is safe to commit** (template only, no real keys)

## 🚀 Quick Setup

### For Local Development:

1. **Create `.env` file in `backend/` directory:**
   ```bash
   cd backend
   cp .env.example .env  # If .env.example exists
   ```

2. **Add your API key:**
   ```env
   VISION_API_PROVIDER=openai
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

3. **Restart backend** - keys are automatically loaded

### For Production (Render.com):

1. Go to **Render.com Dashboard** → Your backend service
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add:
   - Key: `VISION_API_PROVIDER`, Value: `openai`
   - Key: `OPENAI_API_KEY`, Value: `sk-your-key-here`
5. **Save** - Render will redeploy automatically

## 📚 Full Documentation

See `backend/ENV_SETUP.md` for:
- Detailed setup instructions
- All supported vision APIs (OpenAI, Google, AWS)
- Troubleshooting guide
- Security best practices

## 🔑 Getting API Keys

### OpenAI Vision API (Recommended):
1. Sign up at https://platform.openai.com
2. Go to https://platform.openai.com/api-keys
3. Create new API key
4. Copy and paste into `.env` or Render.com

### Google Cloud Vision:
1. Go to https://console.cloud.google.com
2. Enable Vision API
3. Create credentials at https://console.cloud.google.com/apis/credentials
4. Copy API key

## ⚠️ Important Security Notes

- ✅ **Safe:** Using `.env` files (in `.gitignore`)
- ✅ **Safe:** Environment variables on Render.com
- ✅ **Safe:** Backend-only API calls
- ❌ **Never:** Commit `.env` files
- ❌ **Never:** Hardcode keys in source code
- ❌ **Never:** Share keys in chat/email

## 🧪 Testing

The app works without API keys (uses mock analysis), but for best results, add a real API key!

