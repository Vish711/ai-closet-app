/**
 * Local storage layer using Expo SQLite
 * Handles persistence for clothing items, outfits, and calendar entries
 * Falls back to localStorage on web
 */

import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { ClothingItem, SavedOutfit, CalendarEntry, AppState } from '@/types';

let db: SQLite.SQLiteDatabase | null = null;
const isWeb = Platform.OS === 'web';

/**
 * Initialize database and create tables
 */
export async function initDatabase(): Promise<void> {
  // Web doesn't support SQLite, skip initialization
  if (isWeb) {
    console.log('Running on web - using localStorage fallback');
    return;
  }

  try {
    db = await SQLite.openDatabaseAsync('aiCloset.db');
    
    // Create clothing items table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS clothing_items (
        id TEXT PRIMARY KEY,
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
        updatedAt TEXT NOT NULL
      );
    `);
    
    // Create saved outfits table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS saved_outfits (
        id TEXT PRIMARY KEY,
        itemIds TEXT NOT NULL,
        styleExplanation TEXT NOT NULL,
        occasion TEXT,
        season TEXT,
        mood TEXT,
        wornDate TEXT NOT NULL,
        weather TEXT,
        notes TEXT,
        createdAt TEXT NOT NULL
      );
    `);
    
    // Create calendar entries table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS calendar_entries (
        date TEXT PRIMARY KEY,
        outfitId TEXT,
        itemIds TEXT NOT NULL,
        FOREIGN KEY (outfitId) REFERENCES saved_outfits(id)
      );
    `);
    
    // Create app state table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS app_state (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

/**
 * Get database instance (initialize if needed)
 */
async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (isWeb) {
    throw new Error('SQLite not available on web. Use web-specific storage methods.');
  }
  if (!db) {
    await initDatabase();
  }
  return db!;
}

// ==================== Clothing Items ====================

export async function saveClothingItem(item: ClothingItem): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO clothing_items 
     (id, imageUri, category, color, brand, size, season, tags, cost, wearCount, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      item.id,
      item.imageUri,
      item.category,
      item.color,
      item.brand || null,
      item.size || null,
      item.season,
      JSON.stringify(item.tags),
      item.cost,
      item.wearCount,
      item.createdAt,
      item.updatedAt,
    ]
  );
}

export async function getClothingItem(id: string): Promise<ClothingItem | null> {
  const database = await getDb();
  const result = await database.getFirstAsync<{
    id: string;
    imageUri: string;
    category: string;
    color: string;
    brand: string | null;
    size: string | null;
    season: string;
    tags: string;
    cost: number;
    wearCount: number;
    createdAt: string;
    updatedAt: string;
  }>(
    `SELECT * FROM clothing_items WHERE id = ?`,
    [id]
  );
  
  if (!result) return null;
  
  return {
    ...result,
    tags: JSON.parse(result.tags),
    brand: result.brand || undefined,
    size: result.size || undefined,
  };
}

export async function getAllClothingItems(): Promise<ClothingItem[]> {
  const database = await getDb();
  const results = await database.getAllAsync<{
    id: string;
    imageUri: string;
    category: string;
    color: string;
    brand: string | null;
    size: string | null;
    season: string;
    tags: string;
    cost: number;
    wearCount: number;
    createdAt: string;
    updatedAt: string;
  }>(`SELECT * FROM clothing_items ORDER BY createdAt DESC`);
  
  return results.map(item => ({
    ...item,
    tags: JSON.parse(item.tags),
    brand: item.brand || undefined,
    size: item.size || undefined,
  }));
}

export async function deleteClothingItem(id: string): Promise<void> {
  const database = await getDb();
  await database.runAsync(`DELETE FROM clothing_items WHERE id = ?`, [id]);
}

export async function incrementWearCount(itemId: string): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `UPDATE clothing_items SET wearCount = wearCount + 1, updatedAt = ? WHERE id = ?`,
    [new Date().toISOString(), itemId]
  );
}

// ==================== Saved Outfits ====================

export async function saveOutfit(outfit: SavedOutfit): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO saved_outfits 
     (id, itemIds, styleExplanation, occasion, season, mood, wornDate, weather, notes, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      outfit.id,
      JSON.stringify(outfit.itemIds),
      outfit.styleExplanation,
      outfit.occasion || null,
      outfit.season || null,
      outfit.mood || null,
      outfit.wornDate,
      outfit.weather || null,
      outfit.notes || null,
      outfit.createdAt,
    ]
  );
  
  // Increment wear count for all items in the outfit
  for (const itemId of outfit.itemIds) {
    await incrementWearCount(itemId);
  }
}

export async function getSavedOutfits(): Promise<SavedOutfit[]> {
  const database = await getDb();
  const results = await database.getAllAsync<{
    id: string;
    itemIds: string;
    styleExplanation: string;
    occasion: string | null;
    season: string | null;
    mood: string | null;
    wornDate: string;
    weather: string | null;
    notes: string | null;
    createdAt: string;
  }>(`SELECT * FROM saved_outfits ORDER BY wornDate DESC`);
  
  return results.map(outfit => ({
    ...outfit,
    itemIds: JSON.parse(outfit.itemIds),
    occasion: outfit.occasion as any || undefined,
    season: outfit.season as any || undefined,
    mood: outfit.mood as any || undefined,
    weather: outfit.weather || undefined,
    notes: outfit.notes || undefined,
  }));
}

// ==================== Calendar Entries ====================

export async function saveCalendarEntry(entry: CalendarEntry): Promise<void> {
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO calendar_entries (date, outfitId, itemIds)
     VALUES (?, ?, ?)`,
    [
      entry.date,
      entry.outfitId || null,
      JSON.stringify(entry.items.map(item => item.id)),
    ]
  );
}

export async function getCalendarEntry(date: string): Promise<CalendarEntry | null> {
  const database = await getDb();
  const result = await database.getFirstAsync<{
    date: string;
    outfitId: string | null;
    itemIds: string;
  }>(`SELECT * FROM calendar_entries WHERE date = ?`, [date]);
  
  if (!result) return null;
  
  // Fetch actual clothing items
  const itemIds: string[] = JSON.parse(result.itemIds);
  const items: ClothingItem[] = [];
  for (const itemId of itemIds) {
    const item = await getClothingItem(itemId);
    if (item) items.push(item);
  }
  
  return {
    date: result.date,
    outfitId: result.outfitId || undefined,
    items,
  };
}

export async function getCalendarEntries(startDate: string, endDate: string): Promise<CalendarEntry[]> {
  const database = await getDb();
  const results = await database.getAllAsync<{
    date: string;
    outfitId: string | null;
    itemIds: string;
  }>(`SELECT * FROM calendar_entries WHERE date >= ? AND date <= ? ORDER BY date DESC`, [startDate, endDate]);
  
  const entries: CalendarEntry[] = [];
  for (const result of results) {
    const itemIds: string[] = JSON.parse(result.itemIds);
    const items: ClothingItem[] = [];
    for (const itemId of itemIds) {
      const item = await getClothingItem(itemId);
      if (item) items.push(item);
    }
    
    entries.push({
      date: result.date,
      outfitId: result.outfitId || undefined,
      items,
    });
  }
  
  return entries;
}

// ==================== App State ====================

export async function getAppState(): Promise<AppState> {
  // Web fallback using localStorage
  if (isWeb) {
    try {
      const hasOnboarding = typeof window !== 'undefined' 
        ? localStorage.getItem('hasCompletedOnboarding') === 'true'
        : false;
      const preferencesStr = typeof window !== 'undefined'
        ? localStorage.getItem('preferences')
        : null;
      const preferences = preferencesStr ? JSON.parse(preferencesStr) : {};
      return { hasCompletedOnboarding, preferences };
    } catch (error) {
      console.error('Error reading app state from localStorage:', error);
      return { hasCompletedOnboarding: false, preferences: {} };
    }
  }

  // Native SQLite
  try {
    const database = await getDb();
    const hasOnboarding = await database.getFirstAsync<{ value: string }>(
      `SELECT value FROM app_state WHERE key = 'hasCompletedOnboarding'`
    );
    const preferences = await database.getFirstAsync<{ value: string }>(
      `SELECT value FROM app_state WHERE key = 'preferences'`
    );
    
    return {
      hasCompletedOnboarding: hasOnboarding?.value === 'true',
      preferences: preferences ? JSON.parse(preferences.value) : {},
    };
  } catch (error) {
    console.error('Error reading app state:', error);
    return { hasCompletedOnboarding: false, preferences: {} };
  }
}

export async function setAppState(state: Partial<AppState>): Promise<void> {
  // Web fallback using localStorage
  if (isWeb) {
    try {
      if (state.hasCompletedOnboarding !== undefined && typeof window !== 'undefined') {
        localStorage.setItem('hasCompletedOnboarding', state.hasCompletedOnboarding.toString());
      }
      if (state.preferences && typeof window !== 'undefined') {
        localStorage.setItem('preferences', JSON.stringify(state.preferences));
      }
      return;
    } catch (error) {
      console.error('Error saving app state to localStorage:', error);
      throw error;
    }
  }

  // Native SQLite
  try {
    const database = await getDb();
    
    if (state.hasCompletedOnboarding !== undefined) {
      await database.runAsync(
        `INSERT OR REPLACE INTO app_state (key, value) VALUES ('hasCompletedOnboarding', ?)`,
        [state.hasCompletedOnboarding.toString()]
      );
    }
    
    if (state.preferences) {
      await database.runAsync(
        `INSERT OR REPLACE INTO app_state (key, value) VALUES ('preferences', ?)`,
        [JSON.stringify(state.preferences)]
      );
    }
  } catch (error) {
    console.error('Error saving app state:', error);
    throw error;
  }
}


