import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface FAQItem {
  question: string;
  answer: string;
}

interface SeoPageData {
  slug: string;
  title: string;
  description: string;
  h1: string;
  h2: string;
  cta: string;
  region: string;
  keywords: string[];
  faq: FAQItem[];
}

interface SeoPageProps {
  data: SeoPageData;
}

// TODO: расширить под динамический контент AI
export default function SeoPage({ data }: SeoPageProps) {
  useEffect(() => {
    document.title = `${data.title} | MS-PRO`;

    const metaDescription = document.querySelector('meta[name="description"]') || 
      document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', data.description);
    if (!metaDescription.parentNode) {
      document.head.appendChild(metaDescription);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]') || 
      document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', data.keywords.join(', '));
    if (!metaKeywords.parentNode) {
      document.head.appendChild(metaKeywords);
    }

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.faq.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(faqSchema);

    return () => {
      if (metaDescription.parentNode) metaDescription.remove();
      if (metaKeywords.parentNode) metaKeywords.remove();
      if (scriptTag?.parentNode) scriptTag.remove();
    };
  }, [data]);

  return (
    <div className="flex flex-col">
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" data-testid="text-h1">
              {data.h1}
            </h1>
            <h2 className="mt-4 text-xl text-muted-foreground" data-testid="text-h2">
              {data.h2}
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground" data-testid="text-description">
              {data.description}
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
            <div className="flex justify-center mb-12">
              <Link href="/calculator">
                <Button size="lg" data-testid="button-cta">
                  {data.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {data.faq && data.faq.length > 0 && (
              <Card data-testid="card-faq">
                <CardHeader>
                  <CardTitle>Часто задаваемые вопросы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {data.faq.map((item, index) => (
                      <div key={index}>
                        <h3 className="font-semibold mb-2" data-testid={`faq-question-${index}`}>
                          {item.question}
                        </h3>
                        <p className="text-muted-foreground" data-testid={`faq-answer-${index}`}>
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
