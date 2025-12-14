# How to Connect Your Phone/Tablet - Step by Step

## ✅ EASIEST METHOD: Use Tunnel Mode

### Step 1: Start Expo in Tunnel Mode

**Option A: Use the batch file**
1. Double-click `START_EXPO_TUNNEL.bat`
2. Wait for QR code to appear (30-60 seconds)

**Option B: Use command**
1. Open PowerShell or Command Prompt
2. Navigate to: `cd "C:\Users\vishw\OneDrive\Desktop\AI Closet APP"`
3. Run: `npx expo start --tunnel`
4. Wait for QR code

### Step 2: Scan QR Code
1. Open **Expo Go** app on your phone/tablet
2. Tap **"Scan QR Code"**
3. Scan the QR code from the terminal
4. App should load!

---

## ✅ ALTERNATIVE: Use LAN Mode (Faster, Same Wi-Fi Required)

### Step 1: Start Expo in LAN Mode

**Option A: Use the batch file**
1. Double-click `START_EXPO_LAN.bat`
2. Wait for QR code

**Option B: Use command**
1. Open PowerShell
2. Navigate to: `cd "C:\Users\vishw\OneDrive\Desktop\AI Closet APP"`
3. Run: `npx expo start --lan`
4. Wait for QR code

### Step 2: Scan QR Code
- Same as above - scan with Expo Go

### Step 3: Manual Connection (If QR doesn't work)
1. Open Expo Go
2. Tap **"Enter URL manually"**
3. Type: `exp://10.167.0.46:8081`
4. Tap Connect

---

## ✅ IMPORTANT: Update Backend URL

After the app connects:

1. Open the app in Expo Go
2. Go to **Profile** tab (bottom right)
3. Tap **Settings**
4. Expand **"Backend Server URL"**
5. Enter: `http://10.167.0.46:3000/api`
6. Tap **Save**

This lets the app connect to your backend!

---

## What You Should See

When Expo starts, you should see:
- A **QR code** in the terminal
- Text showing connection URLs
- Menu options at the bottom

**If you see `exp://127.0.0.1:8081`** - that's wrong! Use tunnel or LAN mode.

**If you see `exp://10.167.0.46:8081`** - that's correct! ✅

---

## Troubleshooting

### "Cannot connect to server"
- Make sure backend is running: `cd backend && npm run dev`
- Check firewall allows ports 3000 and 8081
- Try tunnel mode (works across networks)

### QR code shows 127.0.0.1
- Use `START_EXPO_TUNNEL.bat` or `START_EXPO_LAN.bat`
- Or run: `npx expo start --tunnel` or `npx expo start --lan`

### Can't find the terminal
- Look for a window with a QR code
- Or start a new terminal and run the batch files

---

## Quick Reference

**Your Computer IP:** `10.167.0.46`

**Expo URL (LAN):** `exp://10.167.0.46:8081`

**Backend URL:** `http://10.167.0.46:3000/api`

