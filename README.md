# AI Closet App

A modern, futuristic mobile app that helps you organize your wardrobe and get AI-powered outfit suggestions.

## 🚀 Quick Start

**New to this project?** See `SETUP_INSTRUCTIONS.md` for complete setup guide.

**Transferring to another computer?** See `TRANSFER_PACKAGE.md` for transfer instructions.

## Features

- **Wardrobe Management**: Add clothing items with photos, categories, colors, brands, sizes, seasons, tags, and cost
- **AI Outfit Generation**: Get personalized outfit suggestions based on your wardrobe, occasion, weather, and style preferences
- **Usage Tracking**: Log outfits and track wear count with cost-per-wear analytics
- **Calendar View**: See what you wore on each day in a beautiful calendar interface
- **Dark Futuristic Theme**: Immersive dark UI with electric cyan accents and subtle glow effects
- **Cross-Platform Sync**: Works on web, iOS, and Android with backend synchronization

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **Expo SQLite** for local database storage
- **React Navigation** for navigation
- **React Native Reanimated** for smooth animations
- **Expo Image Picker** for photo capture

## Project Structure

```
├── App.tsx                 # Main app entry point
├── components/            # Reusable UI components
│   ├── FuturisticCard.tsx
│   ├── GlowButton.tsx
│   ├── FilterChip.tsx
│   ├── ClothingItemCard.tsx
│   └── OutfitCard.tsx
├── screens/               # Main app screens
│   ├── OnboardingScreen.tsx
│   ├── ClosetScreen.tsx
│   ├── AddItemScreen.tsx
│   ├── FitsScreen.tsx
│   ├── CalendarScreen.tsx
│   └── ProfileScreen.tsx
├── hooks/                 # Custom React hooks
│   └── useWardrobe.ts
├── services/              # Business logic services
│   └── aiStylist.ts      # AI outfit generation (mock implementation)
├── lib/                   # Utilities and storage
│   └── storage.ts        # Database layer
├── types/                 # TypeScript type definitions
│   └── index.ts
└── theme/                 # Centralized theme system
    └── index.ts
```

## Getting Started

### Prerequisites

- **Node.js LTS 20.x.x** (recommended - download from https://nodejs.org/)
- npm (comes with Node.js)
- Internet connection

### Quick Installation

1. **Install dependencies:**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

2. **Start backend server:**
```bash
cd backend
npm run dev
```

3. **Start frontend (in new terminal):**
```bash
npm start
# Press 'w' for web browser
```

4. **Access the app:**
   - **Computer:** Browser opens at `http://localhost:8081`
   - **Mobile:** `http://YOUR_IP:8081` (find IP with `ipconfig`)

5. **Configure backend URL:**
   - Open app → Profile → Settings
   - Set Backend URL: `http://YOUR_IP:3000/api`

**For detailed instructions, see `SETUP_INSTRUCTIONS.md`**

## Key Features Implementation

### AI Outfit Generation

The app includes a mock AI service (`services/aiStylist.ts`) that generates outfit suggestions. To integrate with a real LLM:

1. Replace the `generateOutfits` function in `services/aiStylist.ts`
2. Format wardrobe items as structured JSON
3. Send request to your LLM API (OpenAI, Anthropic, etc.)
4. Parse and return `Outfit[]` responses

See the file for detailed integration comments.

### Database

The app uses Expo SQLite for local storage. All data persists locally on the device. The database is automatically initialized on first launch.

### Theme System

All styling is centralized in `theme/index.ts`. The dark futuristic theme uses:
- Deep gray/near-black backgrounds (#020307 - #050816)
- Electric cyan accent color (#00F5FF)
- Subtle glows and gradients
- High contrast text (off-white, light gray)

## Future Enhancements

- Real LLM integration for outfit generation
- Weather API integration
- Cloud sync for wardrobe data
- Social sharing of outfits
- Advanced analytics and insights
- Outfit recommendations based on calendar events

## License

MIT


