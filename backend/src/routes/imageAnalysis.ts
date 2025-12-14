/**
 * Image Analysis routes
 * Server-side image analysis using vision APIs
 */

import { Router, Request, Response } from 'express';
import { analyzeClothingImage } from '../services/imageAnalysis';

const router = Router();

/**
 * POST /api/image-analysis/analyze
 * Analyze a clothing image and extract attributes
 * 
 * Body: { imageBase64: string }
 * Returns: { category, color, brand, season, tags, confidence }
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const result = await analyzeClothingImage(base64Data);

    res.json(result);
  } catch (error: any) {
    console.error('Image analysis error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to analyze image' 
    });
  }
});

export default router;

