export interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  description?: string;
}

export interface MapConfig {
  center: { lat: number; lng: number };
  zoom: number;
  markers: MapMarker[];
}

export const OFFICE_LOCATIONS: MapMarker[] = [
  {
    lat: 55.7558,
    lng: 37.6173,
    title: 'MS-PRO Москва',
    description: 'Головной офис',
  },
  {
    lat: 59.9343,
    lng: 30.3351,
    title: 'MS-PRO Санкт-Петербург',
    description: 'Северо-Западный филиал',
  },
  {
    lat: 55.0084,
    lng: 82.9357,
    title: 'MS-PRO Новосибирск',
    description: 'Сибирский филиал',
  },
];

export function getMapConfig(region?: string): MapConfig {
  const defaultCenter = { lat: 55.7558, lng: 37.6173 };
  
  const regionCenters: Record<string, { lat: number; lng: number }> = {
    'Москва': { lat: 55.7558, lng: 37.6173 },
    'Санкт-Петербург': { lat: 59.9343, lng: 30.3351 },
    'Новосибирск': { lat: 55.0084, lng: 82.9357 },
    'Екатеринбург': { lat: 56.8389, lng: 60.6057 },
    'Казань': { lat: 55.7887, lng: 49.1221 },
  };

  return {
    center: region ? (regionCenters[region] || defaultCenter) : defaultCenter,
    zoom: region ? 12 : 5,
    markers: OFFICE_LOCATIONS,
  };
}

export function generateYandexMapUrl(lat: number, lng: number, zoom: number = 15): string {
  return `https://yandex.ru/maps/?pt=${lng},${lat}&z=${zoom}&l=map`;
}

export function generateGoogleMapUrl(lat: number, lng: number, zoom: number = 15): string {
  return `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}`;
}

export function generate2GISUrl(lat: number, lng: number): string {
  return `https://2gis.ru/geo/${lng},${lat}`;
}
