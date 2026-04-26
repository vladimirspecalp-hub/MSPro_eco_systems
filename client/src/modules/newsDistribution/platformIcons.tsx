import {
  SiTelegram, SiVk, SiOdnoklassniki,
  SiWhatsapp, SiViber, SiPinterest, SiFlipboard,
  SiX, SiFacebook
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { Rss, Newspaper, Globe, BookOpen } from "lucide-react";

export type PlatformId = 
  | "telegram" | "vk" | "dzen" | "ok" | "rss"
  | "whatsapp" | "viber" | "pinterest" | "flipboard"
  | "pulse" | "yandex_news" | "google_news"
  | "twitter" | "facebook" | "linkedin";

export const emojiMap: Record<string, string> = {
  telegram: "📨",
  vk: "💬",
  dzen: "📖",
  ok: "👥",
  rss: "📡",
  whatsapp: "💬",
  viber: "📱",
  pinterest: "📌",
  flipboard: "📰",
  pulse: "⚡",
  yandex_news: "🔴",
  google_news: "📊",
  twitter: "🐦",
  facebook: "👤",
  linkedin: "💼"
};

interface PlatformIconProps {
  platformId: string;
  className?: string;
}

export function PlatformIcon({ platformId, className = "h-5 w-5" }: PlatformIconProps) {
  const iconProps = { className };
  
  switch (platformId) {
    case "telegram":
      return <SiTelegram {...iconProps} />;
    case "vk":
      return <SiVk {...iconProps} />;
    case "dzen":
      return <BookOpen {...iconProps} />;
    case "ok":
      return <SiOdnoklassniki {...iconProps} />;
    case "rss":
      return <Rss {...iconProps} />;
    case "whatsapp":
      return <SiWhatsapp {...iconProps} />;
    case "viber":
      return <SiViber {...iconProps} />;
    case "pinterest":
      return <SiPinterest {...iconProps} />;
    case "flipboard":
      return <SiFlipboard {...iconProps} />;
    case "pulse":
      return <Newspaper {...iconProps} />;
    case "yandex_news":
      return <Globe {...iconProps} />;
    case "google_news":
      return <Globe {...iconProps} />;
    case "twitter":
      return <SiX {...iconProps} />;
    case "facebook":
      return <SiFacebook {...iconProps} />;
    case "linkedin":
      return <FaLinkedin {...iconProps} />;
    default:
      return <Globe {...iconProps} />;
  }
}
