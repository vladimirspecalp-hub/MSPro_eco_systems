/**
 * News Service - управление новостями и интеграция с n8n
 * @module server/services/news-service
 */

import { storage } from "../storage";
import {
  type NewsArticle,
  type InsertNewsArticle,
  insertNewsArticleSchema
} from "@shared/schema";
import { z } from "zod";

/** Схема для n8n ingest payload */
export const n8nIngestSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(50),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  publishImmediately: z.boolean().optional(),
  sourceId: z.string().optional(),
  sourceType: z.string().optional(),
  platforms: z.array(z.string()).optional(),
});

export type N8nIngestPayload = z.infer<typeof n8nIngestSchema>;

/** Генерация slug из заголовка */
function generateSlug(title: string): string {
  const translitMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };

  return title
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

/** Генерация JSON-LD для NewsArticle schema.org */
function generateJsonLd(article: NewsArticle, baseUrl: string): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.excerpt || article.metaDescription,
    "image": article.coverImage || article.ogImage,
    "author": {
      "@type": "Organization",
      "name": article.author || "MSPRO"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MSPRO",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "datePublished": article.publishedAt?.toISOString(),
    "dateModified": article.updatedAt?.toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.canonicalUrl || `${baseUrl}/news/${article.slug}`
    }
  };

  return JSON.stringify(jsonLd);
}

/** Генерация canonical URL */
function generateCanonicalUrl(slug: string, baseUrl: string): string {
  return `${baseUrl}/news/${slug}`;
}

export class NewsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.BASE_URL || "https://mspro-ecosystems.replit.app";
  }

  /**
   * Обработка входящих данных от n8n
   * @param payload - Данные статьи от n8n workflow
   * @returns Созданная статья с canonical URL и JSON-LD
   */
  async ingestFromN8n(payload: N8nIngestPayload): Promise<{
    article: NewsArticle;
    canonicalUrl: string;
    jsonLd: string;
    outboxEntries: string[];
  }> {
    const validated = n8nIngestSchema.parse(payload);

    const slug = validated.slug || generateSlug(validated.title);
    const existingArticle = await storage.getNewsArticleBySlug(slug);

    if (existingArticle) {
      throw new Error(`Article with slug "${slug}" already exists`);
    }

    const canonicalUrl = generateCanonicalUrl(slug, this.baseUrl);
    const now = new Date();

    const articleData: InsertNewsArticle = {
      slug,
      title: validated.title,
      content: validated.content,
      excerpt: validated.excerpt || validated.content.substring(0, 200) + "...",
      coverImage: validated.coverImage,
      author: validated.author || "MSPRO",
      category: validated.category,
      tags: validated.tags,
      status: validated.publishImmediately ? "published" : "draft",
      publishedAt: validated.publishImmediately ? now : null,
      canonicalUrl,
      metaTitle: validated.title,
      metaDescription: validated.excerpt || validated.content.substring(0, 160),
      ogImage: validated.coverImage,
      sourceRef: validated.sourceId,
      sourceType: validated.sourceType || "n8n",
    };

    const article = await storage.createNewsArticle(articleData);

    const jsonLd = generateJsonLd(article, this.baseUrl);
    await storage.updateNewsArticle(article.id, { jsonLd });

    const outboxEntries: string[] = [];
    const platforms = validated.platforms || ["telegram", "vk", "rss"];

    for (const platform of platforms) {
      const entry = await storage.createOutboxEntry({
        articleId: article.id,
        platform,
        status: "pending",
        payload: JSON.stringify({
          title: article.title,
          excerpt: article.excerpt,
          url: canonicalUrl,
          image: article.coverImage
        }),
        scheduledAt: now,
      });
      outboxEntries.push(entry.id);
    }

    return {
      article,
      canonicalUrl,
      jsonLd,
      outboxEntries
    };
  }

  /**
   * Получить статью по slug
   */
  async getBySlug(slug: string): Promise<NewsArticle | undefined> {
    return storage.getNewsArticleBySlug(slug);
  }

  /**
   * Получить все опубликованные статьи
   */
  async getPublished(): Promise<NewsArticle[]> {
    return storage.getAllNewsArticles("published");
  }

  /**
   * Получить все статьи (для админки)
   */
  async getAll(): Promise<NewsArticle[]> {
    return storage.getAllNewsArticles();
  }

  /**
   * Опубликовать статью
   */
  async publish(id: string): Promise<NewsArticle | undefined> {
    return storage.updateNewsArticle(id, {
      status: "published",
      publishedAt: new Date()
    });
  }

  /**
   * Генерация RSS feed
   */
  async generateRssFeed(): Promise<string> {
    const articles = await this.getPublished();

    const items = articles.slice(0, 50).map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${article.canonicalUrl}</link>
      <description><![CDATA[${article.excerpt || article.metaDescription}]]></description>
      <pubDate>${article.publishedAt?.toUTCString()}</pubDate>
      <guid isPermaLink="true">${article.canonicalUrl}</guid>
      ${article.category ? `<category>${article.category}</category>` : ''}
      ${article.coverImage ? `<enclosure url="${article.coverImage}" type="image/jpeg"/>` : ''}
    </item>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MSPRO Новости</title>
    <link>${this.baseUrl}/news</link>
    <description>Новости компании MSPRO - промышленная покраска и антикоррозийная защита</description>
    <language>ru</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${this.baseUrl}/news/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
  }

  /**
   * Генерация News Sitemap
   */
  async generateNewsSitemap(): Promise<string> {
    const articles = await this.getPublished();

    const urls = articles.slice(0, 1000).map(article => `
  <url>
    <loc>${article.canonicalUrl}</loc>
    <news:news>
      <news:publication>
        <news:name>MSPRO</news:name>
        <news:language>ru</news:language>
      </news:publication>
      <news:publication_date>${article.publishedAt?.toISOString().split('T')[0]}</news:publication_date>
      <news:title><![CDATA[${article.title}]]></news:title>
    </news:news>
    <lastmod>${article.updatedAt?.toISOString()}</lastmod>
  </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${urls}
</urlset>`;
  }

  /**
   * Получить meta данные для статьи (OG, Twitter Cards, JSON-LD)
   */
  getArticleMeta(article: NewsArticle): {
    title: string;
    description: string;
    ogImage: string | null;
    canonicalUrl: string | null;
    jsonLd: string | null;
  } {
    return {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt || "",
      ogImage: article.ogImage || article.coverImage,
      canonicalUrl: article.canonicalUrl,
      jsonLd: article.jsonLd
    };
  }
}

export const newsService = new NewsService();
