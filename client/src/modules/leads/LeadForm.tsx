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
import { Loader2 } from "lucide-react";

interface LeadFormProps {
  defaultServiceType?: string;
  source?: string;
  onSuccess?: () => void;
}

import { useLocation } from "wouter";
import { getRegionBySlug } from "@/lib/geo-utils";
import { getServiceGenitive } from "@/lib/grammar";
import { getIntentFromKeywords } from "@/content/copySystem";

export function LeadForm({ defaultServiceType, source = "website", onSuccess }: LeadFormProps) {
  const { toast } = useToast();
  const [location] = useLocation();

  // Parse search params carefully
  const searchParams = new URLSearchParams(window.location.search);
  const regionSlug = searchParams.get("region");
  const query = searchParams.get("query");

  // Geographic Context
  const regionCtx = regionSlug ? getRegionBySlug(regionSlug) : null;
  const regionNamePrepositional = regionCtx ? regionCtx.nameGenitive : null;

  // Intent Context
  const intent = query ? getIntentFromKeywords(query) : "default";

  // Dynamic Copy
  const formTitle = regionNamePrepositional
    ? `Закажите услуги в ${regionNamePrepositional}`
    : "Оставьте заявку";

  const submitLabel = query
    ? `Рассчитать стоимость (${query})`
    : "Отправить заявку";

  // Note: 'query' might be raw. Ideally map intent to service name:
  // But user requested "Calculate cost [Service]".
  // If query is 'fireproofing', `submitLabel` should probably be "Рассчитать стоимость огнезащиты".
  // Let's refine `submitLabel` logic below if needed.

  const computedSubmitLabel = query
    ? `Рассчитать стоимость ${getServiceGenitive(query)}`
    : "Отправить заявку";

  const form = useForm<InsertLead>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      serviceType: defaultServiceType || "",
      message: "",
      source: `${source} (Region: ${regionSlug || 'unknown'}, Query: ${query || 'none'})`,
    },
  });

  const createLeadMutation = useMutation({
    mutationFn: async (data: InsertLead) => {
      return await apiRequest("POST", "/api/leads", data);
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
        serviceType: defaultServiceType || "",
        message: "",
        source,
      });
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
                  <SelectItem value="chimney-painting">Покраска дымовых труб</SelectItem>
                  <SelectItem value="anti-corrosion">Антикоррозионная защита</SelectItem>
                  <SelectItem value="high-altitude-works">Высотные работы</SelectItem>
                  <SelectItem value="facade-repair">Ремонт фасадов</SelectItem>
                  <SelectItem value="mspro-quad">MSPRO Quad покрытие</SelectItem>
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
