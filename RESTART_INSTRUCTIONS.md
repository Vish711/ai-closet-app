# How to Restart Backend and Frontend

## Quick Restart Steps

### 1. Restart Backend

**In your backend terminal:**
- Press `Ctrl+C` to stop the server
- Then run: `npm run dev`

**Or if using PM2:**
```bash
pm2 restart ai-closet-backend
```

### 2. Restart Frontend

**In your frontend terminal (where Expo is running):**
- Press `Ctrl+C` to stop Expo
- Then run: `npm start` or `npx expo start`

**Or just press `r` in the Expo terminal to reload** (faster, but may not pick up all changes)

## What Changed That Requires Restart

### Backend:
- ✅ CORS configuration (allows mobile connections)
- ✅ Server now listens on 0.0.0.0 (network accessible)
- ✅ Better error messages

### Frontend:
- ✅ Automatic image analysis
- ✅ API URL configuration in settings
- ✅ Better connection handling

## After Restarting

1. **Backend should show:**
   ```
   🚀 Server running on http://localhost:3000
   💡 To connect from mobile devices:
      1. Find your IP: ipconfig
      2. Use: http://YOUR_IP:3000/api
   ```

2. **Frontend should reload** and show the new features

3. **Test image analysis:**
   - Go to Closet → Add Item
   - Take/select a photo
   - Watch it auto-detect attributes!

4. **Test connection:**
   - On mobile, go to Profile → Settings
   - Set Backend URL to your computer's IP
   - Try creating an account

## Quick Test Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running (Expo showing QR code)
- [ ] Can add photo and see auto-detection
- [ ] Can configure API URL in settings
- [ ] Can connect from mobile device

