# Complete GitHub Setup Guide

## 🚀 I'll Help You Set Up GitHub Step-by-Step

### Step 1: Install Git (If Not Installed)

**Check if Git is installed:**
```bash
git --version
```

**If not installed:**
1. Download from: https://git-scm.com/download/win
2. Install with default settings
3. Restart terminal/Cursor

---

### Step 2: Initialize Git Repository

**Option A: Use the Batch Script (Easiest)**
1. Double-click `SETUP_GITHUB.bat`
2. It will initialize Git and create first commit

**Option B: Manual**
```bash
git init
git add .
git commit -m "Initial commit: AI Closet App"
```

---

### Step 3: Create GitHub Repository

1. **Go to GitHub:**
   - Visit: https://github.com/new
   - Sign in (or create account if needed)

2. **Create Repository:**
   - Repository name: `ai-closet-app`
   - Description: "AI Closet mobile app"
   - **Visibility:** Public (for free GitHub Pages) or Private
   - **DO NOT** check "Initialize with README"
   - **DO NOT** add .gitignore or license
   - Click **"Create repository"**

3. **Copy Repository URL:**
   - You'll see a page with setup instructions
   - Copy the HTTPS URL (e.g., `https://github.com/YOUR_USERNAME/ai-closet-app.git`)

---

### Step 4: Connect Local Repository to GitHub

**Option A: Use the Batch Script**
1. Double-click `SETUP_GITHUB_REMOTE.bat`
2. Paste your repository URL when prompted
3. It will connect and push your code

**Option B: Manual**
```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-closet-app.git
git branch -M main
git push -u origin main
```

**If you get authentication error:**
- Use GitHub Desktop: https://desktop.github.com
- Or GitHub CLI: `gh auth login`
- Or use Personal Access Token (see below)

---

### Step 5: Authentication (If Needed)

**If Git asks for credentials:**

**Option A: GitHub Desktop (Easiest)**
1. Download: https://desktop.github.com
2. Sign in with GitHub account
3. Clone your repository
4. Copy files to cloned folder
5. Commit and push from GitHub Desktop

**Option B: Personal Access Token**
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo` (all)
4. Copy token
5. Use token as password when Git asks

**Option C: GitHub CLI**
```bash
gh auth login
```

---

### Step 6: Enable GitHub Pages

1. **Go to Repository Settings:**
   - Visit: `https://github.com/YOUR_USERNAME/ai-closet-app/settings/pages`

2. **Configure Pages:**
   - Source: **GitHub Actions**
   - Branch: `main` (default)
   - Folder: `/ (root)` (default)
   - Click **Save**

3. **Wait for Deployment:**
   - Go to **Actions** tab
   - First deployment takes 2-5 minutes
   - When green checkmark appears, it's deployed!

4. **Access Your App:**
   - URL: `https://YOUR_USERNAME.github.io/ai-closet-app/`

---

### Step 7: Host Backend (Required)

GitHub Pages only serves static files. You need to host the backend separately.

**Recommended: Render.com (Free)**

1. **Sign Up:**
   - Go to: https://render.com
   - Sign up with GitHub (free)

2. **Create Web Service:**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Settings:
     - **Name:** `ai-closet-backend`
     - **Root Directory:** `backend`
     - **Environment:** `Node`
     - **Build Command:** `cd backend && npm install`
     - **Start Command:** `cd backend && npm start`
   - Click **"Create Web Service"**

3. **Get Backend URL:**
   - Wait for deployment (2-3 minutes)
   - Copy the URL (e.g., `https://ai-closet-backend.onrender.com`)
   - Add `/api` at the end: `https://ai-closet-backend.onrender.com/api`

---

### Step 8: Configure Backend URL in App

1. **Open Your App:**
   - Visit: `https://YOUR_USERNAME.github.io/ai-closet-app/`

2. **Configure Backend:**
   - Go to **Profile** tab
   - Tap **Settings**
   - Expand **"Backend Server URL"**
   - Enter: `https://ai-closet-backend.onrender.com/api`
   - Tap **Save**

3. **Test:**
   - Create an account
   - Add a clothing item
   - Should work!

---

## 🔄 Updating Your App

**Every time you make changes:**

```bash
git add .
git commit -m "Your update message"
git push origin main
```

GitHub Actions will automatically:
- Build the app
- Deploy to GitHub Pages
- Takes 2-5 minutes

---

## ✅ Quick Checklist

- [ ] Git installed
- [ ] Git repository initialized (`SETUP_GITHUB.bat`)
- [ ] GitHub repository created
- [ ] Local repo connected to GitHub (`SETUP_GITHUB_REMOTE.bat`)
- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled (Settings → Pages → GitHub Actions)
- [ ] Backend hosted (Render.com or similar)
- [ ] Backend URL configured in app
- [ ] App accessible at `https://YOUR_USERNAME.github.io/ai-closet-app/`

---

## 🐛 Troubleshooting

### "Git is not recognized"
- Install Git from https://git-scm.com/download/win
- Restart terminal/Cursor

### "Authentication failed"
- Use GitHub Desktop
- Or create Personal Access Token
- Or use GitHub CLI: `gh auth login`

### "Repository not found"
- Check repository URL is correct
- Make sure repository exists on GitHub
- Verify you have access

### "GitHub Pages not working"
- Check Actions tab for errors
- Verify GitHub Actions workflow exists
- Wait 2-5 minutes for first deployment

### "Cannot connect to backend"
- Make sure backend is running on Render.com
- Check backend URL includes `/api`
- Verify CORS allows GitHub Pages domain

---

## 📱 Access from Any Device

Once deployed, access from:
- **Computer:** `https://YOUR_USERNAME.github.io/ai-closet-app/`
- **Phone:** Same URL in mobile browser
- **Tablet:** Same URL in tablet browser
- **Any device:** Just open the URL!

**No app store needed!** 🎉

---

## 🎯 Summary

1. **Install Git** (if needed)
2. **Run `SETUP_GITHUB.bat`** - Initializes repository
3. **Create GitHub repo** - On github.com
4. **Run `SETUP_GITHUB_REMOTE.bat`** - Connects and pushes
5. **Enable GitHub Pages** - Settings → Pages → GitHub Actions
6. **Host backend** - Render.com (free)
7. **Configure backend URL** - In app settings
8. **Done!** - App is live!

---

**Need help?** Check the scripts I created - they'll guide you through each step!


