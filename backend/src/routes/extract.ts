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
  // Extract Open Graph meta tags using regex (no DOM parser needed)
  const ogTitle = extractMetaTag(html, 'property="og:title"') || 
                  extractMetaTag(html, 'name="og:title"');
  const ogDescription = extractMetaTag(html, 'property="og:description"') || 
                        extractMetaTag(html, 'name="description"');
  const ogImage = extractMetaTag(html, 'property="og:image"') || 
                  extractMetaTag(html, 'name="og:image"');
  const ogPrice = extractMetaTag(html, 'property="product:price:amount"') || 
                  extractMetaTag(html, 'property="product:price"');
  const ogBrand = extractMetaTag(html, 'property="product:brand"') || 
                  extractMetaTag(html, 'itemprop="brand"');

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

  // Find product images in HTML
  const imgRegex = /<img[^>]+(?:src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null && images.length < 5) {
    const src = imgMatch[1];
    if (src && !src.startsWith('data:') && !images.includes(src)) {
      const absoluteUrl = resolveUrl(src, baseUrl);
      // Filter out small icons/logos
      if (!src.includes('icon') && !src.includes('logo') && !src.includes('avatar')) {
        images.push(absoluteUrl);
      }
    }
  }

  // Extract price
  let price: number | null = null;
  if (ogPrice) {
    price = parseFloat(ogPrice.replace(/[^0-9.]/g, ''));
  } else {
    // Try common price patterns
    const pricePatterns = [
      /[\$£€¥]\s*(\d+\.?\d*)/,
      /price[:\s]*[\$£€¥]?\s*(\d+\.?\d*)/i,
      /(\d+\.?\d*)\s*[\$£€¥]/,
      /"price"[:\s]*"([^"]+)"/i,
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
    tops: ['shirt', 'top', 'blouse', 't-shirt', 'tee', 'sweater', 'hoodie', 'tank'],
    bottoms: ['pants', 'jeans', 'trousers', 'shorts', 'skirt', 'leggings', 'tights'],
    shoes: ['shoe', 'sneaker', 'boot', 'sandal', 'heel', 'slipper', 'sneakers'],
    outerwear: ['coat', 'jacket', 'parka', 'blazer', 'cardigan', 'vest'],
    accessories: ['bag', 'hat', 'belt', 'watch', 'jewelry', 'scarf', 'gloves'],
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
  
  const colors = ['black', 'white', 'gray', 'grey', 'navy', 'blue', 'red', 'green', 
    'yellow', 'orange', 'pink', 'purple', 'brown', 'beige', 'multicolor', 'multi-color'];
  
  for (const color of colors) {
    if (text.includes(color)) {
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

