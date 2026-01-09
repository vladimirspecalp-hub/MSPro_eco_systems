/**
 * Distribution Service - управление кросспостингом на платформы
 * Pattern: Outbox + адаптеры платформ (заглушки)
 * @module server/services/distribution-service
 */

import { storage } from "../storage";
import { type NewsOutbox, type NewsArticle } from "@shared/schema";

/** Поддерживаемые платформы для кросспостинга */
export type Platform = 
  | "telegram" 
  | "vk" 
  | "dzen" 
  | "rss" 
  | "twitter" 
  | "linkedin"
  | "facebook";

/** Статусы распространения */
export type DistributionStatus = 
  | "pending" 
  | "processing" 
  | "completed" 
  | "failed" 
  | "skipped";

/** Результат публикации на платформу */
export interface DistributionResult {
  platform: Platform;
  status: DistributionStatus;
  externalId?: string;
  externalUrl?: string;
  errorMessage?: string;
}

/** Конфигурация платформы (заглушка) */
interface PlatformConfig {
  name: Platform;
  enabled: boolean;
  requiresAuth: boolean;
  maxLength?: number;
  supportsImages: boolean;
  supportsLinks: boolean;
}

/** Реестр платформ */
const PLATFORMS: Record<Platform, PlatformConfig> = {
  telegram: { 
    name: "telegram", 
    enabled: true, 
    requiresAuth: true, 
    maxLength: 4096,
    supportsImages: true,
    supportsLinks: true
  },
  vk: { 
    name: "vk", 
    enabled: true, 
    requiresAuth: true, 
    maxLength: 15895,
    supportsImages: true,
    supportsLinks: true
  },
  dzen: { 
    name: "dzen", 
    enabled: false, 
    requiresAuth: true, 
    supportsImages: true,
    supportsLinks: true
  },
  rss: { 
    name: "rss", 
    enabled: true, 
    requiresAuth: false, 
    supportsImages: true,
    supportsLinks: true
  },
  twitter: { 
    name: "twitter", 
    enabled: false, 
    requiresAuth: true, 
    maxLength: 280,
    supportsImages: true,
    supportsLinks: true
  },
  linkedin: { 
    name: "linkedin", 
    enabled: false, 
    requiresAuth: true, 
    maxLength: 3000,
    supportsImages: true,
    supportsLinks: true
  },
  facebook: { 
    name: "facebook", 
    enabled: false, 
    requiresAuth: true, 
    supportsImages: true,
    supportsLinks: true
  }
};

/**
 * Интерфейс адаптера платформы
 */
interface PlatformAdapter {
  publish(article: NewsArticle): Promise<DistributionResult>;
  validate(article: NewsArticle): boolean;
  formatContent(article: NewsArticle): string;
}

/**
 * Базовый класс адаптера (заглушка)
 */
class BasePlatformAdapter implements PlatformAdapter {
  protected platform: Platform;
  protected config: PlatformConfig;

  constructor(platform: Platform) {
    this.platform = platform;
    this.config = PLATFORMS[platform];
  }

  /**
   * Публикация на платформу (заглушка - логирует и возвращает mock)
   */
  async publish(article: NewsArticle): Promise<DistributionResult> {
    console.log(`[Distribution] Publishing to ${this.platform}: ${article.title}`);
    
    if (!this.config.enabled) {
      return {
        platform: this.platform,
        status: "skipped",
        errorMessage: `Platform ${this.platform} is disabled`
      };
    }

    if (!this.validate(article)) {
      return {
        platform: this.platform,
        status: "failed",
        errorMessage: "Validation failed"
      };
    }

    const mockExternalId = `${this.platform}_${Date.now()}`;
    const mockExternalUrl = `https://${this.platform}.com/post/${mockExternalId}`;

    return {
      platform: this.platform,
      status: "completed",
      externalId: mockExternalId,
      externalUrl: mockExternalUrl
    };
  }

  validate(article: NewsArticle): boolean {
    if (!article.title || !article.content) return false;
    if (this.config.maxLength && article.content.length > this.config.maxLength) {
      console.warn(`[Distribution] Content too long for ${this.platform}`);
    }
    return true;
  }

  formatContent(article: NewsArticle): string {
    const content = article.excerpt || article.content.substring(0, 500);
    const link = article.canonicalUrl ? `\n\nЧитать полностью: ${article.canonicalUrl}` : "";
    return `${article.title}\n\n${content}${link}`;
  }
}

/**
 * Telegram адаптер
 */
class TelegramAdapter extends BasePlatformAdapter {
  constructor() {
    super("telegram");
  }

  formatContent(article: NewsArticle): string {
    const hashtags = article.tags?.map(t => `#${t.replace(/\s+/g, '_')}`).join(' ') || '';
    return `📰 <b>${article.title}</b>\n\n${article.excerpt || ''}\n\n🔗 ${article.canonicalUrl}\n\n${hashtags}`;
  }
}

/**
 * VK адаптер
 */
class VKAdapter extends BasePlatformAdapter {
  constructor() {
    super("vk");
  }

  formatContent(article: NewsArticle): string {
    return `${article.title}\n\n${article.excerpt || article.content.substring(0, 1000)}\n\nПодробнее: ${article.canonicalUrl}`;
  }
}

export class DistributionService {
  private adapters: Map<Platform, PlatformAdapter>;

  constructor() {
    this.adapters = new Map([
      ["telegram", new TelegramAdapter()],
      ["vk", new VKAdapter()],
      ["dzen", new BasePlatformAdapter("dzen")],
      ["rss", new BasePlatformAdapter("rss")],
      ["twitter", new BasePlatformAdapter("twitter")],
      ["linkedin", new BasePlatformAdapter("linkedin")],
      ["facebook", new BasePlatformAdapter("facebook")],
    ]);
  }

  /**
   * Получить список доступных платформ
   */
  getAvailablePlatforms(): PlatformConfig[] {
    return Object.values(PLATFORMS);
  }

  /**
   * Получить включённые платформы
   */
  getEnabledPlatforms(): Platform[] {
    return Object.entries(PLATFORMS)
      .filter(([_, config]) => config.enabled)
      .map(([name]) => name as Platform);
  }

  /**
   * Обработать очередь outbox
   */
  async processOutbox(): Promise<DistributionResult[]> {
    const pending = await storage.getPendingOutbox();
    const results: DistributionResult[] = [];

    for (const entry of pending) {
      try {
        const article = await storage.getNewsArticle(entry.articleId);
        if (!article) {
          await storage.updateOutboxEntry(entry.id, {
            status: "failed",
            errorMessage: "Article not found",
            processedAt: new Date()
          });
          continue;
        }

        const adapter = this.adapters.get(entry.platform as Platform);
        if (!adapter) {
          await storage.updateOutboxEntry(entry.id, {
            status: "failed",
            errorMessage: `No adapter for platform: ${entry.platform}`,
            processedAt: new Date()
          });
          continue;
        }

        const result = await adapter.publish(article);
        
        await storage.updateOutboxEntry(entry.id, {
          status: result.status,
          externalId: result.externalId,
          externalUrl: result.externalUrl,
          errorMessage: result.errorMessage,
          processedAt: new Date(),
          attempts: (entry.attempts || 0) + 1
        });

        results.push(result);
      } catch (error: any) {
        await storage.updateOutboxEntry(entry.id, {
          status: "failed",
          errorMessage: error.message,
          processedAt: new Date(),
          attempts: (entry.attempts || 0) + 1
        });

        results.push({
          platform: entry.platform as Platform,
          status: "failed",
          errorMessage: error.message
        });
      }
    }

    return results;
  }

  /**
   * Распространить статью на указанные платформы
   */
  async distribute(articleId: string, platforms?: Platform[]): Promise<DistributionResult[]> {
    const article = await storage.getNewsArticle(articleId);
    if (!article) {
      throw new Error("Article not found");
    }

    const targetPlatforms = platforms || this.getEnabledPlatforms();
    const results: DistributionResult[] = [];

    for (const platform of targetPlatforms) {
      const existingEntries = await storage.getOutboxByArticle(articleId);
      const alreadyQueued = existingEntries.some(e => e.platform === platform);

      if (!alreadyQueued) {
        await storage.createOutboxEntry({
          articleId,
          platform,
          status: "pending",
          payload: JSON.stringify({
            title: article.title,
            excerpt: article.excerpt,
            url: article.canonicalUrl,
            image: article.coverImage
          }),
          scheduledAt: new Date()
        });
      }
    }

    return this.processOutbox();
  }

  /**
   * Получить форматированный контент для платформы
   */
  getFormattedContent(article: NewsArticle, platform: Platform): string {
    const adapter = this.adapters.get(platform);
    if (!adapter) {
      throw new Error(`No adapter for platform: ${platform}`);
    }
    return adapter.formatContent(article);
  }

  /**
   * Статистика распространения
   */
  async getStats(): Promise<{
    totalEntries: number;
    byStatus: Record<string, number>;
    byPlatform: Record<string, number>;
  }> {
    const pending = await storage.getPendingOutbox();
    
    return {
      totalEntries: pending.length,
      byStatus: { pending: pending.length },
      byPlatform: pending.reduce((acc, e) => {
        acc[e.platform] = (acc[e.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

export const distributionService = new DistributionService();
