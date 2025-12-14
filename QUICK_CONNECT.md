# Quick Connection Guide

## For iOS/Android - QR Code Not Working?

### ✅ Solution 1: Use Tunnel Mode (Easiest)

1. In Expo terminal, press `s`
2. Select `tunnel`
3. Wait 30-60 seconds for new QR code
4. Scan with Expo Go
5. **Works even on different Wi-Fi networks!**

### ✅ Solution 2: Manual Connection (Most Reliable)

1. **Find your computer's IP:**
   ```bash
   # Windows
   ipconfig
   # Look for "IPv4 Address" (e.g., 192.168.1.100)
   ```

2. **On your device:**
   - Open Expo Go
   - Tap "Enter URL manually"
   - Type: `exp://YOUR_IP:8081`
   - Example: `exp://192.168.1.100:8081`

3. **Update Backend URL in app:**
   - Go to Profile → Settings
   - Expand "Backend Server URL"
   - Enter: `http://YOUR_IP:3000/api`
   - Example: `http://192.168.1.100:3000/api`
   - Save

## Android Tablet Setup (24/7)

### Keep Backend Running:

**Option 1: PM2 (Recommended)**
```bash
npm install -g pm2
cd backend
pm2 start npm --name "ai-closet-backend" -- run dev
pm2 save
pm2 startup  # Auto-start on boot
```

**Option 2: Windows Task Scheduler**
- Create `start-backend.bat` with: `cd backend && npm run dev`
- Add to Task Scheduler to run on startup

### Connect Tablet:

1. **Same Wi-Fi network** as computer
2. **Find computer IP:** `ipconfig` (Windows)
3. **In app (Profile → Settings):**
   - Set Backend URL: `http://YOUR_IP:3000/api`
4. **In Expo Go:**
   - Manual connection: `exp://YOUR_IP:8081`

## Test Connection

1. **Test backend:** Open `http://YOUR_IP:3000/health` in tablet browser
2. **If it works:** Backend is accessible!
3. **If it fails:** Check firewall, same network, IP address

## Common Issues

- **QR code doesn't work:** Use tunnel mode or manual connection
- **Can't reach backend:** Update API URL in Profile settings
- **Works on web but not mobile:** Mobile needs your IP, not localhost

