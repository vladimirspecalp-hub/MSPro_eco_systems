/**
 * Analytics Scaffold v1
 * @module analytics
 * @description Unified analytics layer with dataLayer integration
 * 
 * @example
 * // In App.tsx
 * import { initAnalytics, useSpaPageView, initEventDelegation } from '@/modules/analytics';
 * 
 * function App() {
 *   useEffect(() => {
 *     initAnalytics();
 *     initEventDelegation();
 *   }, []);
 *   
 *   useSpaPageView();
 *   
 *   return <Router />;
 * }
 */

export { getConfig, getAnalyticsConfig, hasAnalyticsServices } from './config';
export type { AnalyticsConfig } from './config';

export { getConsent, setConsent, hasConsentChoice, resetConsent, canRunAnalytics } from './consent';

export { initAnalytics, isInitialized, reinitializeOnConsent } from './loader';

export { 
  track,
  trackPageView,
  trackCTAClick,
  trackFormStart,
  trackFormSubmit,
  trackPhoneClick,
  trackMessengerClick,
  trackCalcStart,
  trackCalcSubmit,
  trackNewsOpen,
  trackShareClick,
  trackFileDownload
} from './track';

export type {
  AnalyticsEvent,
  EventType,
  CTAClickMeta,
  FormMeta,
  PhoneClickMeta,
  MessengerClickMeta,
  FileDownloadMeta,
  NewsMeta,
  ShareClickMeta
} from './events';
export { generateSessionId, getPageContext } from './events';

export { useSpaPageView, trackVirtualPageView } from './spa';

export { initEventDelegation, destroyEventDelegation } from './delegation';
