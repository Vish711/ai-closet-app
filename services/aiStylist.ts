/**
 * AI Stylist Service
 * Generates outfit suggestions based on wardrobe and constraints
 * 
 * This is a mock implementation that can be replaced with actual LLM API calls.
 * The function signature and response format are designed to be easily swappable.
 */

import { ClothingItem, Outfit, AiOutfitRequest, AiOutfitResponse, Occasion, Mood, Season } from '@/types';

/**
 * Generate outfit suggestions using AI/LLM
 * 
 * TODO: Replace this mock with actual LLM API call:
 * 1. Format wardrobe items as structured JSON
 * 2. Send request to LLM (OpenAI, Anthropic, local model, etc.)
 * 3. Parse response and return Outfit[]
 * 
 * Example integration:
 * ```typescript
 * const response = await fetch('https://api.openai.com/v1/chat/completions', {
 *   method: 'POST',
 *   headers: {
 *     'Authorization': `Bearer ${API_KEY}`,
 *     'Content-Type': 'application/json',
 *   },
 *   body: JSON.stringify({
 *     model: 'gpt-4',
 *     messages: [{
 *       role: 'system',
 *       content: 'You are a fashion stylist...'
 *     }, {
 *       role: 'user',
 *       content: formatPrompt(request)
 *     }]
 *   })
 * });
 * ```
 */
export async function generateOutfits(
  request: AiOutfitRequest
): Promise<AiOutfitResponse> {
  const { wardrobe, constraints } = request;
  
  // Validate input
  if (!wardrobe || wardrobe.length === 0) {
    throw new Error('Wardrobe is empty. Add some clothing items first.');
  }
  
  // Filter wardrobe based on constraints
  let availableItems = [...wardrobe];
  
  // Apply season filter
  if (constraints.weather) {
    const season = inferSeasonFromWeather(constraints.weather);
    availableItems = availableItems.filter(
      item => item.season === season || item.season === 'all-season'
    );
  }
  
  // Exclude locked items from available pool (they'll be added separately)
  if (constraints.lockedItemIds) {
    availableItems = availableItems.filter(
      item => !constraints.lockedItemIds!.includes(item.id)
    );
  }
  
  // Exclude explicitly excluded items
  if (constraints.excludedItemIds) {
    availableItems = availableItems.filter(
      item => !constraints.excludedItemIds!.includes(item.id)
    );
  }
  
  // Generate 3-5 outfit suggestions
  const numOutfits = Math.min(5, Math.max(3, Math.floor(availableItems.length / 3)));
  const outfits: Outfit[] = [];
  
  for (let i = 0; i < numOutfits; i++) {
    const outfit = generateMockOutfit(
      availableItems,
      constraints,
      constraints.lockedItemIds || []
    );
    if (outfit) {
      outfits.push(outfit);
    }
  }
  
  return {
    outfits,
    reasoning: `Generated ${outfits.length} outfit suggestions based on ${wardrobe.length} items in your wardrobe, considering ${constraints.occasion || 'casual'} occasion and ${constraints.mood || 'balanced'} mood.`,
  };
}

/**
 * Mock outfit generation algorithm
 * In production, this would be replaced by LLM reasoning
 */
function generateMockOutfit(
  availableItems: ClothingItem[],
  constraints: AiOutfitRequest['constraints'],
  lockedItems: string[]
): Outfit | null {
  const outfitItems: ClothingItem[] = [];
  const usedCategories = new Set<string>();
  
  // Add locked items first
  const lockedItemObjects = availableItems.filter(item => lockedItems.includes(item.id));
  outfitItems.push(...lockedItemObjects);
  lockedItemObjects.forEach(item => usedCategories.add(item.category));
  
  // Select one item from each essential category
  const essentialCategories: Array<ClothingCategory> = ['tops', 'bottoms', 'shoes'];
  
  for (const category of essentialCategories) {
    if (usedCategories.has(category)) continue;
    
    const categoryItems = availableItems.filter(
      item => item.category === category && !outfitItems.some(oi => oi.id === item.id)
    );
    
    if (categoryItems.length === 0) continue;
    
    // Filter by occasion if specified
    let filtered = categoryItems;
    if (constraints.occasion) {
      // Simple heuristic: filter by tags or category appropriateness
      filtered = categoryItems.filter(item => 
        item.tags.some(tag => 
          tag.toLowerCase().includes(constraints.occasion!.toLowerCase())
        ) || isCategoryAppropriateForOccasion(category, constraints.occasion)
      );
    }
    
    // Select a random item from filtered list
    const selected = filtered[Math.floor(Math.random() * filtered.length)] || categoryItems[0];
    outfitItems.push(selected);
    usedCategories.add(category);
  }
  
  // Optionally add outerwear or accessories
  if (Math.random() > 0.5) {
    const outerwear = availableItems.find(
      item => item.category === 'outerwear' && !outfitItems.some(oi => oi.id === item.id)
    );
    if (outerwear) outfitItems.push(outerwear);
  }
  
  if (outfitItems.length < 2) return null; // Need at least 2 items
  
  // Generate style explanation
  const explanation = generateStyleExplanation(outfitItems, constraints);
  
  return {
    id: `outfit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    itemIds: outfitItems.map(item => item.id),
    styleExplanation: explanation,
    occasion: constraints.occasion,
    season: constraints.weather ? inferSeasonFromWeather(constraints.weather) : undefined,
    mood: constraints.mood,
    createdAt: new Date().toISOString(),
  };
}

type ClothingCategory = 'tops' | 'bottoms' | 'shoes' | 'outerwear' | 'accessories';

function isCategoryAppropriateForOccasion(
  category: ClothingCategory,
  occasion: Occasion
): boolean {
  // Simple heuristic - in production, LLM would handle this
  if (occasion === 'formal' || occasion === 'work') {
    return category !== 'gym';
  }
  if (occasion === 'gym') {
    return category === 'tops' || category === 'bottoms' || category === 'shoes';
  }
  return true;
}

function inferSeasonFromWeather(weather: string): Season {
  const lower = weather.toLowerCase();
  if (lower.includes('cold') || lower.includes('snow') || lower.includes('winter')) {
    return 'winter';
  }
  if (lower.includes('hot') || lower.includes('summer') || lower.includes('sunny')) {
    return 'summer';
  }
  if (lower.includes('spring') || lower.includes('mild')) {
    return 'spring';
  }
  if (lower.includes('fall') || lower.includes('autumn') || lower.includes('cool')) {
    return 'fall';
  }
  return 'all-season';
}

function generateStyleExplanation(
  items: ClothingItem[],
  constraints: AiOutfitRequest['constraints']
): string {
  const colors = items.map(item => item.color).join(', ');
  const categories = items.map(item => item.category).join(' + ');
  const mood = constraints.mood || 'balanced';
  
  const explanations = [
    `A ${mood} ${categories} combination in ${colors}. Perfect for ${constraints.occasion || 'casual'} occasions.`,
    `Stylish ${categories} pairing with ${colors} tones. Great for a ${mood} ${constraints.occasion || 'casual'} look.`,
    `Effortless ${categories} ensemble featuring ${colors}. Ideal for ${constraints.occasion || 'casual'} settings.`,
    `Modern ${categories} mix in ${colors}. A ${mood} take on ${constraints.occasion || 'casual'} style.`,
  ];
  
  return explanations[Math.floor(Math.random() * explanations.length)];
}

/**
 * Calculate cost per wear for an item
 */
export function calculateCostPerWear(item: ClothingItem): number {
  if (item.wearCount === 0) return item.cost;
  return item.cost / item.wearCount;
}

/**
 * Get weather data (mock - replace with actual weather API)
 * TODO: Integrate with weather service (OpenWeatherMap, etc.)
 */
export async function getWeatherForDate(
  date: string,
  city?: string
): Promise<string> {
  // Mock implementation
  const month = new Date(date).getMonth();
  if (month >= 11 || month <= 2) return 'cold, winter';
  if (month >= 3 && month <= 5) return 'mild, spring';
  if (month >= 6 && month <= 8) return 'hot, summer';
  return 'cool, fall';
}


