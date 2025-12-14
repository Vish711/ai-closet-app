/**
 * Shared types for backend API
 */

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClothingItem {
  id: string;
  userId: string;
  imageUri: string;
  category: string;
  color: string;
  brand?: string;
  size?: string;
  season: string;
  tags: string; // JSON string
  cost: number;
  wearCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SavedOutfit {
  id: string;
  userId: string;
  itemIds: string; // JSON string
  styleExplanation: string;
  occasion?: string;
  season?: string;
  mood?: string;
  wornDate: string;
  weather?: string;
  notes?: string;
  createdAt: string;
}

export interface CalendarEntry {
  date: string;
  userId: string;
  outfitId?: string;
  itemIds: string; // JSON string
}

export interface AppState {
  userId: string;
  hasCompletedOnboarding: boolean;
  preferences: string; // JSON string
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

