export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface JsonLdBreadcrumb {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }>;
}

export interface JsonLdReview {
  '@context': string;
  '@type': string;
  itemReviewed: {
    '@type': string;
    name: string;
  };
  reviewRating: {
    '@type': string;
    ratingValue: number;
    bestRating: number;
  };
  author: {
    '@type': string;
    name: string;
  };
  reviewBody: string;
  datePublished: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): JsonLdBreadcrumb {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateReviewSchema(
  serviceName: string,
  rating: number,
  authorName: string,
  reviewText: string,
  date: string
): JsonLdReview {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Service',
      name: serviceName,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rating,
      bestRating: 5,
    },
    author: {
      '@type': 'Person',
      name: authorName,
    },
    reviewBody: reviewText,
    datePublished: date,
  };
}

export function generateAggregateRatingSchema(
  serviceName: string,
  ratingValue: number,
  reviewCount: number
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };
}
