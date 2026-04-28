import { useEffect } from "react";
import { ArrowRight, Trash2, Hammer, Building2, Fence, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ANSWER_BLOCKS, FAQ_DEFAULT } from "@/content/copySystem";

const services = [
    {
        title: "Демонтаж дымовых труб (металл/ЖБ)",
        href: "#",
        icon: Building2,
    },
    {
        title: "Разбор высотных металлоконструкций",
        href: "#",
        icon: Hammer,
    },
    {
        title: "Демонтаж элементов АМС и вышек связи",
        href: "#",
        icon: Zap,
    },
    {
        title: "Снос аварийных участков на высоте",
        href: "#",
        icon: Shield,
    },
];

const objects = [
    { title: "Заброшенные цеха", description: "Демонтаж ферм, перекрытий и кровли" },
    { title: "Дымовые трубы", description: "Поэтапный разбор или направленный демонтаж" },
    { title: "Вышки и мачты", description: "Аккуратный демонтаж оборудования и секций" },
    { title: "Рекламные стелы", description: "Высотный демонтаж крупногабаритных конструкций" },
];

export default function Demolition() {
    useEffect(() => {
        document.title = "Демонтаж на высоте промышленными альпинистами | MSPRO";

        const svcId = "service-page-schema";
        let svcScript = document.getElementById(svcId);
        if (!svcScript) {
            svcScript = document.createElement("script");
            svcScript.id = svcId;
            svcScript.setAttribute("type", "application/ld+json");
            document.head.appendChild(svcScript);
        }
        svcScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Демонтаж на высоте (промальп)",
            "description": "Безопасный разбор и снос конструкций на высоте силами промышленных альпинистов. Работаем там, где нельзя использовать спецтехнику из-за плотной застройки или риска повреждения оборудования.",
            "url": "https://mspro-ltd.ru/services/demolition",
            "provider": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru" },
            "areaServed": { "@type": "Country", "name": "Россия" },
            "serviceType": "Демонтаж на высоте"
        });

        const faqId = "service-faq-schema";
        let faqScript = document.getElementById(faqId);
        if (!faqScript) {
            faqScript = document.createElement("script");
            faqScript.id = faqId;
            faqScript.setAttribute("type", "application/ld+json");
            document.head.appendChild(faqScript);
        }
        faqScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQ_DEFAULT.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": { "@type": "Answer", "text": item.answer }
            }))
        });

        const artId = "article-page-schema";
        let artScript = document.getElementById(artId);
        if (!artScript) {
            artScript = document.createElement("script");
            artScript.id = artId;
            artScript.setAttribute("type", "application/ld+json");
            document.head.appendChild(artScript);
        }
        artScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Демонтаж на высоте (промальп)",
            "description": "Безопасный разбор и снос конструкций на высоте силами промышленных альпинистов. Работаем там, где нельзя использовать спецтехнику из-за плотной застройки или риска повреждения оборудования.",
            "url": "https://mspro-ltd.ru/services/demolition",
            "image": "https://mspro-ltd.ru/site-industrial-theme-v5.jpg",
            "author": { "@type": "Organization", "name": "MSPRO" },
            "publisher": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru", "logo": { "@type": "ImageObject", "url": "https://mspro-ltd.ru/site-industrial-theme-v5.jpg" } },
            "datePublished": "2024-01-01",
            "dateModified": new Date().toISOString().split("T")[0]
        });

        return () => {
            document.getElementById(svcId)?.remove();
            document.getElementById(faqId)?.remove();
            document.getElementById(artId)?.remove();
        };
    }, []);

    return (
        <div className="py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-demolition-h1">
                        Демонтаж на высоте (промальп)
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground" data-testid="text-demolition-intro">
                        Безопасный разбор и снос конструкций на высоте силами промышленных альпинистов.
                        Работаем там, где нельзя использовать спецтехнику из-за плотной застройки или риска повреждения оборудования.
                    </p>
                </div>

                <section className="mt-16">
                    <h2 className="text-2xl font-bold" data-testid="text-services-heading">Что демонтируем</h2>
                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        {services.map((service, index) => (
                            <Card key={index} className="hover-elevate" data-testid={`card-service-${index}`}>
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <service.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">{service.title}</CardTitle>
                                </CardHeader>
                                {service.href !== "#" && (
                                    <CardContent>
                                        <Link href={service.href}>
                                            <Button variant="ghost" size="sm" className="gap-2">
                                                Подробнее <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mt-16" id="objects">
                    <h2 className="text-2xl font-bold" data-testid="text-objects-heading">Объекты демонтажа</h2>
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {objects.map((obj, index) => (
                            <Card key={index} data-testid={`card-object-${index}`}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{obj.title}</CardTitle>
                                    <CardDescription>{obj.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mt-16 rounded-lg bg-muted/50 p-8">
                    <h2 className="text-xl font-semibold" data-testid="text-answer-block-heading">О демонтажных работах MSPRO</h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed" data-testid="text-answer-block">
                        {ANSWER_BLOCKS["demolition"]}
                    </p>
                </section>

                <section className="mt-16">
                    <h2 className="text-2xl font-bold" data-testid="text-faq-heading">Частые вопросы</h2>
                    <div className="mt-8 space-y-6">
                        {FAQ_DEFAULT.map((item, index) => (
                            <div key={index} className="border-b pb-6" data-testid={`faq-item-${index}`}>
                                <h3 className="font-semibold">{item.question}</h3>
                                <p className="mt-2 text-muted-foreground">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-16 rounded-lg border bg-card p-8 text-center">
                    <h2 className="text-xl font-semibold" data-testid="text-cta-heading">
                        Нужен демонтаж на высоте?
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Оценим сложность по фото или приедем на осмотр объекта.
                    </p>
                    <Link href="/calculator">
                        <Button className="mt-6" size="lg" data-testid="button-cta-calculator">
                            Получить расчет
                        </Button>
                    </Link>
                </section>
            </div>
        </div>
    );
}
