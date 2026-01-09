/**
 * News Page - Список новостей MSPRO
 */

import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface NewsPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  category: string | null;
  publishedAt: string | null;
  createdAt: string;
  tags: string[];
}

interface NewsResponse {
  ok: boolean;
  items: NewsPost[];
  total: number;
}

export default function News() {
  const { data, isLoading, error } = useQuery<NewsResponse>({
    queryKey: ["/api/news"],
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground" data-testid="text-news-title">
              Новости MSPRO
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Актуальные новости о промышленной покраске, антикоррозийной защите и инновационных решениях MSPRO Quad
          </p>
        </header>

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="loading-skeleton">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12" data-testid="error-message">
            <p className="text-destructive">Ошибка загрузки новостей</p>
          </div>
        )}

        {data && (!data.items || data.items.length === 0) && (
          <div className="text-center py-12" data-testid="empty-state">
            <Newspaper className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Новостей пока нет</p>
          </div>
        )}

        {data && data.items && data.items.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="news-grid">
            {data.items.map((post) => (
              <Link key={post.id} href={`/news/${post.slug}`}>
                <Card 
                  className="h-full overflow-visible hover-elevate cursor-pointer group"
                  data-testid={`card-news-${post.slug}`}
                >
                  {post.coverImageUrl && (
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader className="flex flex-row items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2" data-testid={`text-title-${post.slug}`}>
                      {post.title}
                    </CardTitle>
                    {post.category && (
                      <Badge variant="secondary" className="shrink-0">
                        {post.category}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4" data-testid={`text-excerpt-${post.slug}`}>
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span data-testid={`text-date-${post.slug}`}>
                          {format(new Date(post.publishedAt || post.createdAt), "d MMMM yyyy", { locale: ru })}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-primary text-sm font-medium">
                        Читать <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <footer className="mt-12 pt-8 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a 
              href="/api/news/rss.xml" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
              data-testid="link-rss"
            >
              RSS лента
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
