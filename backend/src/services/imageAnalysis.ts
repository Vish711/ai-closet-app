/**
 * Backend Image Analysis Service
 * Supports multiple vision APIs with secure API key management via environment variables
 * 
 * Supported APIs:
 * - OpenAI Vision API (recommended)
 * - Google Cloud Vision API
 * - AWS Rekognition
 * 
 * Set VISION_API_PROVIDER and corresponding API key in environment variables
 */

export interface ImageAnalysisResult {
  category: string | null;
  color: string | null;
  brand: string | null;
  season: string | null;
  tags: string[];
  confidence: number;
}

/**
 * Analyze clothing image using configured vision API
 */
export async function analyzeClothingImage(imageBase64: string): Promise<ImageAnalysisResult> {
  const provider = process.env.VISION_API_PROVIDER?.toLowerCase() || 'mock';
  
  switch (provider) {
    case 'openai':
      return analyzeWithOpenAI(imageBase64);
    case 'google':
      return analyzeWithGoogleVision(imageBase64);
    case 'aws':
      return analyzeWithAWSRekognition(imageBase64);
    case 'mock':
    default:
      return mockImageAnalysis(imageBase64);
  }
}

/**
 * Analyze image using OpenAI Vision API
 */
async function analyzeWithOpenAI(imageBase64: string): Promise<ImageAnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not set in environment variables');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this clothing image and extract:
- Category: one of [tops, bottoms, shoes, outerwear, accessories]
- Color: one of [black, white, gray, navy, blue, red, green, yellow, orange, pink, purple, brown, beige, multicolor]
- Brand: clothing brand name if visible (e.g., Nike, Adidas, etc.)
- Season: one of [spring, summer, fall, winter, all-season]
- Tags: array of 3-5 descriptive tags (e.g., ["casual", "comfortable", "versatile"])

Return ONLY a valid JSON object with this exact structure:
{
  "category": "tops",
  "color": "black",
  "brand": "Nike",
  "season": "all-season",
  "tags": ["casual", "comfortable", "versatile"]
}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json() as any;
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Parse JSON from response (may be wrapped in markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from OpenAI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      category: parsed.category || null,
      color: parsed.color || null,
      brand: parsed.brand || null,
      season: parsed.season || 'all-season',
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      confidence: 0.9, // High confidence for OpenAI
    };
  } catch (error: any) {
    console.error('OpenAI Vision API error:', error);
    throw new Error(`OpenAI Vision API failed: ${error.message}`);
  }
}

/**
 * Analyze image using Google Cloud Vision API
 */
async function analyzeWithGoogleVision(imageBase64: string): Promise<ImageAnalysisResult> {
  const apiKey = process.env.GOOGLE_VISION_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_VISION_API_KEY not set in environment variables');
  }

  try {
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: imageBase64,
              },
              features: [
                { type: 'LABEL_DETECTION', maxResults: 20 },
                { type: 'TEXT_DETECTION', maxResults: 10 },
                { type: 'IMAGE_PROPERTIES', maxResults: 1 },
                { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google Vision API error: ${error}`);
    }

    const data = await response.json() as any;
    const annotations = data.responses[0];

    // Extract category from labels and objects
    const labels = annotations.labelAnnotations || [];
    const objects = annotations.localizedObjectAnnotations || [];
    
    // Log for debugging (remove in production if needed)
    console.log('Google Vision Labels:', labels.slice(0, 5).map((l: any) => `${l.description} (${l.score})`));
    console.log('Google Vision Objects:', objects.slice(0, 5).map((o: any) => `${o.name} (${o.score})`));
    
    const category = inferCategoryFromLabels(labels, objects);
    
    // Extract color from image properties - use top 3 dominant colors
    const colors = annotations.imagePropertiesAnnotation?.dominantColors?.colors || [];
    console.log('Dominant Colors:', colors.slice(0, 3).map((c: any) => `RGB(${c.color.red},${c.color.green},${c.color.blue}) ${(c.pixelFraction * 100).toFixed(1)}%`));
    
    const color = inferColorFromProperties(colors, labels);
    
    // Extract brand from text detection
    const texts = annotations.textAnnotations || [];
    console.log('Detected Text:', texts.slice(0, 3).map((t: any) => t.description));
    
    const brand = extractBrandFromText(texts);

    // Generate tags from labels (prioritize high confidence)
    const sortedLabels = labels
      .filter((l: any) => l.score > 0.5) // Only use confident labels
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 5);
    const tags = sortedLabels.map((l: any) => l.description.toLowerCase());

    // Infer season from category, color, and labels
    const season = inferSeason(category, color, labels);

    return {
      category,
      color,
      brand,
      season,
      tags,
      confidence: 0.85,
    };
  } catch (error: any) {
    console.error('Google Vision API error:', error);
    throw new Error(`Google Vision API failed: ${error.message}`);
  }
}

/**
 * Analyze image using AWS Rekognition
 */
async function analyzeWithAWSRekognition(imageBase64: string): Promise<ImageAnalysisResult> {
  // Note: AWS Rekognition requires AWS SDK and proper credentials
  // This is a placeholder - you'll need to install @aws-sdk/client-rekognition
  throw new Error('AWS Rekognition not yet implemented. Please use OpenAI or Google Vision.');
}

/**
 * Mock image analysis (fallback when no API key is set)
 */
async function mockImageAnalysis(imageBase64: string): Promise<ImageAnalysisResult> {
  // Simple mock - in production, always use a real API
  return {
    category: 'tops',
    color: 'black',
    brand: null,
    season: 'all-season',
    tags: ['casual', 'comfortable', 'versatile'],
    confidence: 0.5,
  };
}

/**
 * Helper: Infer category from Google Vision labels and objects
 */
function inferCategoryFromLabels(labels: any[], objects: any[]): string | null {
  // Expanded keyword mapping with confidence scoring
  const categoryKeywords: Record<string, { keywords: string[], weight: number }> = {
    tops: {
      keywords: [
        'shirt', 'top', 'blouse', 't-shirt', 'tee', 'sweater', 'hoodie', 'tank', 'crop top',
        'polo', 'henley', 'turtleneck', 'cardigan', 'pullover', 'jersey', 'tunic', 'camisole',
        'bodysuit', 'blazer', 'sweatshirt', 'long sleeve', 'short sleeve'
      ],
      weight: 1.0
    },
    bottoms: {
      keywords: [
        'pants', 'jeans', 'trousers', 'shorts', 'skirt', 'leggings', 'tights', 'joggers',
        'sweatpants', 'chinos', 'cargo pants', 'capri', 'culottes', 'palazzo', 'wide leg',
        'straight leg', 'skinny', 'bootcut', 'flare'
      ],
      weight: 1.0
    },
    shoes: {
      keywords: [
        'shoe', 'sneaker', 'boot', 'sandal', 'footwear', 'trainer', 'running shoe',
        'athletic shoe', 'dress shoe', 'loafer', 'oxford', 'flats', 'pumps', 'heels'
      ],
      weight: 1.0
    },
    outerwear: {
      keywords: [
        'coat', 'jacket', 'parka', 'blazer', 'windbreaker', 'bomber', 'denim jacket',
        'leather jacket', 'trench coat', 'peacoat', 'puffer', 'fleece', 'vest'
      ],
      weight: 1.0
    },
    accessories: {
      keywords: [
        'bag', 'hat', 'belt', 'watch', 'jewelry', 'scarf', 'gloves', 'headband',
        'socks', 'sunglasses', 'wallet', 'backpack', 'purse', 'tote', 'clutch'
      ],
      weight: 0.8 // Lower weight since accessories are less common
    },
  };

  // Combine labels and objects, prioritizing high confidence
  const allItems: Array<{ text: string, confidence: number }> = [];
  
  // Add labels with their confidence scores
  labels.forEach((l: any) => {
    allItems.push({
      text: l.description.toLowerCase(),
      confidence: l.score || 0.5
    });
  });
  
  // Add objects with their confidence scores
  objects.forEach((o: any) => {
    allItems.push({
      text: o.name.toLowerCase(),
      confidence: o.score || 0.5
    });
  });

  // Score each category - prioritize objects over labels
  const categoryScores: Record<string, number> = {};
  
  for (const [category, config] of Object.entries(categoryKeywords)) {
    let score = 0;
    
    // First check objects (more reliable for clothing items)
    for (const item of allItems) {
      // Objects get higher weight
      const isObject = objects.some((o: any) => o.name.toLowerCase() === item.text);
      const weightMultiplier = isObject ? 2.0 : 1.0;
      
      for (const keyword of config.keywords) {
        if (item.text.includes(keyword)) {
          // Weight by confidence, category weight, and object multiplier
          score += item.confidence * config.weight * weightMultiplier;
          break; // Only count once per item
        }
      }
    }
    
    categoryScores[category] = score;
  }

  // Find category with highest score
  let maxScore = 0;
  let bestCategory: string | null = null;
  
  for (const [category, score] of Object.entries(categoryScores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }

  // Only return if confidence is reasonable
  return maxScore > 0.3 ? bestCategory : null;
}

/**
 * Helper: Infer color from Google Vision color properties and labels
 */
function inferColorFromProperties(colors: any[], labels: any[]): string | null {
  // First, check labels for explicit color mentions (most reliable)
  const labelText = labels.map((l: any) => l.description.toLowerCase()).join(' ');
  const colorKeywords: Record<string, string[]> = {
    black: ['black', 'dark', 'ebony'],
    white: ['white', 'ivory', 'cream'],
    gray: ['gray', 'grey', 'silver', 'charcoal'],
    navy: ['navy', 'navy blue', 'dark blue'],
    blue: ['blue', 'azure', 'cobalt'],
    red: ['red', 'crimson', 'scarlet', 'burgundy'],
    green: ['green', 'emerald', 'olive', 'forest', 'khaki', 'sage'],
    yellow: ['yellow', 'gold', 'amber'],
    orange: ['orange', 'coral', 'peach'],
    pink: ['pink', 'rose', 'salmon'],
    purple: ['purple', 'violet', 'lavender'],
    brown: ['brown', 'tan', 'beige', 'taupe', 'camel'],
    beige: ['beige', 'tan', 'nude', 'cream'],
    multicolor: ['multicolor', 'multi-color', 'patterned', 'print'],
  };

  for (const [color, keywords] of Object.entries(colorKeywords)) {
    if (keywords.some(keyword => labelText.includes(keyword))) {
      return color;
    }
  }

  // If no color in labels, use dominant color from image
  if (colors.length === 0) return null;

  // Get top 3-5 dominant colors and analyze them
  // Filter out white/very light colors (likely background)
  const topColors = colors
    .filter((c: any) => {
      const rgb = c.color;
      const brightness = ((rgb.red || 0) + (rgb.green || 0) + (rgb.blue || 0)) / 3;
      return brightness < 240; // Filter out very light backgrounds
    })
    .slice(0, 5);
    
  const colorScores: Record<string, number> = {};

  for (const colorData of topColors) {
    const rgb = colorData.color;
    const r = rgb.red || 0;
    const g = rgb.green || 0;
    const b = rgb.blue || 0;
    const pixelFraction = colorData.pixelFraction || 0;

    // Skip very small color areas (likely noise/background)
    if (pixelFraction < 0.08) continue; // Increased threshold

    const brightness = (r + g + b) / 3;
    const maxChannel = Math.max(r, g, b);
    const minChannel = Math.min(r, g, b);
    const saturation = maxChannel > 0 ? (maxChannel - minChannel) / maxChannel : 0;

    // Score each possible color match
    if (brightness < 30) {
      colorScores['black'] = (colorScores['black'] || 0) + pixelFraction;
    } else if (brightness > 240 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
      colorScores['white'] = (colorScores['white'] || 0) + pixelFraction;
    } else if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && brightness < 200) {
      colorScores['gray'] = (colorScores['gray'] || 0) + pixelFraction;
    } else if (saturation < 0.2) {
      if (brightness < 150) {
        colorScores['brown'] = (colorScores['brown'] || 0) + pixelFraction;
      } else if (brightness < 200) {
        colorScores['beige'] = (colorScores['beige'] || 0) + pixelFraction;
      } else {
        colorScores['gray'] = (colorScores['gray'] || 0) + pixelFraction;
      }
    } else {
      // High saturation colors
      if (r > g && r > b && r > 150) {
        if (g > 100 && b < 100) {
          colorScores['orange'] = (colorScores['orange'] || 0) + pixelFraction;
        } else if (b > 100) {
          colorScores['pink'] = (colorScores['pink'] || 0) + pixelFraction;
        } else {
          colorScores['red'] = (colorScores['red'] || 0) + pixelFraction;
        }
      } else if (g > r && g > b && g > 150) {
        // Green detection - check for olive/khaki
        if (brightness < 120 && r > 80 && b < 80) {
          colorScores['green'] = (colorScores['green'] || 0) + pixelFraction * 1.2; // Boost olive green
        } else {
          colorScores['green'] = (colorScores['green'] || 0) + pixelFraction;
        }
      } else if (b > r && b > g && b > 150) {
        if (brightness < 100) {
          colorScores['navy'] = (colorScores['navy'] || 0) + pixelFraction;
        } else {
          colorScores['blue'] = (colorScores['blue'] || 0) + pixelFraction;
        }
      } else if (r > 100 && g > 100 && b < 100) {
        colorScores['yellow'] = (colorScores['yellow'] || 0) + pixelFraction;
      } else if (r > 100 && b > 100 && g < 100) {
        colorScores['purple'] = (colorScores['purple'] || 0) + pixelFraction;
      }
    }
  }

  // Return color with highest score
  let maxScore = 0;
  let bestColor: string | null = null;
  for (const [color, score] of Object.entries(colorScores)) {
    if (score > maxScore) {
      maxScore = score;
      bestColor = color;
    }
  }

  return bestColor;
}

/**
 * Helper: Extract brand from text detection
 */
function extractBrandFromText(texts: any[]): string | null {
  // Expanded brand list with common variations
  const brandKeywords = [
    'nike', 'adidas', 'puma', 'gymshark', 'lululemon', 'zara', 'h&m', 'h and m', 'uniqlo',
    'gap', 'levi', 'levis', 'calvin klein', 'tommy hilfiger', 'ralph lauren', 'champion',
    'columbia', 'north face', 'patagonia', 'under armour', 'reebok', 'new balance',
    'vans', 'converse', 'fila', 'asics', 'brooks', 'saucony', 'mizuno', 'adidas',
    'gucci', 'prada', 'versace', 'armani', 'hugo boss', 'burberry', 'coach',
    'michael kors', 'kate spade', 'tory burch', 'banana republic', 'j.crew',
    'old navy', 'american eagle', 'abercrombie', 'hollister', 'forever 21'
  ];

  // Check all text annotations, prioritizing shorter text (logo text is usually short)
  // Also prioritize text that appears in the upper portion of image (where logos usually are)
  const sortedTexts = texts
    .filter((t: any) => {
      const desc = t.description?.toLowerCase() || '';
      // Filter out very long text (likely product descriptions, not brand names)
      return desc && desc.length > 1 && desc.length < 50;
    })
    .sort((a: any, b: any) => {
      // Prioritize shorter text (brand names are usually short)
      const lengthDiff = a.description.length - b.description.length;
      if (Math.abs(lengthDiff) > 5) return lengthDiff;
      // If similar length, check bounding box position (logos often in top area)
      const aY = a.boundingPoly?.vertices?.[0]?.y || 9999;
      const bY = b.boundingPoly?.vertices?.[0]?.y || 9999;
      return aY - bY; // Lower Y = higher on image = more likely logo
    });

  for (const text of sortedTexts) {
    const textLower = text.description?.toLowerCase() || '';
    
    // Check for exact brand matches first (more reliable)
    for (const brand of brandKeywords) {
      // Match whole word or at start/end of text
      const brandRegex = new RegExp(`\\b${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (brandRegex.test(textLower)) {
        // Format brand name properly
        if (brand === 'h&m' || brand === 'h and m') return 'H&M';
        if (brand === 'levi' || brand === 'levis') return 'Levi\'s';
        if (brand === 'columbia') return 'Columbia';
        return brand.split(' ').map(w => {
          if (w === 'and') return '&';
          return w.charAt(0).toUpperCase() + w.slice(1);
        }).join(' ');
      }
    }
  }

  return null;
}

/**
 * Helper: Infer season from category, color, and labels
 */
function inferSeason(category: string | null, color: string | null, labels: any[]): string {
  const labelText = labels.map((l: any) => l.description.toLowerCase()).join(' ');
  
  // Explicit season mentions in labels
  if (labelText.includes('winter') || labelText.includes('warm') || labelText.includes('insulated')) {
    return 'winter';
  }
  if (labelText.includes('summer') || labelText.includes('lightweight') || labelText.includes('breathable')) {
    return 'summer';
  }
  if (labelText.includes('spring')) {
    return 'spring';
  }
  if (labelText.includes('fall') || labelText.includes('autumn')) {
    return 'fall';
  }

  // Infer from category
  if (category === 'outerwear') {
    // Outerwear is typically winter, unless it's a light jacket
    if (labelText.includes('jacket') && !labelText.includes('light')) {
      return 'winter';
    }
    if (labelText.includes('windbreaker') || labelText.includes('rain')) {
      return 'spring';
    }
    return 'winter';
  }

  // Infer from color
  if (color === 'black' || color === 'navy' || color === 'brown') {
    // Dark colors often associated with fall/winter
    if (category === 'outerwear') return 'winter';
    return 'fall';
  }
  if (color === 'yellow' || color === 'orange' || color === 'pink') {
    // Bright colors often spring/summer
    return 'spring';
  }
  if (color === 'white' || color === 'beige') {
    return 'summer';
  }

  // Default based on category
  if (category === 'shoes') {
    // Sneakers are all-season, boots are winter
    if (labelText.includes('boot')) return 'winter';
    return 'all-season';
  }

  return 'all-season';
}

