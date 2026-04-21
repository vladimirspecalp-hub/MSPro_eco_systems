/**
 * UX Personalization Engine
 * @module server/services/ux-personalization
 * 
 * Включает:
 * - A/B тестирование
 * - Поведенческие события
 * - Персонализированный контент
 * - CRO метрики
 */

import { z } from 'zod';

/**
 * Схема для A/B эксперимента
 */
export const ExperimentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  variants: z.array(z.object({
    id: z.string(),
    name: z.string(),
    weight: z.number().min(0).max(100),
    config: z.record(z.any()).optional(),
  })),
  active: z.boolean().default(true),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type Experiment = z.infer<typeof ExperimentSchema>;

/**
 * Схема для поведенческого события
 */
export const BehaviorEventSchema = z.object({
  type: z.enum([
    'page_view',
    'scroll_depth',
    'click',
    'form_start',
    'form_submit',
    'calculator_use',
    'cta_view',
    'cta_click',
    'time_on_page',
    'phone_click',
    'messenger_click',
    'calc_start',
    'calc_submit',
    'news_open',
    'share_click',
    'file_download',
  ]),
  page: z.string(),
  element: z.string().optional(),
  value: z.any().optional(),
  sessionId: z.string(),
  timestamp: z.string().optional(),
});

export type BehaviorEvent = z.infer<typeof BehaviorEventSchema>;

/**
 * Схема профиля пользователя
 */
export interface UserProfile {
  sessionId: string;
  region: string | null;
  source: string | null;
  device: 'mobile' | 'tablet' | 'desktop';
  pages_viewed: string[];
  events: BehaviorEvent[];
  experiments: Record<string, string>; // experimentId -> variantId
  createdAt: string;
  updatedAt: string;
}

const experiments = new Map<string, Experiment>();
const userProfiles = new Map<string, UserProfile>();
const behaviorEvents: BehaviorEvent[] = [];

/**
 * Предустановленные эксперименты для MS-PRO
 */
const defaultExperiments: Experiment[] = [
  {
    id: 'cta-button-color',
    name: 'CTA Button Color Test',
    description: 'Тест цвета кнопки "Получить расчёт"',
    variants: [
      { id: 'control', name: 'Синий (контроль)', weight: 50, config: { color: 'primary' } },
      { id: 'variant-a', name: 'Зелёный', weight: 50, config: { color: 'green' } },
    ],
    active: true,
  },
  {
    id: 'pricing-display',
    name: 'Pricing Display Format',
    description: 'Формат отображения цены в калькуляторе',
    variants: [
      { id: 'control', name: 'Только итого', weight: 33, config: { format: 'total' } },
      { id: 'variant-a', name: 'С разбивкой', weight: 33, config: { format: 'breakdown' } },
      { id: 'variant-b', name: 'С экономией', weight: 34, config: { format: 'savings' } },
    ],
    active: true,
  },
  {
    id: 'form-steps',
    name: 'Lead Form Steps',
    description: 'Количество шагов в форме захвата',
    variants: [
      { id: 'control', name: 'Одношаговая', weight: 50, config: { steps: 1 } },
      { id: 'variant-a', name: 'Многошаговая', weight: 50, config: { steps: 3 } },
    ],
    active: true,
  },
];

defaultExperiments.forEach(exp => experiments.set(exp.id, exp));

/**
 * Получает или создаёт профиль пользователя
 */
export function getOrCreateProfile(sessionId: string, region?: string | null): UserProfile {
  let profile = userProfiles.get(sessionId);

  if (!profile) {
    profile = {
      sessionId,
      region: region || null,
      source: null,
      device: 'desktop',
      pages_viewed: [],
      events: [],
      experiments: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    userProfiles.set(sessionId, profile);
  }

  return profile;
}

/**
 * Назначает вариант эксперимента для пользователя
 */
export function assignExperimentVariant(
  sessionId: string,
  experimentId: string
): { experimentId: string; variantId: string; config: Record<string, any> } | null {
  const experiment = experiments.get(experimentId);
  if (!experiment || !experiment.active) {
    return null;
  }

  const profile = getOrCreateProfile(sessionId);

  if (profile.experiments[experimentId]) {
    const existingVariant = experiment.variants.find(
      v => v.id === profile.experiments[experimentId]
    );
    return existingVariant ? {
      experimentId,
      variantId: existingVariant.id,
      config: existingVariant.config || {},
    } : null;
  }

  const rand = Math.random() * 100;
  let cumulative = 0;
  let selectedVariant = experiment.variants[0];

  for (const variant of experiment.variants) {
    cumulative += variant.weight;
    if (rand <= cumulative) {
      selectedVariant = variant;
      break;
    }
  }

  profile.experiments[experimentId] = selectedVariant.id;
  profile.updatedAt = new Date().toISOString();

  return {
    experimentId,
    variantId: selectedVariant.id,
    config: selectedVariant.config || {},
  };
}

/**
 * Записывает поведенческое событие
 */
export function trackEvent(event: BehaviorEvent): void {
  const validated = BehaviorEventSchema.parse({
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
  });

  behaviorEvents.push(validated);

  const profile = userProfiles.get(validated.sessionId);
  if (profile) {
    profile.events.push(validated);

    if (validated.type === 'page_view' && !profile.pages_viewed.includes(validated.page)) {
      profile.pages_viewed.push(validated.page);
    }

    profile.updatedAt = new Date().toISOString();
  }
}

/**
 * Получает персонализированный контент на основе профиля
 */
export function getPersonalizedContent(sessionId: string): Record<string, any> {
  const profile = userProfiles.get(sessionId);

  const content: Record<string, any> = {
    experiments: {},
    recommendations: [],
    cta: {
      text: 'Получить бесплатный расчёт',
      variant: 'primary',
    },
  };

  for (const [expId, variantId] of Object.entries(profile?.experiments || {})) {
    const experiment = experiments.get(expId);
    const variant = experiment?.variants.find(v => v.id === variantId);
    if (variant) {
      content.experiments[expId] = {
        variantId,
        config: variant.config,
      };
    }
  }

  if (profile) {
    if (profile.pages_viewed.length > 3) {
      content.recommendations.push({
        type: 'urgency',
        message: 'Получите расчёт сегодня и зафиксируйте цену!',
      });
    }

    const calcEvents = profile.events.filter(e => e.type === 'calculator_use');
    if (calcEvents.length > 0) {
      content.recommendations.push({
        type: 'follow_up',
        message: 'Хотите получить детальный расчёт от специалиста?',
      });
    }

    if (profile.region) {
      content.recommendations.push({
        type: 'local',
        message: `Бесплатный выезд специалиста в ${profile.region}`,
      });
    }
  }

  return content;
}

/**
 * Получает все эксперименты
 */
export function getAllExperiments(): Experiment[] {
  return Array.from(experiments.values());
}

/**
 * Получает эксперимент по ID
 */
export function getExperimentById(id: string): Experiment | null {
  return experiments.get(id) || null;
}

/**
 * Создаёт или обновляет эксперимент
 */
export function upsertExperiment(data: Experiment): Experiment {
  const validated = ExperimentSchema.parse(data);
  experiments.set(validated.id, validated);
  return validated;
}

/**
 * Получает CRO метрики
 */
export function getCROMetrics(): Record<string, any> {
  const totalSessions = userProfiles.size;
  const formStarts = behaviorEvents.filter(e => e.type === 'form_start').length;
  const formSubmits = behaviorEvents.filter(e => e.type === 'form_submit').length;
  const ctaClicks = behaviorEvents.filter(e => e.type === 'cta_click').length;
  const calcUses = behaviorEvents.filter(e => e.type === 'calculator_use').length;

  const experimentMetrics: Record<string, any> = {};
  Array.from(experiments.entries()).forEach(([expId, experiment]) => {
    const variantCounts: Record<string, number> = {};
    for (const variant of experiment.variants) {
      variantCounts[variant.id] = 0;
    }

    Array.from(userProfiles.values()).forEach((profile) => {
      const variantId = profile.experiments[expId];
      if (variantId && variantCounts[variantId] !== undefined) {
        variantCounts[variantId]++;
      }
    });

    experimentMetrics[expId] = {
      name: experiment.name,
      active: experiment.active,
      variants: variantCounts,
    };
  });

  return {
    totalSessions,
    conversions: {
      formStartRate: totalSessions > 0 ? (formStarts / totalSessions * 100).toFixed(2) + '%' : '0%',
      formSubmitRate: formStarts > 0 ? (formSubmits / formStarts * 100).toFixed(2) + '%' : '0%',
      ctaClickRate: totalSessions > 0 ? (ctaClicks / totalSessions * 100).toFixed(2) + '%' : '0%',
      calculatorUsage: totalSessions > 0 ? (calcUses / totalSessions * 100).toFixed(2) + '%' : '0%',
    },
    experiments: experimentMetrics,
    totalEvents: behaviorEvents.length,
  };
}

/**
 * Очищает устаревшие данные (для GDPR)
 */
export function clearOldData(daysOld: number = 30): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysOld);
  const cutoffStr = cutoff.toISOString();

  let cleared = 0;
  Array.from(userProfiles.entries()).forEach(([sessionId, profile]) => {
    if (profile.updatedAt < cutoffStr) {
      userProfiles.delete(sessionId);
      cleared++;
    }
  });

  return cleared;
}
