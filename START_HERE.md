# 🎯 START HERE - AI Closet App

## Welcome!

This is your complete AI Closet app package. Follow the steps below to get started.

---

## 📦 What You Have

- ✅ Complete React Native + Expo mobile app
- ✅ Express.js backend with authentication
- ✅ Cross-platform support (Web, iOS, Android)
- ✅ AI-powered outfit suggestions
- ✅ Wardrobe management with photos
- ✅ Usage tracking and calendar

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Node.js
- Download from: https://nodejs.org/
- Choose **LTS version** (20.x.x)
- Install with defaults
- Verify: Open terminal, type `node --version`

### Step 2: Install Dependencies

**Open terminal in this folder:**

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 3: Start the App

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm start
# Press 'w' for web browser
```

**Done!** Browser opens at `http://localhost:8081`

---

## 📚 Documentation Guide

### For Setup:
- **`SETUP_INSTRUCTIONS.md`** ← Start here for detailed setup
- **`QUICK_START_GUIDE.md`** ← Quick reference

### For Transferring:
- **`TRANSFER_PACKAGE.md`** ← How to move to another computer
- **`TRANSFER_CHECKLIST.md`** ← What to include/exclude
- **`WHAT_TO_INCLUDE.txt`** ← File list

### For Troubleshooting:
- **`TROUBLESHOOTING.md`** ← Common issues
- **`EXPO_MENU_GUIDE.md`** ← Expo menu options
- **`ALL_CONNECTION_METHODS.md`** ← Connection methods

### For Reference:
- **`README.md`** ← Project overview
- **`README_TRANSFER.md`** ← Transfer package info

---

## 🎯 Common Tasks

### Access on Mobile Device

**Method 1: Browser (Easiest)**
1. Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. In Expo terminal, press `w`
3. On mobile browser: `http://YOUR_IP:8081`

**Method 2: Expo Go App**
1. Install Expo Go from App Store/Play Store
2. Run: `npx expo start --tunnel`
3. Scan QR code with Expo Go

### Configure Backend URL
1. Open app → Profile → Settings
2. Set: `http://YOUR_IP:3000/api`
3. Save

### Create Transfer Package
- Double-click: `CREATE_TRANSFER_PACKAGE.bat`
- Or follow: `TRANSFER_PACKAGE.md`

---

## ⚠️ Important Notes

1. **Node.js Version:** Use LTS 20.x.x (not 24+)
2. **Backend Must Run:** Keep backend terminal open
3. **Same Wi-Fi:** For mobile access (unless using tunnel)
4. **Android SDK Error:** Normal - ignore it, use Expo Go instead

---

## ✅ Verification

After setup, verify:
- [ ] Backend running (`npm run dev` shows "Server running")
- [ ] Frontend running (`npm start` shows Expo menu)
- [ ] Can access in browser (press `w`)
- [ ] Can create account
- [ ] Can login
- [ ] Can add clothing items

---

## 🆘 Need Help?

1. Check `SETUP_INSTRUCTIONS.md` for detailed steps
2. Check `TROUBLESHOOTING.md` for common issues
3. Review error messages carefully
4. Verify Node.js version (should be 20.x.x)

---

## 🎉 You're Ready!

Once everything is set up:
- ✅ Add clothing items with photos
- ✅ Get AI outfit suggestions
- ✅ Track outfit usage
- ✅ View calendar
- ✅ Sync data across devices

**Enjoy your AI Closet app!** 🚀

---

## 📞 Quick Commands Reference

```bash
# Start backend
cd backend && npm run dev

# Start frontend
npm start

# Web mode
npm start  # then press 'w'

# Tunnel mode (for Expo Go)
npx expo start --tunnel

# LAN mode (for Expo Go)
npx expo start --lan
```

---

**Next Step:** Read `SETUP_INSTRUCTIONS.md` for complete setup guide!


