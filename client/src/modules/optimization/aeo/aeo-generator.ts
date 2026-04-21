import type { SEOEntry } from '@/lib/seo-loader';

export interface JsonLdService {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  provider: JsonLdOrganization;
  areaServed?: string;
  serviceType?: string;
}

export interface JsonLdOrganization {
  '@type': string;
  name: string;
  url: string;
  logo?: string;
  telephone?: string;
  email?: string;
  address?: JsonLdAddress;
  sameAs?: string[];
}

export interface JsonLdAddress {
  '@type': string;
  addressCountry: string;
  addressRegion?: string;
  addressLocality?: string;
  streetAddress?: string;
  postalCode?: string;
}

export interface JsonLdFAQ {
  '@context': string;
  '@type': string;
  mainEntity: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
}

const ORGANIZATION: JsonLdOrganization = {
  '@type': 'Organization',
  name: 'MS-PRO',
  url: 'https://mspro.ru',
  logo: 'https://mspro.ru/logo.png',
  telephone: '+7 (987) 909-29-38',
  email: 'info@mspro-ltd.ru',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'RU',
    addressRegion: 'Самарская область',
    addressLocality: 'Самара',
    streetAddress: 'пр. Кирова, 275',
    postalCode: '443001',
  },
  sameAs: [
    'https://vk.com/mspro_samara',
  ],
};

export function generateServiceSchema(entry: SEOEntry): JsonLdService {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: entry.title,
    description: entry.description,
    provider: ORGANIZATION,
    areaServed: entry.region || 'Россия',
    serviceType: 'Промышленная покраска и антикоррозийная защита',
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): JsonLdFAQ {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateOrganizationSchema(): JsonLdOrganization & { '@context': string } {
  return {
    '@context': 'https://schema.org',
    ...ORGANIZATION,
  };
}

export function injectJsonLd(schema: object): string {
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

// ─── HowTo Schema (P0-2: AIO критично для AI-поисковиков) ──────────────────

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export interface JsonLdHowTo {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  totalTime?: string;
  estimatedCost?: object;
  step: Array<{
    '@type': string;
    position: number;
    name: string;
    text: string;
    image?: string;
  }>;
}

/**
 * Стандартные шаги заказа услуги MS-PRO
 */
export const DEFAULT_HOWTO_STEPS: HowToStep[] = [
  {
    name: 'Оставьте заявку',
    text: 'Оставьте заявку на сайте или позвоните по телефону +7 (987) 909-29-38. Наш специалист свяжется с вами в течение 30 минут.',
  },
  {
    name: 'Осмотр объекта',
    text: 'Инженер выезжает на объект для осмотра и замеров. Выезд бесплатный по всей России.',
  },
  {
    name: 'Расчёт сметы',
    text: 'В день обращения вы получаете детальную смету с указанием материалов, сроков и стоимости.',
  },
  {
    name: 'Подготовка поверхности',
    text: 'Бригада выполняет очистку, обезжиривание и грунтовку поверхности по ГОСТ.',
  },
  {
    name: 'Выполнение работ',
    text: 'Работы выполняются сертифицированными промышленными альпинистами с соблюдением всех норм безопасности.',
  },
  {
    name: 'Контроль качества и приёмка',
    text: 'Контроль качества выполненных работ, составление акта КС-2/КС-3. Гарантия на работы.',
  },
];

export function generateHowToSchema(
  title: string,
  description: string,
  steps: HowToStep[] = DEFAULT_HOWTO_STEPS,
): JsonLdHowTo {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Как заказать: ${title}`,
    description,
    totalTime: 'P3D',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'RUB',
      value: 'По запросу',
    },
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.image ? { image: s.image } : {}),
    })),
  };
}

// ─── Speakable Schema (P0-2: Голосовые ассистенты) ──────────────────────────

export interface JsonLdSpeakable {
  '@context': string;
  '@type': string;
  speakable: {
    '@type': string;
    cssSelector: string[];
  };
  url: string;
}

export function generateSpeakableSchema(
  pageUrl: string,
  cssSelectors: string[] = ['h1', 'meta[name="description"]', '.faq-question'],
): JsonLdSpeakable {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
    url: pageUrl,
  };
}

// ─── WebPage Schema (P1-3: datePublished / dateModified) ────────────────────

export interface JsonLdWebPage {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  publisher: { '@type': string; '@id': string };
  datePublished?: string;
  dateModified?: string;
}

export function generateWebPageSchema(
  url: string,
  title: string,
  description: string,
  datePublished?: string,
  dateModified?: string,
): JsonLdWebPage {
  const schema: JsonLdWebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    inLanguage: 'ru-RU',
    publisher: {
      '@type': 'Organization',
      '@id': 'https://mspro-ltd.ru/#organization',
    },
  };

  if (datePublished) schema.datePublished = datePublished;
  if (dateModified) schema.dateModified = dateModified;

  return schema;
}
