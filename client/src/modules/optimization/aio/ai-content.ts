export interface AIGeneratedContent {
  title: string;
  h1: string;
  h2: string;
  description: string;
  keywords: string[];
  faq: Array<{ question: string; answer: string }>;
}

export interface ContentGenerationRequest {
  slug: string;
  keyword?: string;
  region?: string;
}

export async function generateAIContent(request: ContentGenerationRequest): Promise<AIGeneratedContent | null> {
  try {
    const params = new URLSearchParams();
    params.set('slug', request.slug);
    if (request.keyword) params.set('keyword', request.keyword);
    if (request.region) params.set('region', request.region);

    const response = await fetch(`/api/ai_seo?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`AI generation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('AI content generation error:', error);
    return null;
  }
}

export function generateFallbackContent(keyword: string, region?: string): AIGeneratedContent {
  const title = region 
    ? `${keyword} ${region} — MS-PRO`
    : `${keyword} — MS-PRO`;

  return {
    title,
    h1: title,
    h2: 'Профессиональные услуги с гарантией 20 лет',
    description: `${keyword}${region ? ` ${region}` : ''}. Сертифицированное покрытие MSPRO Quad, гарантия до 20 лет. Работаем по всей России.`,
    keywords: [keyword, 'MSPRO Quad', 'покраска труб', 'антикоррозийная защита'],
    faq: [
      {
        question: `Сколько стоит ${keyword.toLowerCase()}?`,
        answer: 'Стоимость зависит от объёма работ. Оставьте заявку для бесплатного расчёта.',
      },
      {
        question: 'Какая гарантия на работы?',
        answer: 'Мы предоставляем гарантию до 20 лет при использовании покрытия MSPRO Quad.',
      },
    ],
  };
}

export function isContentComplete(content: Partial<AIGeneratedContent>): boolean {
  return !!(
    content.title &&
    content.description &&
    content.h1 &&
    content.keywords?.length
  );
}
