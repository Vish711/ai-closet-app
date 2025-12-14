/**
 * Main server entry point
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db/database';
import authRoutes from './routes/auth';
import wardrobeRoutes from './routes/wardrobe';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// Use absolute path for production, relative for development
const DB_PATH = process.env.DATABASE_PATH || (process.env.NODE_ENV === 'production' 
  ? '/opt/render/project/src/data/closet.db' 
  : './data/closet.db');

// CORS configuration - Allow all Expo connections
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:8081', 'http://localhost:19006', 'exp://*', 'http://*', 'https://*'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // Allow all Expo/React Native connections
      if (origin.includes('localhost') || 
          origin.includes('exp://') || 
          origin.includes('expo') ||
          origin.includes('192.168.') ||
          origin.includes('10.') ||
          origin.includes('172.') ||
          origin.includes('github.io') ||
          origin.includes('github.com')) {
        return callback(null, true);
      }
      
      // Check against allowed origins
      if (corsOrigins.includes('*') || corsOrigins.some(allowed => origin.includes(allowed))) {
        return callback(null, true);
      }
      
      callback(null, true); // Allow all for development
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wardrobe', wardrobeRoutes);

// 404 handler for undefined routes - must return JSON
app.use((req: express.Request, res: express.Response) => {
  // Check if this might be a method mismatch (405)
  const method = req.method;
  const path = req.path;
  
  // If it's a known path but wrong method, return 405
  const knownPaths = ['/api/auth/signup', '/api/auth/login', '/api/auth/verify'];
  if (knownPaths.includes(path)) {
    res.status(405).json({ 
      error: `Method ${method} not allowed for ${path}. Please check your request.` 
    });
    return;
  }
  
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('Initializing database...');
    await initDatabase(DB_PATH);
    console.log('Database initialized successfully');

    const port = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
      console.log(`📊 Health check: http://localhost:${port}/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${port}/api/auth`);
      console.log(`👕 Wardrobe endpoints: http://localhost:${port}/api/wardrobe`);
      console.log(`\n💡 To connect from mobile devices:`);
      console.log(`   1. Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)`);
      console.log(`   2. Use: http://YOUR_IP:${port}/api`);
      console.log(`   3. Update API URL in app settings (Profile → Backend Server URL)\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

