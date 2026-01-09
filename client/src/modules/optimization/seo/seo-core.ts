import type { SEOEntry } from '@/lib/seo-loader';

export interface SEOMetaTags {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  robots: string;
}

export function generateMetaTags(entry: SEOEntry, baseUrl: string = 'https://mspro.ru'): SEOMetaTags {
  const canonical = `${baseUrl}/services/${entry.slug}`;
  
  return {
    title: `${entry.title} | MS-PRO`,
    description: entry.description.slice(0, 160),
    keywords: entry.keywords || [],
    canonical,
    ogTitle: entry.title,
    ogDescription: entry.description,
    robots: 'index, follow',
  };
}

export function generateTitle(keyword: string, region?: string): string {
  const base = keyword.charAt(0).toUpperCase() + keyword.slice(1);
  return region ? `${base} ${region} | MS-PRO` : `${base} | MS-PRO`;
}

export function generateDescription(keyword: string, region?: string): string {
  const base = `Профессиональные услуги: ${keyword}. Гарантия 20 лет, сертифицированные материалы MSPRO Quad.`;
  return region ? `${base} Работаем в ${region}.` : base;
}

export function generateKeywords(keyword: string, region?: string): string[] {
  const baseKeywords = [
    keyword,
    'покраска труб',
    'антикоррозийная защита',
    'MSPRO Quad',
    'промышленная покраска',
    'огнезащита',
  ];
  
  if (region) {
    baseKeywords.push(`${keyword} ${region}`, `покраска труб ${region}`);
  }
  
  return baseKeywords;
}
