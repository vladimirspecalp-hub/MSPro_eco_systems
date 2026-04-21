export interface LocalBusinessData {
  name: string;
  description: string;
  telephone: string;
  email: string;
  url: string;
  logo: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  openingHours: string[];
  priceRange: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export const MSPRO_BUSINESS: LocalBusinessData = {
  name: 'MS-PRO',
  description: 'Промышленный альпинизм, огнезащита металлоконструкций, антикоррозийная защита. Лицензия МЧС, допуск СРО. Работаем по всей России.',
  telephone: '+7 (987) 909-29-38',
  email: 'info@mspro-ltd.ru',
  url: 'https://mspro-ltd.ru',
  logo: 'https://mspro-ltd.ru/assets/logo.jpg',
  address: {
    streetAddress: 'пр. Кирова, 275',
    addressLocality: 'Самара',
    addressRegion: 'Самарская область',
    postalCode: '443001',
    addressCountry: 'RU',
  },
  geo: {
    latitude: 53.2415, // Approximate coords for Kirova 275 Samara
    longitude: 50.2212,
  },
  openingHours: ['Mo-Fr 09:00-18:00', 'Sa 10:00-15:00'],
  priceRange: '₽₽₽',
  aggregateRating: {
    ratingValue: 4.9,
    reviewCount: 127,
  },
};

export function generateLocalBusinessSchema(data: LocalBusinessData = MSPRO_BUSINESS) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${data.url}/#organization`,
    name: data.name,
    description: data.description,
    telephone: data.telephone,
    email: data.email,
    url: data.url,
    logo: data.logo,
    image: data.logo,
    address: {
      '@type': 'PostalAddress',
      ...data.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.geo.latitude,
      longitude: data.geo.longitude,
    },
    openingHoursSpecification: data.openingHours.map(hours => {
      const [days, time] = hours.split(' ');
      const [opens, closes] = time.split('-');
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days,
        opens,
        closes,
      };
    }),
    priceRange: data.priceRange,
  };

  if (data.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.aggregateRating.ratingValue,
      reviewCount: data.aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}
