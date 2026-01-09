/**
 * Analytics Events Type Definitions
 * @module analytics/events
 * @description Strict event types and contracts
 */

/**
 * Base event structure for dataLayer
 */
export interface AnalyticsEvent {
  /** Event name */
  event: string;
  /** Timestamp (Date.now()) */
  ts: number;
  /** Page context */
  page: {
    path: string;
    title?: string;
    referrer?: string;
  };
  /** Session context */
  session: {
    id: string;
  };
  /** Geo context (from personalization) */
  geo?: {
    region?: string;
    regionCode?: string;
  };
  /** A/B test context */
  ab?: {
    experimentKey?: string;
    variant?: string;
  };
  /** Additional metadata (NO PII!) */
  meta?: Record<string, unknown>;
}

/**
 * Supported event types
 */
export type EventType =
  | 'page_view'
  | 'cta_click'
  | 'form_start'
  | 'form_submit'
  | 'phone_click'
  | 'messenger_click'
  | 'file_download'
  | 'calc_start'
  | 'calc_submit'
  | 'news_open'
  | 'share_click'
  | 'scroll_depth'
  | 'video_play'
  | 'custom';

/**
 * CTA click event metadata
 */
export interface CTAClickMeta {
  ctaId: string;
  placement?: string;
  ctaText?: string;
}

/**
 * Form event metadata
 */
export interface FormMeta {
  formId: string;
  formType?: string;
}

/**
 * Phone click event metadata (NO phone number!)
 */
export interface PhoneClickMeta {
  placement: string;
}

/**
 * Messenger click event metadata
 */
export interface MessengerClickMeta {
  platform: 'telegram' | 'whatsapp' | 'viber' | 'other';
  placement?: string;
}

/**
 * File download event metadata
 */
export interface FileDownloadMeta {
  fileType: string;
  fileName?: string;
}

/**
 * News event metadata
 */
export interface NewsMeta {
  slug: string;
  category?: string;
}

/**
 * Share click event metadata
 */
export interface ShareClickMeta {
  platform: string;
  slug?: string;
}

/**
 * Scroll depth event metadata
 */
export interface ScrollDepthMeta {
  depth: 25 | 50 | 75 | 100;
}

/**
 * Generate unique session ID
 * @returns Session ID string
 */
export function generateSessionId(): string {
  const stored = sessionStorage.getItem('mspro_session_id');
  if (stored) return stored;
  
  const newId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('mspro_session_id', newId);
  return newId;
}

/**
 * Get current page context
 * @returns Page context object
 */
export function getPageContext(): AnalyticsEvent['page'] {
  if (typeof window === 'undefined') {
    return { path: '/' };
  }
  
  return {
    path: window.location.pathname,
    title: document.title,
    referrer: document.referrer || undefined,
  };
}
