# Transfer Checklist - AI Closet App

## ✅ Pre-Transfer Checklist

### Files to Verify

- [ ] **Frontend Source Files**
  - [ ] `App.tsx` exists
  - [ ] `package.json` exists
  - [ ] `tsconfig.json` exists
  - [ ] `babel.config.js` exists
  - [ ] `metro.config.js` exists
  - [ ] `app.json` exists

- [ ] **Components Folder**
  - [ ] `components/ClothingItemCard.tsx`
  - [ ] `components/FilterChip.tsx`
  - [ ] `components/FuturisticCard.tsx`
  - [ ] `components/GlowButton.tsx`
  - [ ] `components/ImageDropZone.tsx`
  - [ ] `components/OutfitCard.tsx`
  - [ ] `components/OutfitPreview.tsx`

- [ ] **Screens Folder**
  - [ ] `screens/AddItemScreen.tsx`
  - [ ] `screens/CalendarScreen.tsx`
  - [ ] `screens/ClosetScreen.tsx`
  - [ ] `screens/FitsScreen.tsx`
  - [ ] `screens/LoginScreen.tsx`
  - [ ] `screens/OnboardingScreen.tsx`
  - [ ] `screens/ProfileScreen.tsx`

- [ ] **Services Folder**
  - [ ] `services/aiStylist.ts`
  - [ ] `services/api.ts`
  - [ ] `services/imageAnalysis.ts`
  - [ ] `services/storageSync.ts`

- [ ] **Other Folders**
  - [ ] `hooks/useWardrobe.ts`
  - [ ] `lib/storage.ts`
  - [ ] `theme/index.ts`
  - [ ] `types/index.ts`

- [ ] **Backend Files**
  - [ ] `backend/package.json`
  - [ ] `backend/tsconfig.json`
  - [ ] `backend/src/server.ts`
  - [ ] `backend/src/db/database.ts`
  - [ ] `backend/src/middleware/auth.ts`
  - [ ] `backend/src/routes/auth.ts`
  - [ ] `backend/src/routes/wardrobe.ts`
  - [ ] `backend/src/types/index.ts`

- [ ] **Documentation**
  - [ ] `SETUP_INSTRUCTIONS.md`
  - [ ] `TRANSFER_PACKAGE.md`
  - [ ] `README_TRANSFER.md`
  - [ ] `QUICK_START_GUIDE.md`
  - [ ] `TROUBLESHOOTING.md`

- [ ] **Batch Files (Windows)**
  - [ ] `START_APP.bat`
  - [ ] `START_EXPO_TUNNEL.bat`
  - [ ] `START_EXPO_LAN.bat`
  - [ ] `START_WEB.bat`

---

## ❌ Files to EXCLUDE

- [ ] `node_modules/` (frontend) - **EXCLUDE**
- [ ] `backend/node_modules/` - **EXCLUDE**
- [ ] `.expo/` - **EXCLUDE**
- [ ] `.expo-shared/` - **EXCLUDE**
- [ ] `dist/` - **EXCLUDE**
- [ ] `web-build/` - **EXCLUDE**

---

## 📦 Transfer Method

### Option 1: Zip File (Recommended)

1. Select all files EXCEPT:
   - `node_modules` folders
   - `.expo` folder
   - `dist` folder

2. Right-click → "Send to" → "Compressed (zipped) folder"

3. Name it: `AI_Closet_App_Transfer.zip`

4. Transfer zip file to new computer

5. Extract on new computer

### Option 2: Cloud Storage

1. Upload to OneDrive/Google Drive/Dropbox
2. Exclude `node_modules` and `.expo` folders
3. Download on new computer

### Option 3: USB Drive

1. Copy entire folder (excluding `node_modules` and `.expo`)
2. Paste to USB drive
3. Copy to new computer

---

## 🚀 Setup on New Computer

### Step 1: Install Node.js
- [ ] Download from https://nodejs.org/
- [ ] Install LTS version (20.x.x)
- [ ] Verify: `node --version`
- [ ] Verify: `npm --version`

### Step 2: Extract/Copy Files
- [ ] Extract zip or copy folder
- [ ] Place in desired location (e.g., Desktop)

### Step 3: Install Dependencies
- [ ] Open terminal in project folder
- [ ] Run: `npm install`
- [ ] Wait for completion (5-10 minutes)
- [ ] Navigate to backend: `cd backend`
- [ ] Run: `npm install`
- [ ] Wait for completion (3-5 minutes)

### Step 4: Start Backend
- [ ] Open terminal in `backend` folder
- [ ] Run: `npm run dev`
- [ ] Verify: "Server running on http://localhost:3000"

### Step 5: Start Frontend
- [ ] Open NEW terminal in project root
- [ ] Run: `npm start`
- [ ] Press `w` for web mode
- [ ] Browser should open

### Step 6: Configure
- [ ] Open app
- [ ] Go to Profile → Settings
- [ ] Set Backend URL: `http://YOUR_IP:3000/api`
- [ ] Save

---

## ✅ Verification

After setup, test:

- [ ] Can access app in browser
- [ ] Can create account
- [ ] Can login
- [ ] Can add clothing item
- [ ] Can generate outfit
- [ ] Backend URL works

---

## 📝 Notes

- **Size without node_modules:** ~2-5 MB
- **Size with node_modules:** ~500+ MB (don't include!)
- **Time to install dependencies:** 10-15 minutes total
- **Node.js version:** Use LTS 20.x.x (not 24+)

---

## 🎉 Ready to Transfer!

Once all checkboxes are marked, you're ready to transfer!


