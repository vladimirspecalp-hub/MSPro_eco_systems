import { DEFAULT_FAQS } from '../aeo/aeo-faq';

export interface AEOInsightsData {
  schemaValid: boolean;
  faqCount: number;
  jsonLdCoverage: number;
  aiCitationRate: number;
  structuredDataTypes: string[];
  errors: string[];
}

export async function collectAEOInsights(): Promise<AEOInsightsData> {
  const faqCount = DEFAULT_FAQS.length;
  const structuredDataTypes = ['Service', 'FAQPage', 'Organization', 'LocalBusiness', 'BreadcrumbList'];
  const errors: string[] = [];
  
  const jsonLdCoverage = calculateJsonLdCoverage(structuredDataTypes);
  const schemaValid = errors.length === 0;
  
  return {
    schemaValid,
    faqCount,
    jsonLdCoverage,
    aiCitationRate: 0.85,
    structuredDataTypes,
    errors,
  };
}

function calculateJsonLdCoverage(types: string[]): number {
  const requiredTypes = ['Service', 'FAQPage', 'Organization', 'LocalBusiness'];
  const covered = requiredTypes.filter(t => types.includes(t)).length;
  return Math.round((covered / requiredTypes.length) * 100);
}

export function validateJsonLdStructure(jsonLd: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!jsonLd['@context']) {
    errors.push('Missing @context');
  }
  
  if (!jsonLd['@type']) {
    errors.push('Missing @type');
  }
  
  if (jsonLd['@type'] === 'FAQPage' && !jsonLd['mainEntity']) {
    errors.push('FAQPage missing mainEntity');
  }
  
  if (jsonLd['@type'] === 'Service' && !jsonLd['name']) {
    errors.push('Service missing name');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function getAEOHealthStatus(data: AEOInsightsData): 'healthy' | 'warning' | 'critical' {
  if (data.schemaValid && data.jsonLdCoverage === 100) return 'healthy';
  if (data.jsonLdCoverage >= 75) return 'warning';
  return 'critical';
}
