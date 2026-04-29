import { useEffect } from "react";
import { Check, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ANSWER_BLOCKS, FAQ_BY_INTENT, CREDENTIALS } from "@/content/copySystem";

const risks = [
  {
    risk: "«Потом не доказать, кто виноват»",
    solution: "Критерии приемки + контроль по этапам + фотофиксация",
    icon: AlertTriangle,
  },
  {
    risk: "«Сложно принять высотные работы»",
    solution: "Отчёт по зонам/ярусам, актирование по этапам",
    icon: AlertTriangle,
  },
  {
    risk: "«Материал заказчика»",
    solution: "Согласование условий + входной контроль и письменные предупреждения при несоответствиях",
    icon: AlertTriangle,
  },
];

const faq = FAQ_BY_INTENT.anticorr || [];

export default function AnticorrosionAtHeight() {
  useEffect(() => {
    document.title = "Антикоррозионная защита на высоте (АКЗ, промальп) | MSPRO";

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
      "name": "Антикоррозионная защита металлоконструкций на высоте (АКЗ)",
      "description": "Обновляем и наносим защитные покрытия на высоте для продления ресурса конструкций. Профильные объекты: ЛЭП, АМС/вышки, дымовые трубы, промэстакады и площадки.",
      "url": "https://mspro-ltd.ru/services/anticorrosion-at-height",
      "provider": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru" },
      "areaServed": { "@type": "Country", "name": "Россия" },
      "serviceType": "Антикоррозионная защита металлоконструкций"
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
      "headline": "Антикоррозионная защита металлоконструкций на высоте (АКЗ)",
      "description": "Обновляем и наносим защитные покрытия на высоте для продления ресурса конструкций. Профильные объекты: ЛЭП, АМС/вышки, дымовые трубы, промэстакады и площадки.",
      "url": "https://mspro-ltd.ru/services/anticorrosion-at-height",
      "image": "https://mspro-ltd.ru/site-industrial-theme-v5.jpg",
      "author": { "@type": "Organization", "name": "MSPRO" },
      "publisher": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru", "logo": { "@type": "ImageObject", "url": "https://mspro-ltd.ru/assets/logo-live.jpg" } },
      "datePublished": "2026-01-09",
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400">
            <Shield className="h-4 w-4" />
            СРО (стройка) член №{CREDENTIALS.sroConstruction.memberNumber}
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-anticorr-h1">
            Антикоррозионная защита металлоконструкций на высоте (АКЗ)
          </h1>
          <p className="mt-6 text-lg text-muted-foreground" data-testid="text-anticorr-intro">
            Обновляем и наносим защитные покрытия на высоте для продления ресурса конструкций. 
            Профильные объекты: ЛЭП, АМС/вышки, дымовые трубы, промэстакады и площадки.
          </p>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-risks-heading">Ключевые риски и как снимаем</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {risks.map((item, index) => (
              <Card key={index} data-testid={`card-risk-${index}`}>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <item.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-base mt-3">
                    Риск: {item.risk}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Решение:</span> {item.solution}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-lg bg-blue-50 dark:bg-blue-900/10 p-8">
          <h2 className="text-xl font-semibold" data-testid="text-answer-block-heading">Об АКЗ на высоте</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed" data-testid="text-answer-block">
            {ANSWER_BLOCKS["anticorrosion-at-height"]}
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
            Рассчитать АКЗ на высоте
          </h2>
          <p className="mt-2 text-muted-foreground">
            Пришлите данные об объекте — вернём состав работ и КП.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/calculator">
              <Button size="lg" data-testid="button-cta-calculator">
                Рассчитать АКЗ
              </Button>
            </Link>
            <Link href="/documents">
              <Button variant="outline" size="lg" data-testid="button-cta-documents">
                Смотреть допуски СРО
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
