/**
 * News API Router v2.0
 * REST API для новостей с поддержкой n8n интеграции
 * Спецификация: x-mspro-news-secret, UTM links, shareLinks
 * @module server/routes/news-api
 */

import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { newsRepository } from "../repositories/news-repository";
import { distributionSettingsService } from "../services/distribution-settings";
import { NEWS_PLATFORMS, PLATFORM_IDS } from "../../shared/newsPlatforms";
import { z } from "zod";
import type { InsertNewsArticle, NewsArticle } from "@shared/schema";

const router = Router();

const NEWS_SECRET = process.env.NEWS_INGEST_SECRET || "mspro-news-secret-dev";
const SITE_URL = process.env.SITE_URL || "https://mspro-ltd.ru";
const NEWS_CANONICAL_BASE = process.env.NEWS_CANONICAL_BASE || "/news";

function transliterate(text: string): string {
  const map: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  return text.toLowerCase()
    .split('')
    .map(c => map[c] || c)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

function authMiddleware(req: Request, res: Response, next: Function): void {
  const secret = req.headers["x-mspro-news-secret"] as string;
  if (secret !== NEWS_SECRET) {
    res.status(401).json({ ok: false, error: "Unauthorized" });
    return;
  }
  next();
}

function generateShareLinks(slug: string): Record<string, string> {
  const baseUrl = `${SITE_URL}${NEWS_CANONICAL_BASE}/${slug}`;
  const utmBase = `utm_medium=social&utm_campaign=news&utm_content=${slug}`;

  return {
    telegram: `${baseUrl}?utm_source=telegram&${utmBase}`,
    vk: `${baseUrl}?utm_source=vk&${utmBase}`,
    dzen: `${baseUrl}?utm_source=dzen&${utmBase}`,
    ok: `${baseUrl}?utm_source=ok&${utmBase}`,
    linkedin: `${baseUrl}?utm_source=linkedin&${utmBase}`,
    twitter: `${baseUrl}?utm_source=twitter&${utmBase}`,
    facebook: `${baseUrl}?utm_source=facebook&${utmBase}`,
    reddit: `${baseUrl}?utm_source=reddit&${utmBase}`,
    medium: `${baseUrl}?utm_source=medium&${utmBase}`,
  };
}

function generateCanonicalUrl(slug: string): string {
  return `${SITE_URL}${NEWS_CANONICAL_BASE}/${slug}`;
}

const ingestSchema = z.object({
  externalId: z.string().min(1),
  slug: z.string().optional(),
  title: z.string().min(3),
  excerpt: z.string().optional(),
  contentMarkdown: z.string().optional(),
  contentHtml: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  coverImageUrl: z.string().url().optional().nullable(),
  geo: z.object({
    regionCode: z.string().optional(),
    city: z.string().optional()
  }).optional().nullable(),
  status: z.enum(["draft", "scheduled", "published"]).optional(),
});


/**
 * POST /api/news/ingest - Ingest от n8n
 * Security: x-mspro-news-secret header
 */
router.post("/ingest", authMiddleware, async (req: Request, res: Response) => {
  try {
    const payload = ingestSchema.parse(req.body);
    const slug = payload.slug || transliterate(payload.title);
    const canonicalUrl = generateCanonicalUrl(slug);
    const shareLinks = generateShareLinks(slug);
    const now = new Date();


    const postData = {
      externalId: payload.externalId,
      slug,
      title: payload.title,
      excerpt: payload.excerpt || "",
      contentMarkdown: payload.contentMarkdown || "",
      contentHtml: payload.contentHtml || payload.contentMarkdown || "",
      coverImageUrl: payload.coverImageUrl || null,
      tags: payload.tags || [],
      category: payload.category || null,
      geo: payload.geo || null,
      status: (payload.status || "draft") as "draft" | "scheduled" | "published" | "archived",
      publishedAt: payload.status === "published" ? now.toISOString() : null,
      seo: { title: payload.title, description: payload.excerpt || "", canonicalUrl },
      aeo: {},
      source: { type: "n8n" as const, ref: payload.externalId }
    };

    const post = await newsRepository.upsertByExternalId(postData);
    res.json({ ok: true, post, canonicalUrl, shareLinks });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ ok: false, error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ ok: false, error: error.message });
  }
});

/**
 * GET /api/news - Список новостей
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status = "published", limit = "20", offset = "0" } = req.query;


    const result = await newsRepository.list({
      status: status as string,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });

    res.json({
      ok: true,
      items: result.items,
      total: result.total,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

/**
 * GET /api/news/rss.xml - RSS 2.0 feed
 * ВАЖНО: Этот маршрут ДОЛЖЕН быть ПЕРЕД /:slug
 */
router.get("/rss.xml", async (req: Request, res: Response) => {
  try {
    const { items } = await newsRepository.list({ status: "published", limit: 50 });

    const rssItems = items.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${generateCanonicalUrl(post.slug)}</link>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.publishedAt || post.createdAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${generateCanonicalUrl(post.slug)}</guid>
      ${post.category ? `<category>${post.category}</category>` : ''}
      ${post.coverImageUrl ? `<enclosure url="${post.coverImageUrl}" type="image/jpeg"/>` : ''}
    </item>`).join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MSPRO Новости</title>
    <link>${SITE_URL}/news</link>
    <description>Новости компании MSPRO - промышленная покраска и антикоррозийная защита</description>
    <language>ru</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/news/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

    res.type("application/rss+xml").send(rss);
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

/**
 * GET /api/news/sitemap.xml - News Sitemap
 * ВАЖНО: Этот маршрут ДОЛЖЕН быть ПЕРЕД /:slug
 */
router.get("/sitemap.xml", async (req: Request, res: Response) => {
  try {
    const { items } = await newsRepository.list({ status: "published", limit: 1000 });

    const urls = items.map(post => `
  <url>
    <loc>${generateCanonicalUrl(post.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>MSPRO</news:name>
        <news:language>ru</news:language>
      </news:publication>
      <news:publication_date>${(post.publishedAt || post.createdAt).split('T')[0]}</news:publication_date>
      <news:title><![CDATA[${post.title}]]></news:title>
    </news:news>
    <lastmod>${post.updatedAt}</lastmod>
  </url>`).join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${urls}
</urlset>`;

    res.type("application/xml").send(sitemap);
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ============================================
// PLATFORMS API (Distribution Center v1)
// ВАЖНО: Этот маршрут ДОЛЖЕН быть ПЕРЕД /:slug
// ============================================

const platformUpdateSchema = z.object({
  platformId: z.string(),
  enabled: z.boolean().optional(),
  profileUrl: z.string().nullable().optional(),
  webhookTokenPlaceholder: z.string().nullable().optional()
});

/**
 * GET /api/news/platforms - Получить список платформ и настройки
 * Публичный эндпоинт (без секрета возвращает только public data)
 */
router.get("/platforms", async (req: Request, res: Response) => {
  try {
    const secret = req.headers["x-mspro-news-secret"];
    const isAdmin = secret === NEWS_SECRET;

    const settings = isAdmin
      ? await distributionSettingsService.getPlatformSettings()
      : await distributionSettingsService.getPublicSettings();

    const aggregated = await distributionSettingsService.getAggregatedStatus();

    res.json({
      ok: true,
      platforms: NEWS_PLATFORMS,
      settings,
      aggregated
    });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

/**
 * PUT /api/news/platforms - Обновить настройку платформы
 * Security: x-mspro-news-secret
 */
router.put("/platforms", authMiddleware, async (req: Request, res: Response) => {
  try {
    const payload = platformUpdateSchema.parse(req.body);

    if (!PLATFORM_IDS.includes(payload.platformId)) {
      return res.status(400).json({ ok: false, error: "Unknown platform" });
    }

    const { platformId, ...patch } = payload;
    const updated = await distributionSettingsService.updatePlatformSetting(platformId, patch);

    res.json({ ok: true, setting: updated });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ ok: false, error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ ok: false, error: error.message });
  }
});

/**
 * GET /api/news/:slug - Получить статью
 */
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const draft = req.query.draft === "1";
    const secret = req.headers["x-mspro-news-secret"];


    const post = await newsRepository.getBySlug(slug);

    if (!post) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }

    if (post.status !== "published" && !(draft && secret === NEWS_SECRET)) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }

    const canonicalUrl = generateCanonicalUrl(slug);
    const shareLinks = generateShareLinks(slug);

    res.json({
      ok: true,
      post,
      canonicalUrl,
      shareLinks,
      meta: {
        title: post.seo?.title || post.title,
        description: post.seo?.description || post.excerpt,
        image: post.coverImageUrl,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: post.title,
          description: post.excerpt,
          image: post.coverImageUrl,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: { "@type": "Organization", name: "MSPRO" },
          publisher: { "@type": "Organization", name: "MSPRO" }
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

/**
 * POST /api/news/:id/publish - Опубликовать статью
 * Также создаёт/обновляет outbox jobs для всех 15 платформ
 */
router.post("/:id/publish", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await newsRepository.publish(id);

    if (!post) {
      return res.status(404).json({ ok: false, error: "Not found" });
    }

    // Auto-create outbox jobs for all 15 platforms
    const settings = await distributionSettingsService.getPlatformSettings();
    const jobs = await newsRepository.ensureOutboxForPost(id, settings, SITE_URL);

    res.json({ ok: true, post, outboxJobs: jobs.length });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

/**
 * POST /api/news/distribution/enqueue - Создать задания outbox
 */
router.post("/distribution/enqueue", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { postId, platforms } = req.body;

    if (!postId || !platforms || !Array.isArray(platforms)) {
      return res.status(400).json({ ok: false, error: "postId and platforms[] required" });
    }

    const post = await newsRepository.getById(postId);
    if (!post) {
      return res.status(404).json({ ok: false, error: "Post not found" });
    }

    const shareLinks = generateShareLinks(post.slug);
    const jobs = [];

    for (const platform of platforms) {
      const job = await newsRepository.createDistributionJob({
        postId,
        platform,
        status: "queued",
        attempts: 0,
        scheduledAt: new Date().toISOString(),
        postedAt: null,
        remoteUrl: null,
        backlinkUrl: shareLinks[platform] || generateCanonicalUrl(post.slug),
        lastError: null
      });
      jobs.push(job);
    }

    res.json({ ok: true, jobs });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

/**
 * POST /api/news/distribution/callback - n8n callback
 */
router.post("/distribution/callback", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { jobId, status, remoteUrl, error: errorMsg } = req.body;

    if (!jobId) {
      return res.status(400).json({ ok: false, error: "jobId required" });
    }

    const job = await newsRepository.updateDistributionJob(jobId, {
      status: status || "posted",
      remoteUrl: remoteUrl || null,
      postedAt: status === "posted" ? new Date().toISOString() : null,
      lastError: errorMsg || null
    });

    if (!job) {
      return res.status(404).json({ ok: false, error: "Job not found" });
    }

    res.json({ ok: true, job });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

/**
 * GET /api/news/distribution/jobs - Список заданий
 */
router.get("/distribution/jobs", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { postId } = req.query;

    if (postId) {
      const jobs = await newsRepository.getDistributionJobs(postId as string);
      return res.json({ ok: true, jobs });
    }

    const pending = await newsRepository.getPendingJobs();
    res.json({ ok: true, jobs: pending });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

/**
 * POST /api/news/compile - Заглушка для ConfiuiAI
 */
router.post("/compile", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { rawMaterial } = req.body;
    res.json({
      ok: true,
      status: "queued",
      message: "ConfiuiAI compilation queued (stub)",
      material: rawMaterial ? "received" : "empty"
    });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ============================================
// OUTBOX API (n8n integration)
// ============================================

const dispatchSchema = z.object({
  limit: z.number().optional().default(10),
  platforms: z.array(z.string()).optional()
});

const markSchema = z.object({
  results: z.array(z.object({
    id: z.string(),
    status: z.enum(["published", "posted", "failed"]),
    remoteUrl: z.string().optional(),
    error: z.string().optional()
  }))
});

/**
 * POST /api/news/outbox/dispatch - Выдать queued jobs для n8n
 * Security: x-mspro-news-secret
 * При выдаче помечает jobs как "posting"
 */
router.post("/outbox/dispatch", authMiddleware, async (req: Request, res: Response) => {
  try {
    const payload = dispatchSchema.parse(req.body || {});

    const jobs = await newsRepository.getQueuedJobs({
      limit: payload.limit,
      platforms: payload.platforms
    });

    res.json({
      ok: true,
      items: jobs,
      count: jobs.length
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ ok: false, error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ ok: false, error: error.message });
  }
});

/**
 * POST /api/news/outbox/mark - Обновить статусы jobs от n8n
 * Security: x-mspro-news-secret
 */
router.post("/outbox/mark", authMiddleware, async (req: Request, res: Response) => {
  try {
    const payload = markSchema.parse(req.body);

    const updated = await newsRepository.markJobsBatch(payload.results);

    res.json({
      ok: true,
      updated: updated.length
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ ok: false, error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
