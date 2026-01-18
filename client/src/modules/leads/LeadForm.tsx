import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertLeadSchema, type InsertLead } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Paperclip } from "lucide-react";
import { useState } from "react";

interface LeadFormProps {
  defaultServiceType?: string;
  source?: string;
  onSuccess?: () => void;
}

import { useLocation } from "wouter";
import { getRegionBySlug } from "@/lib/geo-utils";
import { getServiceGenitive } from "@/lib/grammar";
import { getIntentFromKeywords } from "@/content/copySystem";

import { SERVICE_TYPES } from "@/lib/calculator-data";

export function LeadForm({ defaultServiceType, source = "website", onSuccess }: LeadFormProps) {
  const { toast } = useToast();
  const [location] = useLocation();
  const [files, setFiles] = useState<File[]>([]);

  // Parse search params carefully
  const searchParams = new URLSearchParams(window.location.search);
  const regionSlug = searchParams.get("region");
  const query = searchParams.get("query");

  // Calculator Handover
  const calcDetails = searchParams.get("details");
  const calcService = searchParams.get("service");

  // Geographic Context
  const regionCtx = regionSlug ? getRegionBySlug(regionSlug) : null;
  const regionNamePrepositional = regionCtx ? regionCtx.nameGenitive : null;

  // Intent Context
  const intent = query ? getIntentFromKeywords(query) : "default";

  // Dynamic Copy
  const formTitle = regionNamePrepositional
    ? `Закажите услуги в ${regionNamePrepositional}`
    : "Оставьте заявку";

  // Determine initial service type
  let initialServiceType = defaultServiceType || "";
  if (calcService) {
    // Find matching service from shared types
    const found = SERVICE_TYPES.find(s => s.id === calcService);
    if (found) initialServiceType = found.id;
  }

  const computedSubmitLabel = query
    ? `Рассчитать стоимость ${getServiceGenitive(query)}`
    : "Отправить заявку";

  const form = useForm<InsertLead>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      serviceType: initialServiceType,
      message: calcDetails || "",
      source: `${source} (Region: ${regionSlug || 'unknown'}, Query: ${query || 'none'})`,
    },
  });

  const createLeadMutation = useMutation({
    mutationFn: async (data: InsertLead) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof InsertLead];
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      files.forEach((file) => {
        formData.append("files", file);
      });

      // Use fetch directly for FormData to avoid Content-Type JSON header issues
      const res = await fetch("/api/leads", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create lead");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время.",
      });
      form.reset({
        name: "",
        phone: "",
        email: "",
        serviceType: initialServiceType,
        message: "",
        source,
      });
      setFiles([]);
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertLead) => {
    createLeadMutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const allowedExts = [
        "jpg", "jpeg", "png", "webp", "heic",
        "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "rtf"
      ];

      const validFiles = newFiles.filter(file => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        return ext && allowedExts.includes(ext);
      });

      if (validFiles.length !== newFiles.length) {
        toast({
          title: "Файл не поддерживается",
          description: "Пожалуйста, загружайте только изображения, PDF или документы Office.",
          variant: "destructive"
        });
      }

      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-center" data-testid="text-lead-form-title">
          {formTitle}
        </h3>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя *</FormLabel>
              <FormControl>
                <Input placeholder="Ваше имя" {...field} data-testid="input-lead-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон *</FormLabel>
                <FormControl>
                  <Input placeholder="+7 (999) 123-45-67" {...field} data-testid="input-lead-phone" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@mail.ru" {...field} data-testid="input-lead-email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип услуги *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-lead-service-type">
                    <SelectValue placeholder="Выберите услугу" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SERVICE_TYPES.map(service => (
                    <SelectItem key={service.id} value={service.id}>{service.label}</SelectItem>
                  ))}
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сообщение</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Опишите ваш проект или задайте вопрос..."
                  className="min-h-[120px]"
                  {...field}
                  value={field.value || ""}
                  data-testid="textarea-lead-message"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File Upload Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="w-full sm:w-auto"
            >
              <Paperclip className="mr-2 h-4 w-4" />
              Прикрепить файл
            </Button>
            <span className="text-xs text-muted-foreground">
              Макс. 10 МБ (Фото, PDF, Word, Excel)
            </span>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.webp,.heic,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
              aria-label="Загрузить файлы"
            />
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-secondary/50 rounded-md border border-border text-sm">
                  <span className="truncate max-w-[200px] text-foreground">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>


        <Button
          type="submit"
          className="w-full"
          disabled={createLeadMutation.isPending}
          data-testid="button-submit-lead"
        >
          {createLeadMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Отправка...
            </>
          ) : (
            computedSubmitLabel
          )}
        </Button>
      </form>
    </Form>
  );
}
