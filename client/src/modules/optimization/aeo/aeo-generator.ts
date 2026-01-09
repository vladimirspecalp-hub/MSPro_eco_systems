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
  telephone: '+7 (800) 555-35-35',
  email: 'info@mspro.ru',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'RU',
    addressRegion: 'Москва',
    addressLocality: 'Москва',
  },
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
