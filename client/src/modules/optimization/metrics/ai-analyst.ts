import { collectSEOMetrics, type SEOMetricsData } from './seo-metrics';
import { collectAEOInsights, type AEOInsightsData } from './aeo-insights';
import { collectGeoImpact, type GeoImpactData } from './geo-impact';
import { collectUXSession, type UXSessionData } from './ux-session';
import { collectAIHealth, type AIHealthData } from './ai-health';
import { collectEcoAudit, type EcoAuditData } from './eco-audit';
import { collectTrustIndex, type TrustIndexData } from './trust-index';
import { checkThreshold, THRESHOLDS, type ThresholdCheck } from './thresholds';

export interface OptimizationReport {
  timestamp: string;
  seo: SEOMetricsData;
  aeo: AEOInsightsData;
  geo: GeoImpactData;
  ux: UXSessionData;
  ai: AIHealthData;
  eco: EcoAuditData;
  eeat: TrustIndexData;
  overallScore: number;
  overallStatus: 'healthy' | 'warning' | 'critical';
  thresholdChecks: ThresholdCheck[];
  recommendations: string[];
  alerts: string[];
}

export async function analyzeOptimization(): Promise<OptimizationReport> {
  const [seo, aeo, geo, ux, ai, eco, eeat] = await Promise.all([
    collectSEOMetrics(),
    collectAEOInsights(),
    collectGeoImpact(),
    collectUXSession(),
    collectAIHealth(),
    collectEcoAudit(),
    collectTrustIndex(),
  ]);

  const thresholdChecks: ThresholdCheck[] = [];
  const alerts: string[] = [];

  const seoCheck = checkThreshold('SEO Index', seo.indexationRate);
  if (seoCheck) {
    thresholdChecks.push(seoCheck);
    if (seoCheck.status === 'failed') {
      alerts.push(`⚠️ SEO Drop: Indexed Pages fell below ${seoCheck.minimum}%`);
    }
  }

  const aeoCheck = checkThreshold('AEO Schema Valid', aeo.schemaValid ? 100 : 0);
  if (aeoCheck) {
    thresholdChecks.push(aeoCheck);
    if (aeoCheck.status === 'failed') {
      alerts.push('⚠️ AEO Error: JSON-LD schema validation failed');
    }
  }

  const aiCheck = checkThreshold('AI Content Success', ai.successRate);
  if (aiCheck) {
    thresholdChecks.push(aiCheck);
    if (aiCheck.status === 'failed') {
      alerts.push(`⚠️ AI Health: Success rate dropped to ${ai.successRate}`);
    }
  }

  const ecoCheck = checkThreshold('PageSpeed', eco.lighthouse);
  if (ecoCheck) {
    thresholdChecks.push(ecoCheck);
    if (ecoCheck.status === 'failed') {
      alerts.push(`⚠️ Performance: Lighthouse score dropped to ${eco.lighthouse}`);
    }
  }

  const trustCheck = checkThreshold('Trust Index', eeat.trust);
  if (trustCheck) {
    thresholdChecks.push(trustCheck);
    if (trustCheck.status === 'failed') {
      alerts.push(`⚠️ E-E-A-T: Trust index below ${trustCheck.minimum}`);
    }
  }

  const uxCheck = checkThreshold('UX Session Time', ux.sessionTime);
  if (uxCheck) {
    thresholdChecks.push(uxCheck);
    if (uxCheck.status === 'failed') {
      alerts.push(`⚠️ UX: Session time below ${uxCheck.minimum} seconds`);
    }
  }

  const recommendations = generateRecommendations(thresholdChecks);
  const overallScore = calculateOverallScore(seo.score, eco.lighthouse, eeat.trust * 10);
  const overallStatus = getOverallStatus(thresholdChecks);

  return {
    timestamp: new Date().toISOString(),
    seo,
    aeo,
    geo,
    ux,
    ai,
    eco,
    eeat,
    overallScore,
    overallStatus,
    thresholdChecks,
    recommendations,
    alerts,
  };
}

function calculateOverallScore(seoScore: number, lighthouseScore: number, trustScore: number): number {
  const weights = { seo: 0.4, lighthouse: 0.3, trust: 0.3 };
  const score = seoScore * weights.seo + lighthouseScore * weights.lighthouse + trustScore * weights.trust;
  return Math.round(score);
}

function getOverallStatus(checks: ThresholdCheck[]): 'healthy' | 'warning' | 'critical' {
  const failed = checks.filter(c => c.status === 'failed').length;
  const warnings = checks.filter(c => c.status === 'warning').length;

  if (failed > 0) return 'critical';
  if (warnings > 2) return 'warning';
  return 'healthy';
}

function generateRecommendations(checks: ThresholdCheck[]): string[] {
  const recommendations: string[] = [];

  for (const check of checks) {
    if (check.status === 'failed') {
      recommendations.push(`Suggested optimization for ${check.module.toUpperCase()} based on current performance metrics: ${check.message}`);
    } else if (check.status === 'warning') {
      recommendations.push(`Consider improving ${check.name} to reach target value of ${check.target}`);
    }
  }

  if (recommendations.length === 0) {
    recommendations.push('All metrics are within acceptable ranges. Continue monitoring.');
  }

  return recommendations;
}

export function formatReportForGitHub(report: OptimizationReport): string {
  let content = `# MSPRO Optimization Report\n\n`;
  content += `**Generated:** ${report.timestamp}\n`;
  content += `**Overall Score:** ${report.overallScore}/100\n`;
  content += `**Status:** ${report.overallStatus.toUpperCase()}\n\n`;

  content += `## Metrics Summary\n\n`;
  content += `| Module | Score | Status |\n|--------|-------|--------|\n`;
  content += `| SEO | ${report.seo.score} | ${report.seo.indexationRate >= 90 ? '✅' : '⚠️'} |\n`;
  content += `| AEO | ${report.aeo.jsonLdCoverage}% | ${report.aeo.schemaValid ? '✅' : '❌'} |\n`;
  content += `| GEO | ${report.geo.regionalCoverage}% | ${report.geo.verifiedListings >= 3 ? '✅' : '⚠️'} |\n`;
  content += `| AI | ${Math.round(report.ai.successRate * 100)}% | ${report.ai.isHealthy ? '✅' : '⚠️'} |\n`;
  content += `| ECO | ${report.eco.lighthouse} | ${report.eco.lighthouse >= 90 ? '✅' : '⚠️'} |\n`;
  content += `| E-E-A-T | ${report.eeat.trust}/10 | ${report.eeat.trust >= 8 ? '✅' : '⚠️'} |\n\n`;

  if (report.alerts.length > 0) {
    content += `## Alerts\n\n`;
    for (const alert of report.alerts) {
      content += `- ${alert}\n`;
    }
    content += `\n`;
  }

  if (report.recommendations.length > 0) {
    content += `## Recommendations\n\n`;
    for (const rec of report.recommendations) {
      content += `- ${rec}\n`;
    }
  }

  return content;
}
