# Complete Setup Instructions - AI Closet App

## 🎯 Quick Overview

This is a React Native + Expo app with an Express.js backend. It works on:
- ✅ Web browsers
- ✅ iOS (via Expo Go or browser)
- ✅ Android (via Expo Go or browser)

---

## 📋 Prerequisites

### Required Software

1. **Node.js** (LTS version 20.x.x recommended)
   - Download: https://nodejs.org/
   - Choose "LTS" version
   - Install with default settings
   - Verify: Open terminal, type `node --version` (should show v20.x.x)
   - Verify: Type `npm --version` (should show version number)

2. **Code Editor** (optional but recommended)
   - Visual Studio Code: https://code.visualstudio.com/
   - Or any editor you prefer

---

## 🚀 Step-by-Step Setup

### Step 1: Install Node.js

1. Go to https://nodejs.org/
2. Download **LTS version** (20.x.x)
3. Run installer
4. Accept defaults
5. Restart terminal/command prompt

**Verify Installation:**
```bash
node --version
npm --version
```

Both should show version numbers.

---

### Step 2: Transfer Project Files

1. Copy entire project folder to new location
2. **Exclude:** `node_modules` folders (will be reinstalled)
3. **Include:** All `.ts`, `.tsx`, `.json`, `.md` files

---

### Step 3: Install Frontend Dependencies

Open terminal in project root:

```bash
# Navigate to project folder
cd "C:\Users\YourName\Desktop\AI Closet APP"

# Install all dependencies
npm install
```

**This will take 5-10 minutes.** Wait for completion.

**If you see errors:**
- Make sure Node.js is installed correctly
- Try: `npm cache clean --force` then `npm install` again
- Check internet connection

---

### Step 4: Install Backend Dependencies

```bash
# Navigate to backend folder
cd backend

# Install backend dependencies
npm install
```

**This will take 3-5 minutes.** Wait for completion.

**Go back to root:**
```bash
cd ..
```

---

### Step 5: Start Backend Server

**Open a terminal/command prompt:**

```bash
# Navigate to backend folder
cd backend

# Start backend server
npm run dev
```

**You should see:**
```
Server running on http://localhost:3000
Database initialized
```

**Keep this terminal open!** The backend must stay running.

---

### Step 6: Start Frontend App

**Open a NEW terminal/command prompt** (keep backend running):

```bash
# Navigate to project root
cd "C:\Users\YourName\Desktop\AI Closet APP"

# Start Expo
npm start
```

**You should see:**
```
› Metro waiting on exp://...
› Scan the QR code above with Expo Go
```

---

### Step 7: Access the App

#### Option A: Web Browser (Easiest)

1. In Expo terminal, press `w`
2. Browser opens automatically
3. App loads at `http://localhost:8081`

#### Option B: Mobile Device - Browser

1. Find your computer's IP address:
   - Windows: Open terminal, type `ipconfig`
   - Look for "IPv4 Address" (e.g., `192.168.1.100`)
2. In Expo terminal, press `w` (enables web mode)
3. On mobile browser, go to: `http://YOUR_IP:8081`
4. App loads!

#### Option C: Mobile Device - Expo Go App

1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. In Expo terminal, press `s`
3. Select `tunnel` (works anywhere) or `lan` (same Wi-Fi)
4. Scan QR code with Expo Go app
   OR
5. In Expo Go, tap "Enter URL manually"
6. Type: `exp://YOUR_IP:8081` (for LAN mode)

---

### Step 8: Configure Backend URL

**First time setup:**

1. Open app (browser or Expo Go)
2. Go to **Profile** tab (bottom right)
3. Tap **Settings**
4. Expand **"Backend Server URL"**
5. Enter: `http://YOUR_COMPUTER_IP:3000/api`
   - Replace `YOUR_COMPUTER_IP` with your actual IP
   - Example: `http://192.168.1.100:3000/api`
6. Tap **Save**

**Now you can:**
- Create an account
- Login
- Add clothing items
- Generate outfits
- Sync data across devices

---

## 🔧 Using Batch Files (Windows)

Instead of typing commands, you can use batch files:

### Start Frontend:
- Double-click `START_APP.bat`

### Start Backend:
- Open terminal in `backend` folder
- Run: `npm run dev`

### Start Web Mode:
- Double-click `START_WEB.bat`

### Start Tunnel Mode:
- Double-click `START_EXPO_TUNNEL.bat`

### Start LAN Mode:
- Double-click `START_EXPO_LAN.bat`

---

## 📱 Connection Methods Summary

### Web Browser (Recommended for Testing)
```bash
npm start
# Press 'w'
# Access: http://localhost:8081 (computer)
# Or: http://YOUR_IP:8081 (mobile)
```

### Expo Go - Tunnel (Works Anywhere)
```bash
npx expo start --tunnel
# Scan QR code with Expo Go
```

### Expo Go - LAN (Same Wi-Fi)
```bash
npx expo start --lan
# Use: exp://YOUR_IP:8081 in Expo Go
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "npm is not recognized"
**Solution:** Node.js not installed or not in PATH
- Reinstall Node.js
- Restart terminal
- Verify: `npm --version`

### Issue 2: "Port 3000 already in use"
**Solution:** Another app is using port 3000
- Close other applications
- Or change port in `backend/src/server.ts`

### Issue 3: "Port 8081 already in use"
**Solution:** Another Expo instance running
- Close other terminals
- Or kill process: `npx expo start --clear`

### Issue 4: "Cannot connect from mobile"
**Solution:** 
1. Make sure same Wi-Fi (unless using tunnel)
2. Check firewall allows ports 3000 and 8081
3. Use tunnel mode: `npx expo start --tunnel`
4. Verify IP with `ipconfig`

### Issue 5: "Android SDK path not found"
**Solution:** This is normal! Ignore it.
- You don't need Android Studio
- Use Expo Go app instead

### Issue 6: "Network error" when creating account
**Solution:**
1. Make sure backend is running (`npm run dev` in backend folder)
2. Check backend URL in app settings
3. Verify backend URL: `http://YOUR_IP:3000/api`

### Issue 7: Node.js 24+ Compatibility Issues
**Solution:** Use Node.js LTS 20.x.x
- Download from nodejs.org
- Choose LTS version
- Uninstall current Node.js first

---

## 🎯 Quick Start Commands

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm start
# Then press 'w' for web
```

**Access:**
- Computer: `http://localhost:8081`
- Mobile: `http://YOUR_IP:8081`

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Node.js installed (`node --version` works)
- [ ] npm installed (`npm --version` works)
- [ ] Frontend dependencies installed (`npm install` completed)
- [ ] Backend dependencies installed (`cd backend && npm install` completed)
- [ ] Backend starts (`npm run dev` shows "Server running")
- [ ] Frontend starts (`npm start` shows Expo menu)
- [ ] Can access in browser (press `w`, browser opens)
- [ ] Can create account in app
- [ ] Can login
- [ ] Can add clothing items
- [ ] Backend URL configured correctly

---

## 📚 Additional Resources

- `QUICK_START_GUIDE.md` - Quick reference
- `EXPO_MENU_GUIDE.md` - Expo menu options
- `TROUBLESHOOTING.md` - More troubleshooting
- `ALL_CONNECTION_METHODS.md` - All connection methods

---

## 🎉 You're All Set!

Once everything is working:
- ✅ Add clothing items with photos
- ✅ Get AI outfit suggestions
- ✅ Track outfit usage
- ✅ View calendar
- ✅ Sync data across devices

Enjoy your AI Closet app! 🚀

---

## 📞 Need Help?

1. Check error messages carefully
2. Review `TROUBLESHOOTING.md`
3. Verify all prerequisites installed
4. Make sure both backend and frontend are running
5. Check backend URL configuration in app


