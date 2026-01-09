export interface MetricThreshold {
  name: string;
  module: string;
  minimum: number;
  target: number;
  unit: string;
  description: string;
}

export const THRESHOLDS: MetricThreshold[] = [
  {
    name: 'SEO Index',
    module: 'seo',
    minimum: 90,
    target: 100,
    unit: '%',
    description: 'Полная индексация страниц',
  },
  {
    name: 'AEO Schema Valid',
    module: 'aeo',
    minimum: 100,
    target: 100,
    unit: '%',
    description: 'Без ошибок JSON-LD',
  },
  {
    name: 'AI Content Success',
    module: 'aio',
    minimum: 0.95,
    target: 0.99,
    unit: 'rate',
    description: 'Стабильная AI генерация',
  },
  {
    name: 'PageSpeed',
    module: 'eco',
    minimum: 90,
    target: 100,
    unit: 'score',
    description: 'Быстрая загрузка',
  },
  {
    name: 'Trust Index',
    module: 'eeat',
    minimum: 8.0,
    target: 10.0,
    unit: 'index',
    description: 'Высокое доверие',
  },
  {
    name: 'UX Session Time',
    module: 'sxo',
    minimum: 45,
    target: 120,
    unit: 'sec',
    description: 'Глубокое вовлечение',
  },
  {
    name: 'GEO Coverage',
    module: 'geo',
    minimum: 80,
    target: 100,
    unit: '%',
    description: 'Региональный охват',
  },
  {
    name: 'CTA CTR',
    module: 'cro',
    minimum: 5,
    target: 10,
    unit: '%',
    description: 'Конверсия CTA',
  },
];

export interface ThresholdCheck {
  name: string;
  module: string;
  currentValue: number;
  minimum: number;
  target: number;
  status: 'passed' | 'warning' | 'failed';
  message: string;
}

export function checkThreshold(
  name: string,
  currentValue: number
): ThresholdCheck | null {
  const threshold = THRESHOLDS.find(t => t.name === name);
  if (!threshold) return null;

  let status: 'passed' | 'warning' | 'failed';
  let message: string;

  if (currentValue >= threshold.target) {
    status = 'passed';
    message = `${name} достиг целевого значения (${currentValue}${threshold.unit} >= ${threshold.target}${threshold.unit})`;
  } else if (currentValue >= threshold.minimum) {
    status = 'warning';
    message = `${name} выше минимума, но ниже цели (${currentValue}${threshold.unit})`;
  } else {
    status = 'failed';
    message = `⚠️ ${name} ниже минимума: ${currentValue}${threshold.unit} < ${threshold.minimum}${threshold.unit}`;
  }

  return {
    name: threshold.name,
    module: threshold.module,
    currentValue,
    minimum: threshold.minimum,
    target: threshold.target,
    status,
    message,
  };
}

export function getThresholdsByModule(module: string): MetricThreshold[] {
  return THRESHOLDS.filter(t => t.module === module);
}
