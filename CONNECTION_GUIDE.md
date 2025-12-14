# Connection Guide for iOS & Android Tablet

## Quick Fix for QR Code Issues

### Method 1: Use Tunnel Mode (Recommended for iOS)

1. In your Expo terminal, press `s`
2. Select `tunnel` from the menu
3. Wait for new QR code (may take 30-60 seconds)
4. Scan the new QR code with Expo Go
5. **Works even if devices are on different networks!**

### Method 2: Manual Connection (Most Reliable)

1. **Find your computer's IP address:**
   ```bash
   # Windows
   ipconfig
   # Look for "IPv4 Address" (e.g., 192.168.1.100)
   
   # Mac/Linux
   ifconfig
   # Look for "inet" address
   ```

2. **On your device (iOS/Android):**
   - Open Expo Go app
   - Tap "Enter URL manually" or "Connection" button
   - Type: `exp://YOUR_IP:8081`
   - Example: `exp://192.168.1.100:8081`
   - Tap Connect

### Method 3: Update API URL for Backend

If the app connects but can't reach the backend:

1. Go to **Profile/Settings** in the app
2. Expand "Backend Server URL"
3. Enter: `http://YOUR_COMPUTER_IP:3000/api`
4. Example: `http://192.168.1.100:3000/api`
5. Save and restart the app

## Android Tablet Setup (24/7)

### Step 1: Keep Backend Running on Computer

**Option A: Use PM2 (Keeps running after closing terminal)**
```bash
npm install -g pm2
cd backend
pm2 start npm --name "ai-closet-backend" -- run dev
pm2 save
pm2 startup  # Auto-start on computer boot
```

**Option B: Use Windows Task Scheduler**
1. Create a batch file: `start-backend.bat`
2. Add to Task Scheduler to run on startup

### Step 2: Connect Tablet to Backend

1. **Make sure computer and tablet are on same Wi-Fi**
2. **Find computer IP:** Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. **In the app (Profile → Settings):**
   - Set Backend URL to: `http://YOUR_IP:3000/api`
   - Example: `http://192.168.1.100:3000/api`

### Step 3: Test Connection

1. Open Expo Go on tablet
2. Connect using manual URL: `exp://YOUR_IP:8081`
3. Try creating an account - should work!

## Troubleshooting

### "Cannot connect to server"
- Check backend is running: `http://YOUR_IP:3000/health`
- Check firewall allows port 3000
- Verify same Wi-Fi network

### QR Code doesn't work
- Use tunnel mode (press `s` in Expo terminal)
- Or use manual connection method
- Check both devices on same network (unless using tunnel)

### Works on web but not mobile
- Update API URL in Profile settings
- Use your computer's IP, not localhost
- Check CORS settings in backend

## Network Requirements

- **Same Wi-Fi network** (for LAN connection)
- **Or use tunnel mode** (works across networks, slower)
- **Firewall** must allow ports 3000 (backend) and 8081 (Expo)

## Keep Everything Running 24/7

1. **Backend:** Use PM2 or Task Scheduler
2. **Frontend:** Keep Expo running, or build standalone app
3. **Tablet:** Keep Expo Go open, or install as standalone app

