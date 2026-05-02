import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Article {
  slug: string;
  category: string;
  title: string;
  description: string;
  publishedAt?: string;
  updatedAt?: string;
  bodyHtml: string;
  faq?: Array<{ question: string; answer: string }>;
}

export default function KnowledgeArticle() {
  const { slug, category } = useParams<{ slug: string; category?: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const apiUrl = category
      ? `/api/knowledge/articles/${category}/${slug}`
      : `/api/knowledge/${slug}`;
    fetch(apiUrl)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((data) => {
        if (data) {
          setArticle(data);
          document.title = `${data.title} | База знаний MSPRO`;
        }
      })
      .catch(() => setNotFound(true));
  }, [slug, category]);

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Статья не найдена</h1>
        <p className="text-muted-foreground mb-6">
          Возможно, она была перемещена или ещё не опубликована.
        </p>
        <Button asChild>
          <Link href="/knowledge">К базе знаний</Link>
        </Button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Загрузка…</p>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <nav className="mb-6">
        <Link
          href="/knowledge"
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          База знаний
        </Link>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
        <p className="text-lg text-muted-foreground">{article.description}</p>
        {article.updatedAt && (
          <p className="text-xs text-muted-foreground mt-2">
            Обновлено:{" "}
            <time dateTime={article.updatedAt}>
              {new Date(article.updatedAt).toLocaleDateString("ru-RU")}
            </time>
          </p>
        )}
      </header>

      <div
        className="prose prose-slate dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
      />

      {article.faq && article.faq.length > 0 && (
        <section className="mt-12 pt-8 border-t" aria-label="Частые вопросы">
          <h2 className="text-2xl font-bold mb-4">Частые вопросы</h2>
          <dl className="space-y-4">
            {article.faq.map((item, i) => (
              <div key={i} className="rounded-lg border p-4">
                <dt className="font-semibold mb-2 faq-question">{item.question}</dt>
                <dd className="text-muted-foreground">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </article>
  );
}
