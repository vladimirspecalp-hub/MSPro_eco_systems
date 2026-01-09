import { allSEOData } from '@/lib/seo-loader';
import { validateAllSEOData } from '../seo/seo-validator';

export interface SEOMetricsData {
  score: number;
  indexedPages: number;
  totalPages: number;
  indexationRate: number;
  ctr: number;
  impressions: number;
  visibility: number;
  duplicateTitles: number;
  duplicateSlugs: number;
  validPages: number;
  invalidPages: number;
}

export async function collectSEOMetrics(): Promise<SEOMetricsData> {
  const validationReport = validateAllSEOData();
  
  const totalPages = validationReport.totalPages;
  const validPages = validationReport.validPages;
  const indexedPages = validPages;
  const indexationRate = totalPages > 0 ? (indexedPages / totalPages) * 100 : 0;
  
  const score = calculateSEOScore({
    indexationRate,
    duplicates: validationReport.duplicateTitles.length + validationReport.duplicateSlugs.length,
    invalidPages: validationReport.invalidPages,
  });

  return {
    score,
    indexedPages,
    totalPages,
    indexationRate: Math.round(indexationRate * 100) / 100,
    ctr: 0,
    impressions: 0,
    visibility: indexationRate,
    duplicateTitles: validationReport.duplicateTitles.length,
    duplicateSlugs: validationReport.duplicateSlugs.length,
    validPages,
    invalidPages: validationReport.invalidPages,
  };
}

function calculateSEOScore(data: {
  indexationRate: number;
  duplicates: number;
  invalidPages: number;
}): number {
  let score = 100;
  
  if (data.indexationRate < 90) {
    score -= (90 - data.indexationRate);
  }
  
  score -= data.duplicates * 2;
  score -= data.invalidPages * 0.5;
  
  return Math.max(0, Math.round(score));
}

export function getSEOHealthStatus(score: number): 'healthy' | 'warning' | 'critical' {
  if (score >= 90) return 'healthy';
  if (score >= 70) return 'warning';
  return 'critical';
}
