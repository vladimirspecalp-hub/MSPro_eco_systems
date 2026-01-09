export interface ContentTemplate {
  type: 'news' | 'seo' | 'blog' | 'social';
  title: string;
  content: string;
  keywords: string[];
  metadata?: Record<string, any>;
}

export interface GenerationConfig {
  tone?: 'professional' | 'casual' | 'technical';
  length?: 'short' | 'medium' | 'long';
  includeKeywords?: string[];
  targetAudience?: 'b2b' | 'b2c' | 'technical';
}

export async function generateNewsContent(
  topic: string,
  config?: GenerationConfig
): Promise<ContentTemplate> {
  console.log('[AI] Generating news content for:', topic);
  
  return {
    type: 'news',
    title: `Новости MS-PRO: ${topic}`,
    content: `Компания MS-PRO сообщает о ${topic}. Более подробная информация будет доступна в ближайшее время.`,
    keywords: config?.includeKeywords || ['MS-PRO', topic, 'промышленные услуги'],
    metadata: {
      generatedAt: new Date().toISOString(),
      tone: config?.tone || 'professional'
    }
  };
}

export async function generateSEOContent(
  keyword: string,
  serviceType: string,
  config?: GenerationConfig
): Promise<ContentTemplate> {
  console.log('[AI] Generating SEO content for keyword:', keyword);

  const templates = {
    chimney_painting: {
      title: `${keyword} - Покраска дымовых труб от MS-PRO`,
      content: `Профессиональная ${keyword.toLowerCase()}. Высотные работы с гарантией 20 лет. Опыт более 500 объектов по всей России.`
    },
    anticorrosion: {
      title: `${keyword} - Антикоррозионная защита промышленных объектов`,
      content: `Качественная ${keyword.toLowerCase()}. Современные технологии защиты металлоконструкций.`
    },
    mspro_quad: {
      title: `${keyword} - Огнезащитное покрытие MSPRO Quad`,
      content: `Инновационное решение: ${keyword.toLowerCase()}. Сертифицированное покрытие с гарантией.`
    }
  };

  const template = templates[serviceType as keyof typeof templates] || templates.chimney_painting;

  return {
    type: 'seo',
    title: template.title,
    content: template.content,
    keywords: [keyword, serviceType, 'MS-PRO', ...(config?.includeKeywords || [])],
    metadata: {
      serviceType,
      generatedAt: new Date().toISOString(),
      length: config?.length || 'medium'
    }
  };
}

export async function generateBlogPost(
  topic: string,
  config?: GenerationConfig
): Promise<ContentTemplate> {
  console.log('[AI] Generating blog post for:', topic);

  return {
    type: 'blog',
    title: `${topic} - Экспертный блог MS-PRO`,
    content: `
      <h2>Введение</h2>
      <p>В этой статье мы рассмотрим важные аспекты темы: ${topic}.</p>
      
      <h2>Основные моменты</h2>
      <p>Ключевые факторы, которые необходимо учитывать при работе с промышленными объектами.</p>
      
      <h2>Заключение</h2>
      <p>Компания MS-PRO обладает многолетним опытом в данной области. Свяжитесь с нами для консультации.</p>
    `,
    keywords: [topic, 'промышленные услуги', 'MS-PRO', 'эксперты'],
    metadata: {
      generatedAt: new Date().toISOString(),
      tone: config?.tone || 'professional',
      targetAudience: config?.targetAudience || 'b2b'
    }
  };
}

export async function generateSocialPost(
  topic: string,
  platform: 'vk' | 'telegram' | 'linkedin',
  config?: GenerationConfig
): Promise<ContentTemplate> {
  console.log('[AI] Generating social post for:', platform, topic);

  const lengthLimits = {
    vk: 300,
    telegram: 500,
    linkedin: 700
  };

  const content = `🏭 ${topic}\n\nMS-PRO - профессиональные промышленные услуги с гарантией качества.\n\n#MSPRO #ПромышленныеУслуги #${topic.replace(/\s+/g, '')}`;

  return {
    type: 'social',
    title: topic,
    content: content.slice(0, lengthLimits[platform]),
    keywords: [topic, 'MS-PRO'],
    metadata: {
      platform,
      generatedAt: new Date().toISOString(),
      charLimit: lengthLimits[platform]
    }
  };
}

export async function batchGenerateContent(
  topics: string[],
  type: 'news' | 'seo' | 'blog' | 'social',
  config?: GenerationConfig
): Promise<ContentTemplate[]> {
  console.log(`[AI] Batch generating ${type} content for ${topics.length} topics`);

  const generators = {
    news: generateNewsContent,
    seo: (t: string) => generateSEOContent(t, 'chimney_painting', config),
    blog: generateBlogPost,
    social: (t: string) => generateSocialPost(t, 'telegram', config)
  };

  return Promise.all(topics.map(topic => generators[type](topic)));
}
