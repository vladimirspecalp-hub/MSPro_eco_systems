import { useEffect } from "react";
import { ArrowRight, Zap, Shield, FileText, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ANSWER_BLOCKS, FAQ_DEFAULT } from "@/content/copySystem";

const services = [
  {
    title: "Огнезащита металлоконструкций на высоте",
    href: "/services/fireproofing-at-height",
    icon: Zap,
  },
  {
    title: "Антикоррозионная защита металлоконструкций на высоте",
    href: "/services/anticorrosion-at-height",
    icon: Shield,
  },
  {
    title: "Подготовка поверхности (локальная/по ТЗ), обеспыливание, обезжиривание",
    href: "#",
    icon: FileText,
  },
  {
    title: "Ремонт/обновление покрытий на высоте (по согласованию)",
    href: "#",
    icon: Mountain,
  },
];

const objects = [
  { title: "ЛЭП и опоры", description: "Линии электропередач, металлические опоры" },
  { title: "АМС / вышки связи", description: "Антенно-мачтовые сооружения, башни" },
  { title: "Дымовые трубы (металл/ЖБ)", description: "Металлические и железобетонные трубы" },
  { title: "Промышленные металлоконструкции", description: "Эстакады, фермы, площадки" },
];

export default function RopeAccess() {
  useEffect(() => {
    document.title = "Высотные работы промышленными альпинистами для промобъектов | MSPRO";
  }, []);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-rope-access-h1">
            Высотные работы промышленными альпинистами (промальп) на промобъектах
          </h1>
          <p className="mt-6 text-lg text-muted-foreground" data-testid="text-rope-access-intro">
            Выполняем высотные работы там, где техника не подходит или экономически нецелесообразна. 
            Специализация MSPRO — нанесение огнезащиты и антикоррозионной защиты металлоконструкций на высоте.
          </p>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-services-heading">Что делаем на высоте</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {services.map((service, index) => (
              <Card key={index} className="hover-elevate" data-testid={`card-service-${index}`}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <service.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                {service.href !== "#" && (
                  <CardContent>
                    <Link href={service.href}>
                      <Button variant="ghost" size="sm" className="gap-2">
                        Подробнее <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16" id="objects">
          <h2 className="text-2xl font-bold" data-testid="text-objects-heading">Наши типовые объекты</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {objects.map((obj, index) => (
              <Card key={index} data-testid={`card-object-${index}`}>
                <CardHeader>
                  <CardTitle className="text-lg">{obj.title}</CardTitle>
                  <CardDescription>{obj.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-lg bg-muted/50 p-8">
          <h2 className="text-xl font-semibold" data-testid="text-answer-block-heading">О высотных работах MSPRO</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed" data-testid="text-answer-block">
            {ANSWER_BLOCKS["rope-access"]}
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-faq-heading">Частые вопросы</h2>
          <div className="mt-8 space-y-6">
            {FAQ_DEFAULT.map((item, index) => (
              <div key={index} className="border-b pb-6" data-testid={`faq-item-${index}`}>
                <h3 className="font-semibold">{item.question}</h3>
                <p className="mt-2 text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-lg border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold" data-testid="text-cta-heading">
            Нужен расчёт по вашему объекту?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Прикрепите ТЗ/фото — инженер вернётся с предложением.
          </p>
          <Link href="/calculator">
            <Button className="mt-6" size="lg" data-testid="button-cta-calculator">
              Запросить КП
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
