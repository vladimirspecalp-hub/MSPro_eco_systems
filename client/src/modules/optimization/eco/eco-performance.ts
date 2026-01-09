export interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
  tti: number;
}

export interface PerformanceScore {
  overall: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  metrics: PerformanceMetrics;
  recommendations: string[];
}

const THRESHOLDS = {
  lcp: { good: 2500, needs: 4000 },
  fid: { good: 100, needs: 300 },
  cls: { good: 0.1, needs: 0.25 },
  fcp: { good: 1800, needs: 3000 },
  ttfb: { good: 800, needs: 1800 },
  tti: { good: 3800, needs: 7300 },
};

export async function measurePerformance(): Promise<Partial<PerformanceMetrics>> {
  if (typeof window === 'undefined' || !window.performance) {
    return {};
  }

  const metrics: Partial<PerformanceMetrics> = {};

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    metrics.ttfb = navigation.responseStart - navigation.requestStart;
  }

  const paintEntries = performance.getEntriesByType('paint');
  for (const entry of paintEntries) {
    if (entry.name === 'first-contentful-paint') {
      metrics.fcp = entry.startTime;
    }
  }

  return metrics;
}

export function calculateScore(metrics: Partial<PerformanceMetrics>): PerformanceScore {
  let totalScore = 100;
  const recommendations: string[] = [];

  if (metrics.lcp !== undefined) {
    if (metrics.lcp > THRESHOLDS.lcp.needs) {
      totalScore -= 25;
      recommendations.push('LCP слишком высокий. Оптимизируйте главное изображение.');
    } else if (metrics.lcp > THRESHOLDS.lcp.good) {
      totalScore -= 10;
    }
  }

  if (metrics.cls !== undefined) {
    if (metrics.cls > THRESHOLDS.cls.needs) {
      totalScore -= 20;
      recommendations.push('Высокий CLS. Зарезервируйте место для изображений.');
    } else if (metrics.cls > THRESHOLDS.cls.good) {
      totalScore -= 8;
    }
  }

  if (metrics.fcp !== undefined) {
    if (metrics.fcp > THRESHOLDS.fcp.needs) {
      totalScore -= 15;
      recommendations.push('Медленный FCP. Уменьшите размер критического CSS.');
    } else if (metrics.fcp > THRESHOLDS.fcp.good) {
      totalScore -= 5;
    }
  }

  if (metrics.ttfb !== undefined) {
    if (metrics.ttfb > THRESHOLDS.ttfb.needs) {
      totalScore -= 15;
      recommendations.push('Высокий TTFB. Проверьте серверную производительность.');
    } else if (metrics.ttfb > THRESHOLDS.ttfb.good) {
      totalScore -= 5;
    }
  }

  totalScore = Math.max(0, totalScore);

  let grade: PerformanceScore['grade'];
  if (totalScore >= 90) grade = 'A';
  else if (totalScore >= 80) grade = 'B';
  else if (totalScore >= 70) grade = 'C';
  else if (totalScore >= 60) grade = 'D';
  else grade = 'F';

  if (recommendations.length === 0) {
    recommendations.push('Производительность в норме. Продолжайте мониторинг.');
  }

  return {
    overall: totalScore,
    grade,
    metrics: metrics as PerformanceMetrics,
    recommendations,
  };
}
