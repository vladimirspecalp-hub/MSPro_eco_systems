/**
 * GEO API Routes — определение и работа с регионами
 * @module server/routes/geo-api
 */

import { Router } from 'express';
import {
  resolveGeoContext,
  getAllRegions,
  getRegionByCode,
  GEO_REGIONS,
  type GeoContext,
  type GeoRegion,
} from '../middleware/geo-context';

const router = Router();

/**
 * GET /api/geo/context
 * Получить текущий GEO-контекст запроса
 * 
 * Определение региона по приоритету:
 * 1. Query: ?region=spb
 * 2. Header: X-Geo-Region: spb
 * 3. Subdomain: spb.mspro.ru
 * 4. Default: moscow
 * 
 * @example
 * GET /api/geo/context
 * GET /api/geo/context?region=spb
 */
router.get('/context', (req, res) => {
  try {
    const context = resolveGeoContext(req);

    res.json({
      region: context.region,
      source: context.source,
      rawValue: context.rawValue,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/geo/regions
 * Получить список всех доступных регионов
 * 
 * Query params:
 * - priority: фильтр по приоритету (high/medium/low)
 * 
 * @example
 * GET /api/geo/regions
 * GET /api/geo/regions?priority=high
 */
router.get('/regions', (req, res) => {
  try {
    let regions = getAllRegions();

    const priority = req.query.priority as 'high' | 'medium' | 'low' | undefined;
    if (priority) {
      regions = regions.filter(r => r.priority === priority);
    }

    res.json({
      count: regions.length,
      regions,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/geo/region/:code
 * Получить данные региона по коду
 * 
 * @example
 * GET /api/geo/region/spb
 * GET /api/geo/region/ekb
 */
router.get('/region/:code', (req, res) => {
  try {
    const { code } = req.params;
    const region = GEO_REGIONS[code.toLowerCase()];

    if (!region) {
      return res.status(404).json({
        error: 'Region not found',
        code,
        available: Object.keys(GEO_REGIONS).filter((k, i, arr) => arr.indexOf(k) === i),
      });
    }

    res.json(region);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/geo/localize
 * Получить локализованный контент для региона
 * 
 * Query params:
 * - region: код региона (опционально, использует контекст)
 * 
 * @example
 * GET /api/geo/localize?region=spb
 */
router.get('/localize', (req, res) => {
  try {
    const regionCode = req.query.region as string | undefined;
    const context = resolveGeoContext(req);
    const region = regionCode ? getRegionByCode(regionCode) : context.region;

    const localized = {
      region: region,
      cta: {
        phone: getRegionalPhone(region.code),
        text: `Заказать в ${region.nameGenitive}`,
        urgentText: `Срочный выезд в ${region.nameGenitive}`,
      },
      content: {
        serviceArea: `${region.name} и область`,
        headline: `Промышленный альпинизм в ${region.nameGenitive}`,
        subheadline: `Покраска труб и антикоррозийная защита в ${region.nameGenitive}`,
      },
      meta: {
        title: `Промышленный альпинизм ${region.name} | MS-PRO`,
        description: `Покраска труб и антикоррозийная защита в ${region.nameGenitive}. Гарантия 20 лет. MSPRO Quad.`,
      },
    };

    res.json(localized);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Возвращает региональный телефон
 * @param regionCode - Код региона
 * @returns Телефон для региона
 */
function getRegionalPhone(regionCode: string): string {
  const phones: Record<string, string> = {
    msk: '+7 (495) 123-45-67',
    spb: '+7 (812) 123-45-67',
    ekb: '+7 (343) 123-45-67',
    nsk: '+7 (383) 123-45-67',
    kazan: '+7 (843) 123-45-67',
  };

  return phones[regionCode] || '+7 (987) 909-29-38';
}

export default router;
