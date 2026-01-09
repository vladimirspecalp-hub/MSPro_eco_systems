export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface ServiceArea {
  region: string;
  cities: string[];
  isActive: boolean;
}

export const BUSINESS_HOURS: BusinessHours[] = [
  { day: 'Понедельник', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Вторник', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Среда', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Четверг', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Пятница', open: '09:00', close: '18:00', isClosed: false },
  { day: 'Суббота', open: '10:00', close: '15:00', isClosed: false },
  { day: 'Воскресенье', open: '', close: '', isClosed: true },
];

export const SERVICE_AREAS: ServiceArea[] = [
  {
    region: 'Центральный ФО',
    cities: ['Москва', 'Московская область', 'Тула', 'Калуга', 'Рязань', 'Воронеж'],
    isActive: true,
  },
  {
    region: 'Северо-Западный ФО',
    cities: ['Санкт-Петербург', 'Ленинградская область', 'Псков', 'Новгород'],
    isActive: true,
  },
  {
    region: 'Приволжский ФО',
    cities: ['Казань', 'Самара', 'Нижний Новгород', 'Уфа', 'Пермь'],
    isActive: true,
  },
  {
    region: 'Уральский ФО',
    cities: ['Екатеринбург', 'Челябинск', 'Тюмень'],
    isActive: true,
  },
  {
    region: 'Сибирский ФО',
    cities: ['Новосибирск', 'Омск', 'Красноярск', 'Иркутск'],
    isActive: true,
  },
  {
    region: 'Дальневосточный ФО',
    cities: ['Владивосток', 'Хабаровск'],
    isActive: true,
  },
];

export function isBusinessOpen(): boolean {
  const now = new Date();
  const dayIndex = now.getDay();
  const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const today = BUSINESS_HOURS.find(h => h.day === dayNames[dayIndex]);

  if (!today || today.isClosed) return false;

  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  return currentTime >= today.open && currentTime <= today.close;
}

export function getNextOpenTime(): string {
  const now = new Date();
  const dayIndex = now.getDay();
  
  for (let i = 0; i < 7; i++) {
    const checkDayIndex = (dayIndex + i) % 7;
    const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const day = BUSINESS_HOURS.find(h => h.day === dayNames[checkDayIndex]);
    
    if (day && !day.isClosed) {
      if (i === 0) {
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        if (currentTime < day.open) {
          return `Сегодня с ${day.open}`;
        }
      } else {
        return `${day.day} с ${day.open}`;
      }
    }
  }
  
  return 'Уточните время работы';
}

export function getCitiesInRegion(region: string): string[] {
  const area = SERVICE_AREAS.find(a => a.region === region);
  return area?.cities || [];
}

export function isServicedCity(city: string): boolean {
  return SERVICE_AREAS.some(area => 
    area.isActive && area.cities.some(c => c.toLowerCase() === city.toLowerCase())
  );
}
