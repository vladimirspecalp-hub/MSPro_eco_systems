/**
 * Event Delegation Module
 * @module analytics/delegation
 * @description Automatic tracking via data-track attributes
 */

import { track } from './track';
import { getConfig } from './config';

/**
 * Initialize event delegation for automatic tracking
 * Looks for elements with data-track attribute
 * 
 * @example HTML:
 * <button data-track="cta_click" data-track-meta='{"ctaId":"hero-cta"}'>
 *   Click me
 * </button>
 */
export function initEventDelegation(): void {
  if (typeof window === 'undefined') return;
  
  document.addEventListener('click', handleClick, { capture: true });
  
  const config = getConfig();
  if (config.debug) {
    console.log('[Analytics] Event delegation initialized');
  }
}

/**
 * Handle delegated click events
 * @param e - Click event
 */
function handleClick(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  const trackElement = target.closest('[data-track]') as HTMLElement | null;
  
  if (!trackElement) return;
  
  const eventType = trackElement.dataset.track;
  if (!eventType) return;
  
  let meta: Record<string, unknown> = {};
  const metaStr = trackElement.dataset.trackMeta;
  
  if (metaStr) {
    try {
      meta = JSON.parse(metaStr);
    } catch (e) {
      console.warn('[Analytics] Invalid data-track-meta JSON:', metaStr);
    }
  }
  
  if (trackElement.tagName === 'A') {
    const href = (trackElement as HTMLAnchorElement).href;
    
    if (href.startsWith('tel:')) {
      meta.placement = meta.placement || trackElement.dataset.trackPlacement || 'unknown';
      track('phone_click', meta);
      return;
    }
    
    if (href.includes('t.me') || href.includes('telegram')) {
      meta.platform = 'telegram';
      meta.placement = meta.placement || trackElement.dataset.trackPlacement || 'unknown';
      track('messenger_click', meta);
      return;
    }
    
    if (href.includes('wa.me') || href.includes('whatsapp')) {
      meta.platform = 'whatsapp';
      meta.placement = meta.placement || trackElement.dataset.trackPlacement || 'unknown';
      track('messenger_click', meta);
      return;
    }
    
    const fileExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar'];
    const isFile = fileExtensions.some(ext => href.toLowerCase().includes(ext));
    if (isFile) {
      const fileName = href.split('/').pop() || '';
      const fileType = fileName.split('.').pop() || 'unknown';
      track('file_download', { fileType, fileName });
      return;
    }
  }
  
  track(eventType, meta);
}

/**
 * Clean up event delegation
 */
export function destroyEventDelegation(): void {
  if (typeof window === 'undefined') return;
  document.removeEventListener('click', handleClick, { capture: true });
}
