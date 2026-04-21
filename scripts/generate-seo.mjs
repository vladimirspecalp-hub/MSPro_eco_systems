import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.deepseek.com",
});

// Services from calculator
const SERVICES = [
    { id: "painting", name: "Покраска", slug: "pokraska" },
    { id: "anticorrosion", name: "Антикоррозийная защита", slug: "antikorrozionnaya-zaschita" },
    { id: "mspro_quad", name: "Покрытие MSPRO Quad для", slug: "pokrytie-mspro-quad" },
    { id: "fireproofing", name: "Огнезащита", slug: "ognezaschita" },
    { id: "rope_access", name: "Промышленный альпинизм:", slug: "promyshlennyy-alpinizm" },
    { id: "sanation", name: "Санация и обеспыливание", slug: "sanaciya-i-obespylivanie" }
];

// Object types
const OBJECTS = [
    { id: "chimney", name: "дымовых труб", slug: "dymovyh-trub" },
    { id: "metal", name: "металлоконструкций", slug: "metallokonstrukciy" },
    { id: "lep", name: "опор ЛЭП", slug: "opor-lep" },
    { id: "ams", name: "АМС", slug: "ams" },
    { id: "tanks", name: "резервуаров", slug: "rezervuarov" },
    { id: "bridges", name: "мостов", slug: "mostov" },
    { id: "ceiling", name: "потолков цехов", slug: "potolkov-cehov" }
];

// Regions from calculator (simplified list for faster generation)
const REGIONS = [
    // Центральный ФО
    { name: "Москва", slug: "moskva", context: "" },
    { name: "Московская область", slug: "moskovskaya-oblast", context: "" },
    { name: "Тула", slug: "tula", context: "" },
    { name: "Ярославль", slug: "yaroslavl", context: "" },
    { name: "Воронеж", slug: "voronezh", context: "" },
    { name: "Рязань", slug: "ryazan", context: "" },
    { name: "Тверь", slug: "tver", context: "" },
    // Северо-Западный ФО
    { name: "Санкт-Петербург", slug: "sankt-peterburg", context: "" },
    { name: "Архангельск", slug: "arhangelsk", context: "северный регион" },
    { name: "Мурманск", slug: "murmansk", context: "Крайний Север, суровые условия" },
    { name: "Воркута", slug: "vorkuta", context: "Крайний Север, экстремальные морозы" },
    { name: "Сыктывкар", slug: "syktyvkar", context: "Республика Коми" },
    { name: "Калининград", slug: "kaliningrad", context: "эксклав" },
    // Южный ФО
    { name: "Краснодар", slug: "krasnodar", context: "юг России" },
    { name: "Сочи", slug: "sochi", context: "курортный город, морской климат" },
    { name: "Ростов-на-Дону", slug: "rostov-na-donu", context: "" },
    { name: "Волгоград", slug: "volgograd", context: "" },
    { name: "Астрахань", slug: "astrahan", context: "" },
    { name: "Севастополь", slug: "sevastopol", context: "Крым" },
    { name: "Керчь", slug: "kerch", context: "Крым, Керченский пролив" },
    { name: "Симферополь", slug: "simferopol", context: "Крым, промышленность" },
    { name: "Туапсе", slug: "tuapse", context: "Черноморское побережье, НПЗ" },
    // Приволжский ФО
    { name: "Казань", slug: "kazan", context: "Татарстан" },
    { name: "Самара", slug: "samara", context: "" },
    { name: "Тольятти", slug: "tolyatti", context: "химическая промышленность" },
    { name: "Нижний Новгород", slug: "nizhniy-novgorod", context: "" },
    { name: "Нижнекамск", slug: "nizhnekamsk", context: "Татарстан, нефтехимия" },
    { name: "Уфа", slug: "ufa", context: "Башкортостан" },
    { name: "Пермь", slug: "perm", context: "" },
    { name: "Саратов", slug: "saratov", context: "" },
    { name: "Оренбург", slug: "orenburg", context: "" },
    // Уральский ФО
    { name: "Екатеринбург", slug: "ekaterinburg", context: "Урал, промышленный регион" },
    { name: "Челябинск", slug: "chelyabinsk", context: "Урал, промышленный регион" },
    { name: "Магнитогорск", slug: "magnitogorsk", context: "Урал, металлургия" },
    { name: "Тюмень", slug: "tyumen", context: "Западная Сибирь" },
    { name: "Сургут", slug: "surgut", context: "ХМАО, нефтегазовый регион" },
    { name: "Нижневартовск", slug: "nizhnevartovsk", context: "ХМАО, нефтегазовый регион" },
    { name: "Новый Уренгой", slug: "novyy-urengoy", context: "ЯНАО, газодобыча, Крайний Север" },
    // Сибирский ФО
    { name: "Новосибирск", slug: "novosibirsk", context: "Сибирь" },
    { name: "Омск", slug: "omsk", context: "Сибирь" },
    { name: "Красноярск", slug: "krasnoyarsk", context: "Сибирь" },
    { name: "Норильск", slug: "norilsk", context: "Крайний Север, экстремальные условия, металлургия" },
    { name: "Иркутск", slug: "irkutsk", context: "Восточная Сибирь" },
    { name: "Кемерово", slug: "kemerovo", context: "Кузбасс, угледобыча" },
    { name: "Новокузнецк", slug: "novokuznetsk", context: "Кузбасс, металлургия" },
    { name: "Липецк", slug: "lipetsk", context: "металлургия (НЛМК)" },
    { name: "Старый Оскол", slug: "staryy-oskol", context: "КМА, горно-обогатительные комбинаты" },
    { name: "Братск", slug: "bratsk", context: "Восточная Сибирь, металлургия, ЛПК" },
    { name: "Барнаул", slug: "barnaul", context: "Алтай" },
    { name: "Томск", slug: "tomsk", context: "Сибирь" },
    // Дальневосточный ФО
    { name: "Владивосток", slug: "vladivostok", context: "Дальний Восток, морской климат" },
    { name: "Хабаровск", slug: "habarovsk", context: "Дальний Восток" },
    { name: "Якутск", slug: "yakutsk", context: "Республика Саха, экстремальные морозы до -50°C" },
    { name: "Магадан", slug: "magadan", context: "Крайний Север, суровые условия" },
    { name: "Петропавловск-Камчатский", slug: "petropavlovsk-kamchatskiy", context: "Камчатка, вулканы" },
    { name: "Южно-Сахалинск", slug: "yuzhno-sahalinsk", context: "Сахалин, островной регион" },
    // Арктика и Оффшор
    { name: "Певек", slug: "pevek", context: "Чукотка, Арктика, Севморпуть" },
    { name: "Диксон", slug: "dikson", context: "Таймыр, Арктика, самый северный порт" },
    { name: "Оффшорные платформы", slug: "offshore", context: "международные воды, морские платформы" }
];

// Service-Object compatibility matrix
const COMPATIBILITY = {
    "painting": ["chimney", "metal", "tanks", "bridges", "lep", "ams"],
    "anticorrosion": ["chimney", "metal", "lep", "ams", "tanks", "bridges"],
    "mspro_quad": ["chimney", "metal", "tanks", "bridges"],
    "fireproofing": ["metal"],
    "rope_access": ["chimney", "metal", "lep", "ams", "tanks", "bridges"],
    "sanation": ["ceiling"]
};

async function generateSEOContent(service, object, region) {
    const prompt = `
Ты — эксперт по SEO-контенту для B2B услуг промышленного альпинизма.

Услуга: ${service.name} ${object.name}
Регион: ${region.name}
${region.context ? `Контекст региона: ${region.context}` : ''}

Компания MS-PRO специализируется на:
- Промышленном альпинизме
- Покраске и антикоррозийной защите
- Покрытии MSPRO Quad с гарантией 20 лет
- Огнезащите металлоконструкций
- Санации и обеспыливании потолков в цехах

Верни JSON-объект:
{
  "title": "SEO-заголовок (до 60 символов) с услугой и городом",
  "description": "Meta description (до 160 символов) с упоминанием региона${region.context ? ' и его особенностей' : ''}",
  "h1": "Главный заголовок H1",
  "h2": "Подзаголовок H2${region.context ? ' с региональным контекстом' : ''}",
  "keywords": ["ключевое слово 1", "ключевое слово 2", "ключевое слово 3", "ключевое слово 4"],
  "cta": "Текст кнопки призыва к действию",
  "faq": [
    {"question": "Вопрос 1", "answer": "Ответ 1 (2-3 предложения)"},
    {"question": "Вопрос 2", "answer": "Ответ 2 (2-3 предложения)"},
    {"question": "Вопрос 3", "answer": "Ответ 3 (2-3 предложения)"}
  ]
}

Требования:
- Профессиональный B2B тон
- Упоминай MSPRO Quad и гарантию 20 лет где уместно
${region.context ? `- Учитывай региональную специфику: ${region.context}` : ''}
- FAQ должен отвечать на реальные вопросы клиентов
`;

    try {
        const response = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 1000
        });

        const content = JSON.parse(response.choices[0].message.content);
        return {
            slug: `${service.slug}-${object.slug}-${region.slug}`,
            region: region.name,
            ...content
        };
    } catch (error) {
        console.error(`Error generating content for ${service.slug}-${object.slug}-${region.slug}:`, error.message);
        return null;
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('🚀 Starting SEO content generation...');
    console.log(`📊 Services: ${SERVICES.length}, Objects: ${OBJECTS.length}, Regions: ${REGIONS.length}`);

    const outputDir = path.join(__dirname, 'content', 'seo_generated');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const allContent = [];
    let generated = 0;
    let skipped = 0;
    let errors = 0;

    // Calculate total
    let total = 0;
    for (const service of SERVICES) {
        const compatibleObjects = COMPATIBILITY[service.id] || [];
        total += compatibleObjects.length * REGIONS.length;
    }

    console.log(`📝 Total pages to generate: ${total}`);
    console.log(`⏱️ Estimated time: ${Math.ceil(total * 2 / 60)} minutes`);
    console.log('');

    for (const service of SERVICES) {
        const compatibleObjects = COMPATIBILITY[service.id] || [];

        for (const objectId of compatibleObjects) {
            const object = OBJECTS.find(o => o.id === objectId);
            if (!object) continue;

            const batchContent = [];

            for (const region of REGIONS) {
                const slug = `${service.slug}-${object.slug}-${region.slug}`;

                // Check if already exists
                const existingFile = path.join(outputDir, `${slug}.json`);
                if (fs.existsSync(existingFile)) {
                    try {
                        const existingContent = JSON.parse(fs.readFileSync(existingFile, 'utf8'));
                        // Ensure it's an object/array as expected
                        if (existingContent) {
                            allContent.push(existingContent);
                        }
                    } catch (e) {
                        console.error(`Error reading existing file ${slug}.json:`, e.message);
                    }
                    skipped++;
                    continue;
                }

                console.log(`[${generated + skipped + errors + 1}/${total}] Generating: ${slug}`);

                const content = await generateSEOContent(service, object, region);

                if (content) {
                    batchContent.push(content);
                    allContent.push(content);
                    generated++;

                    // Save individual file
                    fs.writeFileSync(existingFile, JSON.stringify(content, null, 2));
                } else {
                    errors++;
                }

                // Rate limiting - 1 request per second
                await sleep(1000);
            }

            // Save batch file for this service-object combination
            if (batchContent.length > 0) {
                const batchFile = path.join(outputDir, `batch_${service.slug}_${object.slug}.json`);
                fs.writeFileSync(batchFile, JSON.stringify(batchContent, null, 2));
                console.log(`✅ Saved batch: ${service.slug}-${object.slug} (${batchContent.length} pages)`);
            }
        }
    }

    // Save all content to single file
    const allContentFile = path.join(outputDir, 'all_seo_content.json');
    fs.writeFileSync(allContentFile, JSON.stringify(allContent, null, 2));

    console.log('');
    console.log('🎉 Generation complete!');
    console.log(`✅ Generated: ${generated}`);
    console.log(`⏭️ Skipped (already exists): ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📁 Output: ${outputDir}`);
}

main().catch(console.error);
