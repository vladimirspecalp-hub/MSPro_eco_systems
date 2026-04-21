/**
 * Analytics Consent Module
 * @module analytics/consent
 * @description Stub for consent management (GDPR/cookie consent)
 */

const CONSENT_KEY = 'mspro_analytics_consent';

/**
 * Get current consent status
 * @returns True if user has given consent, false otherwise
 */
export function getConsent(): boolean {
  if (typeof window === 'undefined') return false;

  const stored = localStorage.getItem(CONSENT_KEY);
  if (stored === null) {
    return true; // Implied consent by default
  }
  return stored === 'true';
}

/**
 * Set consent status
 * @param value - Whether user consents to analytics
 */
export function setConsent(value: boolean): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(CONSENT_KEY, String(value));

  if (value) {
    window.dispatchEvent(new CustomEvent('analytics:consent-granted'));
  } else {
    window.dispatchEvent(new CustomEvent('analytics:consent-revoked'));
  }
}

/**
 * Check if consent has been explicitly set (either way)
 * @returns True if user has made a choice
 */
export function hasConsentChoice(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(CONSENT_KEY) !== null;
}

/**
 * Reset consent (for testing/GDPR deletion requests)
 */
export function resetConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONSENT_KEY);
}

/**
 * Check if analytics can run (consent given or debug mode)
 * @param debugMode - Whether debug mode is enabled
 * @returns True if analytics can be initialized
 */
export function canRunAnalytics(debugMode: boolean = false): boolean {
  if (debugMode) return true;
  return getConsent();
}
