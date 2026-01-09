import { Hero } from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Shield, Flame, CheckCircle2, Zap, Factory, Building2 } from "lucide-react";

export default function MSPROQuad() {
  const features = [
    {
      icon: Flame,
      title: "Огнезащита класса EI 120",
      description: "Обеспечивает защиту металлоконструкций от огня на протяжении 120 минут",
    },
    {
      icon: Shield,
      title: "Долговечность 20+ лет",
      description: "Гарантированный срок службы покрытия более 20 лет в агрессивных условиях",
    },
    {
      icon: Zap,
      title: "Быстрое нанесение",
      description: "Современная технология позволяет сократить сроки работ до 50%",
    },
    {
      icon: CheckCircle2,
      title: "Сертифицировано",
      description: "Все необходимые сертификаты и протоколы испытаний",
    },
  ];

  const applications = [
    {
      icon: Factory,
      title: "Промышленные объекты",
      description: "Заводы, фабрики, производственные помещения",
    },
    {
      icon: Building2,
      title: "Коммерческая недвижимость",
      description: "Торговые центры, офисные здания, склады",
    },
  ];

  const specifications = [
    { label: "Класс огнестойкости", value: "EI 120" },
    { label: "Толщина покрытия", value: "1.5-3 мм" },
    { label: "Расход материала", value: "2-4 кг/м²" },
    { label: "Температура применения", value: "-40°C до +150°C" },
    { label: "Срок службы", value: "20+ лет" },
    { label: "Время высыхания", value: "24 часа" },
  ];

  return (
    <div className="flex flex-col">
      <Hero
        subtitle="MSPRO Quad"
        title="Инновационное огнезащитное покрытие"
        description="Профессиональное решение для защиты металлоконструкций от огня. Сертифицировано, протестировано, гарантия 20 лет."
        primaryCta={{
          text: "Рассчитать стоимость",
          href: "/calculator",
        }}
        secondaryCta={{
          text: "Скачать сертификаты",
          href: "#specs",
        }}
      />

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-features-heading">
              Преимущества MSPRO Quad
            </h2>
            <p className="mt-4 text-lg text-muted-foreground" data-testid="text-features-description">
              Современное решение для огнезащиты металлоконструкций
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:mt-20 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate transition-all duration-300" data-testid={`card-feature-${index}`}>
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="specs" className="bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-specs-heading">
              Технические характеристики
            </h2>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <Card>
              <CardContent className="pt-6">
                <dl className="divide-y">
                  {specifications.map((spec, index) => (
                    <div key={index} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4" data-testid={`spec-${index}`}>
                      <dt className="font-medium">{spec.label}</dt>
                      <dd className="mt-1 sm:col-span-2 sm:mt-0 text-muted-foreground">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-applications-heading">
              Области применения
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              MSPRO Quad используется на различных типах объектов
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            {applications.map((app, index) => (
              <Card key={index} className="hover-elevate transition-all duration-300" data-testid={`card-application-${index}`}>
                <CardHeader>
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                    <app.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>{app.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{app.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent/10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-cta-heading">
              Готовы защитить ваш объект?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Получите консультацию специалиста и расчет стоимости
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 flex-wrap gap-y-4">
              <Link href="/calculator">
                <Button size="lg" data-testid="button-cta-calculator">
                  Рассчитать стоимость
                </Button>
              </Link>
              <Link href="/contacts">
                <Button variant="outline" size="lg" data-testid="button-cta-contact">
                  Связаться с нами
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-8" data-testid="text-benefits-heading">
              Почему выбирают MSPRO Quad
            </h2>
            <ul className="space-y-4">
              {[
                "Соответствует всем требованиям пожарной безопасности",
                "Экономия до 40% по сравнению с традиционными методами",
                "Минимальные сроки выполнения работ",
                "Не требует специального обслуживания",
                "Экологически безопасен",
                "Полный пакет документации и сертификатов",
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3" data-testid={`benefit-${index}`}>
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
