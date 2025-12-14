# Android Tablet Setup Guide (24/7 Server)

## Setting Up on Android Tablet

### Option 1: Keep Backend Running on Your Computer

1. **On your computer**, start the backend:
   ```bash
   cd backend
   npm run dev
   ```

2. **Make sure your computer and tablet are on the same Wi-Fi network**

3. **Find your computer's IP address:**
   - Windows: Run `ipconfig` and look for IPv4 Address
   - Mac/Linux: Run `ifconfig` or `ip addr`

4. **On your Android tablet:**
   - Open Expo Go app
   - Tap "Enter URL manually"
   - Type: `exp://YOUR_COMPUTER_IP:8081`
   - Example: `exp://192.168.1.100:8081`

5. **Update API URL in the app:**
   - The app needs to know where the backend is
   - Edit `services/api.ts` and change:
   ```typescript
   const API_BASE_URL = 'http://YOUR_COMPUTER_IP:3000/api';
   ```

### Option 2: Run Backend on Android Tablet (Advanced)

This requires more setup but allows the tablet to be completely independent.

1. **Install Termux on Android tablet** (from F-Droid or Play Store)
2. **Install Node.js in Termux:**
   ```bash
   pkg install nodejs
   ```
3. **Transfer backend files to tablet**
4. **Run backend in Termux**

## Quick Connection Fixes

### For iOS/Android Connection Issues:

1. **Use Tunnel Mode** (works across networks):
   - In Expo terminal, press `s`
   - Select `tunnel`
   - Wait for new QR code
   - Scan it

2. **Manual Connection** (most reliable):
   - Open Expo Go
   - Tap "Enter URL manually"
   - Type the connection URL shown in terminal

3. **Check Firewall:**
   - Allow Node.js through Windows Firewall
   - Allow port 3000 and 8081

## Keep Server Running 24/7

### On Windows Computer:

1. **Use PM2** (process manager):
   ```bash
   npm install -g pm2
   cd backend
   pm2 start npm --name "ai-closet-backend" -- run dev
   pm2 save
   pm2 startup
   ```

2. **Or use Task Scheduler** to auto-start on boot

### On Android Tablet (Termux):

```bash
# Install termux-services
pkg install termux-services

# Create service script
# Then enable it to run on boot
```

## Network Configuration

### Find Your Computer's IP:
```bash
# Windows
ipconfig | findstr IPv4

# Mac/Linux
ifconfig | grep "inet "
```

### Test Connection:
```bash
# From tablet browser, try:
http://YOUR_COMPUTER_IP:3000/health
```

If this works, the backend is accessible!

