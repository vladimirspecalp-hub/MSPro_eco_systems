// TODO: Реализовать модуль после подключения Supabase и API.

import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/components/layouts/PageLayout';
import CTABlock from '@/components/widgets/CTABlock';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SEOPageData {
  slug: string;
  title: string;
  description: string;
  cta: string;
  region: string;
  keywords: string[];
}

export default function ServicePage() {
  const { slug } = useParams();

  const { data: pageData, isLoading } = useQuery<SEOPageData>({
    queryKey: ['/api/seo', slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <PageLayout>
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-2/3" />
      </PageLayout>
    );
  }

  if (!pageData) {
    return (
      <PageLayout title="Страница не найдена">
        <p>Запрашиваемая страница не найдена.</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title={pageData.title} 
      description={pageData.description}
    >
      <div className="grid gap-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">О услуге</h2>
            <p className="text-muted-foreground mb-4">{pageData.description}</p>
            <div className="flex flex-wrap gap-2">
              {pageData.keywords.map((keyword, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 bg-secondary rounded-md text-sm"
                  data-testid={`tag-keyword-${i}`}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <CTABlock 
          title={pageData.cta}
          description={`Регион: ${pageData.region}`}
        />
      </div>
    </PageLayout>
  );
}
