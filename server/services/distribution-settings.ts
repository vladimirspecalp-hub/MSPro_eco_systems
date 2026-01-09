/**
 * Distribution Settings Service
 * Управление настройками 15 платформ дистрибуции
 * @module server/services/distribution-settings
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { NEWS_PLATFORMS, PLATFORM_IDS } from "../../shared/newsPlatforms";

export interface PlatformSetting {
  enabled: boolean;
  profileUrl: string | null;
  webhookTokenPlaceholder: string | null;
  updatedAt: string | null;
}

export interface SettingsStore {
  platforms: Record<string, PlatformSetting>;
  lastUpdated: string | null;
}

export interface AggregatedStatus {
  lastStatus: string | null;
  lastAttemptAt: string | null;
  publishedCount: number;
  failedCount: number;
}

const SETTINGS_PATH = resolve(process.cwd(), "content/news_distribution_settings.json");
const NEWS_STORE_PATH = resolve(process.cwd(), "content/news_store.json");

function getDefaultSettings(): SettingsStore {
  const platforms: Record<string, PlatformSetting> = {};
  for (const id of PLATFORM_IDS) {
    platforms[id] = {
      enabled: false,
      profileUrl: null,
      webhookTokenPlaceholder: null,
      updatedAt: null
    };
  }
  return { platforms, lastUpdated: null };
}

class DistributionSettingsService {
  private cache: SettingsStore | null = null;

  private loadSettings(): SettingsStore {
    if (this.cache) return this.cache;

    if (!existsSync(SETTINGS_PATH)) {
      const defaults = getDefaultSettings();
      writeFileSync(SETTINGS_PATH, JSON.stringify(defaults, null, 2));
      this.cache = defaults;
      return defaults;
    }

    const data = readFileSync(SETTINGS_PATH, "utf-8");
    this.cache = JSON.parse(data);
    return this.cache!;
  }

  private saveSettings(store: SettingsStore): void {
    store.lastUpdated = new Date().toISOString();
    this.cache = store;
    writeFileSync(SETTINGS_PATH, JSON.stringify(store, null, 2));
  }

  /**
   * Получить настройки всех платформ
   */
  getPlatformSettings(): Record<string, PlatformSetting> {
    const store = this.loadSettings();
    return store.platforms;
  }

  /**
   * Получить настройку одной платформы
   */
  getPlatformSetting(platformId: string): PlatformSetting | null {
    const store = this.loadSettings();
    return store.platforms[platformId] || null;
  }

  /**
   * Обновить настройку платформы
   */
  updatePlatformSetting(
    platformId: string,
    patch: Partial<PlatformSetting>
  ): PlatformSetting | null {
    if (!PLATFORM_IDS.includes(platformId)) {
      return null;
    }

    const store = this.loadSettings();
    const current = store.platforms[platformId] || getDefaultSettings().platforms[platformId];

    store.platforms[platformId] = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString()
    };

    this.saveSettings(store);
    return store.platforms[platformId];
  }

  /**
   * Обновить несколько настроек сразу
   */
  updateMultiplePlatformSettings(
    updates: Array<{ platformId: string } & Partial<PlatformSetting>>
  ): Record<string, PlatformSetting> {
    const store = this.loadSettings();

    for (const update of updates) {
      const { platformId, ...patch } = update;
      if (!PLATFORM_IDS.includes(platformId)) continue;

      const current = store.platforms[platformId] || getDefaultSettings().platforms[platformId];
      store.platforms[platformId] = {
        ...current,
        ...patch,
        updatedAt: new Date().toISOString()
      };
    }

    this.saveSettings(store);
    return store.platforms;
  }

  /**
   * Получить агрегированный статус по каждой платформе
   * (последний статус и дата последней попытки из distributionJobs)
   */
  getAggregatedStatus(): Record<string, AggregatedStatus> {
    const result: Record<string, AggregatedStatus> = {};

    for (const id of PLATFORM_IDS) {
      result[id] = {
        lastStatus: null,
        lastAttemptAt: null,
        publishedCount: 0,
        failedCount: 0
      };
    }

    if (!existsSync(NEWS_STORE_PATH)) {
      return result;
    }

    try {
      const storeData = readFileSync(NEWS_STORE_PATH, "utf-8");
      const store = JSON.parse(storeData);
      const jobs = store.distributionJobs || [];

      for (const job of jobs) {
        if (!result[job.platform]) continue;

        const agg = result[job.platform];

        if (job.status === "posted" || job.status === "published") {
          agg.publishedCount++;
        } else if (job.status === "failed") {
          agg.failedCount++;
        }

        const attemptAt = job.postedAt || job.scheduledAt;
        if (attemptAt) {
          if (!agg.lastAttemptAt || new Date(attemptAt) > new Date(agg.lastAttemptAt)) {
            agg.lastAttemptAt = attemptAt;
            agg.lastStatus = job.status;
          }
        }
      }
    } catch (e) {
      console.error("Failed to aggregate distribution status:", e);
    }

    return result;
  }

  /**
   * Получить публичные настройки (без секретов)
   */
  getPublicSettings(): Record<string, { enabled: boolean; profileUrl: string | null }> {
    const settings = this.getPlatformSettings();
    const result: Record<string, { enabled: boolean; profileUrl: string | null }> = {};

    for (const [id, setting] of Object.entries(settings)) {
      result[id] = {
        enabled: setting.enabled,
        profileUrl: setting.profileUrl
      };
    }

    return result;
  }

  /**
   * Сброс кэша (для тестов)
   */
  clearCache(): void {
    this.cache = null;
  }
}

export const distributionSettingsService = new DistributionSettingsService();
