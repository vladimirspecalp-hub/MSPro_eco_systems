/**
 * AEO API Routes — Answer Engine Optimization endpoints
 * @module server/routes/aeo-api
 */

import { Router } from 'express';
import {
  generateAEOContent,
  GenerateRequestSchema,
  validateJsonLdSchema,
} from '../services/aeo-service';
import { z } from 'zod';

const router = Router();

/**
 * POST /api/aeo/generate
 * Генерирует AEO контент: summary, FAQ, JSON-LD схемы
 * 
 * Body:
 * - slug: string (обязательный) — URL страницы
 * - region: string (опционально) — код региона
 * - faqCount: number (опционально, default: 3) — количество FAQ
 * - includeSchemas: boolean (опционально, default: true)
 * 
 * @example
 * POST /api/aeo/generate
 * { "slug": "pokraska-dymovoj-truby", "region": "spb", "faqCount": 5 }
 */
router.post('/generate', async (req, res) => {
  try {
    const result = await generateAEOContent(req.body);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/aeo/schema/:type
 * Получить базовый JSON-LD шаблон по типу
 * 
 * Types: service, faq, organization, localBusiness, breadcrumb
 * 
 * @example
 * GET /api/aeo/schema/organization
 */
router.get('/schema/:type', (req, res) => {
  const { type } = req.params;
  
  const templates: Record<string, object> = {
    service: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: '{serviceName}',
      description: '{serviceDescription}',
      provider: {
        '@type': 'Organization',
        name: 'MS-PRO',
      },
      areaServed: '{region}',
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '{question}',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '{answer}',
          },
        },
      ],
    },
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'MS-PRO',
      url: 'https://mspro.ru',
      logo: 'https://mspro.ru/logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+7-800-555-35-35',
        contactType: 'customer service',
      },
    },
    localBusiness: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'MS-PRO {region}',
      address: {
        '@type': 'PostalAddress',
        addressLocality: '{region}',
        addressCountry: 'RU',
      },
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://mspro.ru' },
        { '@type': 'ListItem', position: 2, name: '{pageName}', item: '{pageUrl}' },
      ],
    },
  };

  const template = templates[type];
  if (!template) {
    return res.status(404).json({
      error: 'Schema type not found',
      available: Object.keys(templates),
    });
  }

  res.json({
    type,
    template,
    usage: 'Замените {placeholders} на реальные данные',
  });
});

/**
 * POST /api/aeo/validate
 * Валидирует JSON-LD схему
 * 
 * Body: JSON-LD объект
 * 
 * @example
 * POST /api/aeo/validate
 * { "@context": "https://schema.org", "@type": "Organization", "name": "Test" }
 */
router.post('/validate', (req, res) => {
  try {
    const schema = req.body;
    
    if (!schema || typeof schema !== 'object') {
      return res.status(400).json({
        error: 'Body must be a JSON object',
      });
    }

    const result = validateJsonLdSchema(schema);
    
    res.json({
      valid: result.valid,
      errors: result.errors,
      schema: result.valid ? schema : undefined,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/aeo/quality-gates
 * Получить информацию о Quality Gates
 */
router.get('/quality-gates', (req, res) => {
  res.json({
    description: 'AEO Quality Gates — правила валидации контента',
    rules: [
      {
        id: 'faq-min-question-length',
        description: 'Вопрос минимум 10 символов',
        penalty: -5,
      },
      {
        id: 'faq-min-answer-length',
        description: 'Ответ минимум 20 символов',
        penalty: -5,
      },
      {
        id: 'faq-no-duplicates',
        description: 'Нет дублирующихся вопросов',
        penalty: -10,
      },
      {
        id: 'faq-no-fake-data',
        description: 'Нет выдуманных цен/номеров',
        penalty: -15,
      },
      {
        id: 'schema-has-context',
        description: 'JSON-LD имеет @context',
        required: true,
      },
      {
        id: 'schema-has-type',
        description: 'JSON-LD имеет @type',
        required: true,
      },
    ],
    scoring: {
      excellent: '90-100',
      good: '70-89',
      needs_improvement: '50-69',
      poor: '0-49',
    },
  });
});

export default router;
