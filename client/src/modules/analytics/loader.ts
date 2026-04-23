/**
 * Analytics Loader Module
 * @module analytics/loader
 * @description Safe injection of third-party analytics scripts
 */

import { getConfig, type AnalyticsConfig } from './config';
import { canRunAnalytics } from './consent';

let initialized = false;

/**
 * Inject GTM script into head
 * @param gtmId - Google Tag Manager ID
 */
function loadGTM(gtmId: string): void {
  if (document.getElementById('gtm-script')) return;

  const script = document.createElement('script');
  script.id = 'gtm-script';
  script.async = true;
  script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `;
  document.head.appendChild(script);
}

/**
 * Inject GA4 script into head
 * @param gaTagId - Google Analytics 4 Tag ID
 */
function loadGA4(gaTagId: string): void {
  if (document.getElementById('ga4-script')) return;
  // Skip if inline gtag уже загружен в index.html (безопаснее, чем React-инициализация)
  if (typeof (window as any).gtag === 'function') return;

  const script = document.createElement('script');
  script.id = 'ga4-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaTagId}`;
  document.head.appendChild(script);

  const initScript = document.createElement('script');
  initScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaTagId}');
  `;
  document.head.appendChild(initScript);
}

/**
 * Inject Yandex Metrika script into head
 * @param ymTagId - Yandex Metrika counter ID
 */
function loadYM(ymTagId: string): void {
  if (document.getElementById('ym-script')) return;
  // Skip if inline ym уже загружен в index.html
  if (typeof (window as any).ym === 'function') return;

  const script = document.createElement('script');
  script.id = 'ym-script';
  script.innerHTML = `
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    ym(${ymTagId}, "init", {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true,
      webvisor:true
    });
  `;
  document.head.appendChild(script);
}

/**
 * Inject Hotjar script into head
 * @param hotjarId - Hotjar Site ID
 */
function loadHotjar(hotjarId: string): void {
  if (document.getElementById('hotjar-script')) return;

  const script = document.createElement('script');
  script.id = 'hotjar-script';
  script.innerHTML = `
    (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:${hotjarId},hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script');r.async=1;
      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  `;
  document.head.appendChild(script);
}

/**
 * Initialize dataLayer if not exists
 */
function initDataLayer(): void {
  if (typeof window === 'undefined') return;

  if (!(window as any).dataLayer) {
    (window as any).dataLayer = [];
  }
}

/**
 * Initialize all analytics services based on config and consent
 * @returns True if initialized successfully
 */
export function initAnalytics(): boolean {
  if (typeof window === 'undefined') return false;
  if (initialized) return true;

  // Не запускать аналитику на localhost (dev-сессии)
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
    initialized = true;
    return false;
  }

  const config = getConfig();

  initDataLayer();

  if (!config.enabled) {
    if (config.debug) {
      console.log('[Analytics] Disabled via VITE_ANALYTICS_ENABLED=0');
    }
    initialized = true;
    return true;
  }

  const hasConsent = canRunAnalytics(config.debug);

  if (!hasConsent) {
    if (config.debug) {
      console.log('[Analytics] No consent - external scripts not loaded');
    }
    initialized = true;
    return true;
  }

  if (config.gtmId) {
    loadGTM(config.gtmId);
    if (config.debug) console.log('[Analytics] GTM loaded:', config.gtmId);
  }

  if (config.gaTagId) {
    loadGA4(config.gaTagId);
    if (config.debug) console.log('[Analytics] GA4 loaded:', config.gaTagId);
  }

  if (config.ymTagId) {
    loadYM(config.ymTagId);
    if (config.debug) console.log('[Analytics] YM loaded:', config.ymTagId);
  }

  if (config.hotjarId) {
    loadHotjar(config.hotjarId);
    if (config.debug) console.log('[Analytics] Hotjar loaded:', config.hotjarId);
  }

  initialized = true;
  return true;
}

/**
 * Check if analytics has been initialized
 * @returns True if initialized
 */
export function isInitialized(): boolean {
  return initialized;
}

/**
 * Re-initialize analytics after consent is granted
 */
export function reinitializeOnConsent(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('analytics:consent-granted', () => {
    initialized = false;
    initAnalytics();
  });
}
