/**
 * Analytics Track Module
 * @module analytics/track
 * @description Unified tracking function with dataLayer integration
 */

import { getConfig } from './config';
import {
  type EventType,
  type AnalyticsEvent,
  generateSessionId,
  getPageContext
} from './events';

/**
 * Push event to dataLayer
 * @param event - Analytics event object
 */
function pushToDataLayer(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;

  if (!(window as any).dataLayer) {
    (window as any).dataLayer = [];
  }

  (window as any).dataLayer.push(event);
}

/**
 * Log event to console (debug mode)
 * @param event - Analytics event object
 */
function debugLog(event: AnalyticsEvent): void {
  console.log(
    '%c[Analytics]%c ' + event.event,
    'background: #4F46E5; color: white; padding: 2px 6px; border-radius: 3px;',
    'color: #4F46E5; font-weight: bold;',
    event
  );
}

/**
 * Send event to backend UX endpoint (optional)
 * @param event - Analytics event object
 */
async function sendToBackend(event: AnalyticsEvent): Promise<void> {
  try {
    await fetch('/api/ux/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: event.event,
        page: event.page?.path || window.location.pathname,
        sessionId: event.session.id,
        element: (event.meta as Record<string, unknown>)?.ctaId as string || undefined,
        value: event.meta,
        timestamp: new Date(event.ts).toISOString(),
      })
    });
  } catch (e) {
  }
}

/**
 * Get geo context from personalization (if available)
 * @returns Geo context or undefined
 */
function getGeoContext(): AnalyticsEvent['geo'] | undefined {
  if (typeof window === 'undefined') return undefined;

  const geoData = (window as any).__MSPRO_GEO__;
  if (geoData) {
    return {
      region: geoData.region,
      regionCode: geoData.regionCode
    };
  }
  return undefined;
}

/**
 * Get A/B test context (if available)
 * @returns A/B context or undefined
 */
function getABContext(): AnalyticsEvent['ab'] | undefined {
  if (typeof window === 'undefined') return undefined;

  const abData = (window as any).__MSPRO_AB__;
  if (abData) {
    return {
      experimentKey: abData.experimentKey,
      variant: abData.variant
    };
  }
  return undefined;
}

/**
 * Main tracking function - unified event dispatch
 * @param eventType - Type of event
 * @param meta - Event metadata (NO PII!)
 * @returns The created event object
 * 
 * @example
 * track('cta_click', { ctaId: 'hero-cta', placement: 'hero' });
 * track('form_submit', { formId: 'contact-form' });
 * track('phone_click', { placement: 'header' }); // NO phone number!
 */
export function track(
  eventType: EventType | string,
  meta?: Record<string, unknown>
): AnalyticsEvent {
  const config = getConfig();

  const event: AnalyticsEvent = {
    event: eventType,
    ts: Date.now(),
    page: getPageContext(),
    session: {
      id: generateSessionId()
    },
    geo: getGeoContext(),
    ab: getABContext(),
    meta
  };

  pushToDataLayer(event);

  if (config.debug) {
    debugLog(event);
  }

  if (config.enabled) {
    sendToBackend(event);
  }

  return event;
}

/**
 * Track page view event
 * @param path - Optional path override
 * @param title - Optional title override
 */
export function trackPageView(path?: string, title?: string): AnalyticsEvent {
  const pageContext = getPageContext();

  return track('page_view', {
    path: path || pageContext.path,
    title: title || pageContext.title
  });
}

/**
 * Track CTA click event
 * @param ctaId - CTA identifier
 * @param placement - Where CTA is located
 */
export function trackCTAClick(ctaId: string, placement?: string): AnalyticsEvent {
  return track('cta_click', { ctaId, placement });
}

/**
 * Track form start event (first interaction)
 * @param formId - Form identifier
 * @param formType - Form type (contact, calculator, etc.)
 */
export function trackFormStart(formId: string, formType?: string): AnalyticsEvent {
  return track('form_start', { formId, formType });
}

/**
 * Track form submit event
 * @param formId - Form identifier
 * @param formType - Form type
 */
export function trackFormSubmit(formId: string, formType?: string): AnalyticsEvent {
  return track('form_submit', { formId, formType });
}

/**
 * Track phone click event (NO phone number!)
 * @param placement - Where phone link is located
 */
export function trackPhoneClick(placement: string): AnalyticsEvent {
  return track('phone_click', { placement });
}

/**
 * Track messenger click event
 * @param platform - Messenger platform
 * @param placement - Where link is located
 */
export function trackMessengerClick(
  platform: 'telegram' | 'whatsapp' | 'viber' | 'other',
  placement?: string
): AnalyticsEvent {
  return track('messenger_click', { platform, placement });
}

/**
 * Track calculator start
 */
export function trackCalcStart(): AnalyticsEvent {
  return track('calc_start');
}

/**
 * Track calculator submit
 */
export function trackCalcSubmit(): AnalyticsEvent {
  return track('calc_submit');
}

/**
 * Track news article open
 * @param slug - Article slug
 * @param category - Article category
 */
export function trackNewsOpen(slug: string, category?: string): AnalyticsEvent {
  return track('news_open', { slug, category });
}

/**
 * Track share button click
 * @param platform - Share platform
 * @param slug - Content slug
 */
export function trackShareClick(platform: string, slug?: string): AnalyticsEvent {
  return track('share_click', { platform, slug });
}

/**
 * Track file download
 * @param fileType - File type/extension
 * @param fileName - File name (optional)
 */
export function trackFileDownload(fileType: string, fileName?: string): AnalyticsEvent {
  return track('file_download', { fileType, fileName });
}
