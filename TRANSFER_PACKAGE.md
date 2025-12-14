# AI Closet App - Complete Transfer Package

## 📦 What to Transfer

### ✅ INCLUDE These Files/Folders:

```
AI Closet APP/
├── 📁 Frontend Files
│   ├── App.tsx
│   ├── app.json
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── babel.config.js
│   ├── metro.config.js
│   ├── .gitignore
│   │
│   ├── 📁 components/
│   │   ├── ClothingItemCard.tsx
│   │   ├── FilterChip.tsx
│   │   ├── FuturisticCard.tsx
│   │   ├── GlowButton.tsx
│   │   ├── ImageDropZone.tsx
│   │   ├── OutfitCard.tsx
│   │   └── OutfitPreview.tsx
│   │
│   ├── 📁 screens/
│   │   ├── AddItemScreen.tsx
│   │   ├── CalendarScreen.tsx
│   │   ├── ClosetScreen.tsx
│   │   ├── FitsScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   └── ProfileScreen.tsx
│   │
│   ├── 📁 services/
│   │   ├── aiStylist.ts
│   │   ├── api.ts
│   │   ├── imageAnalysis.ts
│   │   └── storageSync.ts
│   │
│   ├── 📁 hooks/
│   │   └── useWardrobe.ts
│   │
│   ├── 📁 lib/
│   │   └── storage.ts
│   │
│   ├── 📁 theme/
│   │   └── index.ts
│   │
│   ├── 📁 types/
│   │   └── index.ts
│   │
│   └── 📁 assets/ (if you have images)
│
├── 📁 Backend Files
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── .gitignore
│   │
│   ├── 📁 src/
│   │   ├── server.ts
│   │   ├── 📁 db/
│   │   │   └── database.ts
│   │   ├── 📁 middleware/
│   │   │   └── auth.ts
│   │   ├── 📁 routes/
│   │   │   ├── auth.ts
│   │   │   └── wardrobe.ts
│   │   └── 📁 types/
│   │       └── index.ts
│   │
│   └── 📁 data/ (optional - contains database)
│       └── closet.db
│
├── 📁 Documentation (All .md files)
│   ├── TRANSFER_PACKAGE.md (this file)
│   ├── SETUP_INSTRUCTIONS.md (complete setup guide)
│   └── All other .md files
│
└── 📁 Batch Files (Windows)
    ├── START_APP.bat
    ├── START_EXPO_TUNNEL.bat
    ├── START_EXPO_LAN.bat
    └── START_WEB.bat
```

### ❌ EXCLUDE These (Will be regenerated):

```
❌ node_modules/ (both frontend and backend)
❌ .expo/ (cache folder)
❌ backend/data/closet.db (optional - exclude if you want fresh database)
❌ dist/ (build output)
❌ .expo-shared/ (if exists)
```

---

## 📋 Transfer Checklist

- [ ] Copy entire project folder (excluding node_modules)
- [ ] Verify all .tsx, .ts, .json files are included
- [ ] Include all .md documentation files
- [ ] Include batch files (.bat)
- [ ] Verify backend/src/ folder is complete
- [ ] Verify frontend components/, screens/, services/ folders are complete

---

## 🚀 Setup on New Computer

### Step 1: Install Prerequisites

1. **Install Node.js** (LTS version 20 recommended)
   - Download from: https://nodejs.org/
   - Choose LTS version (20.x.x)
   - Verify: Open terminal, type `node --version` and `npm --version`

2. **Install Git** (optional, for version control)
   - Download from: https://git-scm.com/

### Step 2: Transfer Files

1. Copy the entire project folder to new computer
2. Place it in a location like: `C:\Users\YourName\Desktop\AI Closet APP`

### Step 3: Install Frontend Dependencies

```bash
# Open terminal in project root
cd "C:\Users\YourName\Desktop\AI Closet APP"

# Install dependencies
npm install
```

**Wait for installation to complete** (may take 5-10 minutes)

### Step 4: Install Backend Dependencies

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Go back to root
cd ..
```

**Wait for installation to complete** (may take 3-5 minutes)

### Step 5: Start the Application

**Option A: Use Batch Files (Windows)**
- Double-click `START_APP.bat` (starts frontend)
- Double-click `START_BACKEND.bat` (if exists, or run manually)

**Option B: Manual Start**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm start
# Then press 'w' for web, or scan QR code for mobile
```

### Step 6: Access the App

**On Computer:**
- Browser opens automatically at `http://localhost:8081`

**On Mobile Device:**
1. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Look for IPv4 address (e.g., `192.168.1.100`)
3. In Expo terminal, press `s` → select `tunnel` or `lan`
4. Scan QR code with Expo Go app
   OR
5. Go to `http://YOUR_IP:8081` in mobile browser

---

## 🔧 Configuration

### Backend URL Setup

1. Open app in browser or Expo Go
2. Go to **Profile** → **Settings**
3. Expand **"Backend Server URL"**
4. Enter: `http://YOUR_COMPUTER_IP:3000/api`
   - Replace `YOUR_COMPUTER_IP` with your actual IP (from `ipconfig`)
5. Click **Save**

---

## 📱 Connection Methods

### Method 1: Web Browser (Easiest)
```bash
npm start
# Press 'w' in terminal
# Then access: http://YOUR_IP:8081 on mobile
```

### Method 2: Expo Go App
```bash
npx expo start --tunnel
# Scan QR code with Expo Go app
```

### Method 3: LAN Mode
```bash
npx expo start --lan
# Use: exp://YOUR_IP:8081 in Expo Go
```

---

## ⚠️ Troubleshooting

### Node.js Version Issues
- **Problem:** Errors with Node.js 24+
- **Solution:** Use Node.js LTS 20.x.x

### Port Already in Use
- **Problem:** Port 3000 or 8081 already in use
- **Solution:** 
  - Close other applications using those ports
  - Or change ports in `backend/src/server.ts` and `app.json`

### Cannot Connect from Mobile
- **Problem:** Can't access from phone/tablet
- **Solution:**
  1. Make sure same Wi-Fi network (unless using tunnel)
  2. Check firewall allows ports 3000 and 8081
  3. Use tunnel mode: `npx expo start --tunnel`
  4. Verify IP address with `ipconfig`

### Android SDK Error
- **Problem:** Error when pressing 'a' in Expo
- **Solution:** Ignore it - use Expo Go app instead

---

## 📚 Documentation Files

All documentation is included:
- `SETUP_INSTRUCTIONS.md` - Complete setup guide
- `QUICK_START_GUIDE.md` - Quick start
- `EXPO_MENU_GUIDE.md` - Expo menu options
- `TROUBLESHOOTING.md` - Common issues
- And more...

---

## ✅ Verification

After setup, verify everything works:

1. ✅ Backend starts without errors
2. ✅ Frontend starts without errors
3. ✅ Can create account in app
4. ✅ Can login
5. ✅ Can add clothing items
6. ✅ Can generate outfits
7. ✅ Data syncs between devices (if logged in)

---

## 📞 Need Help?

1. Check `TROUBLESHOOTING.md`
2. Check `SETUP_INSTRUCTIONS.md`
3. Review error messages carefully
4. Make sure all dependencies installed
5. Verify Node.js version (should be 20.x.x)

---

## 🎉 You're Ready!

Once everything is set up, you can:
- Add clothing items with photos
- Get AI outfit suggestions
- Track outfit usage
- View calendar
- Sync data across devices

Enjoy your AI Closet app! 🚀


