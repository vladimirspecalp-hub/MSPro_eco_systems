import { writeFileSync } from 'fs';
import { resolve } from 'path';
import seoCore1 from '../content/seo_core.json';
import seoCore2 from '../content/seo_core_part2.json';
import seoCore3 from '../content/seo_core_part3.json';
import seoCore4 from '../content/seo_core_part4.json';
import seoCore5 from '../content/seo_core_part5.json';

const DOMAIN = 'https://ms-pro.ru';

function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily', lastmod: currentDate },
    { url: '/calculator', priority: '0.9', changefreq: 'weekly', lastmod: currentDate },
    { url: '/mspro-quad', priority: '0.9', changefreq: 'weekly', lastmod: currentDate },
    { url: '/contacts', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
  ];

  const allSeoData = [
    ...seoCore1,
    ...seoCore2,
    ...seoCore3,
    ...seoCore4,
    ...seoCore5
  ];

  const seoPages = allSeoData.map(entry => ({
    url: `/services/${entry.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: currentDate,
  }));

  const allPages = [...staticPages, ...seoPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${DOMAIN}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const sitemapPath = resolve(process.cwd(), 'public', 'sitemap.xml');
  writeFileSync(sitemapPath, sitemap, 'utf-8');
  
  console.log(`✅ Sitemap generated successfully!`);
  console.log(`📍 Location: ${sitemapPath}`);
  console.log(`📊 Total URLs: ${allPages.length}`);
  console.log(`   - Static pages: ${staticPages.length}`);
  console.log(`   - SEO pages: ${seoPages.length}`);
  console.log(`\n📦 SEO файлы:`);
  console.log(`   - seo_core.json: ${seoCore1.length} записей`);
  console.log(`   - seo_core_part2.json: ${seoCore2.length} записей`);
  console.log(`   - seo_core_part3.json: ${seoCore3.length} записей`);
  console.log(`   - seo_core_part4.json: ${seoCore4.length} записей`);
  console.log(`   - seo_core_part5.json: ${seoCore5.length} записей`);
}

generateSitemap();
