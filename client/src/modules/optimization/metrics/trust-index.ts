import { getValidCertificates, COMPANY_EXPERTS, calculateTrustScore } from '../eeat/eeat-badges';
import { getVerifiedReviews, calculateAverageRating, getRecentCaseStudies } from '../eeat/eeat-trustmarks';

export interface TrustIndexData {
  trust: number;
  experience: number;
  expertise: number;
  authority: number;
  trustworthiness: number;
  certificates: number;
  experts: number;
  reviews: number;
  averageRating: number;
  caseStudies: number;
  components: {
    certScore: number;
    expertScore: number;
    reviewScore: number;
    contentScore: number;
  };
}

export async function collectTrustIndex(): Promise<TrustIndexData> {
  const certificates = getValidCertificates().length;
  const experts = COMPANY_EXPERTS.length;
  const reviews = getVerifiedReviews().length;
  const averageRating = calculateAverageRating();
  const caseStudies = getRecentCaseStudies().length;
  
  const certScore = Math.min(certificates * 20, 100);
  const expertScore = Math.min(experts * 25, 100);
  const reviewScore = Math.min(reviews * 15 + (averageRating / 5) * 50, 100);
  const contentScore = Math.min(caseStudies * 25, 100);
  
  const experience = Math.round((certScore + expertScore) / 2 / 10);
  const expertise = Math.round(expertScore / 10);
  const authority = Math.round((certScore + contentScore) / 2 / 10);
  const trustworthiness = Math.round((reviewScore + certScore) / 2 / 10);
  
  const trust = Math.round((experience + expertise + authority + trustworthiness) / 4 * 10) / 10;

  return {
    trust,
    experience,
    expertise,
    authority,
    trustworthiness,
    certificates,
    experts,
    reviews,
    averageRating,
    caseStudies,
    components: {
      certScore: Math.round(certScore),
      expertScore: Math.round(expertScore),
      reviewScore: Math.round(reviewScore),
      contentScore: Math.round(contentScore),
    },
  };
}

export function getTrustHealthStatus(data: TrustIndexData): 'healthy' | 'warning' | 'critical' {
  if (data.trust >= 8.0) return 'healthy';
  if (data.trust >= 6.0) return 'warning';
  return 'critical';
}

export function generateEEATRecommendations(data: TrustIndexData): string[] {
  const recommendations: string[] = [];

  if (data.certificates < 4) {
    recommendations.push('Добавьте больше сертификатов для повышения авторитетности');
  }

  if (data.experts < 3) {
    recommendations.push('Добавьте профили экспертов с подробными биографиями');
  }

  if (data.reviews < 5) {
    recommendations.push('Соберите больше верифицированных отзывов клиентов');
  }

  if (data.caseStudies < 3) {
    recommendations.push('Добавьте детальные кейсы выполненных проектов');
  }

  if (recommendations.length === 0) {
    recommendations.push('E-E-A-T показатели в норме. Продолжайте поддерживать качество контента.');
  }

  return recommendations;
}
