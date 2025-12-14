# Troubleshoot GitHub Pages Deployment

## 🔍 Step 1: Check if Workflow Has Run

1. Go to: **https://github.com/Vish711/ai-closet-app/actions**
2. Look for "Deploy to GitHub Pages" workflow
3. Check the status:
   - **No workflow runs** = Need to trigger it manually
   - **🟡 Yellow circle** = Still running (wait)
   - **✅ Green checkmark** = Success (check next steps)
   - **❌ Red X** = Failed (see error logs)

---

## 🚀 Step 2: Manually Trigger Workflow (If Not Run)

If you don't see any workflow runs:

1. Go to: **https://github.com/Vish711/ai-closet-app/actions**
2. Click on **"Deploy to GitHub Pages"** in the left sidebar
3. Click **"Run workflow"** button (top right)
4. Select branch: **main**
5. Click **"Run workflow"**
6. Wait 2-5 minutes

---

## 🔧 Step 3: Check for Errors

If workflow failed (red X):

1. Click on the failed workflow run
2. Click on the **"deploy"** job
3. Expand each step to see errors
4. Common issues:

### Issue: "npm ci" failed
**Solution:** Make sure `package-lock.json` exists in repository

### Issue: "expo export:web" failed
**Solution:** 
- Check if all dependencies are in `package.json`
- Make sure `app.json` is valid

### Issue: "Deploy to GitHub Pages" failed
**Solution:**
- Check if GitHub Pages is enabled
- Verify "GitHub Actions" is selected as source

---

## ✅ Step 4: Verify Deployment

After workflow succeeds:

1. Go to: **https://github.com/Vish711/ai-closet-app/settings/pages**
2. Scroll down - should show: **"Your site is live at https://Vish711.github.io/ai-closet-app/"**
3. Try accessing: **https://Vish711.github.io/ai-closet-app/**

---

## 🐛 Common Problems

### Problem: 404 Error
**Causes:**
- Workflow hasn't run yet
- Workflow failed
- GitHub Pages not enabled

**Solutions:**
1. Check Actions tab for workflow status
2. Manually trigger workflow if needed
3. Verify GitHub Pages is enabled in Settings

### Problem: Blank Page
**Causes:**
- Build failed silently
- Missing files in web-build

**Solutions:**
1. Check workflow logs
2. Verify `web-build` folder exists after build
3. Check browser console for errors

### Problem: "Cannot GET /"
**Causes:**
- Missing index.html
- Wrong base path

**Solutions:**
1. Check if `web-build/index.html` exists
2. Verify `homepage` in `package.json` is correct
3. Rebuild and redeploy

---

## 🔄 Force Re-deploy

If nothing works, force a new deployment:

1. Make a small change (add a space in README.md)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Trigger deployment"
   git push origin main
   ```
3. This will trigger the workflow automatically

---

## 📞 Still Not Working?

Check these:
- [ ] GitHub Pages enabled (Settings → Pages → GitHub Actions)
- [ ] Workflow ran successfully (Actions tab)
- [ ] No errors in workflow logs
- [ ] `web-build` folder exists after build
- [ ] `homepage` in `package.json` is correct
- [ ] Repository is public (or you have GitHub Pro)

---

**Need more help?** Check the workflow logs in the Actions tab for specific error messages!

