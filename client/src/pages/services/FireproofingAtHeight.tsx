import { useEffect } from "react";
import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ANSWER_BLOCKS, FAQ_BY_INTENT, CREDENTIALS } from "@/content/copySystem";

const steps = [
  { step: 1, title: "Вводные и осмотр", description: "ТЗ/проект/фото" },
  { step: 2, title: "Подготовка поверхности по ТЗ", description: "Очистка, обезжиривание" },
  { step: 3, title: "Нанесение огнезащитного слоя", description: "По согласованной технологии" },
  { step: 4, title: "Контроль по этапам", description: "По ТЗ/регламенту" },
  { step: 5, title: "Исполнительная документация и сдача", description: "Акты, журналы, фотофиксация" },
];

const faq = FAQ_BY_INTENT.fireproof || [];

export default function FireproofingAtHeight() {
  useEffect(() => {
    document.title = "Огнезащита металлоконструкций на высоте (промальп) | MSPRO";

    const svcId = "service-page-schema";
    let svcScript = document.getElementById(svcId);
    if (!svcScript) {
      svcScript = document.createElement("script");
      svcScript.id = svcId;
      svcScript.setAttribute("type", "application/ld+json");
      document.head.appendChild(svcScript);
    }
    svcScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Огнезащита металлоконструкций на высоте (промышленный альпинизм)",
      "description": "Наносим огнезащитные составы на высоте там, где требуется доступ без тяжелой техники: ЛЭП, АМС/вышки, трубы, фермы и площадки.",
      "url": "https://mspro-ltd.ru/services/fireproofing-at-height",
      "provider": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru" },
      "areaServed": { "@type": "Country", "name": "Россия" },
      "serviceType": "Огнезащита металлоконструкций"
    });

    const faqId = "service-faq-schema";
    let faqScript = document.getElementById(faqId);
    if (!faqScript) {
      faqScript = document.createElement("script");
      faqScript.id = faqId;
      faqScript.setAttribute("type", "application/ld+json");
      document.head.appendChild(faqScript);
    }
    faqScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faq.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    });

    const artId = "article-page-schema";
    let artScript = document.getElementById(artId);
    if (!artScript) {
      artScript = document.createElement("script");
      artScript.id = artId;
      artScript.setAttribute("type", "application/ld+json");
      document.head.appendChild(artScript);
    }
    artScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Огнезащита металлоконструкций на высоте (промышленный альпинизм)",
      "description": "Наносим огнезащитные составы на высоте там, где требуется доступ без тяжелой техники: ЛЭП, АМС/вышки, трубы, фермы и площадки.",
      "url": "https://mspro-ltd.ru/services/fireproofing-at-height",
      "image": "https://mspro-ltd.ru/site-industrial-theme-v5.jpg",
      "author": { "@type": "Organization", "name": "MSPRO" },
      "publisher": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru", "logo": { "@type": "ImageObject", "url": "https://mspro-ltd.ru/site-industrial-theme-v5.jpg" } },
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split("T")[0]
    });

    return () => {
      document.getElementById(svcId)?.remove();
      document.getElementById(faqId)?.remove();
      document.getElementById(artId)?.remove();
    };
  }, []);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 dark:bg-orange-900/30 px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400">
            <Flame className="h-4 w-4" />
            Лицензия МЧС {CREDENTIALS.mchs.number}
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-fireproofing-h1">
            Огнезащита металлоконструкций на высоте (промышленный альпинизм)
          </h1>
          <p className="mt-6 text-lg text-muted-foreground" data-testid="text-fireproofing-intro">
            Наносим огнезащитные составы на высоте там, где требуется доступ без тяжелой техники: 
            ЛЭП, АМС/вышки, трубы, фермы и площадки.
          </p>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-steps-heading">Как работаем</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-5">
            {steps.map((item, index) => (
              <Card key={index} className="relative" data-testid={`card-step-${index}`}>
                <CardHeader className="pb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    {item.step}
                  </div>
                  <CardTitle className="text-base mt-3">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
                {index < steps.length - 1 && (
                  <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-4 w-4 text-muted-foreground hidden sm:block" />
                )}
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-lg bg-orange-50 dark:bg-orange-900/10 p-8">
          <h2 className="text-xl font-semibold" data-testid="text-answer-block-heading">Об огнезащите на высоте</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed" data-testid="text-answer-block">
            {ANSWER_BLOCKS["fireproofing-at-height"]}
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-faq-heading">Частые вопросы</h2>
          <div className="mt-8 space-y-6">
            {faq.map((item, index) => (
              <div key={index} className="border-b pb-6" data-testid={`faq-item-${index}`}>
                <h3 className="font-semibold">{item.question}</h3>
                <p className="mt-2 text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-lg border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold" data-testid="text-cta-heading">
            Рассчитать огнезащиту на высоте
          </h2>
          <p className="mt-2 text-muted-foreground">
            Пришлите ТЗ/проект или фото объекта — вернём состав работ и КП.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/calculator">
              <Button size="lg" data-testid="button-cta-calculator">
                Рассчитать огнезащиту
              </Button>
            </Link>
            <Link href="/documents">
              <Button variant="outline" size="lg" data-testid="button-cta-documents">
                Смотреть лицензию МЧС
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
