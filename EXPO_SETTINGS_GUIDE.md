# How to Access Expo Settings

## Where to Find Settings

When Expo is running, you should see a terminal window with:
- A QR code
- Menu options at the bottom like:
  ```
  › Press s │ switch to development build
  › Press a │ open Android
  › Press i │ open iOS simulator
  › Press w │ open web
  › Press r │ reload app
  › Press m │ toggle menu
  ```

## How to Switch to Tunnel/LAN Mode

### Method 1: Press 's' Key
1. **Click on the terminal window** where Expo is running
2. **Press the `s` key** (don't type anything else, just press `s`)
3. You should see a menu appear
4. Select `tunnel` or `lan` from the options

### Method 2: If 's' Doesn't Work
1. **Click on the terminal window** where Expo is running
2. **Press `m`** to toggle the menu
3. Look for connection options

### Method 3: Restart with LAN Mode
If you can't access settings, restart Expo with LAN mode:

1. **Stop Expo** (press `Ctrl+C` in the terminal)
2. **Run this command:**
   ```bash
   npx expo start --lan
   ```
3. This will start Expo in LAN mode automatically

### Method 4: Restart with Tunnel Mode
1. **Stop Expo** (press `Ctrl+C`)
2. **Run:**
   ```bash
   npx expo start --tunnel
   ```
3. This will start in tunnel mode automatically

## If You Don't See the Terminal

1. **Check if Expo is running:**
   - Look for a terminal/command prompt window
   - It should show a QR code and menu

2. **If Expo isn't running:**
   - Open a new terminal
   - Navigate to your project: `cd "C:\Users\vishw\OneDrive\Desktop\AI Closet APP"`
   - Run: `npm start`

3. **If you closed the terminal:**
   - Expo might still be running in the background
   - Check Task Manager for Node.js processes
   - Or just start a new terminal and run `npm start`

## Quick Commands

**Start with LAN mode:**
```bash
npx expo start --lan
```

**Start with Tunnel mode:**
```bash
npx expo start --tunnel
```

**Start normally (then press 's' for settings):**
```bash
npm start
```

## What You Should See

After running `npm start` or `npx expo start --lan`, you should see:
- A QR code
- Text showing the connection URL (should show your IP, not 127.0.0.1)
- Menu options at the bottom

