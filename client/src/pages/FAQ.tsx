import { useEffect, useState, useMemo } from "react";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Search, ArrowRight } from "lucide-react";
// import { allSEOData } from "@/lib/seo-loader";

interface FAQItem {
    question: string;
    answer: string;
    service: string;
    region: string;
    slug: string;
}

// FAQs are fetched from API

// Get unique services and regions
function getFilters(faqs: FAQItem[]) {
    const services = Array.from(new Set(faqs.map(f => f.service))).sort();
    const regions = Array.from(new Set(faqs.map(f => f.region))).sort();
    return { services, regions };
}

export default function FAQ() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [allFaqs, setAllFaqs] = useState<FAQItem[]>([]);

    // Fetch FAQs from API
    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const response = await fetch('/api/ai_seo?mode=faqs');
                if (response.ok) {
                    const data = await response.json();
                    setAllFaqs(data);
                }
            } catch (error) {
                console.error("Failed to load FAQs:", error);
            }
        };

        fetchFAQs();
    }, []);

    const { services, regions } = useMemo(() => getFilters(allFaqs), [allFaqs]);

    // Filter FAQs
    const filteredFaqs = useMemo(() => {
        return allFaqs.filter(faq => {
            const matchesSearch = searchQuery === "" ||
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesService = !selectedService || faq.service === selectedService;
            const matchesRegion = !selectedRegion || faq.region === selectedRegion;
            return matchesSearch && matchesService && matchesRegion;
        });
    }, [allFaqs, searchQuery, selectedService, selectedRegion]);

    // SEO Meta Tags & Schema
    useEffect(() => {
        document.title = "Частые вопросы | MS-PRO — ОГЗ и АКЗ на высоте";

        const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        metaDesc.setAttribute('content', `Ответы на ${allFaqs.length}+ вопросов о высотных работах, огнезащите и АКЗ. Найдите информацию по вашему региону.`);
        if (!document.head.contains(metaDesc)) document.head.appendChild(metaDesc);

        // FAQPage Schema
        const schemaId = 'faq-hub-schema';
        let script = document.getElementById(schemaId);
        if (!script) {
            script = document.createElement('script');
            script.id = schemaId;
            script.setAttribute('type', 'application/ld+json');
            document.head.appendChild(script);
        }

        // Limit to first 50 for schema (Google recommendation)
        const schemaFaqs = filteredFaqs.slice(0, 50);
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": schemaFaqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };

        script.textContent = JSON.stringify(faqSchema);

        return () => {
            const toRemove = document.getElementById(schemaId);
            if (toRemove) toRemove.remove();
        };
    }, [filteredFaqs, allFaqs.length]);

    return (
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Частые вопросы
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Ответы на {allFaqs.length}+ вопросов о высотных работах, огнезащите и антикоррозионной защите
                    </p>
                </div>

                {/* Filters */}
                <div className="mx-auto mt-10 max-w-4xl space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Найти вопрос..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Filter buttons */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedService === null ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedService(null)}
                        >
                            Все услуги
                        </Button>
                        {services.slice(0, 5).map(service => (
                            <Button
                                key={service}
                                variant={selectedService === service ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedService(selectedService === service ? null : service)}
                            >
                                {service}
                            </Button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedRegion === null ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedRegion(null)}
                        >
                            Все регионы
                        </Button>
                        {regions.slice(0, 5).map(region => (
                            <Button
                                key={region}
                                variant={selectedRegion === region ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
                            >
                                {region}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* FAQ List */}
                <div className="mx-auto mt-10 max-w-4xl space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Найдено: {filteredFaqs.length} вопросов
                    </p>

                    {filteredFaqs.slice(0, 50).map((faq, index) => (
                        <Card
                            key={index}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-4">
                                    <CardTitle className="text-base font-medium leading-relaxed">
                                        {faq.question}
                                    </CardTitle>
                                    {expandedIndex === index ? (
                                        <ChevronUp className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                    )}
                                </div>
                            </CardHeader>
                            {expandedIndex === index && (
                                <CardContent className="pt-0">
                                    <p className="text-muted-foreground">{faq.answer}</p>
                                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                                        <span>📍 {faq.region}</span>
                                        <span>🔧 {faq.service}</span>
                                        <Link href={`/${faq.slug}`}>
                                            <span className="flex items-center text-primary hover:underline">
                                                Подробнее <ArrowRight className="ml-1 h-3 w-3" />
                                            </span>
                                        </Link>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}

                    {filteredFaqs.length > 50 && (
                        <p className="text-center text-sm text-muted-foreground">
                            Показано 50 из {filteredFaqs.length} вопросов. Используйте фильтры для уточнения.
                        </p>
                    )}
                </div>

                {/* CTA */}
                <div className="mx-auto mt-16 max-w-2xl text-center">
                    <h2 className="text-2xl font-bold">Не нашли ответ?</h2>
                    <p className="mt-2 text-muted-foreground">
                        Свяжитесь с нами — ответим в течение часа
                    </p>
                    <div className="mt-6 flex justify-center gap-4 flex-wrap">
                        <Link href="/contacts">
                            <Button size="lg">Задать вопрос</Button>
                        </Link>
                        <Link href="/calculator">
                            <Button variant="outline" size="lg">Рассчитать стоимость</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
