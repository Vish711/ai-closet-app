# All Connection Methods - Complete Guide

## Your Computer IP: `10.167.0.46`

---

## ✅ Method 1: Web Browser (Easiest - Works on Any Device)

### On Your Computer:
1. Run: `npm start` or `npx expo start`
2. In the terminal, press `w` (for web)
3. Browser opens automatically at `http://localhost:8081`

### On Your iOS Browser:
1. Make sure Expo is running on computer
2. Press `w` in Expo terminal (enables web mode)
3. Open Safari/Chrome on iOS
4. Go to: `http://10.167.0.46:8081`
5. App loads in browser!

**✅ This works without any SDK installation!**

---

## ✅ Method 2: Expo Go App (iOS/Android)

### On Your Computer:
1. Run: `npx expo start --tunnel` (works anywhere)
   OR
2. Run: `npx expo start --lan` (same Wi-Fi only)

### On Your Phone/Tablet:
1. Install **Expo Go** app from App Store/Play Store
2. **Option A:** Scan QR code from terminal
3. **Option B:** Tap "Enter URL manually"
   - Type: `exp://10.167.0.46:8081` (for LAN)
   - Or use the tunnel URL shown in terminal

**✅ Works on both iOS and Android!**

---

## ❌ Method 3: Android Emulator (Requires Android Studio)

**This requires Android Studio installation - skip if you don't have it.**

### If You Want to Set It Up:
1. Install Android Studio
2. Install Android SDK
3. Set environment variable: `ANDROID_HOME=C:\Users\vishw\AppData\Local\Android\Sdk`
4. Add to PATH: `%ANDROID_HOME%\platform-tools`
5. Then press `a` in Expo terminal

**⚠️ Not needed if using Expo Go app!**

---

## ✅ Method 4: iOS Simulator (Mac Only)

**Only works on Mac with Xcode installed.**

If you're on Windows, skip this option.

---

## Quick Reference

### Start Commands:

**Web (Browser):**
```bash
npm start
# Then press 'w' in terminal
```

**Expo Go (Phone/Tablet):**
```bash
npx expo start --tunnel  # Works anywhere
# OR
npx expo start --lan     # Same Wi-Fi only
```

**Direct Web URL:**
```bash
npm run web
# Then access: http://10.167.0.46:8081
```

### URLs:

**Web (from phone browser):**
- `http://10.167.0.46:8081`

**Expo Go (manual entry):**
- `exp://10.167.0.46:8081` (LAN mode)
- Or scan QR code (tunnel mode)

**Backend API:**
- `http://10.167.0.46:3000/api`

---

## Recommended Setup

**For iOS Browser:**
1. `npm start` → press `w` → use `http://10.167.0.46:8081` on phone

**For Expo Go App:**
1. `npx expo start --tunnel` → scan QR code

**For Android Tablet (24/7):**
1. Use Expo Go app
2. Set backend URL: `http://10.167.0.46:3000/api`

---

## Troubleshooting

### Android SDK Error (When Pressing 'a')
- **Ignore this** - you don't need it if using Expo Go
- Or install Android Studio if you want emulator

### URL Not Working
- Check Expo is running
- Verify IP address: `ipconfig`
- Make sure same Wi-Fi (unless using tunnel)
- Check firewall allows port 8081

### Web Not Loading
- Press `w` in Expo terminal first
- Or run: `npm run web`
- Try: `http://localhost:8081` on computer first




