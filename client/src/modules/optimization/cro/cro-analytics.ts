import { getConversions, getConversionsByType, type ConversionEvent } from './cro-tracker';

export interface CROReport {
  period: string;
  totalVisitors: number;
  totalConversions: number;
  conversionRate: number;
  conversionsByType: Record<string, number>;
  topPages: Array<{ page: string; conversions: number }>;
  recommendations: string[];
}

export function generateCROReport(visitors: number): CROReport {
  const conversions = getConversions();
  const totalConversions = conversions.length;
  const conversionRate = visitors > 0 ? (totalConversions / visitors) * 100 : 0;

  const conversionsByType: Record<string, number> = {};
  const pageConversions: Record<string, number> = {};

  for (const conv of conversions) {
    conversionsByType[conv.type] = (conversionsByType[conv.type] || 0) + 1;
    pageConversions[conv.page] = (pageConversions[conv.page] || 0) + 1;
  }

  const topPages = Object.entries(pageConversions)
    .map(([page, count]) => ({ page, conversions: count }))
    .sort((a, b) => b.conversions - a.conversions)
    .slice(0, 5);

  const recommendations = generateRecommendations(conversionRate, conversionsByType);

  return {
    period: new Date().toISOString().split('T')[0],
    totalVisitors: visitors,
    totalConversions,
    conversionRate: Math.round(conversionRate * 100) / 100,
    conversionsByType,
    topPages,
    recommendations,
  };
}

function generateRecommendations(
  conversionRate: number,
  conversionsByType: Record<string, number>
): string[] {
  const recommendations: string[] = [];

  if (conversionRate < 2) {
    recommendations.push('Конверсия ниже 2%. Рекомендуется A/B тестирование CTA-кнопок.');
  }

  if (!conversionsByType['calculator_use'] || conversionsByType['calculator_use'] < 10) {
    recommendations.push('Калькулятор используется редко. Добавьте его на главную страницу.');
  }

  const formSubmits = conversionsByType['form_submit'] || 0;
  const ctaClicks = conversionsByType['cta_click'] || 0;
  
  if (ctaClicks > 0 && formSubmits / ctaClicks < 0.3) {
    recommendations.push('Низкая конверсия форм. Упростите форму или добавьте социальные доказательства.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Показатели в норме. Продолжайте мониторинг.');
  }

  return recommendations;
}

export function calculateROI(revenue: number, cost: number): number {
  if (cost === 0) return 0;
  return Math.round(((revenue - cost) / cost) * 10000) / 100;
}

export function calculateCostPerConversion(cost: number, conversions: number): number {
  if (conversions === 0) return 0;
  return Math.round((cost / conversions) * 100) / 100;
}
