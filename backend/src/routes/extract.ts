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
      // Enhanced headers for better compatibility with various sites
      const headers: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
      };

      const response = await fetch(url, {
        headers,
        signal: controller.signal,
        redirect: 'follow',
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
  // Support various lazy-loading attributes
  const imgRegex = /<img[^>]+(?:src|data-src|data-lazy-src|data-original|data-srcset|srcset|data-image|data-product-image)=["']([^"']+)["'][^>]*>/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null && images.length < 10) {
    let src = imgMatch[1];
    // Handle srcset (take first/largest URL)
    if (src.includes(',')) {
      const srcsetParts = src.split(',');
      // Take the largest size (usually last or has size descriptor)
      src = srcsetParts[srcsetParts.length - 1].trim().split(' ')[0];
    }
    if (src && !src.startsWith('data:') && !images.includes(src)) {
      const absoluteUrl = resolveUrl(src, baseUrl);
      // Filter out small icons/logos, but include product images
      // More lenient filtering for various site structures
      const excludePatterns = ['icon', 'logo', 'avatar', 'favicon', 'badge', 'button', 'arrow'];
      const includePatterns = ['product', 'item', 'image', 'photo', 'picture', 'gallery'];
      const isExcluded = excludePatterns.some(pattern => src.toLowerCase().includes(pattern));
      const isIncluded = includePatterns.some(pattern => src.toLowerCase().includes(pattern)) ||
                        src.match(/\.(jpg|jpeg|png|webp|gif)/i);
      
      if (!isExcluded && isIncluded) {
        images.push(absoluteUrl);
      }
    }
  }
  
  // Also check for background-image in CSS (some sites use this)
  const bgImageRegex = /background-image[^:]*:\s*url\(["']?([^"')]+)["']?\)/gi;
  let bgMatch;
  while ((bgMatch = bgImageRegex.exec(html)) !== null && images.length < 10) {
    const src = bgMatch[1];
    if (src && !src.startsWith('data:') && !images.includes(src) && 
        (src.includes('product') || src.includes('item') || src.match(/\.(jpg|jpeg|png|webp)/i))) {
      images.push(resolveUrl(src, baseUrl));
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

  // Extract price - comprehensive extraction
  let price: number | null = null;
  if (ogPrice) {
    // Handle both string and number prices
    if (typeof ogPrice === 'number') {
      price = ogPrice;
    } else {
      price = parseFloat(ogPrice.toString().replace(/[^0-9.]/g, ''));
    }
  } else {
    // Try comprehensive price patterns for various sites
    const pricePatterns = [
      // Standard currency patterns
      /[\$£€¥]\s*(\d+\.?\d*)/,
      /price[:\s]*[\$£€¥]?\s*(\d+\.?\d*)/i,
      /(\d+\.?\d*)\s*[\$£€¥]/,
      // JSON patterns
      /"price"[:\s]*"([^"]+)"/i,
      /"price"[:\s]*(\d+\.?\d*)/i,
      /priceAmount["\s:]+(\d+\.?\d*)/i,
      /"amount"[:\s]*(\d+\.?\d*)/i,
      // Amazon-style
      /a-price-whole[^>]*>(\d+)/i,
      /a-price-fraction[^>]*>(\d+)/i,
      // Shopify-style
      /product-price[^>]*>[\$£€¥]?\s*(\d+\.?\d*)/i,
      /price[^>]*class[^>]*>[\$£€¥]?\s*(\d+\.?\d*)/i,
      // Generic patterns
      /class="[^"]*price[^"]*"[^>]*>[\$£€¥]?\s*(\d+\.?\d*)/i,
      /data-price[=:]\s*["']?(\d+\.?\d*)/i,
      /priceValue[=:]\s*["']?(\d+\.?\d*)/i,
    ];
    
    for (const pattern of pricePatterns) {
      const match = html.match(pattern);
      if (match) {
        const extractedPrice = parseFloat(match[1].replace(/[^0-9.]/g, ''));
        if (extractedPrice > 0 && extractedPrice < 100000) { // Sanity check
          price = extractedPrice;
          break;
        }
      }
    }
    
    // Try to find price in JSON-LD offers
    if (!price && jsonLdData?.offers) {
      const offers = Array.isArray(jsonLdData.offers) ? jsonLdData.offers : [jsonLdData.offers];
      for (const offer of offers) {
        if (offer.price) {
          const offerPrice = typeof offer.price === 'number' ? offer.price : parseFloat(offer.price.toString().replace(/[^0-9.]/g, ''));
          if (offerPrice > 0 && offerPrice < 100000) {
            price = offerPrice;
            break;
          }
        }
      }
    }
  }

  // Extract brand - try multiple methods
  const brand = ogBrand || 
                extractBrandFromText(html, title) ||
                extractBrandFromDomain(baseUrl) ||
                extractBrandFromJsonLd(jsonLdData);

  // Infer category - try JSON-LD first, then fallback to keyword matching
  const category = extractCategoryFromJsonLd(jsonLdData) ||
                    inferCategory(baseUrl, title, description);

  // Extract color
  const color = extractColor(html, title, description);

  // Extract size
  const size = extractSize(html);

  // Deduplicate images
  const uniqueImages = Array.from(new Set(images)).slice(0, 5);

  return {
    images: uniqueImages,
    title: title || null,
    description: description || null,
    price,
    brand: brand || null,
    category: category || null,
    color: color || null,
    size: size || null,
    metadata: {
      url: baseUrl,
      extracted: true,
      hasOpenGraph: !!ogTitle,
      hasJsonLd: !!jsonLdData,
      imageCount: uniqueImages.length,
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
    
    // Look for Product schema (most common)
    for (const block of jsonLdBlocks) {
      // Handle both single objects and arrays
      const items = Array.isArray(block) ? block : [block];
      for (const item of items) {
        const itemType = item['@type'];
        if (itemType === 'Product' || 
            itemType === 'http://schema.org/Product' ||
            itemType === 'https://schema.org/Product') {
          return item;
        }
      }
    }
    
    // Also check for ItemList with products (some sites use this)
    for (const block of jsonLdBlocks) {
      const items = Array.isArray(block) ? block : [block];
      for (const item of items) {
        if (item['@type'] === 'ItemList' && item.itemListElement && item.itemListElement.length > 0) {
          // Return first product in list
          const firstItem = item.itemListElement[0];
          if (firstItem.item && firstItem.item['@type'] === 'Product') {
            return firstItem.item;
          }
        }
      }
    }
    
    // If no Product schema, return first valid JSON-LD that might have useful data
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
 * Extract brand from domain name (e.g., gymshark.com -> Gymshark)
 */
function extractBrandFromDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Remove www. and common TLDs
    let domain = hostname.replace(/^www\./, '').split('.')[0];
    
    // Capitalize first letter
    if (domain && domain.length > 1) {
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Extract brand from JSON-LD
 */
function extractBrandFromJsonLd(jsonLdData: any): string | null {
  if (!jsonLdData) return null;
  
  // Try various brand fields
  if (jsonLdData.brand) {
    if (typeof jsonLdData.brand === 'string') {
      return jsonLdData.brand;
    }
    if (jsonLdData.brand.name) {
      return jsonLdData.brand.name;
    }
  }
  
  if (jsonLdData.manufacturer?.name) {
    return jsonLdData.manufacturer.name;
  }
  
  return null;
}

/**
 * Extract brand from text
 */
function extractBrandFromText(html: string, title: string | null): string | null {
  const text = `${html} ${title || ''}`;
  
  // Common brand patterns
  const brandPatterns = [
    /brand[:\s]*["']?([^"'\s<]+)/i,
    /by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    /manufacturer[:\s]*["']?([^"'\s<]+)/i,
    /itemprop=["']brand["'][^>]*content=["']([^"']+)["']/i,
    /"brand"[:\s]*"([^"]+)"/i,
  ];

  for (const pattern of brandPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length < 50 && match[1].length > 1) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * Extract category from JSON-LD
 */
function extractCategoryFromJsonLd(jsonLdData: any): string | null {
  if (!jsonLdData) return null;
  
  // Check for category in various JSON-LD fields
  const category = jsonLdData.category || 
                   jsonLdData.productCategory ||
                   jsonLdData['@type'];
  
  if (category) {
    const catStr = typeof category === 'string' ? category.toLowerCase() : 
                   (category.name || '').toLowerCase();
    
    // Map common category names to our categories
    if (catStr.includes('top') || catStr.includes('shirt') || catStr.includes('blouse')) return 'tops';
    if (catStr.includes('bottom') || catStr.includes('pant') || catStr.includes('trouser')) return 'bottoms';
    if (catStr.includes('shoe') || catStr.includes('footwear')) return 'shoes';
    if (catStr.includes('outerwear') || catStr.includes('jacket') || catStr.includes('coat')) return 'outerwear';
    if (catStr.includes('accessor')) return 'accessories';
  }
  
  return null;
}

/**
 * Infer clothing category
 */
function inferCategory(url: string, title: string | null, description: string | null): string | null {
  const text = `${url} ${title || ''} ${description || ''}`.toLowerCase();
  
  const categoryKeywords: Record<string, string[]> = {
    tops: [
      'shirt', 'top', 'blouse', 't-shirt', 'tee', 'sweater', 'hoodie', 'tank', 'crop', 
      'bra', 'sports bra', 'jogger', 'polo', 'henley', 'turtleneck', 'sweatshirt',
      'long sleeve', 'short sleeve', 'tank top', 'crop top', 'bodysuit', 'camisole',
      'blazer', 'cardigan', 'pullover', 'crewneck', 'v-neck', 'tunic'
    ],
    bottoms: [
      'pants', 'jeans', 'trousers', 'shorts', 'skirt', 'leggings', 'tights', 'joggers', 
      'sweatpants', 'chinos', 'cargo', 'capri', 'culottes', 'palazzo', 'wide leg',
      'straight leg', 'skinny', 'bootcut', 'flare', 'cropped pants'
    ],
    shoes: [
      'shoe', 'sneaker', 'boot', 'sandal', 'heel', 'slipper', 'sneakers', 'trainer',
      'running shoe', 'athletic shoe', 'dress shoe', 'loafer', 'oxford', 'moccasin',
      'flats', 'pumps', 'stilettos', 'wedges', 'espadrilles', 'mules', 'clogs'
    ],
    outerwear: [
      'coat', 'jacket', 'parka', 'blazer', 'cardigan', 'vest', 'windbreaker',
      'bomber', 'denim jacket', 'leather jacket', 'trench', 'peacoat', 'puffer',
      'fleece', 'hoodie', 'sweatshirt', 'pullover', 'zip-up', 'anorak'
    ],
    accessories: [
      'bag', 'hat', 'belt', 'watch', 'jewelry', 'scarf', 'gloves', 'headband', 
      'socks', 'sunglasses', 'wallet', 'backpack', 'purse', 'tote', 'clutch',
      'necklace', 'bracelet', 'earrings', 'ring', 'tie', 'bow tie', 'cufflinks'
    ],
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
    // Standard size patterns
    /size[:\s]*([XS|S|M|L|XL|XXL|XXXL|\d]+)/i,
    /([XS|S|M|L|XL|XXL|XXXL]+)/,
    /(\d+)\s*(?:US|EU|UK)?\s*size/i,
    // JSON patterns
    /"size"[:\s]*"([^"]+)"/i,
    /"size"[:\s]*(\d+)/i,
    // HTML attribute patterns
    /data-size[=:]\s*["']?([^"'\s]+)/i,
    /itemprop=["']size["'][^>]*content=["']([^"']+)["']/i,
    // Common e-commerce patterns
    /selected[^>]*size[^>]*>([XS|S|M|L|XL|XXL|\d]+)/i,
    /size-option[^>]*selected[^>]*>([XS|S|M|L|XL|XXL|\d]+)/i,
  ];

  for (const pattern of sizePatterns) {
    const match = html.match(pattern);
    if (match && match[1] && match[1].trim().length < 10) {
      return match[1].trim();
    }
  }

  return null;
}

export default router;

