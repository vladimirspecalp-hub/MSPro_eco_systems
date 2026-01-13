import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MoreVertical,
  Phone,
  Trash2,
  Download,
  Settings as SettingsIcon,
  RefreshCw,
  Archive,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city?: string;
  serviceType: string;
  systemType?: string;
  message?: string;
  calculatedPrice?: string;
  status: string;
  n8nSynced: boolean;
  createdAt: string;
  details?: any;
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    if (!token) setLocation("/admin/login");
  }, [token, setLocation]);

  const { data: leads, isLoading } = useQuery<Lead[]>({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const res = await fetch("/api/admin/leads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!token,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      toast({ title: "Статус обновлен" });
    },
  });

  const deleteLead = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/admin/leads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      toast({ title: "Заявка удалена" });
    },
  });

  const exportCSV = () => {
    if (!leads) return;
    const headers = ["Date", "Name", "Phone", "Email", "City", "Service", "System", "Price", "Status", "Message"];
    const csvContent = [
      headers.join(","),
      ...leads.map(lead => [
        format(new Date(lead.createdAt), "yyyy-MM-dd HH:mm"),
        `"${lead.name}"`,
        lead.phone,
        lead.email,
        lead.city || "",
        lead.serviceType,
        lead.systemType || "",
        lead.calculatedPrice || "",
        lead.status,
        `"${(lead.message || "").replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `leads_export_${format(new Date(), "yyyyMMdd")}.csv`;
    link.click();
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/settings">
              <Button variant="outline" size="sm">
                <SettingsIcon className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => {
              localStorage.removeItem("admin_token");
              setLocation("/admin/login");
            }}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Leads ({leads?.length || 0})</h2>
          <Button onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sync</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads?.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(lead.createdAt), "dd.MM.yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-sm text-muted-foreground">{lead.phone}</div>
                    {lead.city && <Badge variant="outline" className="mt-1">{lead.city}</Badge>}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{lead.serviceType}</div>
                    {lead.systemType && <div className="text-sm text-muted-foreground">Sys: {lead.systemType}</div>}
                    {lead.calculatedPrice && <div className="text-sm font-semibold">{lead.calculatedPrice} ₽</div>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      lead.status === "new" ? "default" :
                      lead.status === "in_progress" ? "secondary" : "outline"
                    }>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {lead.n8nSynced ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button size="icon" variant="ghost" asChild>
                        <a href={`tel:${lead.phone}`}>
                          <Phone className="w-4 h-4" />
                        </a>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateStatus.mutate({ id: lead.id, status: "new" })}>
                            Set New
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus.mutate({ id: lead.id, status: "in_progress" })}>
                            Set In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus.mutate({ id: lead.id, status: "archive" })}>
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              if (confirm("Delete this lead?")) deleteLead.mutate(lead.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
