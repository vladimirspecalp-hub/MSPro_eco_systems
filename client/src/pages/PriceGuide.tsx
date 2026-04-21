import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface PriceGuideData {
    slug: string;
    service_id: string;
    region_name: string;
    title: string;
    meta_title: string;
    meta_description: string;
    intro: string;
    price_table: {
        service: string;
        price: string;
        comment: string;
    }[];
    factors_block: string;
    region_specifics: string;
    faq: {
        q: string;
        a: string;
    }[];
    cta_text: string;
}

export default function PriceGuide() {
    const [, params] = useRoute("/price-guide/:slug");
    const slug = params?.slug;

    const { data, isLoading, error } = useQuery<PriceGuideData>({
        queryKey: ["price-guide", slug],
        queryFn: async () => {
            const res = await fetch(`/api/price-guides/${slug}`);
            if (!res.ok) {
                if (res.status === 404) throw new Error("Гайд не найден");
                throw new Error("Ошибка загрузки данных");
            }
            return res.json();
        },
        enabled: !!slug,
    });

    // SEO Meta Tags and JSON-LD
    useEffect(() => {
        if (data) {
            const originalTitle = document.title;
            document.title = data.meta_title || `${data.title} | MS-PRO`;

            // Canonical
            let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
            const canonicalCreated = !canonicalLink;
            if (!canonicalLink) {
                canonicalLink = document.createElement('link');
                canonicalLink.setAttribute('rel', 'canonical');
                document.head.appendChild(canonicalLink);
            }
            canonicalLink.setAttribute('href', `https://mspro-ltd.ru/price-guide/${data.slug}`);

            // Description
            let metaDescription = document.querySelector('meta[name="description"]');
            const originalDescription = metaDescription?.getAttribute('content') || '';
            const metaDescriptionCreated = !metaDescription;
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.setAttribute('name', 'description');
                document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute('content', data.meta_description);

            // JSON-LD
            const scriptId = 'price-guide-jsonld';
            let jsonLdScript = document.getElementById(scriptId) as HTMLScriptElement;
            if (!jsonLdScript) {
                jsonLdScript = document.createElement('script');
                jsonLdScript.setAttribute('type', 'application/ld+json');
                jsonLdScript.setAttribute('id', scriptId);
                document.head.appendChild(jsonLdScript);
            }

            const structuredData = [
                {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": data.title,
                    "description": data.meta_description,
                    "author": {
                        "@type": "Organization",
                        "name": "MS-PRO"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "MS-PRO",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://mspro-ltd.ru/assets/logo.jpg"
                        }
                    },
                    "datePublished": "2024-02-08"
                },
                {
                    "@context": "https://schema.org",
                    "@type": "Service",
                    "name": data.title,
                    "provider": {
                        "@type": "Organization",
                        "name": "MS-PRO",
                        "image": "https://mspro-ltd.ru/assets/logo.jpg"
                    },
                    "areaServed": {
                        "@type": "City",
                        "name": data.region_name
                    },
                    "hasOfferCatalog": {
                        "@type": "OfferCatalog",
                        "name": "Услуги",
                        "itemListElement": data.price_table.map(item => ({
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": item.service
                            },
                            "priceSpecification": {
                                "@type": "PriceSpecification",
                                "price": item.price.replace(/\D/g, ''),
                                "priceCurrency": "RUB"
                            }
                        }))
                    }
                },
                {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Главная",
                            "item": "https://mspro-ltd.ru/"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Цены",
                            "item": "https://mspro-ltd.ru/calculator"
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": data.title,
                            "item": `https://mspro-ltd.ru/price-guide/${data.slug}`
                        }
                    ]
                },
                {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": data.faq.map(item => ({
                        "@type": "Question",
                        "name": item.q,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": item.a
                        }
                    }))
                }
            ];

            jsonLdScript.textContent = JSON.stringify(structuredData);

            return () => {
                document.title = originalTitle;
                if (canonicalCreated && canonicalLink.parentNode) canonicalLink.remove();
                if (metaDescriptionCreated && metaDescription.parentNode) {
                    metaDescription.remove();
                } else if (metaDescription) {
                    metaDescription.setAttribute('content', originalDescription);
                }
                const scriptToRemove = document.getElementById(scriptId);
                if (scriptToRemove) scriptToRemove.remove();
            };
        }
    }, [data]);

    if (isLoading) {
        return (
            <div className="container mx-auto py-12 px-4 max-w-4xl space-y-8">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="container mx-auto py-24 px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">Статья не найдена</h1>
                <p className="text-gray-600 mb-8">
                    {error ? `Ошибка: ${error.message}` : "Возможно, URL указан неверно или страница еще не создана."}
                </p>
                {/* Debug Info */}
                <p className="text-xs text-gray-400 mb-8">Slug: {slug}</p>
                <Link href="/">
                    <Button>На главную</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-slate-900 text-white py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                        {data.title}
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl">
                        {data.meta_description}
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
                {/* Intro */}
                <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
                    {data.intro}
                </div>

                {/* Price Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl text-primary">Расчет стоимости работ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">Вид работ</TableHead>
                                    <TableHead className="w-[20%]">Цена</TableHead>
                                    <TableHead>Комментарий</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.price_table.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">{row.service}</TableCell>
                                        <TableCell className="font-bold text-nowrap">{row.price}</TableCell>
                                        <TableCell className="text-sm text-gray-600">{row.comment}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <p className="text-sm text-gray-500 mt-4 italic">
                            * Указанные цены являются ориентировочными и могут меняться в зависимости от объема и условий.
                        </p>
                    </CardContent>
                </Card>

                {/* Factors and Region Specifics Block - Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="bg-orange-50/50 border-orange-100">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <AlertCircle className="w-5 h-5 text-orange-600" />
                                Что влияет на цену?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="prose prose-sm max-w-none whitespace-pre-wrap">
                            {data.factors_block}
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-50/50 border-blue-100">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                Специфика региона: {data.region_name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="prose prose-sm max-w-none whitespace-pre-wrap">
                            {data.region_specifics}
                        </CardContent>
                    </Card>
                </div>

                {/* FAQ */}
                <section>
                    <h2 className="text-3xl font-bold mb-6">Часто задаваемые вопросы</h2>
                    <Accordion type="single" collapsible className="w-full">
                        {data.faq.map((item, idx) => (
                            <AccordionItem value={`item-${idx}`} key={idx}>
                                <AccordionTrigger className="text-lg text-left">
                                    {item.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-700 whitespace-pre-wrap">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>

                {/* CTA */}
                <div className="bg-slate-100 p-8 rounded-2xl text-center space-y-6">
                    <h3 className="text-2xl font-bold">Рассчитайте точную стоимость</h3>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {data.cta_text}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/calculator">
                            <Button size="lg" className="px-8 text-lg">
                                Открыть калькулятор
                            </Button>
                        </Link>
                        <Link href="/contacts">
                            <Button variant="outline" size="lg" className="px-8 text-lg">
                                Связаться с менеджером
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
