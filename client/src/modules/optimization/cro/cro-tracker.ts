export interface ConversionEvent {
  id: string;
  type: 'form_submit' | 'cta_click' | 'phone_click' | 'calculator_use' | 'download';
  page: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface ConversionGoal {
  id: string;
  name: string;
  targetCount: number;
  currentCount: number;
  value: number;
}

const conversions: ConversionEvent[] = [];

export function trackConversion(
  type: ConversionEvent['type'],
  metadata?: Record<string, unknown>
): ConversionEvent {
  const event: ConversionEvent = {
    id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    page: typeof window !== 'undefined' ? window.location.pathname : '',
    timestamp: Date.now(),
    metadata,
  };

  conversions.push(event);
  
  sendToAnalytics(event);
  
  return event;
}

export function trackFormSubmit(formId: string, formData?: Record<string, unknown>): void {
  trackConversion('form_submit', { formId, ...formData });
}

export function trackCTAClick(ctaId: string, ctaText?: string): void {
  trackConversion('cta_click', { ctaId, ctaText });
}

export function trackPhoneClick(phoneNumber: string): void {
  trackConversion('phone_click', { phoneNumber });
}

export function trackCalculatorUse(result?: number): void {
  trackConversion('calculator_use', { result });
}

export function getConversions(): ConversionEvent[] {
  return [...conversions];
}

export function getConversionsByType(type: ConversionEvent['type']): ConversionEvent[] {
  return conversions.filter(c => c.type === type);
}

export function getConversionRate(conversionsCount: number, visitors: number): number {
  if (visitors === 0) return 0;
  return Math.round((conversionsCount / visitors) * 10000) / 100;
}

function sendToAnalytics(event: ConversionEvent): void {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event.type, {
      event_category: 'conversion',
      event_label: event.page,
      ...event.metadata,
    });
  }

  if (typeof window !== 'undefined' && (window as any).ym) {
    (window as any).ym('reachGoal', event.type, event.metadata);
  }
}
