# Complete Backend Setup Guide

## ✅ What's Been Created

### Backend Server (`backend/`)
- Express + TypeScript server
- JWT authentication (login/signup)
- SQLite database
- RESTful API endpoints
- CORS configured for mobile/web

### Frontend Integration
- Login/Signup screen
- API service layer
- Hybrid storage (syncs with backend, falls back to local)
- Automatic token management

## 🚀 Quick Start

### Step 1: Start the Backend

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:3000`

### Step 2: Start the Frontend

In a new terminal:
```bash
# From project root
npm start
```

Press `w` to open in web browser, or scan QR code with Expo Go.

### Step 3: Test Login

1. The app will show a login screen
2. Click "Sign up" to create an account
3. Enter email and password (min 6 characters)
4. After signup/login, you'll see the onboarding screen
5. Complete onboarding to access the app

## 📱 How It Works

### Authentication Flow
1. User signs up or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. All API requests include token in header
5. Token persists across app restarts

### Data Sync Flow
1. When logged in, data syncs to backend
2. Local storage used as backup/offline fallback
3. On login, data is fetched from backend
4. Changes sync in real-time

### Offline Support
- If backend unavailable, uses local storage
- Data syncs when connection restored
- No data loss

## 🔧 Configuration

### Backend Environment Variables

Edit `backend/.env`:
```env
PORT=3000
JWT_SECRET=your-super-secret-key-here
DATABASE_PATH=./data/closet.db
CORS_ORIGINS=http://localhost:8081,http://localhost:19006,exp://*
```

### Frontend API URL

Edit `services/api.ts` to change backend URL:
```typescript
const API_BASE_URL = 'http://localhost:3000/api'; // Development
// or
const API_BASE_URL = 'https://your-api.com/api'; // Production
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token

### Wardrobe (requires auth)
- `GET /api/wardrobe/items` - Get all items
- `POST /api/wardrobe/items` - Create item
- `PUT /api/wardrobe/items/:id` - Update item
- `DELETE /api/wardrobe/items/:id` - Delete item
- `GET /api/wardrobe/outfits` - Get saved outfits
- `POST /api/wardrobe/outfits` - Save outfit
- `GET /api/wardrobe/calendar` - Get calendar entries
- `POST /api/wardrobe/calendar` - Save calendar entry
- `GET /api/wardrobe/app-state` - Get app state
- `PUT /api/wardrobe/app-state` - Update app state

## 🚢 Deployment

### Backend Deployment Options

1. **Railway** (Easiest)
   - Connect GitHub repo
   - Set environment variables
   - Auto-deploys

2. **Heroku**
   - Create app
   - Set env vars
   - Deploy

3. **VPS (DigitalOcean, AWS)**
   - Install Node.js
   - Use PM2 to run server
   - Set up reverse proxy (nginx)

### Frontend Deployment

- Expo handles deployment
- Update API URL in `services/api.ts` to production URL
- Build and publish

## 🔒 Security Notes

- **Change JWT_SECRET** in production!
- Use HTTPS in production
- Consider rate limiting
- Add input validation
- Use environment variables for secrets

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3000 is available
- Verify Node.js is installed
- Check `.env` file exists

### Can't connect from mobile
- Ensure backend is running
- Check CORS_ORIGINS includes your Expo URL
- Verify API_BASE_URL in frontend

### Login fails
- Check backend logs
- Verify database is created
- Check JWT_SECRET is set

## 📝 Next Steps

1. Deploy backend to production
2. Update frontend API URL
3. Test cross-platform sync
4. Add password reset feature
5. Add email verification
6. Consider migrating to PostgreSQL for production

