/**
 * Authentication routes (login, signup)
 */

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../db/database';
import { generateToken } from '../middleware/auth';
import { AuthRequest, AuthResponse } from '../types';

const router = Router();

// Sign up
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as AuthRequest;

    // Validation
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address' });
      return;
    }

    // Password complexity validation
    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' });
      return;
    }

    if (password.length > 100) {
      res.status(400).json({ error: 'Password is too long (maximum 100 characters)' });
      return;
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      res.status(400).json({ error: 'Password must contain at least one uppercase letter' });
      return;
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      res.status(400).json({ error: 'Password must contain at least one lowercase letter' });
      return;
    }

    // Check for number
    if (!/[0-9]/.test(password)) {
      res.status(400).json({ error: 'Password must contain at least one number' });
      return;
    }

    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      res.status(400).json({ error: 'Password must contain at least one special character (!@#$%^&*...)' });
      return;
    }

    const db = getDatabase();

    // Check if user already exists
    const existingUser = await db.get<{ id: string }>(
      'SELECT id FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (existingUser) {
      res.status(409).json({ 
        error: 'An account with this email already exists. Please sign in instead.' 
      });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    const now = new Date().toISOString();

    await db.run(
      'INSERT INTO users (id, email, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
      [userId, email.toLowerCase(), passwordHash, now, now]
    );

    // Initialize app state
    await db.run(
      'INSERT INTO app_state (userId, hasCompletedOnboarding, preferences) VALUES (?, ?, ?)',
      [userId, 0, '{}']
    );

    // Generate token
    const token = generateToken(userId);

    const response: AuthResponse = {
      token,
      user: {
        id: userId,
        email: email.toLowerCase(),
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as AuthRequest;

    // Validation
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address' });
      return;
    }

    const db = getDatabase();

    // Find user
    const user = await db.get<{ id: string; email: string; passwordHash: string }>(
      'SELECT id, email, passwordHash FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate token
    const token = generateToken(user.id);

    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token (check if still valid)
router.get('/verify', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Token required' });
      return;
    }

    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const db = getDatabase();

    const user = await db.get<{ id: string; email: string }>(
      'SELECT id, email FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;

