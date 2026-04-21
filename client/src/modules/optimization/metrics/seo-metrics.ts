// import { allSEOData } from '@/lib/seo-loader';
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
  try {
    const response = await fetch('/api/ai_seo?mode=stats');
    if (!response.ok) throw new Error('Failed to fetch stats');

    const stats: { totalPages: number; pagesWithFAQ: number; pagesWithKeywords: number; regionsCovered: string[] } = await response.json();
    const totalPages = stats.totalPages;
    const validPages = totalPages; // Assuming server returns valid pages count approx equals total
    const indexationRate = totalPages > 0 ? 100 : 0; // Mocking

    return {
      score: 95, // Mocking
      indexedPages: totalPages,
      totalPages: totalPages,
      indexationRate,
      ctr: 0,
      impressions: 0,
      visibility: 100,
      duplicateTitles: 0,
      duplicateSlugs: 0,
      validPages,
      invalidPages: 0,
    };
  } catch (e) {
    console.error(e);
    return {
      score: 0,
      indexedPages: 0,
      totalPages: 0,
      indexationRate: 0,
      ctr: 0,
      impressions: 0,
      visibility: 0,
      duplicateTitles: 0,
      duplicateSlugs: 0,
      validPages: 0,
      invalidPages: 0,
    };
  }
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
