# Deploy Backend to Render.com - Quick Start

## 🚀 5-Minute Setup

### 1. Sign Up
- Go to: https://render.com
- Sign up with GitHub

### 2. Create Web Service
- Click **"New +"** → **"Web Service"**
- Connect repo: `Vish711/ai-closet-app`

### 3. Settings
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

### 4. Environment Variables
Add these in the "Environment" tab:

**JWT_SECRET:**
- Generate at: https://randomkeygen.com/
- Copy a random string
- Add as environment variable

**DATABASE_PATH:**
- Key: `DATABASE_PATH`
- Value: `/opt/render/project/src/data/closet.db`

### 5. Deploy
- Click **"Create Web Service"**
- Wait 2-3 minutes
- Copy your URL: `https://your-app.onrender.com/api`

### 6. Configure Frontend
- Open: https://Vish711.github.io/ai-closet-app/
- Profile → Settings → Backend URL
- Enter: `https://your-app.onrender.com/api`
- Save

**Done!** Your backend is now online 24/7! 🎉

---

**Full guide:** See `backend/DEPLOY_BACKEND.md`

