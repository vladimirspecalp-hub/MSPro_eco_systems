import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, CheckCircle2, Award, Loader2 } from "lucide-react";
import { findOrGenerateSEOEntry, type SEOEntry } from "@/lib/seo-loader";
import { SEOHead } from "@/components/SEOHead";
import { ContactForm } from "@/modules/leads/form";
import NotFound from "../not-found";

export default function ServicePage() {
  const [, params] = useRoute("/services/:slug");
  const [pageData, setPageData] = useState<SEOEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!params?.slug) return;

      setLoading(true);
      setError(false);

      try {
        const data = await findOrGenerateSEOEntry(params.slug);
        setPageData(data);
        if (!data) {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params?.slug]);

  useEffect(() => {
    if (!pageData || !params?.slug) return;

    const url = `https://mspro-ltd.ru/services/${params.slug}`;
    const today = new Date().toISOString().split("T")[0];
    const image = "https://mspro-ltd.ru/site-industrial-theme-v5.jpg";

    const injectScript = (id: string, data: object) => {
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement("script");
        el.id = id;
        el.setAttribute("type", "application/ld+json");
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(data);
    };

    injectScript("service-page-schema", {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": pageData.title,
      "description": pageData.description,
      "url": url,
      "provider": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru" },
      "areaServed": { "@type": "Country", "name": "Россия" },
      "serviceType": pageData.title,
    });

    injectScript("article-page-schema", {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": pageData.title,
      "description": pageData.description,
      "url": url,
      "image": image,
      "author": { "@type": "Organization", "name": "MSPRO" },
      "publisher": {
        "@type": "Organization",
        "name": "MSPRO",
        "url": "https://mspro-ltd.ru",
        "logo": { "@type": "ImageObject", "url": "https://mspro-ltd.ru/assets/logo-live.jpg" },
      },
      "datePublished": "2026-01-09",
      "dateModified": today,
    });

    if (pageData.faq && pageData.faq.length > 0) {
      injectScript("service-faq-schema", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": pageData.faq.map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": { "@type": "Answer", "text": item.answer },
        })),
      });
    }

    return () => {
      document.getElementById("service-page-schema")?.remove();
      document.getElementById("article-page-schema")?.remove();
      document.getElementById("service-faq-schema")?.remove();
    };
  }, [pageData, params?.slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return <NotFound />;
  }

  return (
    <>
      <SEOHead
        title={pageData.title}
        description={pageData.description}
        keywords={pageData.keywords}
        slug={params?.slug || ""}
      />
      
      <div className="flex flex-col">
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" data-testid="text-service-heading">
                {pageData.h1 || pageData.title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground" data-testid="text-service-description">
                {pageData.description}
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link href="/calculator" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full" data-testid="button-cta">
                    {pageData.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <Card className="mb-8" data-testid="card-mspro-quad">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    MSPRO Quad — сертифицированная защита на 20 лет
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Используем огнезащитное покрытие MSPRO Quad с гарантией 20 лет. 
                    Сертифицировано Ростехнадзором для промышленных объектов.
                  </p>
                  <Link href="/mspro-quad" className="mt-4 inline-block">
                    <Button variant="outline" size="sm">
                      Подробнее о MSPRO Quad
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Ключевые преимущества
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Профессиональное оборудование и материалы</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Опытная команда специалистов</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Гарантия качества до 20 лет</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <span>Работаем по всей России</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {pageData.faq && pageData.faq.length > 0 && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Часто задаваемые вопросы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {pageData.faq.map((item, index) => (
                        <div key={index}>
                          <h3 className="font-semibold mb-2">{item.question}</h3>
                          <p className="text-muted-foreground">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6" data-testid="text-form-heading">
                  Оставить заявку
                </h2>
                <Card>
                  <CardContent className="pt-6">
                    <ContactForm />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
