export interface SXORecommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'ux' | 'content' | 'cta' | 'navigation' | 'performance';
  title: string;
  description: string;
  impact: string;
}

export function analyzeCTAVisibility(ctaClicks: number, pageViews: number): SXORecommendation | null {
  const ctr = pageViews > 0 ? (ctaClicks / pageViews) * 100 : 0;
  
  if (ctr < 2) {
    return {
      id: 'cta-visibility',
      priority: 'high',
      category: 'cta',
      title: 'Низкая кликабельность CTA',
      description: 'CTR кнопки призыва к действию ниже 2%. Рекомендуется изменить расположение, цвет или текст кнопки.',
      impact: 'Увеличение конверсии на 15-30%',
    };
  }
  return null;
}

export function analyzeScrollBehavior(avgScrollDepth: number): SXORecommendation | null {
  if (avgScrollDepth < 50) {
    return {
      id: 'scroll-depth',
      priority: 'medium',
      category: 'content',
      title: 'Пользователи не доскролливают страницу',
      description: 'Средняя глубина прокрутки менее 50%. Контент в нижней части страницы не просматривается.',
      impact: 'Улучшение вовлечённости на 20%',
    };
  }
  return null;
}

export function analyzeBounceRate(bounceRate: number): SXORecommendation | null {
  if (bounceRate > 70) {
    return {
      id: 'bounce-rate',
      priority: 'high',
      category: 'ux',
      title: 'Высокий показатель отказов',
      description: 'Более 70% посетителей покидают страницу без взаимодействия. Проверьте скорость загрузки и релевантность контента.',
      impact: 'Снижение отказов на 25-40%',
    };
  }
  return null;
}

export function generateRecommendations(metrics: {
  ctaClicks: number;
  pageViews: number;
  avgScrollDepth: number;
  bounceRate: number;
}): SXORecommendation[] {
  const recommendations: SXORecommendation[] = [];

  const ctaRec = analyzeCTAVisibility(metrics.ctaClicks, metrics.pageViews);
  if (ctaRec) recommendations.push(ctaRec);

  const scrollRec = analyzeScrollBehavior(metrics.avgScrollDepth);
  if (scrollRec) recommendations.push(scrollRec);

  const bounceRec = analyzeBounceRate(metrics.bounceRate);
  if (bounceRec) recommendations.push(bounceRec);

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
