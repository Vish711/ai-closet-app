# Deploy Backend to Render.com (Free)

## 🚀 Quick Setup (5 minutes)

### Step 1: Sign Up
1. Go to: https://render.com
2. Click **"Get Started for Free"**
3. Sign up with GitHub (easiest - connects to your repo)

### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Vish711/ai-closet-app`
3. Click **"Connect"**

### Step 3: Configure Settings
**Name:** `ai-closet-backend` (or any name you like)

**Root Directory:** `backend`

**Environment:** `Node`

**Build Command:** 
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

### Step 4: Environment Variables
Click **"Environment"** tab and add:

**JWT_SECRET:**
- Click **"Add Environment Variable"**
- Key: `JWT_SECRET`
- Value: Generate a random string (e.g., use: https://randomkeygen.com/)
- Click **"Save"**

**PORT:**
- Render sets this automatically, but you can add:
- Key: `PORT`
- Value: `10000` (or leave blank - Render sets it)

**DATABASE_PATH:**
- Key: `DATABASE_PATH`
- Value: `/opt/render/project/src/data/closet.db`

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 2-3 minutes for deployment
3. When you see **"Live"**, your backend is ready!

### Step 6: Get Your Backend URL
1. Look at the top of the page
2. You'll see: `https://ai-closet-backend.onrender.com`
3. **Add `/api` at the end:** `https://ai-closet-backend.onrender.com/api`
4. This is your backend URL!

---

## 🔧 Configure Frontend

1. **Open your app:** https://Vish711.github.io/ai-closet-app/
2. **Go to:** Profile → Settings
3. **Find:** "Backend Server URL"
4. **Enter:** `https://ai-closet-backend.onrender.com/api`
5. **Save**

---

## ✅ Test It

1. Try creating an account
2. Try logging in
3. Add a clothing item
4. Should work perfectly!

---

## 📝 Notes

- **Free tier:** Service may sleep after 15 minutes of inactivity
- **First request:** May take 30 seconds to wake up (free tier)
- **Database:** Persists between deployments
- **Auto-deploy:** Updates automatically when you push to GitHub

---

## 🔄 Update Backend

Just push to GitHub:
```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render automatically rebuilds and deploys!

---

**That's it! Your backend is now online 24/7!** 🎉

