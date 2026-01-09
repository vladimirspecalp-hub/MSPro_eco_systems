/**
 * SPA Page View Tracking Module
 * @module analytics/spa
 * @description Wouter integration for SPA page_view events
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from './track';
import { getConfig } from './config';

/**
 * Hook for tracking SPA page views with wouter
 * Call this once in your App component
 * 
 * @example
 * function App() {
 *   useSpaPageView();
 *   return <Router />;
 * }
 */
export function useSpaPageView(): void {
  const [location] = useLocation();
  const prevLocation = useRef<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      trackPageView();
      prevLocation.current = location;
      isFirstRender.current = false;
      
      const config = getConfig();
      if (config.debug) {
        console.log('[Analytics] Initial page_view:', location);
      }
      return;
    }

    if (location !== prevLocation.current) {
      trackPageView();
      prevLocation.current = location;
      
      const config = getConfig();
      if (config.debug) {
        console.log('[Analytics] SPA navigation page_view:', location);
      }
    }
  }, [location]);
}

/**
 * Track virtual page view (for modals, tabs, etc.)
 * @param virtualPath - Virtual path to track
 * @param title - Page title
 */
export function trackVirtualPageView(virtualPath: string, title?: string): void {
  trackPageView(virtualPath, title);
}
