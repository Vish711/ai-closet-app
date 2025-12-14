# Deploy to GitHub Pages - Simple Guide

## 🚀 Quick Deploy (5 Steps)

### 1. Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ai-closet-app.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to: `https://github.com/YOUR_USERNAME/ai-closet-app/settings/pages`
2. Source: **GitHub Actions**
3. Click **Save**

### 3. Host Backend (Free Options)

**Render.com (Recommended):**
1. Sign up at https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Root Directory: `backend`
5. Build: `cd backend && npm install`
6. Start: `cd backend && npm start`
7. Copy URL (e.g., `https://your-app.onrender.com`)

### 4. Deploy Frontend

```bash
git push origin main
```

Wait 2-5 minutes, then visit:
`https://YOUR_USERNAME.github.io/ai-closet-app/`

### 5. Configure Backend URL

1. Open app: `https://YOUR_USERNAME.github.io/ai-closet-app/`
2. Profile → Settings → Backend Server URL
3. Enter: `https://your-app.onrender.com/api`
4. Save

**Done!** 🎉

---

## 📱 Access from Any Device

Just open: `https://YOUR_USERNAME.github.io/ai-closet-app/`

Works on:
- ✅ Computer
- ✅ Phone  
- ✅ Tablet
- ✅ Any browser

---

## 🔄 Update App

```bash
git add .
git commit -m "Update"
git push origin main
```

Auto-deploys in 2-5 minutes!

---

**For detailed instructions, see `GITHUB_PAGES_SETUP.md`**


