// import { allSEOData, type SEOEntry } from '@/lib/seo-loader';
import type { SEOEntry } from '@/lib/seo-loader';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SEOValidationReport {
  totalPages: number;
  validPages: number;
  invalidPages: number;
  duplicateTitles: string[];
  duplicateSlugs: string[];
  issues: Array<{ slug: string; errors: string[]; warnings: string[] }>;
}

const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 160;
const MIN_TITLE_LENGTH = 30;
const MIN_DESCRIPTION_LENGTH = 70;

export function validateSEOEntry(entry: SEOEntry): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!entry.title) {
    errors.push('Title is missing');
  } else {
    if (entry.title.length > MAX_TITLE_LENGTH) {
      warnings.push(`Title too long: ${entry.title.length}/${MAX_TITLE_LENGTH}`);
    }
    if (entry.title.length < MIN_TITLE_LENGTH) {
      warnings.push(`Title too short: ${entry.title.length}/${MIN_TITLE_LENGTH}`);
    }
  }

  if (!entry.description) {
    errors.push('Description is missing');
  } else {
    if (entry.description.length > MAX_DESCRIPTION_LENGTH) {
      warnings.push(`Description too long: ${entry.description.length}/${MAX_DESCRIPTION_LENGTH}`);
    }
    if (entry.description.length < MIN_DESCRIPTION_LENGTH) {
      warnings.push(`Description too short: ${entry.description.length}/${MIN_DESCRIPTION_LENGTH}`);
    }
  }

  if (!entry.slug) {
    errors.push('Slug is missing');
  }

  if (!entry.cta) {
    warnings.push('CTA is missing');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateAllSEOData(): SEOValidationReport {
  // Stubbed: Client-side validation of full DB is disabled
  return {
    totalPages: 0,
    validPages: 0,
    invalidPages: 0,
    duplicateTitles: [],
    duplicateSlugs: [],
    issues: [],
  };
}
