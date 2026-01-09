import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://ms-pro-ecosystems.replit.app';

function generateSitemap() {
  console.log('🗺️  Генерируем sitemap.xml...\n');

  const contentDir = path.join(__dirname, '../content');
  const files = fs.readdirSync(contentDir)
    .filter(file => file.startsWith('seo_core') && file.endsWith('.json'))
    .sort();

  console.log(`Найдено ${files.length} SEO файлов:\n`);
  files.forEach(file => console.log(`  - ${file}`));

  const allUrls = new Set();

  // Статические страницы
  const staticPages = [
    '',
    'about',
    'calculator',
    'contacts',
    'mspro-quad'
  ];

  staticPages.forEach(page => {
    allUrls.add(`${BASE_URL}/${page}`);
  });

  // Загружаем все SEO записи
  files.forEach(file => {
    const filepath = path.join(contentDir, file);
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    
    data.forEach(entry => {
      allUrls.add(`${BASE_URL}/${entry.slug}`);
    });

    console.log(`\n✅ ${file}: ${data.length} записей`);
  });

  console.log(`\n📊 Всего уникальных URL: ${allUrls.size}\n`);

  // Генерируем XML
  const urlsArray = Array.from(allUrls).sort();
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsArray.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.endsWith(BASE_URL + '/') ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(sitemapPath, xml);

  console.log(`✨ Sitemap сохранён: public/sitemap.xml`);
  console.log(`📍 Содержит ${allUrls.size} URL\n`);
}

generateSitemap();
