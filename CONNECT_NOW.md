# Connect Expo Go Now - Quick Fix

## Your Computer IP: `10.167.0.46`

## ✅ EASIEST: Use Tunnel Mode (Recommended)

1. **In your Expo terminal** (where you ran `npm start`):
   - Press `s` (for settings)
   - Select `tunnel` from the menu
   - Wait 30-60 seconds for a new QR code
   - **Scan the new QR code** - this will work!

**Why this works:** Tunnel mode creates a public URL that works from anywhere, even different Wi-Fi networks.

---

## ✅ ALTERNATIVE: Manual Connection (Fast)

1. **Open Expo Go** on your phone/tablet
2. **Tap "Enter URL manually"** (usually at the bottom)
3. **Type exactly:** `exp://10.167.0.46:8081`
4. **Tap Connect**

---

## ✅ ALSO NEEDED: Update Backend URL

After the app connects:

1. Go to **Profile** tab → **Settings**
2. Expand **"Backend Server URL"**
3. Enter: `http://10.167.0.46:3000/api`
4. **Save**

This lets the app connect to your backend server.

---

## If Still Not Working

### Check Expo is in LAN Mode:
1. In Expo terminal, press `s`
2. Select `lan` (not localhost)
3. Should show your IP: `10.167.0.46`

### Check Firewall:
- Windows Firewall might be blocking
- Allow Node.js through firewall
- Or temporarily disable firewall to test

### Check Same Network:
- Phone and computer must be on same Wi-Fi
- (Unless using tunnel mode)

---

## For Your Android Tablet (24/7 Setup)

1. **Use tunnel mode** (most reliable)
2. **Or** set static IP for your computer
3. **Update backend URL** in Profile → Settings
4. **Keep backend running** (use PM2 or Task Scheduler)

