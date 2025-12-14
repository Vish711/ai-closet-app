# Cursor AI Handoff Prompt - AI Closet App

**Copy and paste this entire prompt into Cursor when starting on the new account:**

---

## Project Context

I'm continuing development on an **AI Closet mobile app** - a React Native + Expo application with an Express.js backend. This is a wardrobe management app with AI-powered outfit suggestions, cross-platform sync, and usage tracking.

## Project Structure & Key Files

### Frontend (React Native + Expo)
- **Entry Point:** `App.tsx` - Main app component, handles navigation, auth flow, onboarding
- **Screens:** `screens/` folder contains:
  - `LoginScreen.tsx` - Authentication (signup/login with validation)
  - `OnboardingScreen.tsx` - First-time user onboarding
  - `ClosetScreen.tsx` - Main wardrobe browsing
  - `AddItemScreen.tsx` - Add clothing items with image upload and auto-analysis
  - `FitsScreen.tsx` - AI outfit generation and suggestions
  - `CalendarScreen.tsx` - Outfit usage calendar view
  - `ProfileScreen.tsx` - User settings and backend URL configuration

### Components (`components/` folder):
- `FuturisticCard.tsx` - Reusable card component with dark theme
- `GlowButton.tsx` - Animated button with glow effects
- `FilterChip.tsx` - Filter pill component
- `ClothingItemCard.tsx` - Displays clothing items
- `OutfitCard.tsx` - Displays AI-generated outfits
- `OutfitPreview.tsx` - Visual outfit preview component
- `ImageDropZone.tsx` - Drag-and-drop image upload (web) with mobile fallback

### Services (`services/` folder):
- `api.ts` - **CRITICAL** - Backend API client, handles JWT auth, dynamic API URL detection
- `storageSync.ts` - **CRITICAL** - Hybrid storage service, syncs local (SQLite/localStorage) with backend
- `aiStylist.ts` - Mock AI service for outfit generation (ready for LLM integration)
- `imageAnalysis.ts` - Mock image analysis for auto-detecting clothing attributes

### Core Files:
- `lib/storage.ts` - Local storage layer (SQLite for native, localStorage for web)
- `hooks/useWardrobe.ts` - Custom hook for wardrobe state management
- `types/index.ts` - TypeScript type definitions (ClothingItem, Outfit, etc.)
- `theme/index.ts` - Centralized dark futuristic theme (colors, styles)

### Configuration:
- `package.json` - Frontend dependencies (Expo 50, React Native 0.73)
- `tsconfig.json` - TypeScript configuration
- `babel.config.js` - Babel config with module resolver
- `metro.config.js` - Metro bundler config (Node.js externals disabled for Windows)
- `app.json` - Expo configuration

### Backend (`backend/` folder):
- `backend/src/server.ts` - Express server entry point, CORS configured for Expo
- `backend/src/db/database.ts` - SQLite database setup and schema
- `backend/src/middleware/auth.ts` - JWT authentication middleware
- `backend/src/routes/auth.ts` - Auth routes (signup, login, verify) with validation
- `backend/src/routes/wardrobe.ts` - Wardrobe API endpoints
- `backend/package.json` - Backend dependencies (Express, SQLite, JWT, bcrypt)

## Current Features & Implementation Status

### ✅ Completed:
1. **Authentication System:**
   - Client-side and server-side validation
   - Password complexity requirements (8+ chars, uppercase, lowercase, number, special char)
   - Real-time validation feedback
   - "User already exists" detection with auto-switch to login
   - JWT token management

2. **Wardrobe Management:**
   - Add clothing items with photos
   - Automatic image analysis (mock service) to auto-fill attributes
   - Drag-and-drop image upload for web
   - Local storage (SQLite/localStorage) with backend sync
   - Filtering and categorization

3. **AI Outfit Generation:**
   - Mock AI service ready for LLM integration
   - Outfit preview visualization
   - Save/regenerate outfits
   - Item locking in outfits

4. **Cross-Platform Support:**
   - Web browser support
   - iOS (Expo Go or browser)
   - Android (Expo Go or browser)
   - Dynamic API URL detection (uses hostname IP when accessed remotely)

5. **UI/UX:**
   - Dark futuristic theme with cyan accents
   - Smooth animations (React Native Reanimated)
   - Professional design without emojis
   - Responsive layouts

### 🔧 Technical Details:

**API URL Detection:**
- `services/api.ts` automatically detects if accessed from remote device
- Uses `window.location.hostname` to determine if not localhost
- Falls back to `localhost:3000/api` for same-machine access
- User can manually configure in Profile → Settings

**Storage Strategy:**
- `services/storageSync.ts` provides unified interface
- Uses local storage when logged out
- Syncs with backend when logged in
- Transparent switching between local and remote

**Image Handling:**
- `ImageDropZone.tsx` supports drag-and-drop on web
- Falls back to standard image picker on mobile
- Uses Expo ImagePicker for native platforms

## Setup Instructions

### Prerequisites:
- Node.js LTS 20.x.x (NOT 24+ - compatibility issues with Expo on Windows)
- npm (comes with Node.js)

### Installation:
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### Running:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm start
# Press 'w' for web, or scan QR for mobile
```

### Backend URL Configuration:
- Users must set backend URL in Profile → Settings
- Format: `http://YOUR_IP:3000/api`
- App auto-detects IP when accessed from remote device

## Important Notes

1. **Node.js Version:** Use LTS 20.x.x - Node.js 24+ causes Metro bundler issues on Windows

2. **Android SDK Error:** When pressing 'a' in Expo, Android SDK error is normal - user should use Expo Go app instead

3. **Connection Methods:**
   - Web: `npm start` → press `w` → access `http://localhost:8081` or `http://YOUR_IP:8081`
   - Expo Go: `npx expo start --tunnel` → scan QR code
   - LAN: `npx expo start --lan` → use `exp://YOUR_IP:8081`

4. **Database:**
   - Frontend: SQLite (native) or localStorage (web)
   - Backend: SQLite at `backend/data/closet.db`

5. **Authentication:**
   - JWT tokens stored in localStorage
   - Backend validates on each request
   - Password hashed with bcrypt

## Known Issues & Workarounds

1. **Metro bundler with Node.js 24:**
   - Workaround: Use Node.js 20 LTS
   - Or: Modified `metro.config.js` to disable Node.js externals

2. **CORS for mobile devices:**
   - Backend `server.ts` configured to allow all Expo origins
   - Listens on `0.0.0.0` for external access

3. **React Native `gap` property:**
   - Some components use explicit margins instead of `gap` for compatibility

## Development Guidelines

- **TypeScript:** All code is TypeScript - maintain type safety
- **Theme:** Use `theme/index.ts` for all styling - maintain dark futuristic aesthetic
- **API:** Always use `services/api.ts` for backend calls - handles auth automatically
- **Storage:** Use `services/storageSync.ts` for data operations - handles sync automatically
- **Components:** Reuse components from `components/` folder
- **Error Handling:** Check `services/api.ts` for error handling patterns

## Documentation Files

- `SETUP_INSTRUCTIONS.md` - Complete setup guide
- `TRANSFER_PACKAGE.md` - Transfer instructions
- `TROUBLESHOOTING.md` - Common issues
- `QUICK_START_GUIDE.md` - Quick reference
- `EXPO_MENU_GUIDE.md` - Expo menu options
- `ALL_CONNECTION_METHODS.md` - Connection methods

## Next Steps / Future Enhancements

- Real LLM integration for `services/aiStylist.ts`
- Real image analysis API for `services/imageAnalysis.ts`
- Weather API integration for outfit suggestions
- Cloud storage for images
- Social sharing features
- Advanced analytics

## When Making Changes

1. **Always check `services/api.ts`** - This is the central API client
2. **Always check `services/storageSync.ts`** - This handles data sync
3. **Maintain type safety** - Use types from `types/index.ts`
4. **Follow existing patterns** - Check similar components/screens for consistency
5. **Test on web first** - Then test on mobile
6. **Update backend URL** - If changing ports/IPs, update user instructions

## Key Dependencies

**Frontend:**
- Expo ~50.0.0
- React Native 0.73.0
- React Navigation 6.x
- React Native Reanimated 3.6.0
- Expo SQLite ~13.0.0
- Expo ImagePicker ~15.0.0

**Backend:**
- Express 4.18.2
- SQLite3 5.1.6
- jsonwebtoken 9.0.2
- bcryptjs 2.4.3
- CORS 2.8.5

---

**I'm ready to continue development. Please familiarize yourself with the codebase structure, especially `services/api.ts` and `services/storageSync.ts` as these are critical for the app's functionality. Ask me what you'd like to work on next!**


