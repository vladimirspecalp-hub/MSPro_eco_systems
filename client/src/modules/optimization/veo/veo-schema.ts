export interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  embedUrl: string;
  contentUrl?: string;
  platform: 'youtube' | 'vk' | 'rutube' | 'custom';
}

export const COMPANY_VIDEOS: VideoData[] = [
  {
    id: 'BUgl1aUvbQU',
    title: 'Промышленный альпинизм MS-PRO — Выполнение работ на высоте',
    description: 'Профессиональное выполнение высотных работ: покраска дымовых труб, антикоррозийная защита, огнезащита. Работаем по всей России.',
    thumbnailUrl: 'https://img.youtube.com/vi/BUgl1aUvbQU/maxresdefault.jpg',
    uploadDate: '2024-01-01', // Примерная дата, лучше обновить если известна
    duration: 'PT2M30S', // Примерная длительность
    embedUrl: 'https://www.youtube.com/embed/BUgl1aUvbQU',
    platform: 'youtube',
    contentUrl: 'https://youtu.be/BUgl1aUvbQU',
  },
];

export function generateVideoSchema(video: VideoData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    duration: video.duration,
    embedUrl: video.embedUrl,
    contentUrl: video.contentUrl,
    publisher: {
      '@type': 'Organization',
      name: 'MS-PRO',
      logo: {
        '@type': 'ImageObject',
        url: 'https://mspro.ru/logo.png',
      },
    },
  };
}

export function generateVideoListSchema(videos: VideoData[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: videos.map((video, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateVideoSchema(video),
    })),
  };
}

export function getVideoById(id: string): VideoData | undefined {
  return COMPANY_VIDEOS.find(v => v.id === id);
}

export function getVideosByPlatform(platform: VideoData['platform']): VideoData[] {
  return COMPANY_VIDEOS.filter(v => v.platform === platform);
}
