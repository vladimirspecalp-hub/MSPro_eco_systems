/**
 * News Platforms Registry - Реестр 15 платформ дистрибуции
 * Используется на backend и frontend
 * @module shared/newsPlatforms
 */

export interface NewsPlatform {
  id: string;
  title: string;
  iconKey: string;
  requiresProfileUrl: boolean;
  defaultEnabled: boolean;
  utmSource: string;
  shareUrlTemplate?: string;
}

export const NEWS_PLATFORMS: NewsPlatform[] = [
  {
    id: "telegram",
    title: "Telegram",
    iconKey: "telegram",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "telegram",
    shareUrlTemplate: "https://t.me/share/url?url={url}&text={title}"
  },
  {
    id: "vk",
    title: "ВКонтакте",
    iconKey: "vk",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "vk",
    shareUrlTemplate: "https://vk.com/share.php?url={url}&title={title}"
  },
  {
    id: "dzen",
    title: "Дзен",
    iconKey: "dzen",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "dzen"
  },
  {
    id: "tenchat",
    title: "TenChat",
    iconKey: "tenchat",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "tenchat"
  },
  {
    id: "vc",
    title: "VC.ru",
    iconKey: "vc",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "vc"
  },
  {
    id: "habr",
    title: "Хабр",
    iconKey: "habr",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "habr"
  },
  {
    id: "youtube",
    title: "YouTube",
    iconKey: "youtube",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "youtube"
  },
  {
    id: "rutube",
    title: "Rutube",
    iconKey: "rutube",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "rutube"
  },
  {
    id: "ok",
    title: "Одноклассники",
    iconKey: "ok",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "ok",
    shareUrlTemplate: "https://connect.ok.ru/offer?url={url}&title={title}"
  },
  {
    id: "yandex_business",
    title: "Яндекс Бизнес",
    iconKey: "yandex",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "yandex_business"
  },
  {
    id: "google_business",
    title: "Google Мой Бизнес",
    iconKey: "google",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "google_business"
  },
  {
    id: "2gis",
    title: "2ГИС",
    iconKey: "2gis",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "2gis"
  },
  {
    id: "threads",
    title: "Threads",
    iconKey: "threads",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "threads"
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    iconKey: "linkedin",
    requiresProfileUrl: true,
    defaultEnabled: false,
    utmSource: "linkedin",
    shareUrlTemplate: "https://www.linkedin.com/sharing/share-offsite/?url={url}"
  },
  {
    id: "email_digest",
    title: "Email рассылка",
    iconKey: "email",
    requiresProfileUrl: false,
    defaultEnabled: false,
    utmSource: "email"
  }
];

export const PLATFORM_IDS = NEWS_PLATFORMS.map(p => p.id);

export function getPlatformById(id: string): NewsPlatform | undefined {
  return NEWS_PLATFORMS.find(p => p.id === id);
}

export function generateShareUrl(platform: NewsPlatform, articleUrl: string, title: string): string | null {
  if (!platform.shareUrlTemplate) return null;
  return platform.shareUrlTemplate
    .replace("{url}", encodeURIComponent(articleUrl))
    .replace("{title}", encodeURIComponent(title));
}
