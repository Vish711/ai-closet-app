# How to Run the App

## What You Should See

When you run `npm start` or `npx expo start`, you should see:

1. **Metro bundler starting** - Building the app
2. **A QR code** in your terminal
3. **Menu options** like:
   ```
   › Press w │ open web
   › Press a │ open Android
   › Press i │ open iOS simulator
   › Press r │ reload app
   › Press m │ toggle menu
   ```

## How to Actually View the App

### Option 1: Web Browser (Easiest - No Phone Needed)
1. In the terminal where Expo is running, **press the `w` key**
2. This will open the app in your default web browser
3. You can interact with it there!

### Option 2: On Your Phone
1. Install **Expo Go** app:
   - iOS: App Store → Search "Expo Go"
   - Android: Google Play → Search "Expo Go"
2. In the terminal, you'll see a **QR code**
3. Scan it:
   - **iOS**: Use the Camera app (it will prompt to open in Expo Go)
   - **Android**: Open Expo Go app and tap "Scan QR code"
4. The app will load on your phone

### Option 3: Android Emulator
- Press `a` in the terminal (requires Android Studio/emulator to be running)

### Option 4: iOS Simulator (Mac only)
- Press `i` in the terminal (requires Xcode)

## If You Don't See the QR Code

The terminal window where you ran `npm start` should show the QR code. Make sure:
- The terminal window is still open
- You're looking at the correct terminal window
- The process is still running (you should see "Metro waiting on...")

## Quick Test

Try this in your terminal:
1. Make sure Expo is running (`npm start`)
2. Press `w` to open in web browser
3. You should see your AI Closet app!

