import OpenAI from 'openai';

interface FAQItem {
  question: string;
  answer: string;
}

interface PageContent {
  title: string;
  description: string;
  h1: string;
  h2: string;
  faq: FAQItem[];
  keywords: string[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePageContent(keyword: string, region: string = 'Москва и область'): Promise<PageContent> {
  try {
    const prompt = `
Ты — эксперт по SEO-контенту для B2B услуг промышленного альпинизма и покраски труб.

Создай SEO-оптимизированный контент для страницы услуги: "${keyword}"
Регион: ${region}

Компания MS-PRO специализируется на:
- Промышленном альпинизме
- Покраске и антикоррозийной защите труб
- Покрытии MSPRO Quad с гарантией 20 лет

Верни JSON-объект со следующими полями:
{
  "title": "SEO-оптимизированный заголовок страницы (до 60 символов)",
  "description": "Meta description (до 160 символов)",
  "h1": "Главный заголовок H1 с ключевым словом",
  "h2": "Подзаголовок H2 для дополнительного контекста",
  "keywords": ["ключевое слово 1", "ключевое слово 2", "ключевое слово 3", "ключевое слово 4"],
  "faq": [
    {
      "question": "Вопрос 1 с ключевым словом",
      "answer": "Подробный ответ 1 (2-3 предложения)"
    },
    {
      "question": "Вопрос 2 о стоимости/сроках",
      "answer": "Подробный ответ 2 (2-3 предложения)"
    },
    {
      "question": "Вопрос 3 о гарантиях/регионах",
      "answer": "Подробный ответ 3 (2-3 предложения)"
    }
  ]
}

Требования:
- Используй профессиональный B2B тон
- Упоминай MSPRO Quad и гарантию 20 лет
- Естественно интегрируй ключевые слова
- FAQ должен отвечать на реальные вопросы клиентов
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Ты — эксперт по SEO-контенту для промышленных B2B услуг. Всегда возвращай валидный JSON без дополнительного текста.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI не вернул контент');
    }

    const parsedContent = JSON.parse(content) as PageContent;
    
    return parsedContent;
  } catch (error) {
    console.error('Ошибка генерации AI контента:', error);
    
    return {
      title: `${keyword} — MS-PRO промышленный альпинизм`,
      description: `Профессиональные услуги ${keyword} в регионе ${region}. Антикоррозийное покрытие MSPRO Quad с гарантией 20 лет.`,
      h1: keyword,
      h2: 'Профессиональные услуги промышленного альпинизма',
      keywords: ['промышленный альпинизм', keyword, 'антикоррозийная защита', 'MSPRO Quad'],
      faq: [
        {
          question: `Как заказать ${keyword} в ${region}?`,
          answer: "Оставьте заявку на сайте или позвоните нам. Мы рассчитаем стоимость и согласуем сроки выполнения работ."
        },
        {
          question: `Сколько стоит ${keyword}?`,
          answer: "Стоимость рассчитывается индивидуально в зависимости от объема работ, высоты объекта и сложности доступа."
        },
        {
          question: 'Какие гарантии предоставляются?',
          answer: 'Мы предоставляем официальную гарантию до 20 лет на антикоррозийное покрытие MSPRO Quad и до 5 лет на выполненные работы.'
        }
      ]
    };
  }
}

export default { generatePageContent };
