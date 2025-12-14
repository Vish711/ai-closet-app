# Quick Fix: Cannot Connect to Expo Server

## Your Computer's IP Address
**10.167.0.46**

## Solutions (Try in Order)

### Solution 1: Same Wi-Fi Network (Most Common Fix)
1. **Make sure your phone and computer are on the SAME Wi-Fi network**
2. Not mobile data
3. Not a guest network
4. Scan the QR code again

### Solution 2: Use Tunnel Mode
In the Expo terminal:
1. Press `s` (to switch connection type)
2. Select `tunnel` 
3. Wait for new QR code
4. Scan the new QR code
- **Note:** Tunnel is slower but works across different networks

### Solution 3: Manual Connection
1. Open **Expo Go** app on your phone
2. Tap **"Enter URL manually"**
3. Type: `exp://10.167.0.46:8081`
4. Tap Connect

### Solution 4: Use Web Browser Instead
In the Expo terminal, press `w` to open in your web browser
- This works immediately, no connection issues!

### Solution 5: Check Firewall
1. When Windows Firewall asks, click **"Allow access"**
2. Or manually allow Node.js through firewall

## How to Copy Logs Without Stopping Server

### Method 1: Right-Click Method
1. **Right-click** in the terminal
2. Select **"Mark"**
3. **Click and drag** to select text
4. Press **Enter** to copy
5. Server keeps running!

### Method 2: Select All Visible
1. **Right-click** terminal title bar
2. **Edit** → **Select All**
3. **Right-click** → **Copy**
4. Paste wherever you need

## Restart Server Properly

If nothing works, restart:
```powershell
# Stop server: Press Ctrl+C in the Expo terminal
# Then run:
npx expo start --clear
```

