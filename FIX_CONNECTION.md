# Fix Expo Go Connection Error

## The Problem
The QR code shows `exp://127.0.0.1:8081` which is localhost - this won't work on mobile devices. Your phone/tablet needs your computer's actual IP address.

## Quick Fix Options

### Option 1: Use Tunnel Mode (Easiest - Works Anywhere)
1. In your Expo terminal, press `s` (for settings)
2. Select `tunnel` mode
3. Wait for it to generate a new QR code
4. Scan the new QR code with Expo Go
5. This works even if your phone and computer are on different networks!

### Option 2: Use LAN Mode with Your Computer's IP
1. Find your computer's IP address:
   - **Windows:** Open PowerShell and run: `ipconfig`
   - Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x)
   - Example: `192.168.1.100`

2. In your Expo terminal:
   - Press `s` (for settings)
   - Select `lan` mode
   - Make sure it shows your IP address (not 127.0.0.1)

3. If it still shows 127.0.0.1:
   - Stop Expo (Ctrl+C)
   - Set environment variable: `set EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0` (Windows)
   - Restart: `npm start`

4. Scan the QR code - it should now show your IP address

### Option 3: Manual Connection in Expo Go
1. Open Expo Go app
2. Tap "Enter URL manually"
3. Enter: `exp://YOUR_COMPUTER_IP:8081`
   - Replace `YOUR_COMPUTER_IP` with your actual IP (e.g., `192.168.1.100`)
   - Example: `exp://192.168.1.100:8081`

## Firewall Issues
If connection still fails:
1. **Windows Firewall:** Allow Node.js and Expo through firewall
2. **Antivirus:** Temporarily disable to test
3. **Network:** Make sure phone and computer are on the same Wi-Fi

## For Android Tablet (24/7 Setup)
1. Use **Tunnel Mode** (most reliable)
2. Or set a static IP for your computer
3. Configure backend API URL in Profile → Settings to your computer's IP

## Test Connection
After connecting:
1. App should load in Expo Go
2. Try adding an item to test
3. Check if backend connection works (Profile → Settings → set API URL)

