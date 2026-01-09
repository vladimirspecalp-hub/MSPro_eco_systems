/**
 * News Article Page - Отдельная статья новости
 */

import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowLeft, Share2, User } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useEffect } from "react";
import { trackNewsOpen, trackShareClick } from "@/modules/analytics";
import { PlatformGrid } from "@/modules/newsDistribution";

interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  contentHtml: string;
  coverImageUrl: string | null;
  category: string | null;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seo: { title?: string; description?: string };
}

interface ArticleMeta {
  title: string;
  description: string;
  image: string | null;
  jsonLd: object;
}

interface ArticleResponse {
  ok: boolean;
  post: NewsPost;
  canonicalUrl: string;
  shareLinks: Record<string, string>;
  meta: ArticleMeta;
}

export default function NewsArticlePage() {
  const [match, params] = useRoute("/news/:slug");
  const slug = params?.slug;

  const { data, isLoading, error } = useQuery<ArticleResponse>({
    queryKey: ["/api/news", slug],
    enabled: !!slug,
  });

  const { data: platformsData } = useQuery<{
    ok: boolean;
    platforms: Array<{ id: string; title: string; shareUrlTemplate?: string }>;
    settings: Record<string, { enabled: boolean; profileUrl: string | null }>;
  }>({
    queryKey: ["/api/news/platforms"],
  });

  useEffect(() => {
    if (data?.post) {
      trackNewsOpen(data.post.slug, data.post.category || undefined);
    }
  }, [data?.post?.slug]);

  useEffect(() => {
    if (data?.meta) {
      document.title = data.meta.title;
      
      const existingDesc = document.querySelector('meta[name="description"]');
      if (existingDesc) {
        existingDesc.setAttribute("content", data.meta.description);
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = data.meta.description;
        document.head.appendChild(meta);
      }

      if (data.meta.jsonLd) {
        const existingJsonLd = document.querySelector('script[type="application/ld+json"]');
        const jsonLdStr = JSON.stringify(data.meta.jsonLd);
        if (existingJsonLd) {
          existingJsonLd.textContent = jsonLdStr;
        } else {
          const script = document.createElement("script");
          script.type = "application/ld+json";
          script.textContent = jsonLdStr;
          document.head.appendChild(script);
        }
      }
    }

    return () => {
      document.title = "MSPRO";
    };
  }, [data]);

  const handleShare = async () => {
    trackShareClick('native', data?.post?.slug);
    if (navigator.share && data?.post) {
      await navigator.share({
        title: data.post.title,
        text: data.post.excerpt,
        url: data.canonicalUrl,
      });
    } else if (data?.canonicalUrl) {
      await navigator.clipboard.writeText(data.canonicalUrl);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-24 mb-8" />
          <Skeleton className="h-96 w-full rounded-lg mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold mb-4" data-testid="text-error">Статья не найдена</h2>
            <p className="text-muted-foreground mb-6">
              Возможно, статья была удалена или перемещена
            </p>
            <Link href="/news">
              <Button data-testid="button-back-to-news">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Вернуться к новостям
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { post } = data;

  return (
    <div className="min-h-screen bg-background">
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <nav className="mb-8">
          <Link href="/news">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Все новости
            </Button>
          </Link>
        </nav>

        {post.coverImageUrl && (
          <div className="relative h-64 md:h-96 overflow-hidden rounded-lg mb-8">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
              data-testid="img-cover"
            />
          </div>
        )}

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {post.category && (
              <Badge variant="secondary" data-testid="badge-category">
                {post.category}
              </Badge>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.publishedAt || post.createdAt} data-testid="text-date">
                {format(new Date(post.publishedAt || post.createdAt), "d MMMM yyyy", { locale: ru })}
              </time>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span data-testid="text-author">MSPRO</span>
            </div>
          </div>

          <h1 
            className="text-3xl md:text-4xl font-bold text-foreground mb-4" 
            data-testid="text-article-title"
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-muted-foreground" data-testid="text-excerpt">
              {post.excerpt}
            </p>
          )}
        </header>

        <div 
          className="prose prose-lg dark:prose-invert max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.contentHtml || post.contentMarkdown }}
          data-testid="content-article"
        />

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8" data-testid="tags-container">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" data-testid={`tag-${tag}`}>
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {platformsData?.platforms && platformsData?.settings && (
          <PlatformGrid
            platforms={platformsData.platforms}
            settings={platformsData.settings}
            articleUrl={data.canonicalUrl}
            articleTitle={post.title}
            slug={post.slug}
          />
        )}

        <Card className="my-8 p-6 bg-primary/5 border-primary/20" data-testid="cta-block">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Нужна консультация?</h3>
            <p className="text-muted-foreground mb-4">
              Закажите бесплатный расчёт стоимости работ
            </p>
            <Link href="/calculator">
              <Button data-testid="button-cta-calculator">
                Рассчитать стоимость
              </Button>
            </Link>
          </div>
        </Card>

        <footer className="pt-8 border-t flex flex-wrap items-center justify-between gap-4">
          <Link href="/news">
            <Button variant="outline" data-testid="button-more-news">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Больше новостей
            </Button>
          </Link>

          <Button variant="ghost" onClick={handleShare} data-testid="button-share">
            <Share2 className="h-4 w-4 mr-2" />
            Поделиться
          </Button>
        </footer>
      </article>
    </div>
  );
}
