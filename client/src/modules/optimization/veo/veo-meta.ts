import type { VideoData } from './veo-schema';

export interface VideoMeta {
  title: string;
  description: string;
  tags: string[];
  category: string;
  language: string;
}

export function generateYouTubeMeta(video: VideoData): VideoMeta {
  const baseTags = [
    'покраска труб',
    'дымовые трубы',
    'промышленная покраска',
    'антикоррозийная защита',
    'MSPRO Quad',
    'огнезащита',
    'MS-PRO',
  ];

  return {
    title: `${video.title} | MS-PRO`,
    description: `${video.description}\n\n🔗 Сайт: https://mspro.ru\n📞 Телефон: +7 (987) 909-29-38\n\n#покраскатруб #MSPRO #промышленнаяпокраска`,
    tags: baseTags,
    category: 'Science & Technology',
    language: 'ru',
  };
}

export function generateVideoTitle(keyword: string, type: 'how-to' | 'showcase' | 'review'): string {
  const templates: Record<string, string> = {
    'how-to': `Как выполняется ${keyword} — пошаговое руководство`,
    'showcase': `${keyword} — реальный проект MS-PRO`,
    'review': `${keyword} — отзыв клиента`,
  };
  return templates[type] || keyword;
}

export function generateVideoDescription(keyword: string, region?: string): string {
  let description = `В этом видео показываем процесс: ${keyword}.\n\n`;

  if (region) {
    description += `📍 Объект находится в регионе: ${region}\n\n`;
  }

  description += `✅ Гарантия 20 лет с покрытием MSPRO Quad\n`;
  description += `✅ Сертифицировано Ростехнадзором\n`;
  description += `✅ Работаем по всей России\n\n`;
  description += `🔗 Оставить заявку: https://mspro.ru/calculator\n`;
  description += `📞 Горячая линия: +7 (987) 909-29-38`;

  return description;
}

export function generateVideoTags(keyword: string): string[] {
  return [
    keyword,
    keyword.toLowerCase(),
    'покраска труб',
    'дымовые трубы',
    'промышленная покраска',
    'антикоррозийное покрытие',
    'MSPRO Quad',
    'огнезащитное покрытие',
    'промышленный альпинизм',
    'MS-PRO',
    'гарантия 20 лет',
  ];
}
