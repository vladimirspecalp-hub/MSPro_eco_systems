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
  description: 'Профессиональная покраска дымовых труб и антикоррозийная защита промышленных объектов. Гарантия 20 лет.',
  telephone: '+7 (800) 555-35-35',
  email: 'info@mspro.ru',
  url: 'https://mspro.ru',
  logo: 'https://mspro.ru/logo.png',
  address: {
    streetAddress: 'ул. Промышленная, 10',
    addressLocality: 'Москва',
    addressRegion: 'Московская область',
    postalCode: '123456',
    addressCountry: 'RU',
  },
  geo: {
    latitude: 55.7558,
    longitude: 37.6173,
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
