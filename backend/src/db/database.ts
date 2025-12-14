/**
 * Database setup and initialization
 */

import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const sqlite = sqlite3.verbose();

export interface Database {
  run: (sql: string, params?: any[]) => Promise<{ lastID: number; changes: number }>;
  get: <T>(sql: string, params?: any[]) => Promise<T | undefined>;
  all: <T>(sql: string, params?: any[]) => Promise<T[]>;
  close: () => Promise<void>;
}

let db: sqlite3.Database | null = null;

export async function initDatabase(dbPath: string): Promise<Database> {
  // Ensure data directory exists
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    db = new sqlite.Database(dbPath, (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Create tables
      const createTables = `
        -- Users table
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          passwordHash TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );

        -- Clothing items table
        CREATE TABLE IF NOT EXISTS clothing_items (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          imageUri TEXT NOT NULL,
          category TEXT NOT NULL,
          color TEXT NOT NULL,
          brand TEXT,
          size TEXT,
          season TEXT NOT NULL,
          tags TEXT NOT NULL,
          cost REAL NOT NULL,
          wearCount INTEGER DEFAULT 0,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );

        -- Saved outfits table
        CREATE TABLE IF NOT EXISTS saved_outfits (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          itemIds TEXT NOT NULL,
          styleExplanation TEXT NOT NULL,
          occasion TEXT,
          season TEXT,
          mood TEXT,
          wornDate TEXT NOT NULL,
          weather TEXT,
          notes TEXT,
          createdAt TEXT NOT NULL,
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );

        -- Calendar entries table
        CREATE TABLE IF NOT EXISTS calendar_entries (
          date TEXT NOT NULL,
          userId TEXT NOT NULL,
          outfitId TEXT,
          itemIds TEXT NOT NULL,
          PRIMARY KEY (date, userId),
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (outfitId) REFERENCES saved_outfits(id) ON DELETE SET NULL
        );

        -- App state table
        CREATE TABLE IF NOT EXISTS app_state (
          userId TEXT PRIMARY KEY,
          hasCompletedOnboarding INTEGER DEFAULT 0,
          preferences TEXT DEFAULT '{}',
          FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_clothing_user ON clothing_items(userId);
        CREATE INDEX IF NOT EXISTS idx_outfits_user ON saved_outfits(userId);
        CREATE INDEX IF NOT EXISTS idx_calendar_user ON calendar_entries(userId);
      `;

      db.exec(createTables, (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Create promisified database interface
        const database: Database = {
          run: (sql: string, params: any[] = []) => {
            return new Promise((resolve, reject) => {
              db!.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID, changes: this.changes });
              });
            });
          },
          get: <T>(sql: string, params: any[] = []) => {
            return new Promise((resolve, reject) => {
              db!.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row as T);
              });
            });
          },
          all: <T>(sql: string, params: any[] = []) => {
            return new Promise((resolve, reject) => {
              db!.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows as T[]);
              });
            });
          },
          close: () => {
            return new Promise((resolve, reject) => {
              if (!db) {
                resolve();
                return;
              }
              db.close((err) => {
                if (err) reject(err);
                else {
                  db = null;
                  resolve();
                }
              });
            });
          },
        };

        resolve(database);
      });
    });
  });
}

export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  
  return {
    run: (sql: string, params: any[] = []) => {
      return new Promise((resolve, reject) => {
        db!.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID, changes: this.changes });
        });
      });
    },
    get: <T>(sql: string, params: any[] = []) => {
      return new Promise((resolve, reject) => {
        db!.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row as T);
        });
      });
    },
    all: <T>(sql: string, params: any[] = []) => {
      return new Promise((resolve, reject) => {
        db!.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows as T[]);
        });
      });
      },
    close: () => {
      return new Promise((resolve, reject) => {
        if (!db) {
          resolve();
          return;
        }
        db.close((err) => {
          if (err) reject(err);
          else {
            db = null;
            resolve();
          }
        });
      });
    },
  };
}

