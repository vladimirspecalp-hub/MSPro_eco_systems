/**
 * GEO Context Middleware — определение региона пользователя
 * @module server/middleware/geo-context
 * 
 * Приоритет определения региона:
 * 1. Query параметр: ?region=spb
 * 2. Кастомный заголовок: X-Geo-Region
 * 3. Поддомен: spb.mspro.ru (подготовка к будущему)
 * 4. Default: moscow
 */

import { Request, Response, NextFunction } from 'express';
import { PRIORITY_REGIONS } from '../../shared/data/geo-data';

/**
 * Данные региона
 */
export interface GeoRegion {
  code: string;
  name: string;
  nameGenitive: string;
  timezone: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Контекст GEO для запроса
 */
export interface GeoContext {
  region: GeoRegion;
  source: 'query' | 'header' | 'subdomain' | 'default';
  rawValue: string | null;
}

/**
 * Реестр регионов
 */
export const GEO_REGIONS: Record<string, GeoRegion> = {
  msk: {
    code: 'msk',
    name: 'Москва',
    nameGenitive: 'Москве',
    timezone: 'Europe/Moscow',
    priority: 'high',
  },
  moscow: {
    code: 'msk',
    name: 'Москва',
    nameGenitive: 'Москве',
    timezone: 'Europe/Moscow',
    priority: 'high',
  },
  spb: {
    code: 'spb',
    name: 'Санкт-Петербург',
    nameGenitive: 'Санкт-Петербурге',
    timezone: 'Europe/Moscow',
    priority: 'high',
  },
  ekb: {
    code: 'ekb',
    name: 'Екатеринбург',
    nameGenitive: 'Екатеринбурге',
    timezone: 'Asia/Yekaterinburg',
    priority: 'high',
  },
  nsk: {
    code: 'nsk',
    name: 'Новосибирск',
    nameGenitive: 'Новосибирске',
    timezone: 'Asia/Novosibirsk',
    priority: 'high',
  },
  kazan: {
    code: 'kazan',
    name: 'Казань',
    nameGenitive: 'Казани',
    timezone: 'Europe/Moscow',
    priority: 'high',
  },
  chelyabinsk: {
    code: 'chelyabinsk',
    name: 'Челябинск',
    nameGenitive: 'Челябинске',
    timezone: 'Asia/Yekaterinburg',
    priority: 'high',
  },
  samara: {
    code: 'samara',
    name: 'Самара',
    nameGenitive: 'Самаре',
    timezone: 'Europe/Samara',
    priority: 'medium',
  },
  nn: {
    code: 'nn',
    name: 'Нижний Новгород',
    nameGenitive: 'Нижнем Новгороде',
    timezone: 'Europe/Moscow',
    priority: 'medium',
  },
  krasnodar: {
    code: 'krasnodar',
    name: 'Краснодар',
    nameGenitive: 'Краснодаре',
    timezone: 'Europe/Moscow',
    priority: 'medium',
  },
  rostov: {
    code: 'rostov',
    name: 'Ростов-на-Дону',
    nameGenitive: 'Ростове-на-Дону',
    timezone: 'Europe/Moscow',
    priority: 'medium',
  },
  ufa: {
    code: 'ufa',
    name: 'Уфа',
    nameGenitive: 'Уфе',
    timezone: 'Asia/Yekaterinburg',
    priority: 'medium',
  },
  perm: {
    code: 'perm',
    name: 'Пермь',
    nameGenitive: 'Перми',
    timezone: 'Asia/Yekaterinburg',
    priority: 'medium',
  },
  voronezh: {
    code: 'voronezh',
    name: 'Воронеж',
    nameGenitive: 'Воронеже',
    timezone: 'Europe/Moscow',
    priority: 'medium',
  },
  krasnoyarsk: {
    code: 'krasnoyarsk',
    name: 'Красноярск',
    nameGenitive: 'Красноярске',
    timezone: 'Asia/Krasnoyarsk',
    priority: 'medium',
  },
  omsk: {
    code: 'omsk',
    name: 'Омск',
    nameGenitive: 'Омске',
    timezone: 'Asia/Omsk',
    priority: 'medium',
  },
  tyumen: {
    code: 'tyumen',
    name: 'Тюмень',
    nameGenitive: 'Тюмени',
    timezone: 'Asia/Yekaterinburg',
    priority: 'medium',
  },
  volgograd: {
    code: 'volgograd',
    name: 'Волгоград',
    nameGenitive: 'Волгограде',
    timezone: 'Europe/Volgograd',
    priority: 'low',
  },
};

/**
 * Регион по умолчанию
 */
export const DEFAULT_REGION: GeoRegion = GEO_REGIONS.msk;

/**
 * Извлекает поддомен из хоста
 * @param host - Хост запроса (например, spb.mspro.ru)
 * @returns Поддомен или null
 */
function extractSubdomain(host: string | undefined): string | null {
  if (!host) return null;

  const cleanHost = host.split(':')[0];
  const parts = cleanHost.split('.');

  if (parts.length >= 3 && parts[0] !== 'www') {
    return parts[0].toLowerCase();
  }

  return null;
}

/**
 * Определяет регион из различных источников
 * @param req - Express Request
 * @returns GeoContext с определённым регионом
 */
export function resolveGeoContext(req: Request): GeoContext {
  const queryRegion = req.query.region as string | undefined;
  if (queryRegion) {
    const region = GEO_REGIONS[queryRegion.toLowerCase()];
    if (region) {
      return { region, source: 'query', rawValue: queryRegion };
    }

    // Fallback: Try to find by slug in PRIORITY_REGIONS
    const priorityRegion = PRIORITY_REGIONS.find(r => r.slug === queryRegion.toLowerCase());
    if (priorityRegion) {
      // Find matching server region by name
      const serverRegion = Object.values(GEO_REGIONS).find(r => r.name === priorityRegion.name);
      if (serverRegion) {
        return { region: serverRegion, source: 'query', rawValue: queryRegion };
      }
    }
  }

  const headerRegion = req.headers['x-geo-region'] as string | undefined;
  if (headerRegion) {
    const region = GEO_REGIONS[headerRegion.toLowerCase()];
    if (region) {
      return { region, source: 'header', rawValue: headerRegion };
    }
  }

  const subdomain = extractSubdomain(req.headers.host);
  if (subdomain) {
    const region = GEO_REGIONS[subdomain];
    if (region) {
      return { region, source: 'subdomain', rawValue: subdomain };
    }
  }

  return { region: DEFAULT_REGION, source: 'default', rawValue: null };
}

declare global {
  namespace Express {
    interface Request {
      geoContext?: GeoContext;
    }
  }
}

/**
 * Middleware для добавления GEO контекста в запрос
 * @param req - Express Request
 * @param res - Express Response
 * @param next - Next function
 */
export function geoContextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  req.geoContext = resolveGeoContext(req);
  next();
}

/**
 * Получает список всех доступных регионов
 * @returns Массив регионов
 */
export function getAllRegions(): GeoRegion[] {
  const uniqueRegions = new Map<string, GeoRegion>();

  for (const region of Object.values(GEO_REGIONS)) {
    if (!uniqueRegions.has(region.code)) {
      uniqueRegions.set(region.code, region);
    }
  }

  return Array.from(uniqueRegions.values());
}

/**
 * Получает регион по коду
 * @param code - Код региона
 * @returns Регион или default
 */
export function getRegionByCode(code: string): GeoRegion {
  return GEO_REGIONS[code.toLowerCase()] || DEFAULT_REGION;
}
