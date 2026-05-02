import { useEffect, useState } from "react";
import { Link } from "wouter";
import { BookOpen, Scale, HardHat, Calculator as CalculatorIcon, LucideIcon, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface KnowledgeCategory {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

interface KnowledgeArticleSummary {
  slug: string;
  category: string;
  url?: string;
  title: string;
  description: string;
  publishedAt?: string;
  updatedAt?: string;
}

interface KnowledgeIndex {
  title: string;
  description: string;
  categories: KnowledgeCategory[];
  articles: KnowledgeArticleSummary[];
}

const ICONS: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  "scale": Scale,
  "hard-hat": HardHat,
  "calculator": CalculatorIcon,
};

export default function Knowledge() {
  const [index, setIndex] = useState<KnowledgeIndex | null>(null);

  useEffect(() => {
    document.title = "База знаний MSPRO | Гайды, стандарты, расчёты АКЗ и огнезащиты";
    fetch("/api/knowledge")
      .then((r) => (r.ok ? r.json() : null))
      .then(setIndex)
      .catch(() => setIndex(null));
  }, []);

  if (!index) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Загрузка…</p>
      </div>
    );
  }

  const articlesByCategory = (slug: string) =>
    index.articles.filter((a) => a.category === slug);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-10 md:mb-16 max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-4" data-testid="text-page-title">
          {index.title}
        </h1>
        <p className="text-lg text-muted-foreground">{index.description}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {index.categories.map((cat) => {
          const Icon = ICONS[cat.icon] || FileText;
          const articles = articlesByCategory(cat.slug);
          return (
            <Card key={cat.slug} className="flex flex-col" data-testid={`card-category-${cat.slug}`}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{cat.title}</CardTitle>
                    <CardDescription>{cat.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {articles.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    Раздел наполняется. Скоро здесь появятся материалы.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {articles.map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={a.url || `/knowledge/${a.slug}`}
                          className="text-primary hover:underline flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4 shrink-0" />
                          <span>{a.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 pt-8 border-t">
        <p className="text-sm text-muted-foreground">
          Нужна консультация инженера MSPRO?{" "}
          <Link href="/contacts" className="text-primary hover:underline">
            Связаться
          </Link>
          {" "}или{" "}
          <Link href="/calculator" className="text-primary hover:underline">
            рассчитать стоимость работ
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
