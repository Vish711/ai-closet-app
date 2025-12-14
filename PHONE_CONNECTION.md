# Connect Your Phone to Your Computer

## The Setup
- **Your Computer:** Running Expo server (Cursor, terminal, etc.)
- **Your Phone:** Has Expo Go app installed
- **Goal:** Phone connects to Expo server on your computer

## ✅ Step-by-Step Instructions

### Step 1: Start Expo on Your Computer

**On your computer, open PowerShell and run:**

```bash
cd "C:\Users\vishw\OneDrive\Desktop\AI Closet APP"
npx expo start --tunnel
```

**OR** double-click `START_EXPO_TUNNEL.bat` in your project folder

**Wait for:**
- QR code to appear in the terminal
- Text showing connection URLs
- Should NOT show `127.0.0.1` (that's wrong!)

### Step 2: Scan QR Code on Your Phone

1. **Open Expo Go app** on your phone
2. **Tap "Scan QR Code"**
3. **Point camera at the QR code** in your computer's terminal
4. **App should load!**

### Step 3: If QR Code Doesn't Work - Manual Connection

1. **On your phone**, open Expo Go
2. **Tap "Enter URL manually"** (usually at bottom of screen)
3. **Type:** `exp://10.167.0.46:8081`
4. **Tap Connect**

### Step 4: Update Backend URL in App

**After app loads on your phone:**

1. Go to **Profile** tab (bottom right)
2. Tap **Settings**
3. Expand **"Backend Server URL"**
4. Enter: `http://10.167.0.46:3000/api`
5. **Save**

This lets your phone connect to the backend on your computer!

---

## Your Computer's IP Address

**IP Address:** `10.167.0.46`

**Expo URL:** `exp://10.167.0.46:8081`

**Backend URL:** `http://10.167.0.46:3000/api`

---

## Troubleshooting

### "Cannot connect to server" on phone
- Make sure Expo is running on your computer
- Check both devices are on same Wi-Fi (unless using tunnel)
- Try tunnel mode: `npx expo start --tunnel`

### QR code shows 127.0.0.1
- This is wrong! It should show your IP (10.167.0.46)
- Restart Expo with: `npx expo start --tunnel` or `npx expo start --lan`

### Can't find QR code
- Look at the terminal window on your computer
- Should see a big QR code
- If not, wait 30-60 seconds for tunnel mode

### Backend not working
- Make sure backend is running on computer: `cd backend && npm run dev`
- Update backend URL in app settings to: `http://10.167.0.46:3000/api`

---

## Quick Commands (Run on Your Computer)

**Start Expo (Tunnel - works anywhere):**
```bash
cd "C:\Users\vishw\OneDrive\Desktop\AI Closet APP"
npx expo start --tunnel
```

**Start Expo (LAN - same Wi-Fi only):**
```bash
cd "C:\Users\vishw\OneDrive\Desktop\AI Closet APP"
npx expo start --lan
```

**Start Backend:**
```bash
cd "C:\Users\vishw\OneDrive\Desktop\AI Closet APP\backend"
npm run dev
```




