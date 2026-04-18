import { Router } from 'express';
import { cache } from '../lib/redis';

export const stylesRouter = Router();

// Statik stil listesi (DB'ye taşınabilir)
const STYLES = [
  {
    id: 'cinematic-luxury',
    name: 'Cinematic Luxury',
    category: 'cinematic',
    description: 'Ultra-sinematik 4K çekim, lüks ürünler için ideal',
    bestFor: ['jewelry', 'watch', 'perfume', 'luxury-bag'],
    isPremium: false,
    parameters: { duration: 5, fps: 24, aspectRatio: '9:16', motionStrength: 0.6 },
    successRate: 0.92,
    avgQualityScore: 8.4,
  },
  {
    id: 'cinematic-orbit',
    name: 'Cinematic Orbit',
    category: 'cinematic',
    description: '360 derece sinematik döngü',
    bestFor: ['shoe', 'sneaker', 'electronics'],
    isPremium: false,
    parameters: { duration: 5, fps: 24, aspectRatio: '9:16', motionStrength: 0.7 },
    successRate: 0.88,
    avgQualityScore: 8.1,
  },
  {
    id: 'cinematic-reveal',
    name: 'Cinematic Reveal',
    category: 'cinematic',
    description: 'Dramatik slow reveal, parfüm ve kozmetik için',
    bestFor: ['perfume', 'cosmetics', 'premium-packaging'],
    isPremium: false,
    parameters: { duration: 5, fps: 24, aspectRatio: '9:16', motionStrength: 0.5 },
    successRate: 0.90,
    avgQualityScore: 8.6,
  },
  {
    id: 'viral-satisfying',
    name: 'Viral Satisfying',
    category: 'viral',
    description: 'Rahatlatıcı ASMR tarzı, social media için',
    bestFor: ['any-product', 'gadget', 'food', 'cosmetics'],
    isPremium: false,
    parameters: { duration: 4, fps: 30, aspectRatio: '9:16', motionStrength: 0.8 },
    successRate: 0.85,
    avgQualityScore: 7.8,
  },
  {
    id: 'viral-transition',
    name: 'Viral Transition',
    category: 'viral',
    description: 'Dinamik geçiş efekti, TikTok/Reels için',
    bestFor: ['clothing', 'accessories'],
    isPremium: false,
    parameters: { duration: 3, fps: 30, aspectRatio: '9:16', motionStrength: 0.9 },
    successRate: 0.82,
    avgQualityScore: 7.5,
  },
  {
    id: 'minimalist-clean',
    name: 'Minimalist Clean',
    category: 'minimalist',
    description: 'Apple tarzı minimalist, beyaz arka plan',
    bestFor: ['tech', 'skincare', 'stationery'],
    isPremium: false,
    parameters: { duration: 4, fps: 24, aspectRatio: '9:16', motionStrength: 0.3 },
    successRate: 0.94,
    avgQualityScore: 8.8,
  },
  {
    id: 'luxury-liquid',
    name: 'Luxury Liquid Gold',
    category: 'luxury',
    description: 'Altın sıvı efektli ultra lüks',
    bestFor: ['perfume', 'skincare', 'premium-beverage'],
    isPremium: true, // Pro+ gerektirir
    parameters: { duration: 5, fps: 24, aspectRatio: '9:16', motionStrength: 0.6 },
    successRate: 0.86,
    avgQualityScore: 8.5,
  },
  {
    id: 'dynamic-action',
    name: 'Dynamic Action',
    category: 'dynamic',
    description: 'Yüksek enerji, spor ürünleri için',
    bestFor: ['sportswear', 'sneaker', 'outdoor-gear', 'energy-drink'],
    isPremium: false,
    parameters: { duration: 4, fps: 30, aspectRatio: '9:16', motionStrength: 0.9 },
    successRate: 0.83,
    avgQualityScore: 7.9,
  },
  {
    id: 'nature-botanical',
    name: 'Nature Botanical',
    category: 'nature',
    description: 'Doğal bitkiler arasında organik atmosfer',
    bestFor: ['organic-product', 'skincare', 'tea', 'essential-oil'],
    isPremium: false,
    parameters: { duration: 5, fps: 24, aspectRatio: '9:16', motionStrength: 0.4 },
    successRate: 0.88,
    avgQualityScore: 8.1,
  },
  {
    id: 'tech-hologram',
    name: 'Tech Hologram',
    category: 'tech',
    description: 'Fütüristik holografik, teknoloji ürünleri için',
    bestFor: ['phone', 'laptop', 'smart-device', 'wearable'],
    isPremium: true,
    parameters: { duration: 5, fps: 24, aspectRatio: '9:16', motionStrength: 0.7 },
    successRate: 0.81,
    avgQualityScore: 7.9,
  },
];

// GET /styles
stylesRouter.get('/', async (_req, res, next) => {
  try {
    const cached = await cache.get('styles:all');
    if (cached) return res.json({ success: true, data: cached });

    await cache.set('styles:all', STYLES, 3600);
    return res.json({ success: true, data: STYLES });
  } catch (error) { next(error); }
});

// GET /styles/:id
stylesRouter.get('/:id', async (req, res, next) => {
  try {
    const style = STYLES.find((s) => s.id === req.params['id']);
    if (!style) {
      res.status(404).json({ success: false, error: { code: 1002, type: 'NOT_FOUND', message: 'Stil bulunamadı.', retryable: false, requestId: 'unknown' } });
      return;
    }
    res.json({ success: true, data: style });
  } catch (error) { next(error); }
});
