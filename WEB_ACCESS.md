# Access App from iOS Browser

## URL to Use

**On your iOS device (Safari or Chrome):**

```
http://10.167.0.46:8081
```

Replace `10.167.0.46` with your computer's IP if it's different.

## How to Find Your Computer's IP

**On your computer, run:**
```bash
ipconfig
```

Look for "IPv4 Address" (usually starts with 192.168.x.x or 10.x.x.x)

## Steps

1. **Make sure Expo is running** on your computer
   - Run: `npm start` or `npx expo start`
   - Or use: `START_EXPO_LAN.bat`

2. **On your iOS device:**
   - Open Safari (or Chrome)
   - Type in address bar: `http://10.167.0.46:8081`
   - Press Go

3. **The app should load** in your browser!

## Important Notes

- **Same Wi-Fi required:** Your phone and computer must be on the same Wi-Fi network
- **Expo must be running:** The server needs to be active on your computer
- **Use LAN mode:** Make sure Expo is running with `--lan` flag or use `START_EXPO_LAN.bat`

## If It Doesn't Work

1. **Check Expo is running** on your computer
2. **Check IP address** is correct (run `ipconfig` again)
3. **Try tunnel mode** - but this won't work in browser, only in Expo Go app
4. **Check firewall** - Windows Firewall might be blocking port 8081

## Alternative: Use Expo Go App

If browser doesn't work, use the **Expo Go app** instead:
1. Install Expo Go from App Store
2. Scan QR code or enter: `exp://10.167.0.46:8081`

## Update Backend URL

After app loads, go to:
- **Profile** → **Settings**
- Set Backend URL to: `http://10.167.0.46:3000/api`




