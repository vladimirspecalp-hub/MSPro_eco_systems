import { allSEOData, type SEOEntry } from '@/lib/seo-loader';

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
  const titleMap = new Map<string, string[]>();
  const slugMap = new Map<string, number>();
  const issues: Array<{ slug: string; errors: string[]; warnings: string[] }> = [];
  let validPages = 0;
  let invalidPages = 0;

  for (const entry of allSEOData) {
    const result = validateSEOEntry(entry);
    
    if (result.isValid) {
      validPages++;
    } else {
      invalidPages++;
    }

    if (result.errors.length > 0 || result.warnings.length > 0) {
      issues.push({
        slug: entry.slug,
        errors: result.errors,
        warnings: result.warnings,
      });
    }

    const existingTitles = titleMap.get(entry.title) || [];
    existingTitles.push(entry.slug);
    titleMap.set(entry.title, existingTitles);

    slugMap.set(entry.slug, (slugMap.get(entry.slug) || 0) + 1);
  }

  const duplicateTitles = Array.from(titleMap.entries())
    .filter(([_, slugs]) => slugs.length > 1)
    .map(([title]) => title);

  const duplicateSlugs = Array.from(slugMap.entries())
    .filter(([_, count]) => count > 1)
    .map(([slug]) => slug);

  return {
    totalPages: allSEOData.length,
    validPages,
    invalidPages,
    duplicateTitles,
    duplicateSlugs,
    issues,
  };
}
