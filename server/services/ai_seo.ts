import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    correctedKeyword?: string;
    region?: string;
    regionalContext?: string;
    cta?: string;
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.deepseek.com",
});

export async function generatePageContent(keyword: string, region?: string): Promise<PageContent> {
    // 1. Попытка загрузить из заранее сгенерированных файлов
    try {
        const pathsToCheck = [
            path.join(process.cwd(), 'content', 'seo_generated', `${keyword}.json`),
            path.join(process.cwd(), 'public_html', 'content', 'seo_generated', `${keyword}.json`),
            path.join(process.cwd(), 'dist', 'content', 'seo_generated', `${keyword}.json`),
            path.join(__dirname, 'content', 'seo_generated', `${keyword}.json`),
            path.join(__dirname, '..', 'content', 'seo_generated', `${keyword}.json`) // if in dist/server
        ];

        console.log(`🔍 Seeking SEO file for: ${keyword}`);

        for (const filePath of pathsToCheck) {
            try {
                await fs.promises.access(filePath);
                console.log(`✅ Found SEO file at: ${filePath}`);
                const fileContent = await fs.promises.readFile(filePath, 'utf-8');
                const data = JSON.parse(fileContent);
                return {
                    ...data,
                    region: data.region || region || "Москва и область"
                };
            } catch {
                continue;
            }
        }
        console.warn(`⚠️ SEO file not found in any checked paths for ${keyword}`);
    } catch (err) {
        console.warn(`❌ Error loading pre-generated content for ${keyword}:`, err);
    }


    // 2. Если файла нет, генерируем через AI
    try {
        const prompt = `
Ты — эксперт по SEO-контенту для B2B услуг промышленного альпинизма и покраски труб.

ВАЖНО: Пользователь ввёл запрос, который может содержать:
1. Орфографические ошибки — ИСПРАВЬ их
2. Название города/региона — ИЗВЛЕКИ и используй
3. Транслитерацию — преобразуй в читаемый русский текст

Запрос пользователя: "${keyword}"

Твоя задача:
1. Исправь все орфографические ошибки в запросе
2. Извлеки город/регион из запроса. Если город не указан, используй "Москва и область"
3. Определи региональный контекст:
   - Норильск, Мурманск, Воркута → "Крайний Север" (упомяни суровые климатические условия)
   - Якутск → "Республика Саха" (экстремальные морозы)
   - Сургут, Нижневартовск, Тюмень → "Западная Сибирь" (нефтегазовый регион)
   - Екатеринбург, Челябинск, Магнитогорск → "Урал" (промышленный регион)
   - Владивосток, Хабаровск → "Дальний Восток"
   - Сочи, Краснодар → "Юг России" (морской климат)
   - Другие города → просто название города/области

Компания MS-PRO специализируется на:
- Промышленном альпинизме
- Покраске и антикоррозийной защите труб и металлоконструкций
- Покрытии MSPRO Quad с гарантией 20 лет
- Санации и обеспыливании потолков в цехах

Верни JSON-объект со следующими полями:
{
  "correctedKeyword": "Исправленная версия запроса пользователя на правильном русском языке",
  "region": "Извлечённый город/регион",
  "regionalContext": "Региональный контекст (Крайний Север, Урал, Сибирь и т.д.) или пустая строка если не применимо",
  "title": "SEO-заголовок (до 60 символов) с городом и услугой",
  "description": "Meta description (до 160 символов) с упоминанием региона и климатических особенностей если есть",
  "h1": "Главный заголовок H1 с исправленным ключевым словом и городом",
  "h2": "Подзаголовок H2 с региональным контекстом (например: 'в условиях Крайнего Севера')",
  "keywords": ["ключевое слово 1 с городом", "ключевое слово 2", "ключевое слово 3", "ключевое слово 4"],
  "cta": "Текст кнопки призыва к действию",
  "faq": [
    {
      "question": "Вопрос 1 про услугу в конкретном регионе",
      "answer": "Подробный ответ с учётом региональной специфики (2-3 предложения)"
    },
    {
      "question": "Вопрос 2 о стоимости/сроках в этом регионе",
      "answer": "Подробный ответ 2 (2-3 предложения)"
    },
    {
      "question": "Вопрос 3 о гарантиях и особенностях работы",
      "answer": "Подробный ответ 3 (2-3 предложения)"
    }
  ]
}

Требования:
- Используй профессиональный B2B тон
- Упоминай MSPRO Quad и гарантию 20 лет
- Для северных регионов упоминай морозостойкость покрытия
- Для промышленных регионов упоминай опыт работы на крупных предприятиях
- FAQ должен отвечать на реальные вопросы клиентов с учётом региона
`;

        const response = await openai.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: 'Ты — эксперт по SEO-контенту для промышленных B2B услуг. Всегда возвращай валидный JSON без дополнительного текста. Особое внимание уделяй исправлению орфографических ошибок и определению региональной специфики.'
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
            throw new Error('DeepSeek не вернул контент');
        }

        const parsedContent = JSON.parse(content) as PageContent;

        return parsedContent;
    } catch (error) {
        console.error('Ошибка генерации AI контента:', error);

        const readableKeyword = keyword.replace(/-/g, ' ');
        const fallbackRegion = region || 'Москва и область';
        return {
            title: `${readableKeyword} — MS-PRO промышленный альпинизм`,
            description: `Профессиональные услуги ${readableKeyword} в регионе ${fallbackRegion}. Антикоррозийное покрытие MSPRO Quad с гарантией 20 лет.`,
            h1: readableKeyword,
            h2: 'Профессиональные услуги промышленного альпинизма',
            keywords: ['промышленный альпинизм', readableKeyword, 'антикоррозийная защита', 'MSPRO Quad'],
            region: fallbackRegion,
            cta: 'Рассчитать стоимость',
            faq: [
                {
                    question: `Как заказать ${keyword} в ${fallbackRegion}?`,
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
