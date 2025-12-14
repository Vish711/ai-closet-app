/**
 * Core type definitions for AI Closet App
 */

export type ClothingCategory = 
  | 'tops' 
  | 'bottoms' 
  | 'shoes' 
  | 'outerwear' 
  | 'accessories';

export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'all-season';

export type Occasion = 
  | 'casual' 
  | 'work' 
  | 'date' 
  | 'party' 
  | 'gym' 
  | 'formal' 
  | 'sporty';

export type Color = 
  | 'black' 
  | 'white' 
  | 'gray' 
  | 'navy' 
  | 'blue' 
  | 'red' 
  | 'green' 
  | 'yellow' 
  | 'orange' 
  | 'pink' 
  | 'purple' 
  | 'brown' 
  | 'beige' 
  | 'multicolor';

export type Mood = 
  | 'comfy' 
  | 'streetwear' 
  | 'minimal' 
  | 'bold' 
  | 'elegant' 
  | 'edgy' 
  | 'relaxed';

export type DressCode = 'casual' | 'business-casual' | 'business' | 'formal' | 'smart-casual';

/**
 * Core clothing item entity
 */
export interface ClothingItem {
  id: string;
  imageUri: string;
  category: ClothingCategory;
  color: Color;
  brand?: string;
  size?: string;
  season: Season;
  tags: string[];
  cost: number;
  wearCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Outfit suggestion from AI
 */
export interface Outfit {
  id: string;
  itemIds: string[]; // References to ClothingItem IDs
  styleExplanation: string;
  occasion?: Occasion;
  season?: Season;
  mood?: Mood;
  createdAt: string;
}

/**
 * Saved outfit (worn by user)
 */
export interface SavedOutfit extends Outfit {
  wornDate: string;
  weather?: string;
  notes?: string;
}

/**
 * Filters for wardrobe browsing
 */
export interface WardrobeFilters {
  category?: ClothingCategory[];
  color?: Color[];
  season?: Season[];
  occasion?: Occasion[];
  tags?: string[];
  searchQuery?: string;
}

/**
 * Request payload for AI outfit generation
 */
export interface AiOutfitRequest {
  wardrobe: ClothingItem[];
  constraints: {
    date?: string;
    weather?: string;
    occasion?: Occasion;
    dressCode?: DressCode;
    mood?: Mood;
    lockedItemIds?: string[]; // Items that must be included
    excludedItemIds?: string[]; // Items to avoid
  };
}

/**
 * Response from AI outfit generation service
 */
export interface AiOutfitResponse {
  outfits: Outfit[];
  reasoning?: string;
}

/**
 * Calendar entry for tracking daily outfits
 */
export interface CalendarEntry {
  date: string; // ISO date string
  outfitId?: string; // Reference to SavedOutfit
  items: ClothingItem[]; // Items worn that day
}

/**
 * User preferences for styling
 */
export interface UserPreferences {
  defaultCity?: string;
  preferredColorPalette?: Color[];
  defaultDressCode?: DressCode;
  favoriteMoods?: Mood[];
}

/**
 * App state for onboarding
 */
export interface AppState {
  hasCompletedOnboarding: boolean;
  preferences: UserPreferences;
}


