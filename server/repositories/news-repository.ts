/**
 * INewsRepository - интерфейс репозитория новостей
 * Реализация v1: файловое/JSON хранилище с in-memory cache
 * @module server/repositories/news-repository
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { randomUUID } from "crypto";

export interface NewsPostGeo {
  regionCode?: string;
  city?: string;
}

export interface NewsPostSeo {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export interface NewsPostAeo {
  answerBlock?: string;
  faq?: Array<{ q: string; a: string }>;
}

export interface NewsPostSource {
  type: "material" | "manual" | "n8n";
  ref?: string;
}

export interface NewsPost {
  id: string;
  externalId: string | null;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  contentHtml: string;
  coverImageUrl: string | null;
  tags: string[];
  category: string | null;
  geo: NewsPostGeo | null;
  status: "draft" | "scheduled" | "published" | "archived";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seo: NewsPostSeo;
  aeo: NewsPostAeo;
  source: NewsPostSource;
}

export interface NewsDistributionJob {
  id: string;
  postId: string;
  platform: string;
  status: "disabled" | "queued" | "posting" | "posted" | "published" | "failed";
  attempts: number;
  scheduledAt: string | null;
  postedAt: string | null;
  remoteUrl: string | null;
  backlinkUrl: string;
  lastError: string | null;
  payload?: {
    title: string;
    excerpt: string;
    url: string;
    image: string | null;
    tags: string[];
    publishedAt: string | null;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsStore {
  articles: NewsPost[];
  distributionJobs: NewsDistributionJob[];
  lastUpdated: string | null;
}

export interface ListOptions {
  status?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}

export interface INewsRepository {
  upsertByExternalId(payload: Partial<NewsPost> & { externalId: string }): Promise<NewsPost>;
  create(payload: Omit<NewsPost, "id" | "createdAt" | "updatedAt">): Promise<NewsPost>;
  update(id: string, patch: Partial<NewsPost>): Promise<NewsPost | null>;
  getBySlug(slug: string): Promise<NewsPost | null>;
  getById(id: string): Promise<NewsPost | null>;
  list(options: ListOptions): Promise<{ items: NewsPost[]; total: number }>;
  publish(id: string): Promise<NewsPost | null>;
  delete(id: string): Promise<boolean>;
  createDistributionJob(job: Omit<NewsDistributionJob, "id">): Promise<NewsDistributionJob>;
  updateDistributionJob(id: string, patch: Partial<NewsDistributionJob>): Promise<NewsDistributionJob | null>;
  getDistributionJobs(postId: string): Promise<NewsDistributionJob[]>;
  getPendingJobs(): Promise<NewsDistributionJob[]>;
  ensureOutboxForPost(postId: string, settings: Record<string, { enabled: boolean }>, siteUrl: string): Promise<NewsDistributionJob[]>;
  getQueuedJobs(options?: { limit?: number; platforms?: string[] }): Promise<NewsDistributionJob[]>;
  markJobsBatch(results: Array<{ id: string; status: string; remoteUrl?: string; error?: string }>): Promise<NewsDistributionJob[]>;
}

const STORE_PATH = resolve(process.cwd(), "content/news_store.json");

function generateId(): string {
  return `${Date.now()}-${randomUUID().split('-')[0]}`;
}

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

export class FileNewsRepository implements INewsRepository {
  private cache: NewsStore | null = null;

  private loadStore(): NewsStore {
    if (this.cache) return this.cache;

    if (!existsSync(STORE_PATH)) {
      const empty: NewsStore = { articles: [], distributionJobs: [], lastUpdated: null };
      writeFileSync(STORE_PATH, JSON.stringify(empty, null, 2));
      this.cache = empty;
      return empty;
    }

    const data = readFileSync(STORE_PATH, "utf-8");
    this.cache = JSON.parse(data);
    return this.cache!;
  }

  private saveStore(store: NewsStore): void {
    store.lastUpdated = new Date().toISOString();
    this.cache = store;
    writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
  }

  async upsertByExternalId(payload: Partial<NewsPost> & { externalId: string }): Promise<NewsPost> {
    const store = this.loadStore();
    const existing = store.articles.find(a => a.externalId === payload.externalId);

    if (existing) {
      const updated = { ...existing, ...payload, updatedAt: new Date().toISOString() };
      const index = store.articles.findIndex(a => a.id === existing.id);
      store.articles[index] = updated;
      this.saveStore(store);
      return updated;
    }

    return this.create({
      ...payload,
      slug: payload.slug || transliterate(payload.title || "untitled"),
      title: payload.title || "Untitled",
      excerpt: payload.excerpt || "",
      contentMarkdown: payload.contentMarkdown || "",
      contentHtml: payload.contentHtml || "",
      coverImageUrl: payload.coverImageUrl || null,
      tags: payload.tags || [],
      category: payload.category || null,
      geo: payload.geo || null,
      status: payload.status || "draft",
      publishedAt: payload.publishedAt || null,
      seo: payload.seo || {},
      aeo: payload.aeo || {},
      source: payload.source || { type: "n8n" }
    } as Omit<NewsPost, "id" | "createdAt" | "updatedAt">);
  }

  async create(payload: Omit<NewsPost, "id" | "createdAt" | "updatedAt">): Promise<NewsPost> {
    const store = this.loadStore();
    const now = new Date().toISOString();

    const post: NewsPost = {
      ...payload,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };

    store.articles.push(post);
    this.saveStore(store);
    return post;
  }

  async update(id: string, patch: Partial<NewsPost>): Promise<NewsPost | null> {
    const store = this.loadStore();
    const index = store.articles.findIndex(a => a.id === id);

    if (index === -1) return null;

    const updated = {
      ...store.articles[index],
      ...patch,
      updatedAt: new Date().toISOString()
    };
    store.articles[index] = updated;
    this.saveStore(store);
    return updated;
  }

  async getBySlug(slug: string): Promise<NewsPost | null> {
    const store = this.loadStore();
    return store.articles.find(a => a.slug === slug) || null;
  }

  async getById(id: string): Promise<NewsPost | null> {
    const store = this.loadStore();
    return store.articles.find(a => a.id === id) || null;
  }

  async list(options: ListOptions): Promise<{ items: NewsPost[]; total: number }> {
    const store = this.loadStore();
    let items = [...store.articles];

    if (options.status) {
      items = items.filter(a => a.status === options.status);
    }

    if (options.tag) {
      items = items.filter(a => a.tags.includes(options.tag!));
    }

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = items.length;
    const offset = options.offset || 0;
    const limit = options.limit || 20;

    items = items.slice(offset, offset + limit);

    return { items, total };
  }

  async publish(id: string): Promise<NewsPost | null> {
    return this.update(id, {
      status: "published",
      publishedAt: new Date().toISOString()
    });
  }

  async delete(id: string): Promise<boolean> {
    const store = this.loadStore();
    const index = store.articles.findIndex(a => a.id === id);
    if (index === -1) return false;
    store.articles.splice(index, 1);
    this.saveStore(store);
    return true;
  }

  async createDistributionJob(job: Omit<NewsDistributionJob, "id">): Promise<NewsDistributionJob> {
    const store = this.loadStore();
    const newJob: NewsDistributionJob = { ...job, id: generateId() };
    store.distributionJobs.push(newJob);
    this.saveStore(store);
    return newJob;
  }

  async updateDistributionJob(id: string, patch: Partial<NewsDistributionJob>): Promise<NewsDistributionJob | null> {
    const store = this.loadStore();
    const index = store.distributionJobs.findIndex(j => j.id === id);
    if (index === -1) return null;
    store.distributionJobs[index] = { ...store.distributionJobs[index], ...patch };
    this.saveStore(store);
    return store.distributionJobs[index];
  }

  async getDistributionJobs(postId: string): Promise<NewsDistributionJob[]> {
    const store = this.loadStore();
    return store.distributionJobs.filter(j => j.postId === postId);
  }

  async getPendingJobs(): Promise<NewsDistributionJob[]> {
    const store = this.loadStore();
    return store.distributionJobs.filter(j => j.status === "queued");
  }

  /**
   * Ensure outbox jobs exist for all 15 platforms (idempotent)
   * Creates/updates jobs based on current platform settings
   */
  async ensureOutboxForPost(
    postId: string,
    settings: Record<string, { enabled: boolean }>,
    siteUrl: string
  ): Promise<NewsDistributionJob[]> {
    const store = this.loadStore();
    const post = store.articles.find(a => a.id === postId);

    if (!post) {
      throw new Error(`Post not found: ${postId}`);
    }

    const now = new Date().toISOString();
    const platformIds = Object.keys(settings);
    const result: NewsDistributionJob[] = [];

    for (const platformId of platformIds) {
      const setting = settings[platformId];
      const existingJob = store.distributionJobs.find(
        j => j.postId === postId && j.platform === platformId
      );

      const utmUrl = `${siteUrl}/news/${post.slug}?utm_source=${platformId}&utm_medium=social&utm_campaign=news&utm_content=${post.slug}`;

      const payload = {
        title: post.title,
        excerpt: post.excerpt,
        url: utmUrl,
        image: post.coverImageUrl,
        tags: post.tags,
        publishedAt: post.publishedAt
      };

      if (existingJob) {
        // Update existing job
        const newStatus = setting.enabled
          ? (existingJob.status === "posted" || existingJob.status === "published" ? existingJob.status : "queued")
          : "disabled";

        const index = store.distributionJobs.findIndex(j => j.id === existingJob.id);
        store.distributionJobs[index] = {
          ...existingJob,
          status: newStatus as NewsDistributionJob["status"],
          payload,
          backlinkUrl: utmUrl,
          updatedAt: now
        };
        result.push(store.distributionJobs[index]);
      } else {
        // Create new job
        const newJob: NewsDistributionJob = {
          id: generateId(),
          postId,
          platform: platformId,
          status: setting.enabled ? "queued" : "disabled",
          attempts: 0,
          scheduledAt: now,
          postedAt: null,
          remoteUrl: null,
          backlinkUrl: utmUrl,
          lastError: null,
          payload,
          createdAt: now,
          updatedAt: now
        };
        store.distributionJobs.push(newJob);
        result.push(newJob);
      }
    }

    this.saveStore(store);
    return result;
  }

  /**
   * Get queued jobs for n8n dispatch
   */
  async getQueuedJobs(options?: { limit?: number; platforms?: string[] }): Promise<NewsDistributionJob[]> {
    const store = this.loadStore();
    let jobs = store.distributionJobs.filter(j => j.status === "queued");

    if (options?.platforms && options.platforms.length > 0) {
      jobs = jobs.filter(j => options.platforms!.includes(j.platform));
    }

    if (options?.limit) {
      jobs = jobs.slice(0, options.limit);
    }

    // Mark as posting to prevent double dispatch
    const now = new Date().toISOString();
    for (const job of jobs) {
      const index = store.distributionJobs.findIndex(j => j.id === job.id);
      if (index !== -1) {
        store.distributionJobs[index].status = "posting";
        store.distributionJobs[index].updatedAt = now;
      }
    }
    this.saveStore(store);

    return jobs;
  }

  /**
   * Mark jobs batch from n8n callback
   */
  async markJobsBatch(
    results: Array<{ id: string; status: string; remoteUrl?: string; error?: string }>
  ): Promise<NewsDistributionJob[]> {
    const store = this.loadStore();
    const now = new Date().toISOString();
    const updated: NewsDistributionJob[] = [];

    for (const result of results) {
      const index = store.distributionJobs.findIndex(j => j.id === result.id);
      if (index === -1) continue;

      const job = store.distributionJobs[index];
      job.status = result.status as NewsDistributionJob["status"];
      job.updatedAt = now;

      if (result.status === "published" || result.status === "posted") {
        job.postedAt = now;
        job.remoteUrl = result.remoteUrl || null;
      }

      if (result.status === "failed") {
        job.lastError = result.error || "Unknown error";
        job.attempts = (job.attempts || 0) + 1;
      }

      updated.push(job);
    }

    this.saveStore(store);
    return updated;
  }
}

export const newsRepository = new FileNewsRepository();
