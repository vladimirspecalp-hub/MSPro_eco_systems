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
    id: 'video-1',
    title: 'Покраска дымовой трубы 120 метров — MS-PRO',
    description: 'Процесс покраски промышленной дымовой трубы высотой 120 метров с использованием покрытия MSPRO Quad.',
    thumbnailUrl: 'https://mspro.ru/video/thumb-1.jpg',
    uploadDate: '2024-06-15',
    duration: 'PT5M30S',
    embedUrl: 'https://www.youtube.com/embed/example1',
    platform: 'youtube',
  },
  {
    id: 'video-2',
    title: 'Технология нанесения MSPRO Quad',
    description: 'Подробный обзор технологии нанесения огнезащитного покрытия MSPRO Quad на промышленные объекты.',
    thumbnailUrl: 'https://mspro.ru/video/thumb-2.jpg',
    uploadDate: '2024-05-20',
    duration: 'PT8M15S',
    embedUrl: 'https://www.youtube.com/embed/example2',
    platform: 'youtube',
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
