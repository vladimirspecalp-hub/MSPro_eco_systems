/**
 * PlatformShareBlock - Блок "Мы публикуем также здесь"
 * Отображает 15 иконок платформ с логикой enabled/disabled
 */

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLink, Copy, Check } from "lucide-react";
import { 
  SiTelegram, SiVk, SiYoutube, SiLinkedin,
  SiOdnoklassniki
} from "react-icons/si";
import { useState } from "react";
import { trackShareClick } from "@/modules/analytics";

interface NewsPlatform {
  id: string;
  title: string;
  iconKey: string;
  shareUrlTemplate?: string;
}

interface PlatformSetting {
  enabled: boolean;
  profileUrl: string | null;
}

interface PlatformsResponse {
  ok: boolean;
  platforms: NewsPlatform[];
  settings: Record<string, PlatformSetting>;
}

interface PlatformShareBlockProps {
  articleUrl: string;
  articleTitle: string;
  slug: string;
}

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  telegram: SiTelegram,
  vk: SiVk,
  youtube: SiYoutube,
  linkedin: SiLinkedin,
  ok: SiOdnoklassniki,
};

function DefaultIcon({ className }: { className?: string }) {
  return <ExternalLink className={className} />;
}

function getPlatformIcon(iconKey: string): React.ComponentType<{ className?: string }> {
  return PLATFORM_ICONS[iconKey] || DefaultIcon;
}

function generateShareUrl(platform: NewsPlatform, articleUrl: string, title: string): string | null {
  if (!platform.shareUrlTemplate) return null;
  return platform.shareUrlTemplate
    .replace("{url}", encodeURIComponent(articleUrl))
    .replace("{title}", encodeURIComponent(title));
}

export default function PlatformShareBlock({ articleUrl, articleTitle, slug }: PlatformShareBlockProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const { data } = useQuery<PlatformsResponse>({
    queryKey: ["/api/news/platforms"],
  });

  if (!data?.platforms) return null;

  const handleCopyLink = async (platform: NewsPlatform) => {
    const utmUrl = `${articleUrl}?utm_source=${platform.id}&utm_medium=social&utm_campaign=news&utm_content=${slug}`;
    await navigator.clipboard.writeText(utmUrl);
    setCopied(platform.id);
    trackShareClick(platform.id, slug);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleOpenProfile = (profileUrl: string, platformId: string) => {
    trackShareClick(platformId, slug);
    window.open(profileUrl, "_blank");
  };

  const handleShare = (platform: NewsPlatform) => {
    const shareUrl = generateShareUrl(platform, articleUrl, articleTitle);
    if (shareUrl) {
      trackShareClick(platform.id, slug);
      window.open(shareUrl, "_blank");
    } else {
      handleCopyLink(platform);
    }
  };

  return (
    <div className="my-8 p-6 bg-muted/50 rounded-lg" data-testid="platform-share-block">
      <h3 className="text-lg font-semibold mb-4">Мы публикуем также здесь</h3>
      
      <div className="flex flex-wrap gap-3">
        {data.platforms.map((platform) => {
          const setting = data.settings[platform.id];
          const isEnabled = setting?.enabled && setting?.profileUrl;
          const Icon = getPlatformIcon(platform.iconKey);

          if (!isEnabled) {
            return (
              <Tooltip key={platform.id}>
                <TooltipTrigger asChild>
                  <div 
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-muted opacity-40 cursor-not-allowed"
                    data-testid={`platform-disabled-${platform.id}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{platform.title} — Скоро</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <div key={platform.id} className="flex items-center gap-1" data-testid={`platform-${platform.id}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover-elevate"
                    onClick={() => handleOpenProfile(setting.profileUrl!, platform.id)}
                  >
                    <Icon className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Наш канал: {platform.title}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-8 h-8"
                    onClick={() => handleShare(platform)}
                  >
                    {copied === platform.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Поделиться в {platform.title}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}
      </div>
    </div>
  );
}
