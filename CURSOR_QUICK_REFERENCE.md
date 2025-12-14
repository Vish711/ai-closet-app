# Quick Reference for Cursor AI

## 🎯 Project: AI Closet App
React Native + Expo mobile app with Express.js backend for wardrobe management and AI outfit suggestions.

## 📁 Critical Files to Know

### Must-Read First:
1. **`services/api.ts`** - Backend API client, JWT auth, dynamic URL detection
2. **`services/storageSync.ts`** - Hybrid storage (local + backend sync)
3. **`App.tsx`** - Main entry point, navigation, auth flow
4. **`backend/src/server.ts`** - Express server, CORS config

### Key Screens:
- `screens/LoginScreen.tsx` - Auth with validation
- `screens/AddItemScreen.tsx` - Image upload + auto-analysis
- `screens/FitsScreen.tsx` - AI outfit generation
- `screens/ProfileScreen.tsx` - Settings, backend URL config

### Key Services:
- `services/aiStylist.ts` - Mock AI (ready for LLM integration)
- `services/imageAnalysis.ts` - Mock image analysis
- `lib/storage.ts` - Local storage layer

### Configuration:
- `package.json` - Frontend deps (Expo 50, RN 0.73)
- `backend/package.json` - Backend deps (Express, SQLite, JWT)
- `metro.config.js` - Metro config (Node.js externals disabled)
- `app.json` - Expo config

## 🔑 Key Concepts

1. **API URL Detection:** `services/api.ts` auto-detects remote access, uses hostname IP
2. **Storage Strategy:** `storageSync.ts` switches between local/backend based on login
3. **Theme:** Dark futuristic, cyan accents, centralized in `theme/index.ts`
4. **Platform Support:** Web, iOS, Android via Expo Go or browser

## ⚙️ Setup

```bash
# Install
npm install && cd backend && npm install && cd ..

# Run
# Terminal 1: cd backend && npm run dev
# Terminal 2: npm start (press 'w' for web)
```

## 🚨 Important Notes

- **Node.js:** Use LTS 20.x.x (NOT 24+)
- **Backend URL:** Users configure in Profile → Settings
- **Android SDK Error:** Normal, use Expo Go instead
- **CORS:** Backend allows all Expo origins

## 📚 Documentation

- `SETUP_INSTRUCTIONS.md` - Full setup guide
- `TROUBLESHOOTING.md` - Common issues
- `CURSOR_HANDOFF_PROMPT.md` - Complete handoff (use this!)

## 🎨 Architecture

```
Frontend (Expo)
├── Local Storage (SQLite/localStorage)
├── API Client (services/api.ts)
└── Storage Sync (services/storageSync.ts)
    └── Backend API (Express + SQLite)
```

## 🔄 Data Flow

1. User action → Component
2. Component → `storageSync.ts` or `api.ts`
3. `storageSync.ts` → Local storage OR Backend API
4. Backend API → SQLite database
5. Response → Component update

## 💡 Development Tips

- Always use `services/api.ts` for backend calls
- Always use `storageSync.ts` for data operations
- Maintain TypeScript types from `types/index.ts`
- Follow existing component patterns
- Test web first, then mobile

---

**For complete context, read `CURSOR_HANDOFF_PROMPT.md`**


