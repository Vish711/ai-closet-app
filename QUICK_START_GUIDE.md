# Quick Start Guide - All Connection Methods

## Your Computer IP: `10.167.0.46`

---

## ✅ METHOD 1: iOS Browser (Easiest!)

### Step 1: Start Expo on Your Computer
```bash
npm start
```
Then press `w` in the terminal (enables web mode)

### Step 2: On Your iOS Device
1. Open Safari or Chrome
2. Go to: `http://10.167.0.46:8081`
3. App loads!

### Step 3: Set Backend URL (First Time Only)
1. In the app, go to **Profile** → **Settings**
2. Expand **"Backend Server URL"**
3. Enter: `http://10.167.0.46:3000/api`
4. **Save**

**✅ Done! App works in browser!**

---

## ✅ METHOD 2: Expo Go App (Best for Mobile)

### Step 1: Start Expo on Your Computer
```bash
npx expo start --tunnel
```
OR double-click `START_EXPO_TUNNEL.bat`

### Step 2: On Your Phone/Tablet
1. Install **Expo Go** from App Store/Play Store
2. Open Expo Go
3. **Scan QR code** from terminal
   OR
4. Tap "Enter URL manually"
5. Type: `exp://10.167.0.46:8081` (for LAN mode)
   OR use tunnel URL shown in terminal

### Step 3: Set Backend URL
Same as Method 1 - Profile → Settings → Backend URL

**✅ Done! App works in Expo Go!**

---

## ❌ Android Emulator (Skip This)

**Error you saw:**
```
Failed to resolve the Android SDK path
```

**Why:** Android Studio not installed (not needed!)

**Solution:** Use Expo Go app instead - it's easier and works perfectly!

---

## Menu Options Explained

When you run `npm start`, you'll see:

- **Press `w`** → Open web (✅ Use this for browser!)
- **Press `s`** → Switch mode (tunnel/LAN) (✅ Use for Expo Go!)
- **Press `r`** → Reload app (✅ Works great!)
- **Press `a`** → Android emulator (❌ Needs Android Studio - skip!)
- **Press `i`** → iOS simulator (❌ Mac only - skip!)

---

## Troubleshooting

### URL Not Working
- Make sure Expo is running
- Check IP address: `ipconfig` (should be `10.167.0.46`)
- Make sure same Wi-Fi (unless using tunnel)
- Press `w` first to enable web mode

### Backend Not Connecting
- Make sure backend is running: `cd backend && npm run dev`
- Set backend URL in app: `http://10.167.0.46:3000/api`
- Check firewall allows port 3000

### Android SDK Error
- **Ignore it!** You don't need Android Studio
- Use Expo Go app instead

---

## Recommended Setup

**For iOS Browser:**
1. `npm start` → press `w`
2. Go to `http://10.167.0.46:8081` on phone

**For Expo Go:**
1. `npx expo start --tunnel` → scan QR code

**For Android Tablet (24/7):**
1. Use Expo Go app
2. Set backend URL: `http://10.167.0.46:3000/api`

---

## Quick Commands

**Start Web:**
```bash
npm start
# Then press 'w'
```

**Start Tunnel (Expo Go):**
```bash
npx expo start --tunnel
```

**Start LAN (Expo Go):**
```bash
npx expo start --lan
```

**Start Backend:**
```bash
cd backend
npm run dev
```

---

## Summary

✅ **Working Methods:**
- Web browser (`w` key)
- Expo Go app (scan QR code)
- Tunnel mode (works anywhere)

❌ **Skip These:**
- Android emulator (`a` key) - needs Android Studio
- iOS simulator (`i` key) - Mac only

**Best Choice:** Use `w` for browser or `--tunnel` for Expo Go!




