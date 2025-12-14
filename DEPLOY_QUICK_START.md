# Quick Deploy to GitHub Pages

## 🚀 5-Minute Setup

### Step 1: Create GitHub Repository

```bash
# If not already a git repo
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ai-closet-app.git
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to: `https://github.com/YOUR_USERNAME/ai-closet-app/settings/pages`
2. Source: **GitHub Actions**
3. Save

### Step 3: Host Backend (Choose One)

**Option A: Render.com (Easiest)**
1. Go to https://render.com
2. Sign up (free)
3. New → Web Service
4. Connect GitHub repo
5. Root Directory: `backend`
6. Build: `cd backend && npm install`
7. Start: `cd backend && npm start`
8. Copy URL (e.g., `https://your-app.onrender.com`)

**Option B: Keep Local (Development)**
- Run backend on your computer
- Use ngrok: `ngrok http 3000`
- Copy ngrok URL

### Step 4: Deploy

```bash
git push origin main
```

Wait 2-5 minutes, then visit:
`https://YOUR_USERNAME.github.io/ai-closet-app/`

### Step 5: Configure Backend URL

1. Open app in browser
2. Go to Profile → Settings
3. Set Backend URL: `https://your-backend.onrender.com/api`
4. Save

**Done!** 🎉

---

## 🔄 Update App

```bash
# Make changes
git add .
git commit -m "Update"
git push origin main
```

Auto-deploys in 2-5 minutes!

---

## 📱 Access from Any Device

Just open: `https://YOUR_USERNAME.github.io/ai-closet-app/`

Works on:
- ✅ Computer
- ✅ Phone
- ✅ Tablet
- ✅ Any browser

---

**For detailed instructions, see `GITHUB_PAGES_SETUP.md`**


