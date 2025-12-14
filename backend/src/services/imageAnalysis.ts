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

    const data = await response.json();
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
                { type: 'LABEL_DETECTION', maxResults: 10 },
                { type: 'TEXT_DETECTION', maxResults: 10 },
                { type: 'IMAGE_PROPERTIES', maxResults: 1 },
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

    const data = await response.json();
    const annotations = data.responses[0];

    // Extract category from labels
    const labels = annotations.labelAnnotations || [];
    const category = inferCategoryFromLabels(labels);
    
    // Extract color from image properties
    const colors = annotations.imagePropertiesAnnotation?.dominantColors?.colors || [];
    const color = inferColorFromProperties(colors);
    
    // Extract brand from text detection
    const texts = annotations.textAnnotations || [];
    const brand = extractBrandFromText(texts);

    // Generate tags from labels
    const tags = labels.slice(0, 5).map((l: any) => l.description.toLowerCase());

    return {
      category,
      color,
      brand,
      season: 'all-season', // Google Vision doesn't detect season
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
 * Helper: Infer category from Google Vision labels
 */
function inferCategoryFromLabels(labels: any[]): string | null {
  const categoryKeywords: Record<string, string[]> = {
    tops: ['shirt', 'top', 'blouse', 't-shirt', 'sweater', 'hoodie', 'tank'],
    bottoms: ['pants', 'jeans', 'trousers', 'shorts', 'skirt', 'leggings'],
    shoes: ['shoe', 'sneaker', 'boot', 'sandal', 'footwear'],
    outerwear: ['coat', 'jacket', 'parka', 'blazer'],
    accessories: ['bag', 'hat', 'belt', 'watch'],
  };

  const labelText = labels.map(l => l.description.toLowerCase()).join(' ');
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => labelText.includes(keyword))) {
      return category;
    }
  }

  return null;
}

/**
 * Helper: Infer color from Google Vision color properties
 */
function inferColorFromProperties(colors: any[]): string | null {
  if (colors.length === 0) return null;

  // Get the most dominant color
  const dominantColor = colors[0];
  const rgb = dominantColor.color;

  // Simple RGB to color name mapping
  const colorNames = ['black', 'white', 'gray', 'navy', 'blue', 'red', 'green', 'yellow', 'orange', 'pink', 'purple', 'brown', 'beige'];
  
  // This is simplified - in production, use a proper color matching algorithm
  return 'black'; // Placeholder
}

/**
 * Helper: Extract brand from text detection
 */
function extractBrandFromText(texts: any[]): string | null {
  const brandKeywords = [
    'nike', 'adidas', 'puma', 'gymshark', 'lululemon', 'zara', 'h&m', 'uniqlo',
    'gap', 'levi', 'calvin klein', 'tommy hilfiger', 'ralph lauren', 'champion'
  ];

  for (const text of texts) {
    const textLower = text.description?.toLowerCase() || '';
    for (const brand of brandKeywords) {
      if (textLower.includes(brand)) {
        return brand.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    }
  }

  return null;
}

