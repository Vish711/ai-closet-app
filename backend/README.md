# AI Closet Backend API

Backend server for AI Closet app with authentication and cross-platform data sync.

## Features

- 🔐 User authentication (JWT tokens)
- 👕 CRUD operations for clothing items
- 👔 Saved outfits management
- 📅 Calendar entries tracking
- 💾 SQLite database (can be swapped for PostgreSQL)
- 🔄 Cross-platform data sync

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and set your JWT_SECRET
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token

### Wardrobe (requires authentication)

- `GET /api/wardrobe/items` - Get all clothing items
- `POST /api/wardrobe/items` - Create clothing item
- `GET /api/wardrobe/items/:id` - Get single item
- `PUT /api/wardrobe/items/:id` - Update item
- `DELETE /api/wardrobe/items/:id` - Delete item

- `GET /api/wardrobe/outfits` - Get saved outfits
- `POST /api/wardrobe/outfits` - Save outfit

- `GET /api/wardrobe/calendar` - Get calendar entries
- `POST /api/wardrobe/calendar` - Create calendar entry

- `GET /api/wardrobe/app-state` - Get app state
- `PUT /api/wardrobe/app-state` - Update app state

## Authentication

All wardrobe endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT tokens (change in production!)
- `DATABASE_PATH` - Path to SQLite database file
- `CORS_ORIGINS` - Comma-separated list of allowed origins

