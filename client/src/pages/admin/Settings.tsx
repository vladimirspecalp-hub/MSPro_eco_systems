import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const token = localStorage.getItem("admin_token");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    n8n_webhook_url: "",
    external_supabase_url: "",
  });

  useEffect(() => {
    if (!token) {
      setLocation("/admin/login");
      return;
    }

    fetch("/api/admin/settings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, setLocation]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast({ title: "Settings saved" });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">Admin Settings</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>External Connections</CardTitle>
              <CardDescription>Configure outbound data flows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>n8n Webhook URL</Label>
                <Input
                  placeholder="https://n8n.example.com/webhook/..."
                  value={settings.n8n_webhook_url}
                  onChange={(e) => setSettings(s => ({ ...s, n8n_webhook_url: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  New leads will be POSTed to this URL asynchronously.
                </p>
              </div>

              <div className="space-y-2">
                <Label>External Supabase URL (Sync)</Label>
                <Input
                  placeholder="https://project.supabase.co"
                  value={settings.external_supabase_url}
                  onChange={(e) => setSettings(s => ({ ...s, external_supabase_url: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Optional: URL for mirroring data to cloud Supabase instance.
                </p>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </main>
    </div>
  );
}
