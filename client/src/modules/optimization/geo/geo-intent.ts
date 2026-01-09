export interface GeoIntent {
  baseKeyword: string;
  region: string;
  city?: string;
  fullKeyword: string;
  slug: string;
}

export const RUSSIAN_REGIONS = [
  'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань',
  'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону',
  'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград',
  'Краснодар', 'Саратов', 'Тюмень', 'Тольятти', 'Ижевск',
  'Барнаул', 'Ульяновск', 'Иркутск', 'Хабаровск', 'Ярославль',
  'Владивосток', 'Махачкала', 'Томск', 'Оренбург', 'Кемерово',
];

export const REGION_SUFFIXES: Record<string, string> = {
  'Москва': 'в Москве',
  'Санкт-Петербург': 'в Санкт-Петербурге',
  'Новосибирск': 'в Новосибирске',
  'Екатеринбург': 'в Екатеринбурге',
  'Казань': 'в Казани',
  'Нижний Новгород': 'в Нижнем Новгороде',
  'Челябинск': 'в Челябинске',
  'Самара': 'в Самаре',
  'Омск': 'в Омске',
  'Ростов-на-Дону': 'в Ростове-на-Дону',
  'Уфа': 'в Уфе',
  'Красноярск': 'в Красноярске',
  'Воронеж': 'в Воронеже',
  'Пермь': 'в Перми',
  'Волгоград': 'в Волгограде',
  'Краснодар': 'в Краснодаре',
  'Владивосток': 'во Владивостоке',
};

export function addGeoIntent(keyword: string, region: string): GeoIntent {
  const suffix = REGION_SUFFIXES[region] || `в ${region}`;
  const fullKeyword = `${keyword} ${suffix}`;
  const slug = fullKeyword
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-zа-яё0-9-]/g, '');

  return {
    baseKeyword: keyword,
    region,
    fullKeyword,
    slug,
  };
}

export function generateGeoVariants(keyword: string, regions?: string[]): GeoIntent[] {
  const targetRegions = regions || RUSSIAN_REGIONS;
  return targetRegions.map(region => addGeoIntent(keyword, region));
}

export function detectUserRegion(): string | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('user_region');
  if (stored) return stored;
  
  return null;
}

export function setUserRegion(region: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_region', region);
  }
}
