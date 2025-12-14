# Backend Setup Instructions

## Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and set:
- `JWT_SECRET` - A random secret string (use a strong password generator)
- `PORT` - Server port (default: 3000)
- `DATABASE_PATH` - Where to store the database (default: `./data/closet.db`)

### 3. Start the Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

### 4. Update Frontend API URL

The frontend is configured to use `http://localhost:3000` in development.

For production, update `services/api.ts`:
```typescript
const API_BASE_URL = 'https://your-production-api.com/api';
```

## Testing the Backend

### Health Check
```bash
curl http://localhost:3000/health
```

### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Deployment Options

### Option 1: Railway
1. Push backend to GitHub
2. Connect to Railway
3. Set environment variables
4. Deploy

### Option 2: Heroku
1. Create Heroku app
2. Set environment variables
3. Deploy with git push

### Option 3: DigitalOcean / AWS
1. Set up a VPS
2. Install Node.js
3. Run `npm start` with PM2 or similar

## Security Notes

- **Change JWT_SECRET** in production!
- Use HTTPS in production
- Consider rate limiting for auth endpoints
- Add input validation
- Use environment variables for secrets

## Database

Currently uses SQLite for simplicity. For production with multiple users, consider:
- PostgreSQL
- MySQL
- MongoDB

The database schema is in `backend/src/db/database.ts` and can be easily adapted.

