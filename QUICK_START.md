# Quick Start Guide

## Prerequisites

Before running the app, make sure you have:

1. **Node.js** installed (v16 or higher)
   - Check: `node --version`
   - Download: https://nodejs.org/

2. **npm** or **yarn** package manager
   - npm comes with Node.js
   - Check: `npm --version`

3. **Expo CLI** (optional but recommended)
   ```bash
   npm install -g expo-cli
   ```

4. **For iOS** (Mac only):
   - Xcode installed
   - iOS Simulator

5. **For Android**:
   - Android Studio installed
   - Android Emulator set up

6. **For Physical Device**:
   - Expo Go app installed on your phone
   - iOS: App Store
   - Android: Google Play Store

## Step-by-Step Instructions

### 1. Navigate to Project Directory

```bash
cd "C:\Users\vishw\OneDrive\Desktop\AI Closet APP"
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages. Wait for it to complete (may take a few minutes).

### 3. Start the Development Server

```bash
npm start
```

or

```bash
expo start
```

This will:
- Start the Metro bundler
- Open Expo DevTools in your browser
- Show a QR code in the terminal

### 4. Run on Your Device/Simulator

**Option A: Physical Device (Easiest)**
1. Install **Expo Go** app on your phone
2. Scan the QR code from the terminal with:
   - **iOS**: Camera app
   - **Android**: Expo Go app
3. The app will load on your device

**Option B: iOS Simulator (Mac only)**
- Press `i` in the terminal where Expo is running
- Or click "Run on iOS simulator" in Expo DevTools

**Option C: Android Emulator**
- Press `a` in the terminal where Expo is running
- Or click "Run on Android device/emulator" in Expo DevTools
- Make sure your emulator is running first

**Option D: Web Browser**
- Press `w` in the terminal
- Or click "Run in web browser" in Expo DevTools

## Troubleshooting

### "Command not found: expo"
```bash
npm install -g expo-cli
```

### "Cannot find module" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Metro bundler cache issues
```bash
# Clear cache and restart
expo start -c
```

### Port already in use
```bash
# Kill the process using port 8081
# Windows:
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8081 | xargs kill -9
```

### Database errors on first run
- This is normal - the database will be created automatically
- If you see SQLite errors, try restarting the app

## Development Tips

- **Hot Reload**: Changes to code will automatically reload
- **Shake Device**: Opens developer menu (or press `Cmd+D` on iOS, `Cmd+M` on Android)
- **Reload**: Press `r` in the terminal to reload
- **Clear Cache**: Press `Shift+R` in the terminal

## Next Steps

Once the app is running:
1. Complete the onboarding screen
2. Add your first clothing item
3. Generate AI outfit suggestions
4. Explore the calendar and profile screens

Enjoy your AI Closet app! 🎉


