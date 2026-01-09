export interface SXOMetrics {
  pageLoadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export function collectWebVitals(): Promise<Partial<SXOMetrics>> {
  return new Promise((resolve) => {
    const metrics: Partial<SXOMetrics> = {};

    if (typeof window === 'undefined' || !window.performance) {
      resolve(metrics);
      return;
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      metrics.pageLoadTime = navigation.loadEventEnd - navigation.startTime;
      metrics.timeToInteractive = navigation.domInteractive - navigation.startTime;
    }

    const paintEntries = performance.getEntriesByType('paint');
    for (const entry of paintEntries) {
      if (entry.name === 'first-contentful-paint') {
        metrics.firstContentfulPaint = entry.startTime;
      }
    }

    resolve(metrics);
  });
}

export function calculatePerformanceScore(metrics: Partial<SXOMetrics>): number {
  let score = 100;

  if (metrics.pageLoadTime) {
    if (metrics.pageLoadTime > 3000) score -= 20;
    else if (metrics.pageLoadTime > 2000) score -= 10;
  }

  if (metrics.firstContentfulPaint) {
    if (metrics.firstContentfulPaint > 2500) score -= 15;
    else if (metrics.firstContentfulPaint > 1800) score -= 7;
  }

  if (metrics.largestContentfulPaint) {
    if (metrics.largestContentfulPaint > 4000) score -= 20;
    else if (metrics.largestContentfulPaint > 2500) score -= 10;
  }

  if (metrics.cumulativeLayoutShift) {
    if (metrics.cumulativeLayoutShift > 0.25) score -= 15;
    else if (metrics.cumulativeLayoutShift > 0.1) score -= 7;
  }

  return Math.max(0, score);
}

export function getPerformanceGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}
