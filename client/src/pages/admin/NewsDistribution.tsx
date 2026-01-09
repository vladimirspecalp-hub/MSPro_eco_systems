/**
 * Admin News Distribution - Управление платформами дистрибуции
 * Route: /admin/news-distribution
 */

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { PlatformTable } from "@/modules/newsDistribution";
import { Settings, Save, Lock, Info } from "lucide-react";

interface NewsPlatform {
  id: string;
  title: string;
}

interface PlatformSetting {
  enabled: boolean;
  profileUrl: string | null;
  webhookTokenPlaceholder: string | null;
  updatedAt: string | null;
}

interface AggregatedStatus {
  lastStatus: string | null;
  lastAttemptAt: string | null;
  publishedCount: number;
  failedCount: number;
}

interface PlatformsResponse {
  ok: boolean;
  platforms: NewsPlatform[];
  settings: Record<string, PlatformSetting>;
  aggregated: Record<string, AggregatedStatus>;
}

export default function NewsDistributionPage() {
  const { toast } = useToast();
  const [adminSecret, setAdminSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [localSettings, setLocalSettings] = useState<Record<string, { enabled: boolean; profileUrl: string }>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("mspro-admin-secret");
    if (saved) {
      setAdminSecret(saved);
      setIsAuthenticated(true);
    }
  }, []);

  const { data, isLoading, refetch } = useQuery<PlatformsResponse>({
    queryKey: ["/api/news/platforms"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await fetch("/api/news/platforms", {
        headers: {
          "x-mspro-news-secret": adminSecret
        }
      });
      return res.json();
    }
  });

  useEffect(() => {
    if (data?.settings) {
      const initial: Record<string, { enabled: boolean; profileUrl: string }> = {};
      for (const [id, setting] of Object.entries(data.settings)) {
        initial[id] = {
          enabled: setting.enabled,
          profileUrl: setting.profileUrl || ""
        };
      }
      setLocalSettings(initial);
      setHasChanges(false);
    }
  }, [data?.settings]);

  const updateMutation = useMutation({
    mutationFn: async (payload: { platformId: string; enabled?: boolean; profileUrl?: string | null }) => {
      const res = await fetch("/api/news/platforms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-mspro-news-secret": adminSecret
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news/platforms"] });
    }
  });

  const handleLogin = () => {
    if (adminSecret.length > 3) {
      sessionStorage.setItem("mspro-admin-secret", adminSecret);
      setIsAuthenticated(true);
      setTimeout(() => refetch(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  const handleToggle = (platformId: string, enabled: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      [platformId]: { ...prev[platformId], enabled }
    }));
    setHasChanges(true);
  };

  const handleProfileUrlChange = (platformId: string, profileUrl: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [platformId]: { ...prev[platformId], profileUrl }
    }));
    setHasChanges(true);
  };

  const handleSaveAll = async () => {
    try {
      for (const [platformId, setting] of Object.entries(localSettings)) {
        const original = data?.settings[platformId];
        if (!original) continue;

        const needsUpdate =
          setting.enabled !== original.enabled ||
          setting.profileUrl !== (original.profileUrl || "");

        if (needsUpdate) {
          await updateMutation.mutateAsync({
            platformId,
            enabled: setting.enabled,
            profileUrl: setting.profileUrl || null
          });
        }
      }

      toast({
        title: "Сохранено",
        description: "Настройки платформ обновлены"
      });
      setHasChanges(false);
    } catch {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Авторизация
              </CardTitle>
              <CardDescription>
                Введите секретный ключ для доступа к настройкам
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="secret">Admin Secret</Label>
                <Input
                  id="secret"
                  type="password"
                  placeholder="NEWS_INGEST_SECRET"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  onKeyDown={handleKeyDown}
                  data-testid="input-admin-secret"
                />
              </div>
              <Button onClick={handleLogin} className="w-full" data-testid="button-login">
                Войти
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Дистрибуция новостей
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Заглушки: токены не используются. Настройки сохраняются. Outbox создаётся при публикации.
            </p>
          </div>

          <Button
            onClick={handleSaveAll}
            disabled={!hasChanges || updateMutation.isPending}
            data-testid="button-save-all"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateMutation.isPending ? "Сохранение..." : "Сохранить все"}
          </Button>
        </header>

        <Card>
          <CardContent className="p-0">
            <PlatformTable
              platforms={data.platforms}
              localSettings={localSettings}
              aggregated={data.aggregated}
              onToggle={handleToggle}
              onProfileUrlChange={handleProfileUrlChange}
            />
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4" />
              n8n Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <code className="block text-xs bg-muted p-3 rounded">
              POST /api/news/outbox/dispatch — выдача queued jobs<br />
              POST /api/news/outbox/mark — обновление статусов
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
