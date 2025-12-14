# Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on your device/simulator:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## Project Overview

This is a complete React Native + TypeScript mobile app for managing your wardrobe and getting AI-powered outfit suggestions.

### Key Features Implemented

✅ **Wardrobe Management**
- Add clothing items with photos
- Organize by category, color, season, tags
- Track cost and wear count
- Calculate cost-per-wear

✅ **AI Outfit Generation**
- Mock AI service (ready for LLM integration)
- Generate outfits based on occasion, mood, weather
- Lock specific items and regenerate
- Save outfits to history

✅ **Usage Tracking**
- Calendar view of logged outfits
- Wear count tracking
- Cost-per-wear analytics

✅ **Dark Futuristic UI**
- Deep gray/near-black backgrounds
- Electric cyan accent color
- Subtle glows and animations
- Card-based design system

### Architecture

- **Screens**: Onboarding, Closet, Add Item, Fits, Calendar, Profile
- **Components**: Reusable UI components with theme support
- **Storage**: SQLite database for local persistence
- **Services**: AI stylist service (mock, ready for real LLM)
- **Theme**: Centralized dark theme system

### Next Steps

1. **Add Real AI Integration**
   - Replace mock in `services/aiStylist.ts`
   - Add API key management
   - Implement error handling for API calls

2. **Add Weather API**
   - Integrate OpenWeatherMap or similar
   - Update `getWeatherForDate` function

3. **Add App Icons**
   - Generate icons using Expo tools
   - Add to `assets/` directory

4. **Testing**
   - Add unit tests for services
   - Add integration tests for screens
   - Test on physical devices

### Notes

- The app uses Expo SQLite for local storage
- All data persists locally (no cloud sync yet)
- Image picker requires camera/photo library permissions
- The AI service is a mock - replace with real LLM API


