# GitHub Pages Deployment Guide

## 🚀 Deploy Your AI Closet App to GitHub Pages

This guide will help you deploy your app so it's always accessible from any device via a web browser.

---

## 📋 Prerequisites

1. **GitHub Account** - Free account works fine
2. **Git Installed** - On your computer
3. **Node.js** - Already installed
4. **Backend Hosting** - You'll need to host the backend separately (see options below)

---

## 🔧 Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `ai-closet-app`)
3. **Don't** initialize with README (you already have files)
4. Copy the repository URL

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-closet-app.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 2: Host Your Backend

**Important:** GitHub Pages only serves static files. Your backend needs to be hosted separately.

### Option A: Free Backend Hosting (Recommended)

**1. Render.com (Free Tier)**
- Go to https://render.com
- Sign up (free)
- Create new "Web Service"
- Connect your GitHub repo
- Point to `backend` folder
- Set build command: `cd backend && npm install`
- Set start command: `cd backend && npm start`
- Free tier: 750 hours/month

**2. Railway.app (Free Tier)**
- Go to https://railway.app
- Sign up (free)
- Deploy from GitHub
- Select `backend` folder
- Free tier: $5 credit/month

**3. Fly.io (Free Tier)**
- Go to https://fly.io
- Free tier available

**4. Heroku (Paid, but has free alternatives)**
- Note: Heroku removed free tier, but alternatives exist

### Option B: Keep Backend Local (Development Only)

- Run backend on your computer
- Use a service like ngrok to expose it: `ngrok http 3000`
- Update API URL in app settings

### Option C: Self-Hosted Backend

- Deploy backend to your own server
- Use VPS (DigitalOcean, Linode, etc.)
- Configure domain name

---

## 📦 Step 3: Install gh-pages (Optional - for manual deployment)

If you want to deploy manually:

```bash
npm install --save-dev gh-pages
```

This is already added to `package.json` scripts.

---

## ⚙️ Step 4: Configure GitHub Pages

### 4.1 Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select:
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`
4. Click **Save**

### 4.2 Set Up GitHub Actions (Automatic Deployment)

The workflow file (`.github/workflows/deploy.yml`) is already created!

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add secret (optional):
   - **Name:** `API_URL`
   - **Value:** Your backend URL (e.g., `https://your-backend.onrender.com/api`)

---

## 🚀 Step 5: Deploy

### Option A: Automatic Deployment (Recommended)

**Using GitHub Actions:**

1. Push to `main` branch:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

2. GitHub Actions will automatically:
   - Build the app
   - Deploy to GitHub Pages
   - Takes 2-5 minutes

3. Check deployment:
   - Go to **Actions** tab in GitHub
   - See deployment progress

4. Access your app:
   - URL: `https://YOUR_USERNAME.github.io/ai-closet-app/`
   - Or: `https://YOUR_USERNAME.github.io/REPO_NAME/`

### Option B: Manual Deployment

```bash
# Build the app
npm run build:web

# Deploy to GitHub Pages
npm run deploy
```

This creates a `gh-pages` branch and deploys it.

---

## 🔗 Step 6: Configure Backend URL

Since your backend is hosted separately:

1. **Get your backend URL:**
   - If using Render: `https://your-app.onrender.com/api`
   - If using Railway: `https://your-app.railway.app/api`
   - If using ngrok: `https://your-id.ngrok.io/api`

2. **Update in app:**
   - Users can set this in Profile → Settings → Backend Server URL
   - OR set as default in code (see below)

3. **Set as default (optional):**
   - Add to GitHub Secrets: `API_URL`
   - Or update `services/api.ts` with your backend URL

---

## 🔧 Step 7: Update API URL in Code (Optional)

If you want to set a default backend URL:

1. Edit `services/api.ts`
2. Find the production URL section
3. Replace with your backend URL:

```typescript
// In services/api.ts, around line 9
if (!__DEV__) {
  return 'https://your-backend.onrender.com/api';
}
```

Or use environment variable:
- Add to GitHub Secrets: `API_URL`
- It will be injected during build

---

## ✅ Step 8: Test Your Deployment

1. **Wait for deployment** (2-5 minutes)
2. **Visit your GitHub Pages URL:**
   - `https://YOUR_USERNAME.github.io/ai-closet-app/`
3. **Test the app:**
   - Create account
   - Add clothing item
   - Generate outfits
   - Configure backend URL if needed

---

## 🔄 Updating Your App

### Automatic Updates

Every time you push to `main` branch, GitHub Actions will:
1. Build the app
2. Deploy to GitHub Pages
3. Takes 2-5 minutes

### Manual Updates

```bash
# Make changes
git add .
git commit -m "Update app"
git push origin main
```

---

## 🐛 Troubleshooting

### Issue: "404 Not Found" on GitHub Pages

**Solution:**
- Check GitHub Pages is enabled in Settings
- Verify `gh-pages` branch exists
- Wait a few minutes for deployment

### Issue: "Cannot connect to backend"

**Solution:**
1. Make sure backend is running and accessible
2. Configure backend URL in app: Profile → Settings
3. Check CORS settings on backend
4. Verify backend URL is correct (include `/api` at end)

### Issue: Build fails in GitHub Actions

**Solution:**
1. Check Actions tab for error messages
2. Verify Node.js version (should be 20.x)
3. Check if all dependencies are in `package.json`
4. Make sure `build:web` script works locally

### Issue: App loads but features don't work

**Solution:**
1. Check browser console for errors
2. Verify backend URL is configured
3. Check backend is running and accessible
4. Verify CORS allows GitHub Pages domain

---

## 📱 Accessing from Different Devices

Once deployed, access from:

- **Computer:** `https://YOUR_USERNAME.github.io/ai-closet-app/`
- **Phone:** Same URL in mobile browser
- **Tablet:** Same URL in tablet browser
- **Any device:** Just open the URL!

**No app store needed!** Works in any modern web browser.

---

## 🔒 Security Notes

1. **Backend Security:**
   - Use HTTPS for backend
   - Implement rate limiting
   - Use environment variables for secrets
   - Don't commit API keys

2. **CORS:**
   - Backend must allow GitHub Pages domain
   - Update CORS in `backend/src/server.ts`

3. **API Keys:**
   - Store in GitHub Secrets
   - Never commit to repository

---

## 📊 Deployment Checklist

- [ ] Git repository created
- [ ] Code pushed to GitHub
- [ ] Backend hosted (Render, Railway, etc.)
- [ ] GitHub Pages enabled
- [ ] GitHub Actions workflow working
- [ ] App deployed successfully
- [ ] Backend URL configured
- [ ] Tested on different devices
- [ ] CORS configured on backend

---

## 🎉 You're Done!

Your app is now live on GitHub Pages and accessible from anywhere!

**URL:** `https://YOUR_USERNAME.github.io/ai-closet-app/`

**Next Steps:**
- Share the URL with others
- Bookmark it on your devices
- Update the app and push to deploy automatically

---

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render.com Documentation](https://render.com/docs)
- [Railway.app Documentation](https://docs.railway.app)

---

## 💡 Tips

1. **Custom Domain:** You can use a custom domain with GitHub Pages
2. **HTTPS:** GitHub Pages provides free HTTPS
3. **Automatic Updates:** Every push to main auto-deploys
4. **Free Hosting:** Both GitHub Pages and backend hosting can be free
5. **No App Store:** No need to submit to app stores!

---

**Enjoy your always-accessible AI Closet app!** 🚀


