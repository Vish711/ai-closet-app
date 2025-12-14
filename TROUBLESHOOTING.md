# Troubleshooting Guide

## How to Copy Logs Without Stopping the Server

### In PowerShell/Command Prompt:
1. **Right-click** in the terminal window
2. Select **"Mark"** from the context menu
3. **Click and drag** to select the text you want to copy
4. Press **Enter** to copy the selected text
5. The server will keep running!

### Alternative Method:
- **Right-click** the terminal title bar → **Edit** → **Mark**
- Select text with mouse
- Press **Enter** to copy

### Using Keyboard (PowerShell):
- **Ctrl+C** will stop the server (don't use this!)
- Instead, use **right-click → Mark** method above

## Fixing "Cannot Connect to Server" Error

### Issue 1: Network Connection
Your phone and computer need to be on the **same Wi-Fi network**.

**Check:**
1. Make sure your phone is connected to the same Wi-Fi as your computer
2. Not using mobile data
3. Not on a guest network (some block device-to-device communication)

### Issue 2: Firewall Blocking Connection
Windows Firewall might be blocking Expo.

**Fix:**
1. When you see the firewall prompt, click **"Allow access"**
2. Or manually allow Node.js through Windows Firewall:
   - Windows Security → Firewall → Allow an app
   - Find "Node.js" and check both Private and Public

### Issue 3: Use Tunnel Mode
If same network doesn't work, use Expo's tunnel:

**In the terminal where Expo is running:**
- Press `s` to switch connection type
- Select **"tunnel"** (slower but works across networks)
- Scan the new QR code

### Issue 4: Try Manual Connection
Instead of scanning QR code:
1. In Expo Go app, tap **"Enter URL manually"**
2. Type: `exp://YOUR_COMPUTER_IP:8081`
   - Find your IP: In terminal run `ipconfig` (look for IPv4 Address)
   - Example: `exp://192.168.1.100:8081`

## Quick Fixes

### Restart Expo Server:
1. In the terminal, press **Ctrl+C** to stop
2. Run: `npx expo start --clear`
3. Try connecting again

### Clear Everything and Restart:
```powershell
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
npx expo start --clear
```

### Check if Server is Running:
Look for these in your terminal:
- "Metro waiting on..."
- A QR code
- "› Press w │ open web"

If you don't see these, the server isn't fully started yet (wait 10-30 seconds).

