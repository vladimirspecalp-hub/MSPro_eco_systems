import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Shield, Clock, Award } from "lucide-react";
import { findSEOEntry, findRelatedPages, type SEOEntry } from "@/lib/seo-loader";
import NotFound from "./not-found";

export default function SEOPage() {
  const [, params] = useRoute("/:slug");
  const [pageData, setPageData] = useState<SEOEntry | null>(null);
  const [relatedPages, setRelatedPages] = useState<SEOEntry[]>([]);

  useEffect(() => {
    if (params?.slug) {
      const data = findSEOEntry(params.slug);
      setPageData(data || null);
      
      // Загружаем связанные страницы
      if (data) {
        const related = findRelatedPages(params.slug, 6);
        setRelatedPages(related);
      }
    }
  }, [params?.slug]);

  // SEO Meta Tags
  useEffect(() => {
    if (pageData) {
      // Save original values for cleanup
      const originalTitle = document.title;
      
      // Set page title
      document.title = `${pageData.title} | MS-PRO`;

      // Set or update canonical link
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      const canonicalCreated = !canonicalLink;
      
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', `https://ms-pro.ru/${pageData.slug}`);

      // Set or update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      const originalDescription = metaDescription?.getAttribute('content') || '';
      const metaDescriptionCreated = !metaDescription;
      
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', pageData.description);

      // Set or update meta keywords (only for SEO pages)
      let metaKeywords: HTMLMetaElement | null = null;
      if (pageData.keywords && pageData.keywords.length > 0) {
        metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', pageData.keywords.join(', '));
      }

      // Add JSON-LD structured data with unique ID for SEO pages
      const seoJsonLdId = 'seo-page-jsonld';
      let jsonLdScript = document.getElementById(seoJsonLdId) as HTMLScriptElement;
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.setAttribute('type', 'application/ld+json');
        jsonLdScript.setAttribute('id', seoJsonLdId);
        document.head.appendChild(jsonLdScript);
      }

      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": pageData.title,
        "description": pageData.description,
        "provider": {
          "@type": "Organization",
          "name": "MS-PRO",
          "url": "https://ms-pro.ru"
        },
        "areaServed": pageData.region || "Москва и область",
        "serviceType": pageData.keywords?.[0] || "Промышленный альпинизм"
      };

      jsonLdScript.textContent = JSON.stringify(structuredData);

      // Cleanup on unmount - restore original values
      return () => {
        document.title = originalTitle;
        
        if (canonicalLink && canonicalCreated && canonicalLink.parentNode) {
          canonicalLink.remove();
        }
        
        if (metaDescription) {
          if (metaDescriptionCreated) {
            metaDescription.remove();
          } else {
            metaDescription.setAttribute('content', originalDescription);
          }
        }
        
        if (metaKeywords && metaKeywords.parentNode) {
          metaKeywords.remove();
        }
        
        const scriptToRemove = document.getElementById(seoJsonLdId);
        if (scriptToRemove && scriptToRemove.parentNode) {
          scriptToRemove.remove();
        }
      };
    }
  }, [pageData]);


  if (!pageData) {
    return <NotFound />;
  }

  const benefits = [
    "Профессиональное оборудование и материалы",
    "Опытные специалисты с допуском к высотным работам",
    "Гарантия качества до 20 лет",
    "Полный пакет документации",
    "Соблюдение всех норм безопасности",
    "Работаем по всей России",
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section with H1 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl" data-testid="text-page-title">
              {pageData.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground" data-testid="text-page-description">
              {pageData.description}
            </p>
            {pageData.region && (
              <p className="mt-4 text-sm text-muted-foreground" data-testid="text-page-region">
                📍 Регион работы: {pageData.region}
              </p>
            )}
            <div className="mt-10 flex items-center justify-center gap-x-6 flex-wrap gap-y-4">
              <Link href="/calculator">
                <Button size="lg" data-testid="button-cta-calculator">
                  {pageData.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contacts">
                <Button variant="outline" size="lg" data-testid="button-cta-contacts">
                  Связаться с нами
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-benefits-heading">
              Наши преимущества
            </h2>
            <ul className="mt-8 space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3" data-testid={`benefit-item-${index}`}>
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* MSPRO Quad Card */}
      <section className="bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card className="overflow-hidden" data-testid="card-mspro-quad">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl" data-testid="text-mspro-quad-title">
                      MSPRO Quad — сертифицированная защита на 20 лет
                    </CardTitle>
                    <CardDescription className="mt-2 text-base" data-testid="text-mspro-quad-description">
                      Уникальное огнезащитное и антикоррозийное покрытие с гарантией качества
                    </CardDescription>
                  </div>
                  <Link href="/mspro-quad">
                    <Button variant="default" data-testid="button-mspro-quad-learn-more">
                      Подробнее
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="flex items-start gap-3" data-testid="feature-certification">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Сертификация Ростехнадзора</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Одобрено надзорными органами
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3" data-testid="feature-warranty">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Гарантия 20 лет</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Долговечная защита металлоконструкций
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3" data-testid="feature-quality">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Высокое качество</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Проверенная технология нанесения
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-process-heading">
              Как мы работаем
            </h2>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {[
                { step: "1", title: "Заявка", description: "Оставьте заявку на сайте или позвоните нам" },
                { step: "2", title: "Осмотр", description: "Выезд специалиста для оценки объема работ" },
                { step: "3", title: "Расчет", description: "Составление коммерческого предложения" },
                { step: "4", title: "Работы", description: "Выполнение работ в согласованные сроки" },
              ].map((item, index) => (
                <Card key={index} data-testid={`step-card-${index}`}>
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-2xl font-bold text-primary">{item.step}</span>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Services Section */}
      {relatedPages.length > 0 && (
        <section className="py-24 sm:py-32 bg-background">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-related-heading">
                Похожие услуги
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Другие услуги, которые могут быть вам интересны
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPages.map((service: SEOEntry, index: number) => (
                <Link key={service.slug} href={`/${service.slug}`}>
                  <Card className="h-full hover-elevate active-elevate-2 transition-all" data-testid={`related-service-${index}`}>
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2" data-testid={`related-service-title-${index}`}>
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`related-service-description-${index}`}>
                        {service.description}
                      </p>
                      {service.region && (
                        <p className="mt-4 text-xs text-muted-foreground" data-testid={`related-service-region-${index}`}>
                          📍 {service.region}
                        </p>
                      )}
                      <div className="mt-4 flex items-center text-sm font-medium text-primary" data-testid={`related-service-link-${index}`}>
                        Подробнее <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-final-cta-heading">
              Готовы начать проект?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Рассчитайте стоимость работ или свяжитесь с нами для консультации
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 flex-wrap gap-y-4">
              <Link href="/calculator">
                <Button size="lg" data-testid="button-goto-calculator">
                  Рассчитать стоимость
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contacts">
                <Button variant="outline" size="lg" data-testid="button-goto-contacts">
                  Связаться с нами
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
