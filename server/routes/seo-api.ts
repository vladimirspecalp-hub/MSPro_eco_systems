/**
 * SEO API Routes — живые эндпоинты для работы с SEO данными
 * @module server/routes/seo-api
 */

import { Router } from 'express';
import {
  getPages,
  getPageBySlug,
  searchPages,
  getSEOStats,
  getRelatedPages,
  invalidateSEOCache,
} from '../services/seo-service';

const router = Router();

/**
 * GET /api/seo/pages
 * Получить список страниц с пагинацией
 * 
 * Query params:
 * - page: номер страницы (default: 1)
 * - limit: записей на страницу (default: 20, max: 100)
 * - region: фильтр по региону
 * 
 * @example
 * GET /api/seo/pages?page=1&limit=20&region=Москва
 */
router.get('/pages', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const region = req.query.region as string | undefined;

    const result = await getPages(page, limit, region);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/seo/page/:slug
 * Получить SEO данные страницы по slug
 * 
 * @example
 * GET /api/seo/page/pokraska-dymovoj-truby
 */
router.get('/page/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const entry = await getPageBySlug(slug);

    if (!entry) {
      return res.status(404).json({
        error: 'Page not found',
        slug,
      });
    }

    res.json(entry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/seo/search
 * Поиск страниц по keywords, title, description
 * 
 * Query params:
 * - q: поисковый запрос (обязательный)
 * - limit: максимум результатов (default: 20)
 * 
 * @example
 * GET /api/seo/search?q=покраска&limit=10
 */
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Query parameter "q" is required'
      });
    }

    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const results = await searchPages(query.trim(), limit);

    res.json({
      query,
      count: results.length,
      results,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/seo/stats
 * Получить статистику по SEO данным
 * 
 * @example
 * GET /api/seo/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await getSEOStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/seo/related/:slug
 * Получить связанные страницы по keywords
 * 
 * @example
 * GET /api/seo/related/pokraska-dymovoj-truby?limit=6
 */
router.get('/related/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit as string) || 6));

    const related = await getRelatedPages(slug, limit);

    res.json({
      slug,
      count: related.length,
      related,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/seo/cache/invalidate
 * Инвалидировать кэш SEO данных
 * 
 * @example
 * POST /api/seo/cache/invalidate
 */
router.post('/cache/invalidate', (req, res) => {
  try {
    invalidateSEOCache();
    res.json({ success: true, message: 'SEO cache invalidated' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
