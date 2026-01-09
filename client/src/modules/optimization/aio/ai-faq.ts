export interface FAQGenerationContext {
  keyword: string;
  region?: string;
  serviceType?: string;
}

export async function generateAIFAQ(context: FAQGenerationContext): Promise<Array<{ question: string; answer: string }>> {
  try {
    const response = await fetch('/api/ai_faq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(context),
    });

    if (!response.ok) {
      return generateDefaultFAQ(context);
    }

    const data = await response.json();
    return data.faq || generateDefaultFAQ(context);
  } catch {
    return generateDefaultFAQ(context);
  }
}

export function generateDefaultFAQ(context: FAQGenerationContext): Array<{ question: string; answer: string }> {
  const { keyword, region } = context;
  const regionSuffix = region ? ` в ${region}` : '';

  return [
    {
      question: `Сколько стоит ${keyword.toLowerCase()}${regionSuffix}?`,
      answer: `Стоимость услуги "${keyword}" зависит от объёма работ, высоты объекта и выбранного покрытия. Для точного расчёта оставьте заявку — мы свяжемся с вами в течение 30 минут.`,
    },
    {
      question: `Какие сроки выполнения работ по ${keyword.toLowerCase()}?`,
      answer: 'Сроки зависят от масштаба проекта. Обычно работы занимают от 3 до 14 дней. Точные сроки определяются после осмотра объекта.',
    },
    {
      question: 'Какую гарантию вы предоставляете?',
      answer: 'При использовании покрытия MSPRO Quad мы предоставляем гарантию до 20 лет. Это сертифицированное огнезащитное покрытие, одобренное Ростехнадзором.',
    },
    {
      question: 'Работаете ли вы с промышленными объектами?',
      answer: 'Да, мы специализируемся на промышленных объектах: заводы, ТЭЦ, котельные, нефтеперерабатывающие предприятия. Имеем все необходимые допуски и сертификаты.',
    },
    {
      question: `Выезжаете ли вы${regionSuffix}?`,
      answer: `Да, мы работаем по всей России${region ? `, включая ${region}` : ''}. Выезд бригады с полным комплектом оборудования в любой регион.`,
    },
  ];
}

export function mergeFAQs(
  generated: Array<{ question: string; answer: string }>,
  defaults: Array<{ question: string; answer: string }>,
  limit: number = 5
): Array<{ question: string; answer: string }> {
  const merged = [...generated];
  const existingQuestions = new Set(merged.map(f => f.question.toLowerCase()));

  for (const faq of defaults) {
    if (merged.length >= limit) break;
    if (!existingQuestions.has(faq.question.toLowerCase())) {
      merged.push(faq);
    }
  }

  return merged.slice(0, limit);
}
