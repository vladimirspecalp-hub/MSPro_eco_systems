import type { Certificate, ExpertProfile } from './eeat-badges';

export function generatePersonSchema(expert: ExpertProfile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: expert.name,
    jobTitle: expert.title,
    worksFor: {
      '@type': 'Organization',
      name: 'MS-PRO',
    },
    description: expert.bio,
    knowsAbout: expert.specializations,
    image: expert.photoUrl,
  };
}

export function generateOrganizationWithCredentials(certificates: Certificate[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MS-PRO',
    url: 'https://mspro.ru',
    logo: 'https://mspro.ru/logo.png',
    description: 'Профессиональная покраска дымовых труб и антикоррозийная защита промышленных объектов',
    foundingDate: '2010',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 50,
      maxValue: 100,
    },
    hasCredential: certificates.map(cert => ({
      '@type': 'EducationalOccupationalCredential',
      name: cert.name,
      credentialCategory: cert.type,
      recognizedBy: {
        '@type': 'Organization',
        name: cert.issuer,
      },
      validFor: cert.validUntil,
    })),
    areaServed: {
      '@type': 'Country',
      name: 'Россия',
    },
    serviceType: [
      'Покраска дымовых труб',
      'Антикоррозийная защита',
      'Огнезащитная обработка',
      'Промышленный альпинизм',
    ],
  };
}

export function generateAggregateRating(
  ratingValue: number,
  reviewCount: number,
  bestRating: number = 5
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MS-PRO',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating,
      worstRating: 1,
    },
  };
}
