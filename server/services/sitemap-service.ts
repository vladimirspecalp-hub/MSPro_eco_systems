import { promises as fs } from "fs";
import { resolve } from "path";
import { loadAllSEOData } from "./seo-service";
import { newsRepository } from "../repositories/news-repository";

const SITE_URL = "https://mspro-ltd.ru";

export async function generateSitemapXml(): Promise<string> {
    console.log("[Sitemap] Starting generation...");
    const staticUrls = [
        "",
        "/services",
        "/contacts",
        "/calculator",
        "/mspro-quad",
        "/news",
        "/services/rope-access",
        "/services/fireproofing-at-height",
        "/services/anticorrosion-at-height",
        "/services/ceiling-sanation",
        "/services/demolition"
    ];

    const now = new Date().toISOString().split("T")[0];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Static URLs
    staticUrls.forEach(url => {
        xml += `  <url>\n`;
        xml += `    <loc>${SITE_URL}${url}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>${url === "" ? "1.0" : "0.8"}</priority>\n`;
        xml += `  </url>\n`;
    });

    // 2. SEO Generated Pages
    try {
        const seoPages = await loadAllSEOData();
        console.log(`[Sitemap] Adding ${seoPages.length} SEO pages`);
        seoPages.forEach(page => {
            if (!page.slug) return;
            xml += `  <url>\n`;
            xml += `    <loc>${SITE_URL}/${page.slug}</loc>\n`;
            xml += `    <lastmod>${now}</lastmod>\n`;
            xml += `    <changefreq>monthly</changefreq>\n`;
            xml += `    <priority>0.6</priority>\n`;
            xml += `  </url>\n`;
        });
    } catch (e) {
        console.error("[Sitemap] Error adding SEO pages:", e);
    }

    // 3. Price Guides
    try {
        const guidesDir = resolve(process.cwd(), "content", "price_guides");
        const guideFiles = (await fs.readdir(guidesDir)).filter(f => f.endsWith(".json") && f !== "test.json");
        console.log(`[Sitemap] Adding ${guideFiles.length} price guides`);
        guideFiles.forEach(file => {
            const slug = file.replace(".json", "");
            xml += `  <url>\n`;
            xml += `    <loc>${SITE_URL}/price-guide/${slug}</loc>\n`;
            xml += `    <lastmod>${now}</lastmod>\n`;
            xml += `    <changefreq>monthly</changefreq>\n`;
            xml += `    <priority>0.5</priority>\n`;
            xml += `  </url>\n`;
        });
    } catch (e) {
        console.error("[Sitemap] Error reading price guides:", e);
    }

    // 4. News Articles
    try {
        const { items: newsItems } = await newsRepository.list({ status: "published", limit: 1000 });
        console.log(`[Sitemap] Adding ${newsItems.length} news articles`);
        newsItems.forEach(post => {
            xml += `  <url>\n`;
            xml += `    <loc>${SITE_URL}/news/${post.slug}</loc>\n`;
            xml += `    <lastmod>${post.updatedAt ? post.updatedAt.split("T")[0] : now}</lastmod>\n`;
            xml += `    <changefreq>monthly</changefreq>\n`;
            xml += `    <priority>0.5</priority>\n`;
            xml += `  </url>\n`;
        });
    } catch (e) {
        console.error("[Sitemap] Error reading news articles:", e);
    }

    xml += `</urlset>`;
    console.log("[Sitemap] Generation finished successfully");
    return xml;
}
