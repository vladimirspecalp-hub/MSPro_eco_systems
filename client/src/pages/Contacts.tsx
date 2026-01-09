import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LeadForm } from "@/modules/leads/LeadForm";
import { MapPin, Building, User, Phone, Mail } from "lucide-react";

export default function Contacts() {
  const { toast } = useToast();

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-contacts-heading">
            Свяжитесь с нами
          </h1>
          <p className="mt-4 text-lg text-muted-foreground" data-testid="text-contacts-description">
            Оставьте заявку и наш менеджер свяжется с вами в течение часа
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Оставить заявку</CardTitle>
                <CardDescription>
                  Заполните форму и мы рассчитаем стоимость работ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LeadForm source="contact-page" />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Телефон
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a href="tel:+79879092938" className="text-lg font-semibold hover:text-primary transition-colors" data-testid="link-phone">
                  +7 (987) 909-29-38
                </a>
                <p className="mt-1 text-sm text-muted-foreground">Пн-Пт: 9:00 - 18:00</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <a href="mailto:info@mspro-ltd.ru" className="block text-lg font-semibold hover:text-primary transition-colors" data-testid="link-email">
                    info@mspro-ltd.ru
                  </a>
                  <a href="mailto:specalp@ya.ru" className="block text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-email-alt">
                    specalp@ya.ru
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Адрес
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold" data-testid="text-address">
                  443091, г. Самара, пр. Кирова, д. 275, оф. 29
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Работаем по всей России</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Реквизиты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm" data-testid="text-requisites">
                  <p><span className="text-muted-foreground">Название:</span> ООО «МЕТАЛИУМ СИСТЕМ ПРОТЕКТ»</p>
                  <p><span className="text-muted-foreground">ИНН:</span> 6312197667</p>
                  <p><span className="text-muted-foreground">ОГРН:</span> 1196313040330</p>
                  <p><span className="text-muted-foreground">КПП:</span> 631201001</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Руководитель
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold" data-testid="text-director">Бровяков Владимир Андреевич</p>
                <p className="mt-1 text-sm text-muted-foreground">Директор ООО «МСПРО»</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
