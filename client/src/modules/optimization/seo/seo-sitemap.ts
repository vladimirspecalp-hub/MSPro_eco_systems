// import { allSEOData } from '@/lib/seo-loader';

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export function generateSitemapEntries(baseUrl: string = 'https://mspro.ru'): SitemapEntry[] {
  const today = new Date().toISOString().split('T')[0];

  const staticPages: SitemapEntry[] = [
    { loc: baseUrl, lastmod: today, changefreq: 'daily', priority: 1.0 },
    { loc: `${baseUrl}/calculator`, lastmod: today, changefreq: 'weekly', priority: 0.9 },
    { loc: `${baseUrl}/mspro-quad`, lastmod: today, changefreq: 'monthly', priority: 0.8 },
    { loc: `${baseUrl}/contact`, lastmod: today, changefreq: 'monthly', priority: 0.7 },
  ];

  // Client-side sitemap generation is disabled for performance.
  // Use server-side sitemap.xml instead.
  return staticPages;
}

export function generateSitemapXML(baseUrl?: string): string {
  const entries = generateSitemapEntries(baseUrl);

  const urlElements = entries.map(entry => `
  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}
