export interface Review {
  id: string;
  author: string;
  company: string;
  rating: number;
  text: string;
  date: string;
  projectType: string;
  verified: boolean;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  location: string;
  year: number;
  description: string;
  results: string[];
  images?: string[];
}

export const FEATURED_REVIEWS: Review[] = [
  {
    id: 'review-1',
    author: 'Петров В.А.',
    company: 'ТЭЦ-3 Самара',
    rating: 5,
    text: 'Отличная работа! Покрасили две трубы высотой 120 метров за 10 дней. Качество на высшем уровне, гарантия 20 лет.',
    date: '2024-08-15',
    projectType: 'Покраска дымовых труб',
    verified: true,
  },
  {
    id: 'review-2',
    author: 'Сидорова Е.М.',
    company: 'НПЗ Омский',
    rating: 5,
    text: 'Работаем с MS-PRO уже 5 лет. Надёжный подрядчик, всегда в срок и с соблюдением всех требований безопасности.',
    date: '2024-07-20',
    projectType: 'Антикоррозийная защита',
    verified: true,
  },
  {
    id: 'review-3',
    author: 'Козлов И.С.',
    company: 'Котельная №7 Казань',
    rating: 5,
    text: 'Использовали покрытие MSPRO Quad. Прошло 3 года — никаких следов коррозии. Рекомендую!',
    date: '2024-06-10',
    projectType: 'Огнезащитное покрытие',
    verified: true,
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Покраска 4 дымовых труб ТЭЦ-5',
    client: 'ПАО "Т Плюс"',
    location: 'Екатеринбург',
    year: 2024,
    description: 'Комплексная покраска и антикоррозийная защита четырёх дымовых труб высотой от 80 до 150 метров.',
    results: [
      'Срок выполнения: 45 дней',
      'Площадь покрытия: 12 000 м²',
      'Использовано покрытие MSPRO Quad',
      'Гарантия: 20 лет',
    ],
  },
  {
    id: 'case-2',
    title: 'Реконструкция промышленного резервуара',
    client: 'Роснефть',
    location: 'Самара',
    year: 2023,
    description: 'Полная очистка и нанесение антикоррозийного покрытия на резервуар объёмом 50 000 м³.',
    results: [
      'Срок выполнения: 60 дней',
      'Площадь покрытия: 8 500 м²',
      'Экономия на ремонте: 40%',
      'Гарантия: 15 лет',
    ],
  },
];

export function getVerifiedReviews(): Review[] {
  return FEATURED_REVIEWS.filter(r => r.verified);
}

export function calculateAverageRating(): number {
  const verified = getVerifiedReviews();
  if (verified.length === 0) return 0;
  const sum = verified.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / verified.length) * 10) / 10;
}

export function getRecentCaseStudies(limit: number = 5): CaseStudy[] {
  return CASE_STUDIES
    .sort((a, b) => b.year - a.year)
    .slice(0, limit);
}
