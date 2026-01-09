export interface EmbedConfig {
  width: number;
  height: number;
  autoplay: boolean;
  muted: boolean;
  controls: boolean;
  loop: boolean;
  start?: number;
}

const DEFAULT_EMBED_CONFIG: EmbedConfig = {
  width: 560,
  height: 315,
  autoplay: false,
  muted: false,
  controls: true,
  loop: false,
};

export function generateYouTubeEmbed(videoId: string, config: Partial<EmbedConfig> = {}): string {
  const cfg = { ...DEFAULT_EMBED_CONFIG, ...config };
  
  const params = new URLSearchParams();
  if (cfg.autoplay) params.set('autoplay', '1');
  if (cfg.muted) params.set('mute', '1');
  if (!cfg.controls) params.set('controls', '0');
  if (cfg.loop) params.set('loop', '1');
  if (cfg.start) params.set('start', cfg.start.toString());
  
  const queryString = params.toString();
  const src = `https://www.youtube.com/embed/${videoId}${queryString ? '?' + queryString : ''}`;

  return `<iframe 
    width="${cfg.width}" 
    height="${cfg.height}" 
    src="${src}" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen
  ></iframe>`;
}

export function generateVKEmbed(oid: string, id: string, config: Partial<EmbedConfig> = {}): string {
  const cfg = { ...DEFAULT_EMBED_CONFIG, ...config };
  
  return `<iframe 
    src="https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2" 
    width="${cfg.width}" 
    height="${cfg.height}" 
    allow="autoplay; encrypted-media; fullscreen; picture-in-picture" 
    frameborder="0" 
    allowfullscreen
  ></iframe>`;
}

export function generateRutubeEmbed(videoId: string, config: Partial<EmbedConfig> = {}): string {
  const cfg = { ...DEFAULT_EMBED_CONFIG, ...config };
  
  return `<iframe 
    width="${cfg.width}" 
    height="${cfg.height}" 
    src="https://rutube.ru/play/embed/${videoId}" 
    frameBorder="0" 
    allow="clipboard-write; autoplay" 
    webkitAllowFullScreen 
    mozallowfullscreen 
    allowFullScreen
  ></iframe>`;
}

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

export function getThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'max' = 'high'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    max: 'maxresdefault',
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}
