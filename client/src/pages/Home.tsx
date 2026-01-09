import { useEffect } from "react";
import { AdaptiveHero } from "@/components/AdaptiveHero";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Zap, Shield, Mountain, Factory } from "lucide-react";

const services = [
  {
    title: "Высотные работы (промальп)",
    description: "Промышленный альпинизм для работ на труднодоступных объектах: ЛЭП, АМС, вышки связи, дымовые трубы.",
    icon: Mountain,
    href: "/services/rope-access",
  },
  {
    title: "Огнезащита на высоте",
    description: "Нанесение огнезащитных составов на металлоконструкции без тяжелой техники. Лицензия МЧС.",
    icon: Zap,
    href: "/services/fireproofing-at-height",
  },
  {
    title: "АКЗ на высоте",
    description: "Антикоррозионная защита металлоконструкций. Подготовка поверхности, нанесение, контроль, ИД.",
    icon: Shield,
    href: "/services/anticorrosion-at-height",
  },
];

const objects = [
  { title: "ЛЭП и опоры", icon: Factory },
  { title: "АМС / вышки связи", icon: Factory },
  { title: "Дымовые трубы", icon: Factory },
  { title: "Промметаллоконструкции", icon: Factory },
];

export default function Home() {
  useEffect(() => {
    document.title = "Высотные работы промышленными альпинистами | MS-PRO — ОГЗ и АКЗ на высоте";
  }, []);

  return (
    <div className="flex flex-col">
      <AdaptiveHero />

      <section id="services" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-services-heading">
              Что делаем на высоте
            </h2>
            <p className="mt-4 text-lg text-muted-foreground" data-testid="text-services-description">
              Специализация — нанесение огнезащиты и антикоррозионной защиты там, где техника не подходит
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:mt-20 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Card key={index} className="hover-elevate" data-testid={`card-service-${index}`}>
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription className="mt-2">{service.description}</CardDescription>
                  <Link href={service.href}>
                    <Button variant="ghost" size="sm" className="mt-4 -ml-2">
                      Подробнее
                    </Button>
                  </Link>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="objects" className="bg-muted/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-objects-heading">
              Типовые объекты
            </h2>
            <p className="mt-4 text-lg text-muted-foreground" data-testid="text-objects-description">
              Профильные объекты для высотных работ с ОГЗ и АКЗ
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4">
            {objects.map((obj, index) => (
              <div key={index} className="flex flex-col items-center text-center" data-testid={`object-${index}`}>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <obj.icon className="h-8 w-8 text-primary" />
                </div>
                <span className="mt-4 font-medium">{obj.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-cta-heading">
              Нужен расчёт по вашему объекту?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Приложите ТЗ/фото — вернёмся с КП и составом работ.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link href="/calculator">
                <Button size="lg" data-testid="button-cta-calculator">
                  Запросить КП
                </Button>
              </Link>
              <Link href="/documents">
                <Button variant="outline" size="lg" data-testid="button-cta-documents">
                  Смотреть документы
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
