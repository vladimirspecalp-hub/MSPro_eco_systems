import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.deepseek.com",
});

// --- DATA FROM CALCULATOR ---
// Copied from client/src/lib/calculator-data.ts to avoid TS build complexity

const REGIONS = [
    // ЦЕНТРАЛЬНЫЙ ФО
    { name: "Москва", value: 1.0 },
    { name: "Московская область", value: 1.0 },
    { name: "Санкт-Петербург", value: 1.0 },
    { name: "Екатеринбург", value: 0.95 },
    { name: "Казань (Татарстан)", value: 0.9 },
    { name: "Новосибирск", value: 1.1 },
    { name: "Краснодар", value: 1.0 },
    { name: "Нижний Новгород", value: 0.9 },
    { name: "Якутск (Саха)", value: 1.7 }, // Example of high cost region
    { name: "Мурманск", value: 1.4 },
    { name: "Владивосток", value: 1.3 },
];

const SERVICE_TYPES = [
    {
        id: "chimney_painting",
        label: "Покраска дымовых труб",
        baseRate: 500, // руб/м2 или пог.м
        unit: "за м²"
    },
    {
        id: "anticorrosion",
        label: "Антикоррозионная защита металлоконструкций",
        baseRate: 700,
        unit: "за м²"
    },
    {
        id: "mspro_quad",
        label: "Нанесение покрытия MSPRO Quad (гарантия 20 лет)",
        baseRate: 1200,
        unit: "за м²"
    },
    {
        id: "fireproofing",
        label: "Огнезащита металлоконструкций",
        baseRate: 900,
        unit: "за м²"
    },
    {
        id: "rope_access",
        label: "Услуги промышленных альпинистов",
        baseRate: 2000, // Минимальный выезд или ставка
        unit: "за смену/вызов"
    },
    {
        id: "ceiling_sanation",
        label: "Санация и обеспыливание потолков",
        baseRate: 1500,
        unit: "за м²"
    }
];

const HAZARDS = [
    "Работа на высоте",
    "Сжатые сроки",
    "Сложный доступ",
    "Агрессивная среда"
];

// --- GENERATION LOGIC ---

async function generatePriceGuide(service, region) {
    // Calculate estimated base price for this region
    const estimatedPrice = Math.round(service.baseRate * region.value);

    const prompt = `
Ты — ведущий сметчик и эксперт по ценообразованию в промышленном строительстве (компания MS-PRO).
Твоя задача — написать подробную статью "Гайд по ценам" для SEO.

Вводные данные:
- Услуга: ${service.label}
- Регион: ${region.name}
- Базовая ставка в калькуляторе (без к-тов): ${service.baseRate} руб. ${service.unit}
- Региональный коэффициент: ${region.value} (Цены в этом регионе ${region.value >= 1 ? 'выше' : 'ниже'} или равны базовым)
- Расчетная цена ОТ: ${estimatedPrice} руб. ${service.unit}

Структура JSON-ответа:
{
  "title": "Заголовок H1 (например: Цены на покраску труб в Москве 2025: Прайс-лист)",
  "meta_title": "SEO Title (до 60 зн)",
  "meta_description": "Meta Description (до 160 зн) с ценой и призывом",
  "intro": "Вступление (2-3 абзаца). Почему важно знать точную цену, специфика региона ${region.name}.",
  "price_table": [
    {"service": "Название работы (эконом)", "price": "от ${Math.round(estimatedPrice * 0.9)} руб.", "comment": "Для простых объектов"},
    {"service": "Название работы (стандарт)", "price": "от ${estimatedPrice} руб.", "comment": "Самый популярный вариант"},
    {"service": "Название работы (премиум/сложно)", "price": "от ${Math.round(estimatedPrice * 1.3)} руб.", "comment": "С гарантией 10+ лет или сложные условия"}
  ],
  "factors_block": "Текст о том, что влияет на цену (высота, сезонность, материалы). Упомяни факторы: ${HAZARDS.join(', ')}.",
  "region_specifics": "Блок про специфику работы именно в регионе ${region.name} (логистика, климат, местные требования).",
  "faq": [
    {"q": "Вопрос про цену 1", "a": "Ответ"},
    {"q": "Вопрос про сроки/смету 2", "a": "Ответ"}
  ],
  "cta_text": "Призыв воспользоваться онлайн-калькулятором для точного расчета."
}

Требования:
- Стиль: Экспертный, B2B, конкретный.
- Обязательно упоминай, что точную смету можно получить только после расчета в калькуляторе или выезда.
- Не выдумывай несуществующие законы, пиши общие строительные нормы РФ.
`;

    try {
        const response = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 4000
        });

        const content = JSON.parse(response.choices[0].message.content);
        return {
            slug: `price-${service.id.replace(/_/g, '-')}-${region.name.toLowerCase().replace(/ \(.+\)/, '').replace(/ /g, '-')}`,
            service_id: service.id,
            region_name: region.name,
            ...content
        };
    } catch (error) {
        console.error(`Error generating for ${service.label} in ${region.name}:`, error.message);
        return null;
    }
}

async function main() {
    console.log('🚀 Starting Price Guide Generation...');

    const outputDir = path.join(__dirname, '..', 'content', 'price_guides');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate for ALL services and regions
    const SERVICES_TO_GENERATE = SERVICE_TYPES;
    const REGIONS_TO_GENERATE = REGIONS; // All regions

    for (const service of SERVICES_TO_GENERATE) {
        for (const region of REGIONS_TO_GENERATE) {
            console.log(`Generating: ${service.label} for ${region.name}...`);
            const guide = await generatePriceGuide(service, region);

            if (guide) {
                const filePath = path.join(outputDir, `${guide.slug}.json`);
                fs.writeFileSync(filePath, JSON.stringify(guide, null, 2));
                console.log(`✅ Saved: ${filePath}`);
            }

            // Rate limit
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    console.log('🎉 Done!');
}

main().catch(console.error);
