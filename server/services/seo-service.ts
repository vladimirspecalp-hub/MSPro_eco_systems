/**
 * SEO Service — работа с SEO данными из JSON-файлов
 * @module server/services/seo-service
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Структура SEO-записи страницы
 */
export interface SEOEntry {
  slug: string;
  title: string;
  description: string;
  cta: string;
  region?: string;
  keywords?: string[];
  h1?: string;
  h2?: string;
  faq?: Array<{ question: string; answer: string }>;
  slug_autogen?: string;
}

/**
 * Результат пагинированного запроса
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Кэш SEO данных в памяти
 */
let seoCache: SEOEntry[] | null = null;
let seoMap: Map<string, SEOEntry> | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

/**
 * Загружает все SEO данные из JSON-файлов
 * @returns Массив SEO-записей
 * @throws Error если файлы не найдены
 */
export function loadAllSEOData(): SEOEntry[] {
  const now = Date.now();
  
  if (seoCache && (now - cacheTimestamp) < CACHE_TTL) {
    return seoCache;
  }

  const contentDir = resolve(process.cwd(), 'content');
  const files = [
    'seo_core.json',
    'seo_core_part2.json',
    'seo_core_part3.json',
    'seo_core_part4.json',
    'seo_core_part5.json',
    'seo_dynamic.json',
  ];

  const allData: SEOEntry[] = [];

  for (const file of files) {
    try {
      const filePath = resolve(contentDir, file);
      const content = readFileSync(filePath, 'utf-8');
      const entries = JSON.parse(content) as SEOEntry[];
      allData.push(...entries);
    } catch (error) {
      console.warn(`[SEO Service] Could not load ${file}:`, error);
    }
  }

  seoCache = allData;
  seoMap = new Map(allData.map(e => [e.slug, e]));
  cacheTimestamp = now;

  return allData;
}

/**
 * Инвалидирует кэш SEO данных
 */
export function invalidateSEOCache(): void {
  seoCache = null;
  seoMap = null;
  cacheTimestamp = 0;
}

/**
 * Получает список страниц с пагинацией
 * @param page - Номер страницы (начиная с 1)
 * @param limit - Количество записей на странице
 * @param region - Фильтр по региону (опционально)
 * @returns Пагинированный результат
 */
export function getPages(
  page: number = 1,
  limit: number = 20,
  region?: string
): PaginatedResult<SEOEntry> {
  let data = loadAllSEOData();

  if (region) {
    data = data.filter(e => e.region?.toLowerCase().includes(region.toLowerCase()));
  }

  const total = data.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const pageData = data.slice(offset, offset + limit);

  return {
    data: pageData,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Получает SEO данные страницы по slug
 * @param slug - URL-slug страницы
 * @returns SEO-запись или null
 */
export function getPageBySlug(slug: string): SEOEntry | null {
  loadAllSEOData();
  return seoMap?.get(slug) || null;
}

/**
 * Поиск страниц по ключевым словам и заголовкам
 * @param query - Поисковый запрос
 * @param limit - Максимальное количество результатов
 * @returns Найденные страницы
 */
export function searchPages(query: string, limit: number = 20): SEOEntry[] {
  const data = loadAllSEOData();
  const queryLower = query.toLowerCase();

  const results = data.filter(entry => {
    const titleMatch = entry.title.toLowerCase().includes(queryLower);
    const descMatch = entry.description.toLowerCase().includes(queryLower);
    const keywordsMatch = entry.keywords?.some(k => k.toLowerCase().includes(queryLower));
    const h1Match = entry.h1?.toLowerCase().includes(queryLower);

    return titleMatch || descMatch || keywordsMatch || h1Match;
  });

  return results.slice(0, limit);
}

/**
 * Получает статистику по SEO данным
 * @returns Объект со статистикой
 */
export function getSEOStats(): {
  totalPages: number;
  pagesWithFAQ: number;
  pagesWithKeywords: number;
  regionsCovered: string[];
} {
  const data = loadAllSEOData();

  const regions = new Set<string>();
  let pagesWithFAQ = 0;
  let pagesWithKeywords = 0;

  for (const entry of data) {
    if (entry.region) regions.add(entry.region);
    if (entry.faq && entry.faq.length > 0) pagesWithFAQ++;
    if (entry.keywords && entry.keywords.length > 0) pagesWithKeywords++;
  }

  return {
    totalPages: data.length,
    pagesWithFAQ,
    pagesWithKeywords,
    regionsCovered: Array.from(regions),
  };
}

/**
 * Получает связанные страницы по keywords
 * @param slug - Slug текущей страницы
 * @param limit - Максимальное количество связанных страниц
 * @returns Связанные страницы
 */
export function getRelatedPages(slug: string, limit: number = 6): SEOEntry[] {
  const data = loadAllSEOData();
  const current = getPageBySlug(slug);

  if (!current || !current.keywords || current.keywords.length === 0) {
    return [];
  }

  const currentKeywords = new Set(current.keywords);

  const related = data
    .filter(entry => entry.slug !== slug && entry.keywords)
    .map(entry => {
      const matchCount = entry.keywords!.filter(k => currentKeywords.has(k)).length;
      return { entry, matchCount };
    })
    .filter(item => item.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, limit)
    .map(item => item.entry);

  return related;
}
