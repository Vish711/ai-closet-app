# Quick GitHub Setup - 3 Steps

## Step 1: Install Git (If Needed)

**Check:**
```bash
git --version
```

**If not installed:**
- Download: https://git-scm.com/download/win
- Install with defaults
- Restart Cursor

---

## Step 2: Run Setup Scripts

1. **Double-click:** `SETUP_GITHUB.bat`
   - Initializes Git repository
   - Creates first commit

2. **Create GitHub Repository:**
   - Go to: https://github.com/new
   - Name: `ai-closet-app`
   - **Don't** initialize with README
   - Create repository

3. **Double-click:** `SETUP_GITHUB_REMOTE.bat`
   - Paste your GitHub repo URL
   - Connects and pushes code

---

## Step 3: Enable GitHub Pages

1. Go to: `https://github.com/YOUR_USERNAME/ai-closet-app/settings/pages`
2. Source: **GitHub Actions**
3. Save

**Wait 2-5 minutes, then visit:**
`https://YOUR_USERNAME.github.io/ai-closet-app/`

---

## Host Backend (Required)

**Render.com (Free):**
1. Sign up: https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Root Directory: `backend`
5. Build: `cd backend && npm install`
6. Start: `cd backend && npm start`
7. Copy URL: `https://your-app.onrender.com/api`

**Then configure in app:**
- Profile → Settings → Backend URL
- Enter: `https://your-app.onrender.com/api`

---

**Done!** 🎉

**For detailed instructions, see `GITHUB_SETUP_COMPLETE.md`**


