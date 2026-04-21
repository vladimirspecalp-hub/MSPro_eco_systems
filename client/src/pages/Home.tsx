import { Helmet } from "react-helmet";
import { AdaptiveHero } from "@/components/AdaptiveHero";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Zap, Shield, Mountain, Factory, UtilityPole, RadioTower, Warehouse } from "lucide-react";
import { Geography } from "@/components/Geography";
import { AIKnowledgeBlock } from "@/components/AIKnowledgeBlock";
import { LicensesSection } from "@/components/LicensesSection";

const services = [
  {
    title: "Высотные работы (промальп)",
    description: "Промышленный альпинизм для работ на труднодоступных объектах: ЛЭП, АМС, вышки связи, дымовые трубы.",
    imgSrc: "/icons/icon_rope_access_red.png",
    href: "/services/rope-access",
  },
  {
    title: "Огнезащита на высоте",
    description: "Нанесение огнезащитных составов на металлоконструкции без тяжелой техники. Лицензия МЧС.",
    imgSrc: "/icons/icon_fireproofing_red.png",
    href: "/services/fireproofing-at-height",
  },
  {
    title: "АКЗ на высоте",
    description: "Антикоррозионная защита металлоконструкций. Подготовка поверхности, нанесение, контроль, ИД.",
    imgSrc: "/icons/icon_anticorrosion_red.png",
    href: "/services/anticorrosion-at-height",
  },
];

const objects = [
  { title: "ЛЭП и опоры", imgSrc: "/icons/icon_pylon_red.png", href: "/services/anticorrosion-at-height", description: "Многослойная АКЗ" },
  { title: "АМС / вышки связи", imgSrc: "/icons/icon_amc_red.png", href: "/services/rope-access", description: "Обслуживание и покраска" },
  { title: "Дымовые трубы", imgSrc: "/icons/icon_smokestack_red.png", href: "/services/rope-access", description: "Ремонт и маркировка" },
  { title: "Промметаллоконструкции", imgSrc: "/icons/icon_hangar_red.png", href: "/services/fireproofing-at-height", description: "Огнезащита и АКЗ" },
];

export default function Home() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MS-PRO",
    "alternateName": "ООО «МЕТАЛИУМ СИСТЕМ ПРОТЕКТ»",
    "url": "https://ms-pro.ru",
    "logo": "https://ms-pro.ru/assets/logo.jpg",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+7 (987) 909-29-38",
      "contactType": "sales",
      "areaServed": "RU",
      "availableLanguage": "Russian"
    },
    "areaServed": [
      "Russia",
      "Moscow",
      "Moscow Region",
      "Saint Petersburg",
      "Nizhny Novgorod",
      "Kazan",
      "Ekaterinburg",
      "Samara",
      "Omsk",
      "Rostov-on-Don",
      "Ufa",
      "Krasnoyarsk",
      "Voronezh",
      "Perm",
      "Volgograd"
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 55.7558,
        "longitude": 37.6173
      },
      "geoRadius": "8000000"
    },
    "founder": {
      "@type": "Person",
      "name": "Бровяков Владимир Андреевич"
    },
    "taxID": "6312197667",
    "iso6523Code": "1196313040330"
  };

  return (
    <div className="flex flex-col bg-noise bg-grid-pattern min-h-screen">
      <Helmet>
        <title>Высотные работы промышленными альпинистами | MS-PRO — ОГЗ и АКЗ на высоте</title>
        <script type="application/ld+json">
          {JSON.stringify(organizationData)}
        </script>
      </Helmet>
      <AdaptiveHero />

      <section id="services" className="py-24 sm:py-32">
        {/* ... existing services content ... */}
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
              <Card key={index} className="card-industrial group border-white/10 dark:border-slate-800 hover:border-primary/50 transition-all duration-500 overflow-hidden shadow-xl hover:shadow-primary/20 hover:-translate-y-2 backdrop-blur-md" data-testid={`card-service-${index}`}>
                <CardHeader className="relative z-10">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900/50 dark:bg-slate-950/50 border border-slate-700/50 shadow-inner group-hover:scale-110 group-hover:bg-red-900/20 group-hover:border-red-500/50 transition-all duration-500 mb-6 overflow-hidden">
                    <img
                      src={service.imgSrc}
                      alt={service.title}
                      className="h-full w-full object-cover group-hover:brightness-110 group-hover:contrast-125 transition-all duration-500"
                    />
                    {/* Ripple ring animation on hover */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-red-500/0 group-hover:border-red-500/40 scale-100 group-hover:scale-[1.15] opacity-100 group-hover:opacity-0 transition-all duration-700 ease-out" />
                  </div>
                  <CardTitle className="group-hover:text-white transition-colors duration-300">{service.title}</CardTitle>
                  <CardDescription className="mt-2">{service.description}</CardDescription>
                  <Link href={service.href}>
                    <Button variant="ghost" size="sm" className="mt-4 -ml-2 group-hover:text-primary transition-colors">
                      Подробнее
                    </Button>
                  </Link>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Trust Section */}
      <LicensesSection />

      {/* Geography Section */}
      <Geography />

      <section id="objects" className="bg-muted/50 py-24 sm:py-32 relative overflow-hidden">
        {/* Subtle background glow for dark mode aesthetic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-objects-heading">
              Типовые объекты
            </h2>
            <p className="mt-4 text-lg text-muted-foreground" data-testid="text-objects-description">
              Профильные объекты для высотных работ с ОГЗ и АКЗ
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {objects.map((obj, index) => (
              <Link key={index} href={obj.href}>
                <div
                  className="group relative flex flex-col items-center justify-center h-[260px] px-6 rounded-2xl bg-white/5 dark:bg-slate-900/40 border border-white/10 dark:border-slate-800 hover:bg-white/10 dark:hover:bg-slate-800/80 hover:border-primary/50 transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-md shadow-xl hover:shadow-primary/20 hover:-translate-y-2"
                  data-testid={`object-${index}`}
                >
                  {/* Subtle top gradient glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Inner wrapper that moves up on hover */}
                  <div className="flex flex-col items-center justify-center transition-transform duration-500 group-hover:-translate-y-5 relative z-10 w-full">
                    {/* Animated Icon Container */}
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900/50 dark:bg-slate-950/50 border border-slate-700/50 shadow-inner group-hover:scale-110 group-hover:bg-red-900/20 group-hover:border-red-500/50 transition-all duration-500 mb-6 z-10 overflow-hidden">
                      <img
                        src={obj.imgSrc}
                        alt={obj.title}
                        className="h-full w-full object-cover group-hover:brightness-110 group-hover:contrast-125 transition-all duration-500"
                      />
                      {/* Ring ripple animation on hover - adapted to red theme */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-red-500/0 group-hover:border-red-500/40 scale-100 group-hover:scale-[1.15] opacity-100 group-hover:opacity-0 transition-all duration-700 ease-out" />
                    </div>

                    {/* Text Content */}
                    <h3 className="font-bold text-center text-lg text-slate-200 dark:text-slate-100 group-hover:text-white transition-colors duration-300 relative z-10 leading-snug">
                      {obj.title}
                    </h3>
                  </div>

                  {/* Reveal Description on Hover (Absolutely positioned at bottom) */}
                  <div className="absolute bottom-6 left-0 right-0 px-6 text-center opacity-0 group-hover:opacity-100 transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 z-10 pointer-events-none">
                    <p className="text-sm font-medium text-primary/80 group-hover:text-primary">
                      {obj.description} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </p>
                  </div>
                </div>
              </Link>
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

      {/* Semantic Footer for AIO */}
      <AIKnowledgeBlock />
    </div>
  );
}
