/**
 * Hybrid storage service that syncs with backend API
 * Falls back to local storage when offline or not logged in
 */

import { apiService } from './api';
import * as localStorage from '@/lib/storage';
import { ClothingItem, SavedOutfit, CalendarEntry, AppState } from '@/types';

let useBackend = false;

export function setUseBackend(enabled: boolean) {
  useBackend = enabled && !!apiService.getToken();
}

export const storageSync = {
  setUseBackend,
};

// Initialize - check if we have a token
export async function initStorage() {
  const token = apiService.getToken();
  storageSync.setUseBackend(!!token);
  
  // Always initialize local storage as fallback
  await localStorage.initDatabase();
}

// ==================== Clothing Items ====================

export async function saveClothingItem(item: ClothingItem): Promise<void> {
  if (useBackend) {
    try {
      const response = await apiService.createClothingItem(item);
      if (response.error) {
        throw new Error(response.error);
      }
      // Also save locally as backup
      await localStorage.saveClothingItem(item);
      return;
    } catch (error) {
      console.warn('Backend save failed, using local storage:', error);
      // Fall through to local storage
    }
  }
  await localStorage.saveClothingItem(item);
}

export async function getAllClothingItems(): Promise<ClothingItem[]> {
  if (useBackend) {
    try {
      const response = await apiService.getClothingItems();
      if (response.data) {
        // Sync to local storage
        for (const item of response.data) {
          await localStorage.saveClothingItem(item);
        }
        return response.data;
      }
    } catch (error) {
      console.warn('Backend fetch failed, using local storage:', error);
      // Fall through to local storage
    }
  }
  return localStorage.getAllClothingItems();
}

export async function deleteClothingItem(id: string): Promise<void> {
  if (useBackend) {
    try {
      const response = await apiService.deleteClothingItem(id);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.warn('Backend delete failed:', error);
    }
  }
  await localStorage.deleteClothingItem(id);
}

export async function incrementWearCount(itemId: string): Promise<void> {
  const item = await localStorage.getClothingItem(itemId);
  if (item) {
    item.wearCount += 1;
    item.updatedAt = new Date().toISOString();
    
    if (useBackend) {
      try {
        await apiService.updateClothingItem(itemId, { wearCount: item.wearCount });
      } catch (error) {
        console.warn('Backend update failed:', error);
      }
    }
    await localStorage.saveClothingItem(item);
  }
}

// ==================== Saved Outfits ====================

export async function saveOutfit(outfit: SavedOutfit): Promise<void> {
  if (useBackend) {
    try {
      const response = await apiService.saveOutfit(outfit);
      if (response.error) {
        throw new Error(response.error);
      }
      return;
    } catch (error) {
      console.warn('Backend save failed, using local storage:', error);
    }
  }
  await localStorage.saveOutfit(outfit);
}

export async function getSavedOutfits(): Promise<SavedOutfit[]> {
  if (useBackend) {
    try {
      const response = await apiService.getSavedOutfits();
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.warn('Backend fetch failed, using local storage:', error);
    }
  }
  return localStorage.getSavedOutfits();
}

// ==================== Calendar Entries ====================

export async function saveCalendarEntry(entry: CalendarEntry): Promise<void> {
  if (useBackend) {
    try {
      const response = await apiService.saveCalendarEntry(entry);
      if (response.error) {
        throw new Error(response.error);
      }
      return;
    } catch (error) {
      console.warn('Backend save failed, using local storage:', error);
    }
  }
  await localStorage.saveCalendarEntry(entry);
}

export async function getCalendarEntries(startDate: string, endDate: string): Promise<CalendarEntry[]> {
  if (useBackend) {
    try {
      const response = await apiService.getCalendarEntries(startDate, endDate);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.warn('Backend fetch failed, using local storage:', error);
    }
  }
  return localStorage.getCalendarEntries(startDate, endDate);
}

// ==================== App State ====================

export async function getAppState(): Promise<AppState> {
  if (useBackend) {
    try {
      const response = await apiService.getAppState();
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.warn('Backend fetch failed, using local storage:', error);
    }
  }
  return localStorage.getAppState();
}

export async function setAppState(state: Partial<AppState>): Promise<void> {
  if (useBackend) {
    try {
      await apiService.updateAppState(state);
    } catch (error) {
      console.warn('Backend update failed, using local storage:', error);
    }
  }
  await localStorage.setAppState(state);
}

