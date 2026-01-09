import { measurePerformance, calculateScore } from '../eco/eco-performance';

export interface EcoAuditData {
  lighthouse: number;
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  recommendations: string[];
  coreWebVitals: {
    passed: boolean;
    details: Record<string, { value: number; status: 'good' | 'needs-improvement' | 'poor' }>;
  };
}

export async function collectEcoAudit(): Promise<EcoAuditData> {
  const metrics = await measurePerformance();
  const scoreResult = calculateScore(metrics);
  
  const coreWebVitals = {
    passed: true,
    details: {} as Record<string, { value: number; status: 'good' | 'needs-improvement' | 'poor' }>,
  };

  if (metrics.lcp !== undefined) {
    coreWebVitals.details.lcp = {
      value: metrics.lcp,
      status: metrics.lcp <= 2500 ? 'good' : metrics.lcp <= 4000 ? 'needs-improvement' : 'poor',
    };
    if (coreWebVitals.details.lcp.status === 'poor') coreWebVitals.passed = false;
  }

  if (metrics.fcp !== undefined) {
    coreWebVitals.details.fcp = {
      value: metrics.fcp,
      status: metrics.fcp <= 1800 ? 'good' : metrics.fcp <= 3000 ? 'needs-improvement' : 'poor',
    };
  }

  if (metrics.ttfb !== undefined) {
    coreWebVitals.details.ttfb = {
      value: metrics.ttfb,
      status: metrics.ttfb <= 800 ? 'good' : metrics.ttfb <= 1800 ? 'needs-improvement' : 'poor',
    };
  }

  return {
    lighthouse: scoreResult.overall,
    lcp: metrics.lcp || 0,
    fid: metrics.fid || 0,
    cls: metrics.cls || 0,
    fcp: metrics.fcp || 0,
    ttfb: metrics.ttfb || 0,
    grade: scoreResult.grade,
    recommendations: scoreResult.recommendations,
    coreWebVitals,
  };
}

export function getEcoHealthStatus(data: EcoAuditData): 'healthy' | 'warning' | 'critical' {
  if (data.lighthouse >= 90 && data.coreWebVitals.passed) return 'healthy';
  if (data.lighthouse >= 70) return 'warning';
  return 'critical';
}

export function runLighthouseAudit(): Promise<EcoAuditData> {
  return collectEcoAudit();
}
