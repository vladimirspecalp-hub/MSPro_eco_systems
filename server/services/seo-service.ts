/**
 * SEO Service — работа с SEO данными из JSON-файлов
 * @module server/services/seo-service
 */

import { promises as fs } from 'fs';
import { resolve } from 'path';
import { CITY_CONTENT, getBenefitsForSlug, getFAQForSlug } from "../data/city-content";

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
  datePublished?: string;
  dateModified?: string;
  benefits?: string[];
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
const CACHE_TTL = 10 * 60 * 1000; // 10 минут
let loadingPromise: Promise<SEOEntry[]> | null = null;

/**
 * Асинхронно загружает все SEO данные из JSON-файлов
 * @returns Promise<SEOEntry[]>
 */
export async function loadAllSEOData(): Promise<SEOEntry[]> {
  const now = Date.now();

  // Return cached data if valid
  if (seoCache && (now - cacheTimestamp) < CACHE_TTL) {
    return seoCache;
  }

  // Deduplicate simultaneous requests
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      const contentDir = resolve(process.cwd(), 'content');
      let allData: SEOEntry[] = [];

      const filesToLoad = [
        resolve(contentDir, 'seo_generated', 'all_seo_content.json'),
        resolve(contentDir, 'seo_dynamic.json'),
        // Legacy files fallback
        resolve(contentDir, 'seo_core.json'),
        resolve(contentDir, 'seo_core_part2.json'),
        resolve(contentDir, 'seo_core_part3.json'),
        resolve(contentDir, 'seo_core_part4.json'),
        resolve(contentDir, 'seo_core_part5.json'),
      ];

      const loadedFiles = await Promise.allSettled(
        filesToLoad.map(async (path) => {
          try {
            const content = await fs.readFile(path, 'utf-8');
            const parsed = JSON.parse(content);
            return Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            return []; // Ignore missing or malformed files
          }
        })
      );

      for (const result of loadedFiles) {
        if (result.status === 'fulfilled') {
          allData.push(...result.value);
        }
      }

      // --- Apply City Content Overrides ---
      const cityKeys = Object.keys(CITY_CONTENT);

      // Deduplicate by slug (last one wins)
      const uniqueMap = new Map<string, SEOEntry>();
      for (const item of allData) {
        if (item.slug) {
          uniqueMap.set(item.slug, item);
        }
      }
      allData = Array.from(uniqueMap.values());


      for (const entry of allData) {
        // Find matching city key (suffix matching)
        // e.g. "price-rope-access-moskva" matches "moskva"
        const cityKey = cityKeys.find(key => entry.slug === key || entry.slug.endsWith(`-${key}`));

        if (cityKey) {
          const content = CITY_CONTENT[cityKey];
          if (content) {
            // --- MIXER STRATEGY ---
            // 1. Benefits: Use explicit city override OR generic mixer
            if (content.benefits && content.benefits.length > 0) {
              entry.benefits = content.benefits;
            } else {
              // Fallback to deterministic mixer
              entry.benefits = getBenefitsForSlug(entry.slug);
            }

            // 2. FAQ: Use mixer to get varied questions and inject city name
            // Note: We use the existing FAQ from JSON if available, but since most JSONs are identical,
            // we prefer the mixer for uniqueness unless it's a very specific city content.
            // However, to be safe, let's only APPLY mixer if the JSON FAQ looks "generic"
            // or if we want to enforce uniqueness.
            // STRATEGY: We will OVERRIDE the generic FAQ with our unique mixer FAQ
            // because the JSON FAQs are currently ALL IDENTICAL duplicates.
            const regionName = entry.region || "вашем регионе";
            entry.faq = getFAQForSlug(entry.slug, regionName);

            // 3. Intro Injection (existing logic)
            if (content.intro && content.intro.length > 0) {
              // Deterministically select a variant based on slug hash
              const variantIndex = Math.abs(hashCode(entry.slug)) % content.intro.length;
              const selectedIntro = content.intro[variantIndex];

              // Prepend unique text to description if not already present
              // We consider the description generally has the "Generic" text.
              const genericDesc = entry.description || "";
              // Check if we already have this specific intro (avoid duplication on re-runs or caching issues)
              // Using a substring check
              if (!genericDesc.includes(selectedIntro.substring(0, 20))) {
                // If there are multiple paragraphs, we might want to replace the first one if it's generic,
                // but prepending is safer to ensure unique content is seen first by bots.
                // However, user wants "Unique intro instead of template".
                // If I prepend, I get "Unique data. Template data." -> This is good.
                entry.description = `${selectedIntro} ${genericDesc}`;
              }
            }
          }
        }
      }

      // Update cache
      seoCache = allData;
      seoMap = new Map(allData.map(e => [e.slug, e]));
      cacheTimestamp = Date.now();

      console.log(`[SEO Service] Cache updated. Total pages: ${allData.length}`);
      return allData;
    } finally {
      loadingPromise = null;
    }
  })();

  return loadingPromise;
}



/**
 * Simple string hash function for deterministic variant selection
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
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
 */
export async function getPages(
  page: number = 1,
  limit: number = 20,
  region?: string
): Promise<PaginatedResult<SEOEntry>> {
  let data = await loadAllSEOData();

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
 */
export async function getPageBySlug(slug: string): Promise<SEOEntry | null> {
  // If cache is empty, load it
  if (!seoMap) {
    await loadAllSEOData();
  }
  return seoMap?.get(slug) || null;
}

/**
 * Поиск страниц по ключевым словам и заголовкам
 */
export async function searchPages(query: string, limit: number = 20): Promise<SEOEntry[]> {
  const data = await loadAllSEOData();
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
 */
export async function getSEOStats(): Promise<{
  totalPages: number;
  pagesWithFAQ: number;
  pagesWithKeywords: number;
  regionsCovered: string[];
}> {
  const data = await loadAllSEOData();

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
 */
export async function getRelatedPages(slug: string, limit: number = 6): Promise<SEOEntry[]> {
  const data = await loadAllSEOData();
  const current = seoMap?.get(slug);

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

/**
 * Получает все FAQ из всех SEO страниц
 */
export async function getAllFAQs(): Promise<Array<{ question: string; answer: string; service: string; region: string; slug: string }>> {
  const data = await loadAllSEOData();
  const faqs: Array<{ question: string; answer: string; service: string; region: string; slug: string }> = [];

  for (const page of data) {
    if (page.faq && page.faq.length > 0) {
      for (const faqItem of page.faq) {
        faqs.push({
          question: faqItem.question,
          answer: faqItem.answer,
          service: page.keywords?.[0] || "Промышленный альпинизм",
          region: page.region || "Россия",
          slug: page.slug,
        });
      }
    }
  }

  return faqs;
}
