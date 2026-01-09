/**
 * AEO Service — Answer Engine Optimization с AI-генерацией
 * @module server/services/aeo-service
 * 
 * Включает:
 * - AI-генерацию FAQ
 * - Schema Builder (JSON-LD)
 * - Quality Gates (валидация)
 */

import OpenAI from 'openai';
import { z } from 'zod';
import { getPageBySlug, type SEOEntry } from './seo-service';
import { getRegionByCode, type GeoRegion } from '../middleware/geo-context';

/**
 * Схема валидации FAQ
 */
export const FAQItemSchema = z.object({
  question: z.string().min(10, 'Вопрос должен быть минимум 10 символов').max(200),
  answer: z.string().min(20, 'Ответ должен быть минимум 20 символов').max(1000),
});

export const FAQListSchema = z.array(FAQItemSchema).min(1).max(10);

/**
 * Схема запроса на генерацию
 */
export const GenerateRequestSchema = z.object({
  slug: z.string().min(1, 'slug обязателен'),
  region: z.string().optional(),
  faqCount: z.number().min(1).max(10).optional().default(3),
  includeSchemas: z.boolean().optional().default(true),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;

/**
 * Структура FAQ
 */
import { FAQItem, DEFAULT_FAQS } from '../../shared/data/aeo-data';

/**
 * JSON-LD схемы
 */
export interface JsonLdSchemas {
  service?: object;
  faqPage?: object;
  organization?: object;
  localBusiness?: object;
  breadcrumb?: object;
}

/**
 * Результат генерации AEO
 */
export interface AEOGenerationResult {
  slug: string;
  summary: string;
  faq: FAQItem[];
  schemas: JsonLdSchemas;
  qualityScore: number;
  warnings: string[];
  generatedAt: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

/**
 * Генерирует AEO контент для страницы
 * @param request - Параметры генерации
 * @returns Результат генерации с FAQ и схемами
 * @throws Error при ошибке валидации или AI
 */
export async function generateAEOContent(request: GenerateRequest): Promise<AEOGenerationResult> {
  const validated = GenerateRequestSchema.parse(request);
  const { slug, region, faqCount, includeSchemas } = validated;

  const seoEntry = getPageBySlug(slug);
  const geoRegion = region ? getRegionByCode(region) : null;

  const faq = await generateFAQ(slug, seoEntry, geoRegion, faqCount);
  const qualityResult = validateFAQQuality(faq);

  const schemas: JsonLdSchemas = {};
  if (includeSchemas) {
    schemas.service = buildServiceSchema(seoEntry, geoRegion);
    schemas.faqPage = buildFAQPageSchema(faq);
    schemas.organization = buildOrganizationSchema();
    if (geoRegion) {
      schemas.localBusiness = buildLocalBusinessSchema(geoRegion);
    }
    schemas.breadcrumb = buildBreadcrumbSchema(slug, seoEntry);
  }

  const summary = generateSummary(seoEntry, geoRegion);

  return {
    slug,
    summary,
    faq: qualityResult.cleanedFAQ,
    schemas,
    qualityScore: qualityResult.score,
    warnings: qualityResult.warnings,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Генерирует FAQ с помощью AI
 * @param slug - URL страницы
 * @param seoEntry - SEO данные (если есть)
 * @param region - Регион (если есть)
 * @param count - Количество FAQ
 * @returns Массив FAQ
 */
async function generateFAQ(
  slug: string,
  seoEntry: SEOEntry | null,
  region: GeoRegion | null,
  count: number
): Promise<FAQItem[]> {
  if (seoEntry?.faq && seoEntry.faq.length >= count) {
    return seoEntry.faq.slice(0, count);
  }

  const keyword = slug.replace(/-/g, ' ');
  const regionName = region?.name || 'Россия';

  const prompt = `
Создай ${count} часто задаваемых вопроса (FAQ) для B2B услуги:
"${seoEntry?.title || keyword}"

Регион: ${regionName}
Компания: MS-PRO (промышленный альпинизм, покраска труб, MSPRO Quad)

Правила:
1. Вопросы должны быть реальными, которые задают клиенты B2B
2. Ответы 2-4 предложения, конкретные
3. НЕ выдумывай точные цены, адреса, номера сертификатов
4. Упоминай гарантию 20 лет и MSPRO Quad где уместно
5. Формат JSON: [{"question": "...", "answer": "..."}]

Верни только JSON массив.
`;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'Ты — эксперт по B2B промышленным услугам. Возвращай только валидный JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('OpenAI не вернул контент');

    const parsed = JSON.parse(content);
    const faqArray = Array.isArray(parsed) ? parsed : parsed.faq || parsed.questions || [];

    return faqArray.slice(0, count);
  } catch (error) {
    console.error('[AEO] FAQ generation error:', error);
    return getDefaultFAQ(keyword, count, region);
  }
}

/**
 * FAQ по умолчанию (fallback)
 */
function getDefaultFAQ(keyword: string, count: number, region: GeoRegion | null = null): FAQItem[] {
  // Use shared DEFAULT_FAQS as base
  let faqs = [...DEFAULT_FAQS];

  // Localize if region is provided
  if (region && region.priority !== 'low') {
    faqs = faqs.map(item => {
      let localizedAnswer = item.answer;
      if (item.question.includes('регионах')) {
        localizedAnswer = `Мы активно работаем в регионе ${region.name} и области. Выезд бригады осуществляется в течение 24 часов.`;
      }
      return { ...item, answer: localizedAnswer };
    });
  }

  return faqs.slice(0, count);
}

/**
 * Quality Gates — валидация FAQ
 */
interface QualityResult {
  score: number;
  warnings: string[];
  cleanedFAQ: FAQItem[];
}

function validateFAQQuality(faq: FAQItem[]): QualityResult {
  const warnings: string[] = [];
  let score = 100;
  const cleanedFAQ: FAQItem[] = [];
  const seenQuestions = new Set<string>();

  for (const item of faq) {
    const qNorm = item.question.toLowerCase().trim();

    if (seenQuestions.has(qNorm)) {
      warnings.push(`Дубликат вопроса: "${item.question.slice(0, 50)}..."`);
      score -= 10;
      continue;
    }
    seenQuestions.add(qNorm);

    if (item.question.length < 10) {
      warnings.push(`Слишком короткий вопрос: "${item.question}"`);
      score -= 5;
    }

    if (item.answer.length < 20) {
      warnings.push(`Слишком короткий ответ для: "${item.question.slice(0, 30)}..."`);
      score -= 5;
    }

    if (/\d{10,}|\$\d+|€\d+|₽\s*\d{5,}/.test(item.answer)) {
      warnings.push(`Потенциально выдуманные данные в ответе: "${item.question.slice(0, 30)}..."`);
      score -= 15;
    }

    cleanedFAQ.push(item);
  }

  if (cleanedFAQ.length === 0) {
    warnings.push('Нет валидных FAQ после проверки');
    score = 0;
  }

  return {
    score: Math.max(0, score),
    warnings,
    cleanedFAQ,
  };
}

/**
 * Генерирует summary для страницы
 */
function generateSummary(seoEntry: SEOEntry | null, region: GeoRegion | null): string {
  if (seoEntry?.description) {
    return seoEntry.description;
  }

  const regionText = region ? ` в ${region.nameGenitive}` : '';
  return `Профессиональные услуги промышленного альпинизма${regionText}. Антикоррозийное покрытие MSPRO Quad с гарантией 20 лет.`;
}

/**
 * Строит JSON-LD схему Service
 */
function buildServiceSchema(seoEntry: SEOEntry | null, region: GeoRegion | null): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: seoEntry?.title || 'Промышленный альпинизм MS-PRO',
    description: seoEntry?.description || 'Профессиональные высотные работы',
    provider: {
      '@type': 'Organization',
      name: 'MS-PRO',
      url: 'https://mspro.ru',
    },
    areaServed: region?.name || 'Россия',
    serviceType: 'Промышленная покраска и антикоррозийная защита',
  };
}

/**
 * Строит JSON-LD схему FAQPage
 */
function buildFAQPageSchema(faq: FAQItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Строит JSON-LD схему Organization
 */
function buildOrganizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MS-PRO',
    url: 'https://mspro.ru',
    logo: 'https://mspro.ru/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+7-800-555-35-35',
      contactType: 'customer service',
      areaServed: 'RU',
      availableLanguage: 'Russian',
    },
  };
}

/**
 * Строит JSON-LD схему LocalBusiness для региона
 */
function buildLocalBusinessSchema(region: GeoRegion): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `MS-PRO ${region.name}`,
    description: `Промышленный альпинизм и покраска труб в ${region.nameGenitive}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: region.name,
      addressCountry: 'RU',
    },
    areaServed: region.name,
    priceRange: '₽₽₽',
  };
}

/**
 * Строит JSON-LD схему BreadcrumbList
 */
function buildBreadcrumbSchema(slug: string, seoEntry: SEOEntry | null): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: 'https://mspro.ru',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Услуги',
        item: 'https://mspro.ru/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: seoEntry?.title || slug,
        item: `https://mspro.ru/services/${slug}`,
      },
    ],
  };
}

/**
 * Валидирует JSON-LD схему
 * @param schema - Схема для валидации
 * @returns Результат валидации
 */
export function validateJsonLdSchema(schema: object): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!('@context' in schema)) {
    errors.push('Отсутствует @context');
  }

  if (!('@type' in schema)) {
    errors.push('Отсутствует @type');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
