/**
 * Wardrobe routes (clothing items, outfits, calendar)
 */

import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../db/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { ClothingItem, SavedOutfit, CalendarEntry } from '../types';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// ==================== Clothing Items ====================

// Get all clothing items for user
router.get('/items', async (req: AuthRequest, res) => {
  try {
    const db = getDatabase();
    const items = await db.all<ClothingItem>(
      'SELECT * FROM clothing_items WHERE userId = ? ORDER BY createdAt DESC',
      [req.userId]
    );

    // Parse JSON fields
    const parsedItems = items.map(item => ({
      ...item,
      tags: JSON.parse(item.tags),
    }));

    res.json(parsedItems);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single clothing item
router.get('/items/:id', async (req: AuthRequest, res) => {
  try {
    const db = getDatabase();
    const item = await db.get<ClothingItem>(
      'SELECT * FROM clothing_items WHERE id = ? AND userId = ?',
      [req.params.id, req.userId]
    );

    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.json({
      ...item,
      tags: JSON.parse(item.tags),
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create clothing item
router.post('/items', async (req: AuthRequest, res) => {
  try {
    const {
      imageUri,
      category,
      color,
      brand,
      size,
      season,
      tags,
      cost,
    } = req.body;

    if (!imageUri || !category || !color || !season || cost === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const db = getDatabase();
    const id = uuidv4();
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO clothing_items 
       (id, userId, imageUri, category, color, brand, size, season, tags, cost, wearCount, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        req.userId,
        imageUri,
        category,
        color,
        brand || null,
        size || null,
        season,
        JSON.stringify(tags || []),
        cost,
        0,
        now,
        now,
      ]
    );

    const item = await db.get<ClothingItem>(
      'SELECT * FROM clothing_items WHERE id = ?',
      [id]
    );

    res.status(201).json({
      ...item!,
      tags: JSON.parse(item!.tags),
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update clothing item
router.put('/items/:id', async (req: AuthRequest, res) => {
  try {
    const db = getDatabase();
    
    // Verify ownership
    const existing = await db.get<{ userId: string }>(
      'SELECT userId FROM clothing_items WHERE id = ?',
      [req.params.id]
    );

    if (!existing || existing.userId !== req.userId) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    const {
      imageUri,
      category,
      color,
      brand,
      size,
      season,
      tags,
      cost,
      wearCount,
    } = req.body;

    const updatedAt = new Date().toISOString();

    await db.run(
      `UPDATE clothing_items SET
       imageUri = COALESCE(?, imageUri),
       category = COALESCE(?, category),
       color = COALESCE(?, color),
       brand = ?,
       size = ?,
       season = COALESCE(?, season),
       tags = COALESCE(?, tags),
       cost = COALESCE(?, cost),
       wearCount = COALESCE(?, wearCount),
       updatedAt = ?
       WHERE id = ? AND userId = ?`,
      [
        imageUri,
        category,
        color,
        brand,
        size,
        season,
        tags ? JSON.stringify(tags) : null,
        cost,
        wearCount,
        updatedAt,
        req.params.id,
        req.userId,
      ]
    );

    const item = await db.get<ClothingItem>(
      'SELECT * FROM clothing_items WHERE id = ?',
      [req.params.id]
    );

    res.json({
      ...item!,
      tags: JSON.parse(item!.tags),
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete clothing item
router.delete('/items/:id', async (req: AuthRequest, res) => {
  try {
    const db = getDatabase();
    
    const result = await db.run(
      'DELETE FROM clothing_items WHERE id = ? AND userId = ?',
      [req.params.id, req.userId]
    );

    if (result.changes === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== Saved Outfits ====================

// Get all saved outfits
router.get('/outfits', async (req: AuthRequest, res) => {
  try {
    const db = getDatabase();
    const outfits = await db.all<SavedOutfit>(
      'SELECT * FROM saved_outfits WHERE userId = ? ORDER BY wornDate DESC',
      [req.userId]
    );

    const parsedOutfits = outfits.map(outfit => ({
      ...outfit,
      itemIds: JSON.parse(outfit.itemIds),
    }));

    res.json(parsedOutfits);
  } catch (error) {
    console.error('Error fetching outfits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create saved outfit
router.post('/outfits', async (req: AuthRequest, res) => {
  try {
    const {
      itemIds,
      styleExplanation,
      occasion,
      season,
      mood,
      wornDate,
      weather,
      notes,
    } = req.body;

    if (!itemIds || !styleExplanation || !wornDate) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const db = getDatabase();
    const id = uuidv4();
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO saved_outfits
       (id, userId, itemIds, styleExplanation, occasion, season, mood, wornDate, weather, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        req.userId,
        JSON.stringify(itemIds),
        styleExplanation,
        occasion || null,
        season || null,
        mood || null,
        wornDate,
        weather || null,
        notes || null,
        now,
      ]
    );

    // Increment wear count for items
    for (const itemId of itemIds) {
      await db.run(
        'UPDATE clothing_items SET wearCount = wearCount + 1, updatedAt = ? WHERE id = ? AND userId = ?',
        [now, itemId, req.userId]
      );
    }

    const outfit = await db.get<SavedOutfit>(
      'SELECT * FROM saved_outfits WHERE id = ?',
      [id]
    );

    res.status(201).json({
      ...outfit!,
      itemIds: JSON.parse(outfit!.itemIds),
    });
  } catch (error) {
    console.error('Error creating outfit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== Calendar Entries ====================

// Get calendar entries
router.get('/calendar', async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate } = req.query;

    const db = getDatabase();
    let query = 'SELECT * FROM calendar_entries WHERE userId = ?';
    const params: any[] = [req.userId];

    if (startDate && endDate) {
      query += ' AND date >= ? AND date <= ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY date DESC';

    const entries = await db.all<CalendarEntry>(query, params);

    const parsedEntries = entries.map(entry => ({
      ...entry,
      itemIds: JSON.parse(entry.itemIds),
    }));

    res.json(parsedEntries);
  } catch (error) {
    console.error('Error fetching calendar entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create/update calendar entry
router.post('/calendar', async (req: AuthRequest, res) => {
  try {
    const { date, outfitId, itemIds } = req.body;

    if (!date || !itemIds) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const db = getDatabase();

    await db.run(
      `INSERT OR REPLACE INTO calendar_entries (date, userId, outfitId, itemIds)
       VALUES (?, ?, ?, ?)`,
      [date, req.userId, outfitId || null, JSON.stringify(itemIds)]
    );

    const entry = await db.get<CalendarEntry>(
      'SELECT * FROM calendar_entries WHERE date = ? AND userId = ?',
      [date, req.userId]
    );

    res.status(201).json({
      ...entry!,
      itemIds: JSON.parse(entry!.itemIds),
    });
  } catch (error) {
    console.error('Error creating calendar entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== App State ====================

// Get app state
router.get('/app-state', async (req: AuthRequest, res) => {
  try {
    const db = getDatabase();
    const state = await db.get<{ hasCompletedOnboarding: number; preferences: string }>(
      'SELECT hasCompletedOnboarding, preferences FROM app_state WHERE userId = ?',
      [req.userId]
    );

    if (!state) {
      res.json({
        hasCompletedOnboarding: false,
        preferences: {},
      });
      return;
    }

    res.json({
      hasCompletedOnboarding: state.hasCompletedOnboarding === 1,
      preferences: JSON.parse(state.preferences),
    });
  } catch (error) {
    console.error('Error fetching app state:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update app state
router.put('/app-state', async (req: AuthRequest, res) => {
  try {
    const { hasCompletedOnboarding, preferences } = req.body;

    const db = getDatabase();

    await db.run(
      `INSERT OR REPLACE INTO app_state (userId, hasCompletedOnboarding, preferences)
       VALUES (?, ?, ?)`,
      [
        req.userId,
        hasCompletedOnboarding ? 1 : 0,
        JSON.stringify(preferences || {}),
      ]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating app state:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

