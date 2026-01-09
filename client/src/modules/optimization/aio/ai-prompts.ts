export interface PromptTemplate {
  name: string;
  system: string;
  user: string;
}

export const PROMPTS: Record<string, PromptTemplate> = {
  seoContent: {
    name: 'SEO Content Generation',
    system: `Ты — SEO-эксперт для B2B промышленной компании MS-PRO, специализирующейся на покраске дымовых труб и антикоррозийной защите.
Твоя задача — создавать контент, оптимизированный для поисковых систем и AI-поисковиков.
Пиши на русском языке, профессиональным B2B тоном.
Всегда упоминай MSPRO Quad — сертифицированное огнезащитное покрытие с гарантией 20 лет.`,
    user: `Создай SEO-контент для страницы услуги: "{{keyword}}"{{#region}} в регионе {{region}}{{/region}}.

Верни JSON с полями:
- title (до 60 символов)
- h1 (заголовок страницы)
- h2 (подзаголовок)
- description (до 160 символов)
- keywords (массив из 5-7 ключевых слов)
- faq (3 вопроса-ответа)`,
  },

  faqGeneration: {
    name: 'FAQ Generation',
    system: `Ты — эксперт по созданию FAQ для промышленных услуг.
Создавай вопросы и ответы, которые реальные клиенты могут задавать.
Ответы должны быть информативными, но краткими (2-3 предложения).`,
    user: `Создай 5 FAQ для услуги "{{keyword}}"{{#region}} в {{region}}{{/region}}.

Формат: JSON массив с полями question и answer.`,
  },

  ctaGeneration: {
    name: 'CTA Generation',
    system: `Ты — маркетолог, специализирующийся на B2B продажах.
Создавай убедительные призывы к действию для промышленных услуг.`,
    user: `Создай 3 варианта CTA для услуги "{{keyword}}".
Формат: JSON массив строк.`,
  },
};

export function renderPrompt(template: string, variables: Record<string, string>): string {
  let result = template;
  
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    
    const conditionalPattern = new RegExp(`{{#${key}}}([\\s\\S]*?){{/${key}}}`, 'g');
    result = result.replace(conditionalPattern, value ? '$1' : '');
  }

  result = result.replace(/{{#\w+}}[\s\S]*?{{\/\w+}}/g, '');
  result = result.replace(/{{\w+}}/g, '');

  return result.trim();
}

export function getPrompt(name: keyof typeof PROMPTS): PromptTemplate {
  return PROMPTS[name];
}
