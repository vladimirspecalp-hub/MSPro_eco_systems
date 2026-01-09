import { PlatformIcon } from "./platformIcons";
import { Toggle, TextInput, StatusBadge, ProfileUrlHint } from "./ui";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface NewsPlatform {
  id: string;
  title: string;
}

interface PlatformSetting {
  enabled: boolean;
  profileUrl: string;
}

interface AggregatedStatus {
  lastStatus: string | null;
  lastAttemptAt: string | null;
  publishedCount: number;
  failedCount: number;
}

interface PlatformTableProps {
  platforms: NewsPlatform[];
  localSettings: Record<string, PlatformSetting>;
  aggregated: Record<string, AggregatedStatus>;
  onToggle: (platformId: string, enabled: boolean) => void;
  onProfileUrlChange: (platformId: string, url: string) => void;
}

export function PlatformTable({
  platforms,
  localSettings,
  aggregated,
  onToggle,
  onProfileUrlChange,
}: PlatformTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-3 font-medium">Платформа</th>
            <th className="text-left p-3 font-medium w-20">Вкл.</th>
            <th className="text-left p-3 font-medium">Profile URL</th>
            <th className="text-left p-3 font-medium w-28">Webhook</th>
            <th className="text-left p-3 font-medium w-24">Статус</th>
            <th className="text-left p-3 font-medium w-32">Последняя</th>
          </tr>
        </thead>
        <tbody>
          {platforms.map((platform) => {
            const setting = localSettings[platform.id] || { enabled: false, profileUrl: "" };
            const agg = aggregated[platform.id];
            const showHint = setting.enabled && !setting.profileUrl;

            return (
              <tr
                key={platform.id}
                className="border-b hover:bg-muted/30 transition-colors"
                data-testid={`row-platform-${platform.id}`}
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platformId={platform.id} className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{platform.title}</span>
                  </div>
                </td>
                <td className="p-3">
                  <Toggle
                    checked={setting.enabled}
                    onCheckedChange={(checked) => onToggle(platform.id, checked)}
                    testId={`toggle-${platform.id}`}
                  />
                </td>
                <td className="p-3">
                  <div>
                    <TextInput
                      value={setting.profileUrl}
                      onChange={(url) => onProfileUrlChange(platform.id, url)}
                      placeholder="https://..."
                      className="max-w-xs"
                      testId={`input-url-${platform.id}`}
                    />
                    <ProfileUrlHint show={showHint} />
                  </div>
                </td>
                <td className="p-3 text-xs text-muted-foreground">
                  n8n
                </td>
                <td className="p-3">
                  <StatusBadge 
                    status={agg?.lastStatus} 
                    publishedCount={agg?.publishedCount} 
                  />
                </td>
                <td className="p-3 text-xs text-muted-foreground">
                  {agg?.lastAttemptAt
                    ? format(new Date(agg.lastAttemptAt), "d MMM HH:mm", { locale: ru })
                    : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
