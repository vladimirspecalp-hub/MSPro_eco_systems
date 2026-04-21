
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";

// 1. Services Data (5 services)
const SERVICES = [
    {
        slug: "rope-access",
        title: "Промышленный альпинизм",
        h1_template: "Услуги промышленных альпинистов в {CityGenitive}",
        price_from: 2500
    },
    {
        slug: "fireproofing",
        title: "Огнезащитная обработка",
        h1_template: "Огнезащита конструкций в {CityGenitive}",
        price_from: 450
    },
    {
        slug: "chimney-painting",
        title: "Покраска дымовых труб",
        h1_template: "Покраска дымовых труб в {CityGenitive}",
        price_from: 1200
    },
    {
        slug: "mspro-quad",
        title: "Аренда спецтехники",
        h1_template: "Аренда спецтехники в {CityGenitive}",
        price_from: 8000
    },
    {
        slug: "demolition",
        title: "Демонтажные работы",
        h1_template: "Демонтаж зданий и сооружений в {CityGenitive}",
        price_from: 3000
    }
];

// 2. Cities Data (Top 50 RU cities)
const CITIES = [
    { name: "Москва", genitive: "Москве", slug: "moskva" },
    { name: "Московская область", genitive: "Московской области", slug: "moskovskaya-oblast" },
    { name: "Санкт-Петербург", genitive: "Санкт-Петербурге", slug: "sankt-peterburg" },
    { name: "Нижний Новгород", genitive: "Нижнем Новгороде", slug: "nizhniy-novgorod" },
    { name: "Екатеринбург", genitive: "Екатеринбурге", slug: "ekaterinburg" },
    { name: "Новосибирск", genitive: "Новосибирске", slug: "novosibirsk" },
    { name: "Казань", genitive: "Казани", slug: "kazan" },
    { name: "Челябинск", genitive: "Челябинске", slug: "chelyabinsk" },
    { name: "Омск", genitive: "Омске", slug: "omsk" },
    { name: "Самара", genitive: "Самаре", slug: "samara" },
    { name: "Ростов-на-Дону", genitive: "Ростове-на-Дону", slug: "rostov-na-donu" },
    { name: "Уфа", genitive: "Уфе", slug: "ufa" },
    { name: "Красноярск", genitive: "Красноярске", slug: "krasnoyarsk" },
    { name: "Воронеж", genitive: "Воронеже", slug: "voronezh" },
    { name: "Пермь", genitive: "Перми", slug: "perm" },
    { name: "Волгоград", genitive: "Волгограде", slug: "volgograd" },
    { name: "Краснодар", genitive: "Краснодаре", slug: "krasnodar" },
    { name: "Саратов", genitive: "Саратове", slug: "saratov" },
    { name: "Тюмень", genitive: "Тюмени", slug: "tyumen" },
    { name: "Тольятти", genitive: "Тольятти", slug: "tolyatti" },
    { name: "Ижевск", genitive: "Ижевске", slug: "izhevsk" },
    { name: "Барнаул", genitive: "Барнауле", slug: "barnaul" },
    { name: "Ульяновск", genitive: "Ульяновске", slug: "ulyanovsk" },
    { name: "Иркутск", genitive: "Иркутске", slug: "irkutsk" },
    { name: "Хабаровск", genitive: "Хабаровске", slug: "khabarovsk" },
    { name: "Махачкала", genitive: "Махачкале", slug: "makhachkala" },
    { name: "Ярославль", genitive: "Ярославле", slug: "yaroslavl" },
    { name: "Владивосток", genitive: "Владивостоке", slug: "vladivostok" },
    { name: "Оренбург", genitive: "Оренбурге", slug: "orenburg" },
    { name: "Томск", genitive: "Томске", slug: "tomsk" },
    { name: "Кемерово", genitive: "Кемерово", slug: "kemerovo" },
    { name: "Новокузнецк", genitive: "Новокузнецке", slug: "novokuznetsk" },
    { name: "Рязань", genitive: "Рязани", slug: "ryazan" },
    { name: "Астрахань", genitive: "Астрахани", slug: "astrakhan" },
    { name: "Набережные Челны", genitive: "Набережных Челнах", slug: "naberezhnye-chelny" },
    { name: "Пенза", genitive: "Пензе", slug: "penza" },
    { name: "Липецк", genitive: "Липецке", slug: "lipetsk" },
    { name: "Киров", genitive: "Кирове", slug: "kirov" },
    { name: "Чебоксары", genitive: "Чебоксарах", slug: "cheboksary" },
    { name: "Тула", genitive: "Туле", slug: "tula" },
    { name: "Калининград", genitive: "Калининграде", slug: "kaliningrad" },
    { name: "Балашиха", genitive: "Балашихе", slug: "balashikha" },
    { name: "Курск", genitive: "Курске", slug: "kursk" },
    { name: "Севастополь", genitive: "Севастополе", slug: "sevastopol" },
    { name: "Улан-Удэ", genitive: "Улан-Удэ", slug: "ulan-ude" },
    { name: "Ставрополь", genitive: "Ставрополе", slug: "stavropol" },
    { name: "Сочи", genitive: "Сочи", slug: "sochi" },
    { name: "Тверь", genitive: "Твери", slug: "tver" },
    { name: "Магнитогорск", genitive: "Магнитогорске", slug: "magnitogorsk" },
    { name: "Иваново", genitive: "Иваново", slug: "ivanovo" }
];

const OUTPUT_DIR = resolve(process.cwd(), "content", "price_guides");

if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
}

function generate() {
    let count = 0;
    console.log(`Starting generation for ${SERVICES.length} services x ${CITIES.length} cities...`);

    // Define more realistic data templates for variety
    const VARIATIONS = [
        { type: 'standard', suffix: '' },
        { type: 'premium', suffix: ' - Профессиональные услуги' },
        { type: 'promo', suffix: ' (Скидка 10% при заказе с сайта)' }
    ];

    SERVICES.forEach(service => {
        CITIES.forEach(city => {
            const filename = `price-${service.slug}-${city.slug}.json`;
            const filePath = resolve(OUTPUT_DIR, filename);

            const h1_raw = service.h1_template.replace("{CityGenitive}", city.genitive);

            const content = {
                slug: `price-${service.slug}-${city.slug}`,
                service_slug: service.slug,
                city_slug: city.slug,

                region: {
                    name: city.name,
                    genitive: city.genitive
                },

                title: `${h1_raw} - Цены 2026 | Прайс-лист МС ПРО`,
                description: `Актуальный прайс-лист 2026 на ${service.title.toLowerCase()} в городе ${city.name} (${city.genitive}). Рассчитайте стоимость онлайн. Лицензии МЧС, допуски СРО. Выезд инженера бесплатно.`,
                keywords: [
                    service.title,
                    `цена ${service.title.toLowerCase()}`,
                    `стоимость ${service.title.toLowerCase()}`,
                    `${service.title.toLowerCase()} ${city.name}`,
                    `${service.title.toLowerCase()} ${city.genitive}`,
                    `заказать ${service.title.toLowerCase()}`
                ],

                h1: h1_raw,

                content: `
          <p class="lead">Официальный прайс-лист компании МС ПРО на услуги направления "${service.title}" в городе ${city.name}.</p>
          <p>Мы работаем по всей территории города и области (${city.genitive}), предлагая конкурентные цены и строгое соблюдение нормативов безопасности.</p>
          <h3>Почему выбирают нас в г. ${city.name}?</h3>
          <ul>
            <li>Работаем с 2011 года</li>
            <li>Собственный штат квалифицированных специалистов</li>
            <li>Лицензии МЧС и допуски СРО на высотные работы</li>
            <li>Бесплатный выезд на осмечивание</li>
          </ul>
        `,

                pricing_table: [
                    { name: "Минимальный выезд бригады", price: `${service.price_from} ₽` },
                    { name: "Стандартная ставка (м²)", price: "от 550 ₽" },
                    { name: "Сложный доступ (веревки)", price: "+30%" },
                    { name: "Ночные работы", price: "+50%" },
                    { name: "Срочный выезд", price: "+20%" }
                ],

                faq: [
                    {
                        q: `Вы работаете непосредственно в г. ${city.name}?`,
                        a: `Да, у нас есть мобильные бригады, обслуживающие ${city.name} и ближайшие населенные пункты.`
                    },
                    {
                        q: "Как быстро вы можете приступить к работам?",
                        a: "Обычно мы готовы выйти на объект в течение 24-48 часов после согласования сметы."
                    },
                    {
                        q: "Предоставляете ли вы гарантию?",
                        a: "Да, на все виды работ предоставляется официальная гарантия по договору от 1 до 5 лет."
                    }
                ],

                updatedAt: new Date().toISOString()
            };

            writeFileSync(filePath, JSON.stringify(content, null, 2));
            count++;
        });
    });

    console.log(`Successfully generated ${count} price guides into ${OUTPUT_DIR}`);
}

generate();
