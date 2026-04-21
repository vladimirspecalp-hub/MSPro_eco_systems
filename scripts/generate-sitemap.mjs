import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://mspro-ltd.ru';
const CONTENT_FILE = path.join(__dirname, '..', 'content', 'seo_generated', 'all_seo_content.json');
const SITEMAP_FILE = path.join(__dirname, '..', 'dist', 'public', 'sitemap.xml'); // Write directly to dist/public
const SITEMAP_SOURCE_FILE = path.join(__dirname, '..', 'public', 'sitemap.xml'); // And source

async function generateSitemap() {
    console.log('🗺️ Generating sitemap...');

    if (!fs.existsSync(CONTENT_FILE)) {
        console.error('❌ Content file not found:', CONTENT_FILE);
        return;
    }

    const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));
    console.log(`📄 Found ${content.length} generated pages.`);

    // Static pages
    const staticPages = [
        '',
        '/contacts',
        '/calculator',
        '/documents',
        '/mspro-quad',
        '/services/rope-access',
        '/services/fireproofing-at-height',
        '/services/anticorrosion-at-height'
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static pages
    for (const page of staticPages) {
        sitemap += `  <url>
    <loc>${BASE_URL}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>
`;
    }

    // Add generated SEO pages
    for (const item of content) {
        if (!item.slug) continue;

        // Use lastmod if file modification time is available, otherwise current date
        const lastMod = new Date().toISOString().split('T')[0];

        sitemap += `  <url>
    <loc>${BASE_URL}/${item.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }

    sitemap += '</urlset>';

    // Ensure directories exist
    const distPublicDir = path.dirname(SITEMAP_FILE);
    if (!fs.existsSync(distPublicDir)) {
        fs.mkdirSync(distPublicDir, { recursive: true });
    }

    fs.writeFileSync(SITEMAP_FILE, sitemap);
    fs.writeFileSync(SITEMAP_SOURCE_FILE, sitemap);

    console.log(`✅ Sitemap generated at: ${SITEMAP_FILE}`);
    console.log(`✅ Sitemap source saved at: ${SITEMAP_SOURCE_FILE}`);
}

generateSitemap().catch(console.error);
