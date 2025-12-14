/**
 * URL Extraction routes
 * Server-side scraping to bypass CORS limitations
 */

import { Router, Request, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// This endpoint doesn't require auth (public utility)
// But you can add auth if you want to limit usage
router.post('/extract', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Fetch the URL server-side (no CORS restrictions)
    // Node.js 18+ has built-in fetch
    // Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        return res.status(response.status).json({ 
          error: `Failed to fetch URL: ${response.statusText}` 
        });
      }

      const html = await response.text();
      const extracted = parseHtml(html, url);

      res.json(extracted);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return res.status(408).json({ error: 'Request timeout - URL took too long to respond' });
      }
      throw fetchError;
    }
  } catch (error: any) {
    console.error('URL extraction error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to extract content from URL' 
    });
  }
});

/**
 * Parse HTML and extract product information
 */
function parseHtml(html: string, baseUrl: string): any {
  // First, try to extract JSON-LD structured data (used by many modern e-commerce sites)
  const jsonLdData = extractJsonLd(html);
  
  // Extract Open Graph meta tags using regex (no DOM parser needed)
  const ogTitle = extractMetaTag(html, 'property="og:title"') || 
                  extractMetaTag(html, 'name="og:title"') ||
                  jsonLdData?.name;
  const ogDescription = extractMetaTag(html, 'property="og:description"') || 
                        extractMetaTag(html, 'name="description"') ||
                        jsonLdData?.description;
  const ogImage = extractMetaTag(html, 'property="og:image"') || 
                  extractMetaTag(html, 'name="og:image"') ||
                  (jsonLdData?.image && (Array.isArray(jsonLdData.image) ? jsonLdData.image[0] : jsonLdData.image));
  const ogPrice = extractMetaTag(html, 'property="product:price:amount"') || 
                  extractMetaTag(html, 'property="product:price"') ||
                  (jsonLdData?.offers?.price || jsonLdData?.price);
  const ogBrand = extractMetaTag(html, 'property="product:brand"') || 
                  extractMetaTag(html, 'itemprop="brand"') ||
                  jsonLdData?.brand?.name ||
                  jsonLdData?.brand;

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = ogTitle || (titleMatch ? titleMatch[1].trim() : null);

  // Extract description
  const description = ogDescription || null;

  // Extract images
  const images: string[] = [];
  if (ogImage) {
    images.push(resolveUrl(ogImage, baseUrl));
  }

  // Find product images in HTML (including lazy-loaded images)
  const imgRegex = /<img[^>]+(?:src|data-src|data-lazy-src|data-original|data-srcset|srcset)=["']([^"']+)["'][^>]*>/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null && images.length < 5) {
    let src = imgMatch[1];
    // Handle srcset (take first URL)
    if (src.includes(',')) {
      src = src.split(',')[0].trim().split(' ')[0];
    }
    if (src && !src.startsWith('data:') && !images.includes(src)) {
      const absoluteUrl = resolveUrl(src, baseUrl);
      // Filter out small icons/logos, but include product images
      if (!src.includes('icon') && !src.includes('logo') && !src.includes('avatar') && 
          !src.includes('favicon') && (src.includes('product') || src.includes('item') || 
          src.match(/\.(jpg|jpeg|png|webp)/i))) {
        images.push(absoluteUrl);
      }
    }
  }
  
  // Also check JSON-LD for images
  if (jsonLdData?.image) {
    const jsonImages = Array.isArray(jsonLdData.image) ? jsonLdData.image : [jsonLdData.image];
    for (const img of jsonImages) {
      if (images.length >= 5) break;
      const imgUrl = typeof img === 'string' ? img : (img.url || img);
      if (imgUrl && !images.includes(imgUrl)) {
        images.push(resolveUrl(imgUrl, baseUrl));
      }
    }
  }

  // Extract price
  let price: number | null = null;
  if (ogPrice) {
    // Handle both string and number prices
    if (typeof ogPrice === 'number') {
      price = ogPrice;
    } else {
      price = parseFloat(ogPrice.toString().replace(/[^0-9.]/g, ''));
    }
  } else {
    // Try common price patterns in HTML
    const pricePatterns = [
      /[\$£€¥]\s*(\d+\.?\d*)/,
      /price[:\s]*[\$£€¥]?\s*(\d+\.?\d*)/i,
      /(\d+\.?\d*)\s*[\$£€¥]/,
      /"price"[:\s]*"([^"]+)"/i,
      /"price"[:\s]*(\d+\.?\d*)/i,
      /priceAmount["\s:]+(\d+\.?\d*)/i,
    ];
    
    for (const pattern of pricePatterns) {
      const match = html.match(pattern);
      if (match) {
        price = parseFloat(match[1].replace(/[^0-9.]/g, ''));
        if (price > 0 && price < 100000) { // Sanity check
          break;
        }
      }
    }
  }

  // Extract brand
  const brand = ogBrand || extractBrandFromText(html, title);

  // Infer category
  const category = inferCategory(baseUrl, title, description);

  // Extract color
  const color = extractColor(html, title, description);

  // Extract size
  const size = extractSize(html);

  return {
    images: images.slice(0, 5),
    title,
    description,
    price,
    brand,
    category,
    color,
    size,
    metadata: {
      url: baseUrl,
      extracted: true,
      hasOpenGraph: !!ogTitle,
    },
  };
}

/**
 * Extract JSON-LD structured data (used by many modern e-commerce sites)
 */
function extractJsonLd(html: string): any {
  try {
    // Find all JSON-LD script tags
    const jsonLdRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    const jsonLdBlocks: any[] = [];
    
    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const jsonData = JSON.parse(match[1]);
        jsonLdBlocks.push(jsonData);
      } catch (e) {
        // Skip invalid JSON
      }
    }
    
    // Look for Product schema
    for (const block of jsonLdBlocks) {
      // Handle both single objects and arrays
      const items = Array.isArray(block) ? block : [block];
      for (const item of items) {
        if (item['@type'] === 'Product' || item['@type'] === 'http://schema.org/Product') {
          return item;
        }
      }
    }
    
    // If no Product schema, return first valid JSON-LD
    return jsonLdBlocks[0] || null;
  } catch (error) {
    return null;
  }
}

/**
 * Extract meta tag content
 */
function extractMetaTag(html: string, attribute: string): string | null {
  const regex = new RegExp(`<meta[^>]+${attribute}[^>]+content=["']([^"']+)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Resolve relative URL to absolute
 */
function resolveUrl(url: string, baseUrl: string): string {
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

/**
 * Extract brand from text
 */
function extractBrandFromText(html: string, title: string | null): string | null {
  const text = `${html} ${title || ''}`.toLowerCase();
  
  // Common brand patterns
  const brandPatterns = [
    /brand[:\s]*["']?([^"'\s<]+)/i,
    /by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    /manufacturer[:\s]*["']?([^"'\s<]+)/i,
  ];

  for (const pattern of brandPatterns) {
    const match = text.match(pattern);
    if (match && match[1].length < 50) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * Infer clothing category
 */
function inferCategory(url: string, title: string | null, description: string | null): string | null {
  const text = `${url} ${title || ''} ${description || ''}`.toLowerCase();
  
  const categoryKeywords: Record<string, string[]> = {
    tops: ['shirt', 'top', 'blouse', 't-shirt', 'tee', 'sweater', 'hoodie', 'tank', 'crop', 'bra', 'sports bra', 'jogger'],
    bottoms: ['pants', 'jeans', 'trousers', 'shorts', 'skirt', 'leggings', 'tights', 'joggers', 'sweatpants'],
    shoes: ['shoe', 'sneaker', 'boot', 'sandal', 'heel', 'slipper', 'sneakers', 'trainer'],
    outerwear: ['coat', 'jacket', 'parka', 'blazer', 'cardigan', 'vest', 'windbreaker'],
    accessories: ['bag', 'hat', 'belt', 'watch', 'jewelry', 'scarf', 'gloves', 'headband', 'socks'],
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
  const text = `${html} ${title || ''} ${description || ''}`.toLowerCase();
  
  const colors = ['black', 'white', 'gray', 'grey', 'navy', 'blue', 'red', 'green', 
    'yellow', 'orange', 'pink', 'purple', 'brown', 'beige', 'multicolor', 'multi-color',
    'burgundy', 'maroon', 'teal', 'cyan', 'lime', 'olive', 'tan', 'khaki'];
  
  // Also check for color in meta tags or JSON-LD
  const colorMeta = extractMetaTag(html, 'property="product:color"') || 
                    extractMetaTag(html, 'name="color"');
  if (colorMeta) {
    const normalized = colorMeta.toLowerCase();
    for (const color of colors) {
      if (normalized.includes(color)) {
        if (color === 'grey') return 'gray';
        if (color === 'multi-color') return 'multicolor';
        return color;
      }
    }
  }
  
  for (const color of colors) {
    if (text.includes(` ${color} `) || text.includes(`-${color}-`) || text.endsWith(` ${color}`)) {
      // Normalize
      if (color === 'grey') return 'gray';
      if (color === 'multi-color') return 'multicolor';
      return color;
    }
  }

  return null;
}

/**
 * Extract size information
 */
function extractSize(html: string): string | null {
  const sizePatterns = [
    /size[:\s]*([XS|S|M|L|XL|XXL|XXXL|\d]+)/i,
    /([XS|S|M|L|XL|XXL|XXXL]+)/,
    /(\d+)\s*(?:US|EU|UK)?\s*size/i,
    /"size"[:\s]*"([^"]+)"/i,
  ];

  for (const pattern of sizePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}

export default router;

