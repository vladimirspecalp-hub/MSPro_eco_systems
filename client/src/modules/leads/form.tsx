import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { trackFormStart, trackFormSubmit } from "@/modules/analytics";
import { Calculator } from "lucide-react";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatorData, setCalculatorData] = useState<any>(null);
  const { toast } = useToast();
  const hasTrackedStart = useRef(false);

  useEffect(() => {
    const savedData = sessionStorage.getItem("calculatorData");
    if (savedData) {
      try {
        setCalculatorData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse calculator data");
      }
    }
  }, []);

  const handleFormInteraction = () => {
    if (!hasTrackedStart.current) {
      trackFormStart("contact-form", "contact");
      hasTrackedStart.current = true;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      const data: any = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        message: formData.get("message"),
        serviceType: calculatorData?.serviceType || "general",
        source: "contact_form"
      };

      if (calculatorData) {
        data.systemType = calculatorData.serviceType;
        data.calculatedPrice = calculatorData.calculatedPrice;
        data.details = calculatorData;
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        trackFormSubmit("contact-form", "contact");
        toast({
          title: "Заявка отправлена!",
          description: "Мы свяжемся с вами в ближайшее время.",
        });
        e.currentTarget.reset();
        sessionStorage.removeItem("calculatorData");
        setCalculatorData(null);
        hasTrackedStart.current = false;
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" onFocus={handleFormInteraction}>
      {calculatorData && (
        <div className="bg-primary/10 p-4 rounded-lg flex items-center gap-3 text-sm text-primary">
          <Calculator className="h-5 w-5" />
          <div>
            <p className="font-medium">Прикреплен расчет стоимости</p>
            <p className="opacity-80">
              Тип: {calculatorData.serviceType}, Сумма: {new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(calculatorData.calculatedPrice)}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Имя *</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="Ваше имя"
          data-testid="input-name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Телефон *</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="+7 (999) 123-45-67"
          data-testid="input-phone"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="info@example.com"
          data-testid="input-email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Сообщение</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Опишите ваш проект..."
          data-testid="input-message"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
        data-testid="button-submit"
      >
        {isSubmitting ? "Отправка..." : "Отправить заявку"}
      </Button>
    </form>
  );
}
