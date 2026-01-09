import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { trackFormStart, trackFormSubmit } from "@/modules/analytics";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const hasTrackedStart = useRef(false);

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
      const data = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        message: formData.get("message"),
        serviceType: "general",
        source: "contact_form"
      };

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
