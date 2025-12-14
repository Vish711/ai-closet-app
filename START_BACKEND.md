# How to Start the Backend Server

## Quick Start

The network error occurs because the backend server isn't running. Here's how to start it:

### Step 1: Open a New Terminal

Keep your frontend running in one terminal, and open a **new terminal window**.

### Step 2: Navigate to Backend Folder

```bash
cd backend
```

### Step 3: Install Dependencies (First Time Only)

```bash
npm install
```

### Step 4: Start the Backend Server

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3000
📊 Health check: http://localhost:3000/health
🔐 Auth endpoints: http://localhost:3000/api/auth
👕 Wardrobe endpoints: http://localhost:3000/api/wardrobe
```

### Step 5: Try Creating Account Again

Once the backend is running, go back to your app and try creating an account again.

## Troubleshooting

### Port 3000 Already in Use
If you see "port 3000 already in use":
1. Find what's using it: `netstat -ano | findstr :3000`
2. Kill the process, or
3. Change the port in `backend/.env` to a different number (e.g., 3001)

### Missing Dependencies
If you see module errors:
```bash
cd backend
npm install
```

### Database Errors
The database will be created automatically in `backend/data/closet.db`

## Keep Both Running

You need **two terminals**:
1. **Terminal 1**: Frontend (`npm start` or `npx expo start`)
2. **Terminal 2**: Backend (`cd backend && npm run dev`)

Both should be running for the app to work!

