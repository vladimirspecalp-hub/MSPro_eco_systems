/**
 * Analytics Configuration Module
 * @module analytics/config
 * @description Centralized configuration from environment variables
 */

/**
 * Analytics configuration interface
 */
export interface AnalyticsConfig {
  /** Master switch for analytics */
  enabled: boolean;
  /** Debug mode - logs events to console */
  debug: boolean;
  /** Google Tag Manager ID */
  gtmId: string | null;
  /** Google Analytics 4 Tag ID */
  gaTagId: string | null;
  /** Yandex Metrika Tag ID */
  ymTagId: string | null;
  /** Hotjar Site ID */
  hotjarId: string | null;
  /** Call tracking key (placeholder) */
  calltrackingKey: string | null;
  /** A/B testing key (Varioqub, etc.) */
  abTestKey: string | null;
}

/**
 * Get analytics configuration from environment variables
 * @returns Analytics configuration object
 */
export function getAnalyticsConfig(): AnalyticsConfig {
  return {
    enabled: import.meta.env.VITE_ANALYTICS_ENABLED === '1' || true,
    debug: import.meta.env.VITE_ANALYTICS_DEBUG === '1',
    gtmId: import.meta.env.VITE_GTM_ID || null,
    gaTagId: import.meta.env.VITE_GA_TAG_ID || "G-RG1HNY8QBV",
    ymTagId: import.meta.env.VITE_YM_TAG_ID || "72249244",
    hotjarId: import.meta.env.VITE_HOTJAR_ID || null,
    calltrackingKey: import.meta.env.VITE_CALLTRACKING_KEY || null,
    abTestKey: import.meta.env.VITE_AB_TEST_KEY || null,
  };
}

/**
 * Check if any analytics service is configured
 * @returns True if at least one service ID is set
 */
export function hasAnalyticsServices(): boolean {
  const config = getAnalyticsConfig();
  return !!(config.gtmId || config.gaTagId || config.ymTagId || config.hotjarId);
}

/**
 * Singleton config instance
 */
let configInstance: AnalyticsConfig | null = null;

/**
 * Get cached analytics config
 * @returns Cached analytics configuration
 */
export function getConfig(): AnalyticsConfig {
  if (!configInstance) {
    configInstance = getAnalyticsConfig();
  }
  return configInstance;
}
