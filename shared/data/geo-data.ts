export interface RegionData {
    name: string;
    slug: string;
    population: number;
    industrialIndex: number;
    priority: 'high' | 'medium' | 'low';
}

export const PRIORITY_REGIONS: RegionData[] = [
    { name: 'Москва', slug: 'moskva', population: 12600000, industrialIndex: 95, priority: 'high' },
    { name: 'Санкт-Петербург', slug: 'spb', population: 5400000, industrialIndex: 85, priority: 'high' },
    { name: 'Екатеринбург', slug: 'ekaterinburg', population: 1500000, industrialIndex: 80, priority: 'high' },
    { name: 'Новосибирск', slug: 'novosibirsk', population: 1600000, industrialIndex: 75, priority: 'high' },
    { name: 'Казань', slug: 'kazan', population: 1300000, industrialIndex: 78, priority: 'high' },
    { name: 'Челябинск', slug: 'chelyabinsk', population: 1200000, industrialIndex: 88, priority: 'high' },
    { name: 'Самара', slug: 'samara', population: 1150000, industrialIndex: 72, priority: 'medium' },
    { name: 'Нижний Новгород', slug: 'nn', population: 1250000, industrialIndex: 70, priority: 'medium' },
    { name: 'Красноярск', slug: 'krasnoyarsk', population: 1100000, industrialIndex: 82, priority: 'medium' },
    { name: 'Омск', slug: 'omsk', population: 1150000, industrialIndex: 76, priority: 'medium' },
];
