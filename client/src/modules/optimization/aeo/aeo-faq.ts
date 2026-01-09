import { FAQItem, DEFAULT_FAQS } from '@shared/data/aeo-data';

export type { FAQItem };
export { DEFAULT_FAQS };

export function generateFAQsForService(keyword: string, region?: string): FAQItem[] {
  const faqs: FAQItem[] = [
    {
      question: `Сколько стоит ${keyword.toLowerCase()}?`,
      answer: `Стоимость услуги "${keyword}" зависит от объёма работ и специфики объекта. Оставьте заявку для бесплатного расчёта${region ? ` в ${region}` : ''}.`,
    },
    {
      question: `Какая гарантия на ${keyword.toLowerCase()}?`,
      answer: `При использовании покрытия MSPRO Quad мы даём гарантию до 20 лет. Все работы выполняются по ГОСТ и СНиП.`,
    },
    {
      question: `Как заказать ${keyword.toLowerCase()}${region ? ` в ${region}` : ''}?`,
      answer: `Оставьте заявку на сайте или позвоните нам. Наш специалист свяжется с вами в течение 30 минут для уточнения деталей.`,
    },
  ];

  return [...faqs, ...DEFAULT_FAQS.slice(0, 2)];
}
