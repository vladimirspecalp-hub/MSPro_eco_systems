import { PlatformIcon } from "./platformIcons";
import { TooltipWrapper } from "./ui";
import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface NewsPlatform {
  id: string;
  title: string;
  shareUrlTemplate?: string;
}

interface PlatformSetting {
  enabled: boolean;
  profileUrl: string | null;
}

interface PlatformGridProps {
  platforms: NewsPlatform[];
  settings: Record<string, PlatformSetting>;
  articleUrl: string;
  articleTitle: string;
  slug: string;
}

function buildShareUrl(
  template: string | undefined,
  articleUrl: string,
  articleTitle: string
): string | null {
  if (!template) return null;
  return template
    .replace("{url}", encodeURIComponent(articleUrl))
    .replace("{title}", encodeURIComponent(articleTitle));
}

function buildUtmUrl(baseUrl: string, platformId: string, slug: string): string {
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}utm_source=${platformId}&utm_medium=social&utm_campaign=news&utm_content=${slug}`;
}

export function PlatformGrid({
  platforms,
  settings,
  articleUrl,
  articleTitle,
  slug,
}: PlatformGridProps) {
  const { toast } = useToast();

  const handleCopyLink = async (platformId: string) => {
    const utmUrl = buildUtmUrl(articleUrl, platformId, slug);
    try {
      await navigator.clipboard.writeText(utmUrl);
      toast({
        title: "Ссылка скопирована",
        description: "UTM-ссылка в буфере обмена",
      });
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось скопировать",
        variant: "destructive",
      });
    }
  };

  const handleShare = (platform: NewsPlatform) => {
    const utmUrl = buildUtmUrl(articleUrl, platform.id, slug);
    const shareUrl = buildShareUrl(platform.shareUrlTemplate, utmUrl, articleTitle);
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    } else {
      handleCopyLink(platform.id);
    }
  };

  const enabledPlatforms = platforms.filter(p => settings[p.id]?.enabled);
  
  if (enabledPlatforms.length === 0) {
    return null;
  }

  return (
    <div className="my-6 p-4 bg-muted/50 rounded-lg" data-testid="platform-share-grid">
      <h4 className="text-sm font-medium mb-3 text-muted-foreground">
        Поделиться в соцсетях
      </h4>
      <div className="flex flex-wrap gap-2">
        {enabledPlatforms.map((platform) => (
          <div key={platform.id} className="flex items-center gap-1">
            <TooltipWrapper content={`Поделиться в ${platform.title}`}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare(platform)}
                className="gap-2"
                data-testid={`button-share-${platform.id}`}
              >
                <PlatformIcon platformId={platform.id} className="h-4 w-4" />
                <span className="hidden sm:inline">{platform.title}</span>
              </Button>
            </TooltipWrapper>
            <TooltipWrapper content="Копировать UTM-ссылку">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleCopyLink(platform.id)}
                data-testid={`button-copy-${platform.id}`}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </TooltipWrapper>
          </div>
        ))}
      </div>
    </div>
  );
}
