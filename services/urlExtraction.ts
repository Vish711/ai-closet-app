/**
 * URL Extraction Service
 * Extracts product information and images from URLs
 * 
 * Note: Due to CORS restrictions, this may need a backend proxy
 * for production use with external websites.
 */

export interface ExtractedContent {
  images: string[];
  title: string | null;
  description: string | null;
  price: number | null;
  brand: string | null;
  category: string | null;
  color: string | null;
  size: string | null;
  metadata: Record<string, any>;
}

/**
 * Extract content from a URL
 * Attempts to fetch and parse product information
 */
export async function extractFromUrl(url: string): Promise<ExtractedContent> {
  try {
    // Validate URL
    if (!isValidUrl(url)) {
      throw new Error('Invalid URL format');
    }

    // For web, we can try to fetch directly
    // For mobile, we might need a backend proxy due to CORS
    if (typeof window !== 'undefined') {
      return await extractFromUrlWeb(url);
    } else {
      // Mobile - would need backend proxy
      throw new Error('URL extraction on mobile requires backend proxy');
    }
  } catch (error) {
    console.error('URL extraction error:', error);
    throw error;
  }
}

/**
 * Extract content from URL in web environment
 */
async function extractFromUrlWeb(url: string): Promise<ExtractedContent> {
  try {
    // Try to fetch the URL
    // Note: This will fail for most sites due to CORS
    // In production, use a backend proxy or service like:
    // - ScraperAPI
    // - Bright Data
    // - Custom backend endpoint
    
    const response = await fetch(url, {
      mode: 'cors',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      // If direct fetch fails (CORS), try alternative methods
      return await extractFromUrlFallback(url);
    }

    const html = await response.text();
    return parseHtml(html, url);
  } catch (error: any) {
    // CORS or other fetch error - use fallback
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
      return await extractFromUrlFallback(url);
    }
    throw error;
  }
}

/**
 * Fallback extraction method
 * Uses Open Graph meta tags and common patterns
 */
async function extractFromUrlFallback(url: string): Promise<ExtractedContent> {
  // For now, return a basic structure
  // In production, you could:
  // 1. Use a backend proxy service
  // 2. Use a service like ScraperAPI
  // 3. Use Open Graph meta tags via a proxy
  
  return {
    images: [],
    title: null,
    description: null,
    price: null,
    brand: null,
    category: null,
    color: null,
    size: null,
    metadata: { url, extracted: false },
  };
}

/**
 * Parse HTML content to extract product information
 */
function parseHtml(html: string, url: string): ExtractedContent {
  // Create a temporary DOM parser (web only)
  if (typeof window === 'undefined' || !window.DOMParser) {
    return extractFromUrlFallback(url);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Extract Open Graph meta tags
  const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
  const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
  const ogPrice = doc.querySelector('meta[property="product:price:amount"]')?.getAttribute('content');
  const ogBrand = doc.querySelector('meta[property="product:brand"]')?.getAttribute('content');

  // Extract title
  const title = ogTitle || doc.querySelector('title')?.textContent || null;

  // Extract description
  const description = ogDescription || 
    doc.querySelector('meta[name="description"]')?.getAttribute('content') || null;

  // Extract images
  const images: string[] = [];
  if (ogImage) {
    images.push(ogImage);
  }
  
  // Try to find product images
  const productImages = doc.querySelectorAll('img[src*="product"], img[src*="item"], img[data-src]');
  productImages.forEach(img => {
    const src = img.getAttribute('src') || img.getAttribute('data-src');
    if (src && !images.includes(src)) {
      // Convert relative URLs to absolute
      const absoluteUrl = new URL(src, url).href;
      images.push(absoluteUrl);
    }
  });

  // Extract price (try multiple patterns)
  let price: number | null = null;
  if (ogPrice) {
    price = parseFloat(ogPrice);
  } else {
    // Try to find price in common patterns
    const pricePatterns = [
      /[\$£€¥]\s*(\d+\.?\d*)/,
      /price[:\s]*[\$£€¥]?\s*(\d+\.?\d*)/i,
      /(\d+\.?\d*)\s*[\$£€¥]/,
    ];
    
    for (const pattern of pricePatterns) {
      const match = html.match(pattern);
      if (match) {
        price = parseFloat(match[1]);
        break;
      }
    }
  }

  // Extract brand
  const brand = ogBrand || 
    doc.querySelector('meta[itemprop="brand"]')?.getAttribute('content') ||
    doc.querySelector('[itemprop="brand"]')?.textContent?.trim() || null;

  // Try to infer category from URL or content
  const category = inferCategory(url, title, description);

  // Try to extract color
  const color = extractColor(html, title, description);

  // Try to extract size
  const size = extractSize(html);

  return {
    images: images.slice(0, 5), // Limit to 5 images
    title,
    description,
    price,
    brand,
    category,
    color,
    size,
    metadata: {
      url,
      extracted: true,
      hasOpenGraph: !!ogTitle,
    },
  };
}

/**
 * Infer clothing category from URL and content
 */
function inferCategory(url: string, title: string | null, description: string | null): string | null {
  const text = `${url} ${title || ''} ${description || ''}`.toLowerCase();
  
  const categoryKeywords: Record<string, string[]> = {
    tops: ['shirt', 'top', 'blouse', 't-shirt', 'tee', 'sweater', 'hoodie', 'jacket'],
    bottoms: ['pants', 'jeans', 'trousers', 'shorts', 'skirt', 'leggings'],
    shoes: ['shoe', 'sneaker', 'boot', 'sandal', 'heel', 'slipper'],
    outerwear: ['coat', 'jacket', 'parka', 'blazer', 'cardigan'],
    accessories: ['bag', 'hat', 'belt', 'watch', 'jewelry', 'scarf'],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }

  return null;
}

/**
 * Extract color information
 */
function extractColor(html: string, title: string | null, description: string | null): string | null {
  const text = `${title || ''} ${description || ''}`.toLowerCase();
  
  const colors = ['black', 'white', 'gray', 'navy', 'blue', 'red', 'green', 'yellow', 
    'orange', 'pink', 'purple', 'brown', 'beige', 'multicolor'];
  
  for (const color of colors) {
    if (text.includes(color)) {
      return color;
    }
  }

  return null;
}

/**
 * Extract size information
 */
function extractSize(html: string): string | null {
  // Try to find size in common patterns
  const sizePatterns = [
    /size[:\s]*([XS|S|M|L|XL|XXL|\d]+)/i,
    /([XS|S|M|L|XL|XXL]+)/,
    /(\d+)\s*(?:US|EU|UK)?\s*size/i,
  ];

  for (const pattern of sizePatterns) {
    const match = html.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Download image from URL and convert to data URI
 * (For use in React Native/Expo)
 */
export async function downloadImageFromUrl(imageUrl: string): Promise<string> {
  try {
    // For web, we can use the URL directly
    if (typeof window !== 'undefined') {
      // Check if it's a data URI or blob URL
      if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
        return imageUrl;
      }
      
      // For web, we might need to proxy through backend to avoid CORS
      // For now, return the URL as-is (will work if CORS allows)
      return imageUrl;
    }
    
    // For React Native, we'd need to download and convert
    // This would require expo-file-system or similar
    throw new Error('Image download on mobile requires additional setup');
  } catch (error) {
    console.error('Image download error:', error);
    throw error;
  }
}

