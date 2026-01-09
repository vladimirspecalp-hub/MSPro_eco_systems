interface SEOEntry {
  slug: string;
  title: string;
  description: string;
  cta: string;
  region?: string;
  keywords?: string[];
  h1?: string;
  h2?: string;
  faq?: Array<{ question: string; answer: string }>;
}

import seoCore1 from '../../../content/seo_core.json';
import seoCore2 from '../../../content/seo_core_part2.json';
import seoCore3 from '../../../content/seo_core_part3.json';
import seoCore4 from '../../../content/seo_core_part4.json';
import seoCore5 from '../../../content/seo_core_part5.json';
import seoDynamic from '../../../content/seo_dynamic.json';

export const allSEOData: SEOEntry[] = [
  ...seoCore1,
  ...seoCore2,
  ...seoCore3,
  ...seoCore4,
  ...seoCore5,
  ...seoDynamic
];

export const seoDataMap = new Map<string, SEOEntry>(
  allSEOData.map(entry => [entry.slug, entry])
);

export function findSEOEntry(slug: string): SEOEntry | undefined {
  return seoDataMap.get(slug);
}

export async function findOrGenerateSEOEntry(slug: string): Promise<SEOEntry | null> {
  const existing = findSEOEntry(slug);
  if (existing) {
    return existing;
  }

  try {
    const response = await fetch(`/api/ai_seo?slug=${encodeURIComponent(slug)}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to generate SEO content:', error);
    return null;
  }
}

// Функция поиска связанных страниц по keywords
export function findRelatedPages(currentSlug: string, limit: number = 6): SEOEntry[] {
  const currentEntry = seoDataMap.get(currentSlug);
  if (!currentEntry || !currentEntry.keywords) return [];

  const currentKeywords = new Set(currentEntry.keywords);
  
  // Ищем страницы с пересекающимися keywords
  const related = allSEOData
    .filter(entry => {
      if (entry.slug === currentSlug) return false;
      if (!entry.keywords) return false;
      
      // Проверяем пересечение keywords
      return entry.keywords.some(kw => currentKeywords.has(kw));
    })
    .map(entry => {
      // Считаем количество совпадающих keywords
      const matchCount = entry.keywords!.filter(kw => currentKeywords.has(kw)).length;
      return { entry, matchCount };
    })
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, limit)
    .map(item => item.entry);

  return related;
}

export type { SEOEntry };
