/**
 * SSR Meta Service — серверная инъекция JSON-LD, <title> и <meta> в HTML
 * @module server/services/ssr-meta
 *
 * Для каждого URL определяет тип страницы и генерирует:
 * - <title> и <meta name="description">
 * - JSON-LD: Organization, Service, FAQPage, BreadcrumbList, HowTo, Speakable, WebPage
 */

import { getPageBySlug, type SEOEntry } from './seo-service';
import type { GeoContext, GeoRegion } from '../middleware/geo-context';

// ─── Константы организации ─────────────────────────────────────────────────

const ORG = {
    name: 'MS-PRO',
    legalName: 'ООО "МЕТАЛИУМ СИСТЕМ ПРОТЕКТ"',
    url: 'https://mspro-ltd.ru',
    logo: 'https://mspro-ltd.ru/assets/logo.jpg',
    telephone: '+7 (987) 909-29-38',
    email: 'info@mspro-ltd.ru',
    description: 'Промышленный альпинизм, огнезащита, антикоррозийная защита. Работаем по всей России. Лицензия МЧС, допуск СРО.',
    foundingDate: '2010',
    address: {
        streetAddress: 'пр. Кирова, 275',
        addressLocality: 'Самара',
        addressRegion: 'Самарская область',
        postalCode: '443001',
        addressCountry: 'RU',
    },
};

const DEFAULT_TITLE = 'MS-PRO — Промышленный альпинизм, огнезащита, антикоррозийная защита';
const DEFAULT_DESCRIPTION = 'MS-PRO — промышленный альпинизм, огнезащитная обработка, антикоррозийная защита. Лицензия МЧС, допуск СРО. Работаем по всей России. +7 (987) 909-29-38.';

// ─── Типы страниц ──────────────────────────────────────────────────────────

interface PageMeta {
    title: string;
    description: string;
    schemas: object[];
    statusCode: number;
}

type PageType =
    | { type: 'home' }
    | { type: 'service'; slug: string }
    | { type: 'seo'; slug: string }
    | { type: 'price-guide'; slug: string }
    | { type: 'faq' }
    | { type: 'contacts' }
    | { type: 'calculator' }
    | { type: 'documents' }
    | { type: 'mspro-quad' }
    | { type: 'news' }
    | { type: 'news-article'; slug: string }
    | { type: 'prices' }
    | { type: 'company-team' }
    | { type: 'other'; path: string };

// ─── Роутинг ────────────────────────────────────────────────────────────────

function resolvePageType(url: string): PageType {
    const path = url.split('?')[0].replace(/\/$/, '') || '/';

    if (path === '/') return { type: 'home' };
    if (path === '/faq') return { type: 'faq' };
    if (path === '/contacts') return { type: 'contacts' };
    if (path === '/calculator') return { type: 'calculator' };
    if (path === '/documents') return { type: 'documents' };
    if (path === '/prices') return { type: 'prices' };
    if (path === '/company/team') return { type: 'company-team' };
    if (path === '/mspro-quad') return { type: 'mspro-quad' };
    if (path === '/news') return { type: 'news' };

    const newsMatch = path.match(/^\/news\/(.+)$/);
    if (newsMatch) return { type: 'news-article', slug: newsMatch[1] };

    const serviceMatch = path.match(/^\/services\/(.+)$/);
    if (serviceMatch) return { type: 'service', slug: serviceMatch[1] };

    const priceMatch = path.match(/^\/price-guide\/(.+)$/);
    if (priceMatch) return { type: 'price-guide', slug: priceMatch[1] };

    // /:slug — сначала проверяем SEO-страницы
    const rootSlug = path.slice(1);
    if (rootSlug && !rootSlug.includes('/')) {
        return { type: 'seo', slug: rootSlug };
    }

    return { type: 'other', path };
}

// ─── Генераторы schema ─────────────────────────────────────────────────────

function buildOrganizationSchema(): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${ORG.url}/#organization`,
        name: ORG.name,
        legalName: ORG.legalName,
        url: ORG.url,
        logo: ORG.logo,
        description: ORG.description,
        foundingDate: ORG.foundingDate,
        telephone: ORG.telephone,
        email: ORG.email,
        address: {
            '@type': 'PostalAddress',
            ...ORG.address,
        },
        sameAs: [
            'https://vk.com/mspro_samara',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: ORG.telephone,
            contactType: 'customer service',
            areaServed: 'RU',
            availableLanguage: 'Russian',
        },
        areaServed: {
            '@type': 'Country',
            name: 'Россия',
        },
        serviceType: [
            'Промышленный альпинизм',
            'Огнезащитная обработка',
            'Антикоррозийная защита',
            'Покраска дымовых труб',
            'Демонтаж на высоте',
        ],
    };
}

function buildWebPageSchema(url: string, title: string, description: string, datePublished?: string, dateModified?: string, addSpeakable: boolean = false): object {
    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description,
        url: `${ORG.url}${url}`,
        publisher: {
            '@type': 'Organization',
            '@id': `${ORG.url}/#organization`,
        },
        inLanguage: 'ru-RU',
    };

    if (datePublished) schema.datePublished = datePublished;
    if (dateModified) schema.dateModified = dateModified;

    if (addSpeakable) {
        schema.speakable = {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', 'meta[name="description"]', '.faq-question'],
        };
    }

    return schema;
}

function buildServiceSchema(entry: SEOEntry, region?: GeoRegion): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: entry.title,
        description: entry.description,
        provider: {
            '@type': 'Organization',
            '@id': `${ORG.url}/#organization`,
        },
        areaServed: region?.name || entry.region || 'Россия',
        serviceType: 'Промышленная покраска и антикоррозийная защита',
    };
}

function buildFAQPageSchema(faq: Array<{ question: string; answer: string }>): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    };
}

function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

function buildHowToSchema(title: string, description: string): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `Как заказать: ${title}`,
        description,
        totalTime: 'P3D',
        estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'RUB',
            value: 'от 25 000',
        },
        step: [
            {
                '@type': 'HowToStep',
                position: 1,
                name: 'Оставьте заявку',
                text: 'Оставьте заявку на сайте или позвоните по телефону +7 (987) 909-29-38. Наш специалист свяжется с вами в течение 30 минут.',
            },
            {
                '@type': 'HowToStep',
                position: 2,
                name: 'Осмотр объекта',
                text: 'Инженер выезжает на объект для осмотра и замеров. Выезд бесплатный по всей России.',
            },
            {
                '@type': 'HowToStep',
                position: 3,
                name: 'Расчёт сметы',
                text: 'В день обращения вы получаете детальную смету с указанием материалов, сроков и стоимости.',
            },
            {
                '@type': 'HowToStep',
                position: 4,
                name: 'Подготовка поверхности',
                text: 'Бригада выполняет очистку, обезжиривание и грунтовку поверхности по ГОСТ.',
            },
            {
                '@type': 'HowToStep',
                position: 5,
                name: 'Нанесение покрытия',
                text: 'Нанесение сертифицированного покрытия MSPRO Quad методом промышленного альпинизма.',
            },
            {
                '@type': 'HowToStep',
                position: 6,
                name: 'Контроль качества и приёмка',
                text: 'Контроль толщины покрытия, составление акта выполненных работ. Гарантия до 20 лет.',
            },
        ],
    };
}

// ─── Статические мета для известных страниц ─────────────────────────────────

const STATIC_PAGES: Record<string, { title: string; description: string }> = {
    home: {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
    },
    faq: {
        title: 'Часто задаваемые вопросы — MS-PRO',
        description: 'Ответы на вопросы о покраске дымовых труб, антикоррозийной защите, сроках и стоимости работ. MS-PRO — гарантия 20 лет.',
    },
    contacts: {
        title: 'Контакты — MS-PRO',
        description: 'Свяжитесь с MS-PRO: телефон +7 (987) 909-29-38, email info@mspro-ltd.ru. Работаем по всей России.',
    },
    calculator: {
        title: 'Калькулятор стоимости — MS-PRO',
        description: 'Рассчитайте стоимость покраски дымовой трубы онлайн. Бесплатный расчёт за 2 минуты.',
    },
    documents: {
        title: 'Документы и сертификаты — MS-PRO',
        description: 'Лицензии, сертификаты и допуски компании MS-PRO. Сертификат соответствия MSPRO Quad.',
    },
    'mspro-quad': {
        title: 'MSPRO Quad — Огнезащитное покрытие с гарантией 20 лет',
        description: 'MSPRO Quad — сертифицированное огнезащитное и антикоррозийное покрытие для промышленных объектов. Одобрено Ростехнадзором.',
    },
    news: {
        title: 'Новости компании — MS-PRO',
        description: 'Последние новости MS-PRO: выполненные проекты, новые технологии покраски, расширение географии работ.',
    },
    prices: {
        title: 'Прайс-лист 2026 на высотные работы | Цены MS-PRO',
        description: 'Актуальные цены на услуги промышленного альпинизма и антикоррозийной защиты. Прайс-лист на покраску труб, металлоконструкций и огнезащиту. Скачать PDF.',
    },
    'company-team': {
        title: 'Команда MS-PRO — Эксперты по высоте и АКЗ',
        description: 'Руководство, инженеры и альпинисты компании MS-PRO. Квалифицированные специалисты с допусками и опытом работы на сложных промышленных объектах.',
    },
};

// Named service pages
const NAMED_SERVICES: Record<string, { title: string; description: string }> = {
    'rope-access': {
        title: 'Промышленный альпинизм — MS-PRO',
        description: 'Высотные работы методом промышленного альпинизма. Покраска, ремонт, монтаж на высоте. Лицензированные специалисты.',
    },
    'fireproofing-at-height': {
        title: 'Огнезащитная обработка на высоте — MS-PRO',
        description: 'Огнезащитная обработка конструкций покрытием MSPRO Quad. Гарантия 20 лет. Работы на высоте.',
    },
    'anticorrosion-at-height': {
        title: 'Антикоррозийная защита на высоте — MS-PRO',
        description: 'Антикоррозийная защита металлоконструкций на высоте. Сертифицированные материалы, гарантия качества.',
    },
    'ceiling-sanation': {
        title: 'Санация потолков промышленных зданий — MS-PRO',
        description: 'Санация и восстановление потолков промышленных зданий. Удаление грибка, покраска, гидроизоляция.',
    },
    'demolition': {
        title: 'Демонтаж промышленных объектов — MS-PRO',
        description: 'Демонтаж дымовых труб и промышленных конструкций. Безопасный демонтаж с соблюдением всех норм.',
    },
};

// ─── Главная функция ────────────────────────────────────────────────────────

/**
 * Генерирует HTML-фрагмент с <title>, <meta> и JSON-LD для инъекции в <head>
 * @param url — URL запроса (req.originalUrl)
 * @param geoContext — GEO контекст из middleware (опционально)
 * @returns { html: строка для вставки перед </head>, statusCode: HTTP статус }
 */
export async function generateSSRMeta(url: string, geoContext?: GeoContext): Promise<{ html: string; statusCode: number }> {
    const pageType = resolvePageType(url);
    const meta = await resolvePageMeta(pageType, geoContext?.region);

    const canonicalPath = url.split('?')[0].replace(/\/$/, '') || '/';
    const canonicalUrl = `${ORG.url}${canonicalPath}`;

    const parts: string[] = [];

    // <title> и <meta description>
    parts.push(`<title>${escapeHtml(meta.title)}</title>`);
    parts.push(`<meta name="description" content="${escapeAttr(meta.description)}" />`);

    // Canonical (всегда без query-параметров)
    parts.push(`<link rel="canonical" href="${canonicalUrl}" />`);

    // noindex для 404-страниц
    if (meta.statusCode === 404) {
        parts.push(`<meta name="robots" content="noindex, nofollow" />`);
    }

    // Open Graph
    parts.push(`<meta property="og:title" content="${escapeAttr(meta.title)}" />`);
    parts.push(`<meta property="og:description" content="${escapeAttr(meta.description)}" />`);
    parts.push(`<meta property="og:type" content="website" />`);
    parts.push(`<meta property="og:url" content="${canonicalUrl}" />`);
    parts.push(`<meta property="og:locale" content="ru_RU" />`);

    // JSON-LD scripts
    for (const schema of meta.schemas) {
        parts.push(`<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
    }

    return { html: parts.join('\n    '), statusCode: meta.statusCode };
}

async function resolvePageMeta(pageType: PageType, region?: GeoRegion): Promise<PageMeta> {
    const schemas: object[] = [];

    // Organization schema — на каждой странице
    schemas.push(buildOrganizationSchema());

    switch (pageType.type) {
        case 'home': {
            const s = STATIC_PAGES.home;
            schemas.push(buildWebPageSchema('/', s.title, s.description, undefined, undefined, true));
            return { title: s.title, description: s.description, schemas, statusCode: 200 };
        }

        case 'service': {
            // Сначала проверяем именованные сервисы
            const named = NAMED_SERVICES[pageType.slug];
            if (named) {
                schemas.push(buildBreadcrumbSchema([
                    { name: 'Главная', url: ORG.url },
                    { name: 'Услуги', url: `${ORG.url}/services` },
                    { name: named.title.replace(' — MS-PRO', ''), url: `${ORG.url}/services/${pageType.slug}` },
                ]));
                schemas.push(buildHowToSchema(named.title.replace(' — MS-PRO', ''), named.description));
                schemas.push(buildWebPageSchema(`/services/${pageType.slug}`, named.title, named.description, undefined, undefined, true));
                return { title: named.title, description: named.description, schemas, statusCode: 200 };
            }

            // Далее проверяем SEO-данные из JSON
            const entry = await getPageBySlug(pageType.slug);
            if (entry) {
                const title = `${entry.title} — MS-PRO`;
                schemas.push(buildServiceSchema(entry, region));
                schemas.push(buildBreadcrumbSchema([
                    { name: 'Главная', url: ORG.url },
                    { name: 'Услуги', url: `${ORG.url}/services` },
                    { name: entry.title, url: `${ORG.url}/services/${pageType.slug}` },
                ]));
                schemas.push(buildWebPageSchema(`/services/${pageType.slug}`, title, entry.description, entry.datePublished, entry.dateModified, true));
                schemas.push(buildHowToSchema(entry.title, entry.description));

                if (entry.faq && entry.faq.length > 0) {
                    schemas.push(buildFAQPageSchema(entry.faq));
                }
                return { title, description: entry.description, schemas, statusCode: 200 };
            }

            // Fallback — сервис не найден → 404
            return { title: 'Страница не найдена — MS-PRO', description: 'Запрашиваемая страница не найдена. Перейдите на главную или воспользуйтесь навигацией.', schemas, statusCode: 404 };
        }

        case 'price-guide': {
            const title = `Прайс-гид: ${pageType.slug.replace(/-/g, ' ')} — MS-PRO`;
            const desc = `Подробный гид по ценам на ${pageType.slug.replace(/-/g, ' ')}. Расчёт стоимости, факторы влияния на цену, рекомендации.`;
            schemas.push(buildBreadcrumbSchema([
                { name: 'Главная', url: ORG.url },
                { name: 'Прайс-гиды', url: `${ORG.url}/price-guide` },
                { name: title.replace(' — MS-PRO', ''), url: `${ORG.url}/price-guide/${pageType.slug}` },
            ]));
            schemas.push(buildWebPageSchema(`/price-guide/${pageType.slug}`, title, desc));
            return { title, description: desc, schemas, statusCode: 200 };
        }

        case 'faq': {
            const s = STATIC_PAGES.faq;
            schemas.push(buildBreadcrumbSchema([{ name: 'Главная', url: ORG.url }, { name: s.title.split(' — ')[0], url: `${ORG.url}/faq` }]));
            schemas.push(buildWebPageSchema('/faq', s.title, s.description, undefined, undefined, true));
            return { title: s.title, description: s.description, schemas, statusCode: 200 };
        }

        case 'company-team': {
            const s = STATIC_PAGES['company-team'];
            schemas.push(buildBreadcrumbSchema([
                { name: 'Главная', url: ORG.url },
                { name: 'Команда', url: `${ORG.url}/company/team` }
            ]));
            schemas.push(buildWebPageSchema('/company/team', s.title, s.description));
            return { title: s.title, description: s.description, schemas, statusCode: 200 };
        }

        case 'prices':
        case 'contacts':
        case 'calculator':
        case 'documents':
        case 'mspro-quad':
        case 'news': {
            const s = STATIC_PAGES[pageType.type];
            const urlPath = `/${pageType.type === 'mspro-quad' ? 'mspro-quad' : pageType.type}`;
            const cleanTitle = s.title.split(' — ')[0]; // Remove brand suffix for breadcrumb

            schemas.push(buildBreadcrumbSchema([
                { name: 'Главная', url: ORG.url },
                { name: cleanTitle, url: `${ORG.url}${urlPath}` }
            ]));

            schemas.push(buildWebPageSchema(urlPath, s.title, s.description));
            return { title: s.title, description: s.description, schemas, statusCode: 200 };
        }

        case 'news-article': {
            const title = `Новости — MS-PRO`;
            schemas.push(buildBreadcrumbSchema([
                { name: 'Главная', url: ORG.url },
                { name: 'Новости', url: `${ORG.url}/news` },
            ]));
            return { title, description: STATIC_PAGES.news.description, schemas, statusCode: 200 };
        }

        case 'seo': {
            const entry = await getPageBySlug(pageType.slug);
            const urlPath = `/${pageType.slug}`;

            if (entry) {
                const title = `${entry.title} — MS-PRO`;
                schemas.push(buildServiceSchema(entry, region));
                schemas.push(buildBreadcrumbSchema([
                    { name: 'Главная', url: ORG.url },
                    { name: entry.title, url: `${ORG.url}${urlPath}` },
                ]));
                schemas.push(buildWebPageSchema(urlPath, title, entry.description, entry.datePublished, entry.dateModified, true));

                if (entry.faq && entry.faq.length > 0) {
                    schemas.push(buildFAQPageSchema(entry.faq));
                }
                return { title, description: entry.description, schemas, statusCode: 200 };
            }

            // Robust Fallback for SEO pages (if content not found)
            const fallbackTitle = `${pageType.slug.replace(/-/g, ' ')} — MS-PRO`; // Capitalize?
            // Simple capitalize first letter
            const readableSlug = pageType.slug.replace(/-/g, ' ');
            const capitalizedSlug = readableSlug.charAt(0).toUpperCase() + readableSlug.slice(1);
            const generatedTitle = `${capitalizedSlug} — MS-PRO`;

            schemas.push(buildBreadcrumbSchema([
                { name: 'Главная', url: ORG.url },
                { name: capitalizedSlug, url: `${ORG.url}${urlPath}` },
            ]));
            schemas.push(buildWebPageSchema(urlPath, generatedTitle, DEFAULT_DESCRIPTION));

            // SEO slug не найден в данных → 404
            return { title: 'Страница не найдена — MS-PRO', description: 'Запрашиваемая страница не найдена. Перейдите на главную или воспользуйтесь навигацией.', schemas, statusCode: 404 };
        }

        default: {
            return { title: 'Страница не найдена — MS-PRO', description: 'Запрашиваемая страница не найдена.', schemas, statusCode: 404 };
        }
    }
}

// ─── Утилиты ────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function escapeAttr(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
