import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    CheckCircle2, ArrowRight, AlertTriangle, Lightbulb, Shield,
    Clock, Wrench, HardHat, Sparkles, Wind, Droplets, PaintBucket
} from "lucide-react";

const ceilingSanationFaq = [
    {
        question: "Надо ли останавливать производство?",
        answer: "Нет. Мы работаем в ночные смены, выходные дни или локально ограждаем зоны работ, накрывая оборудование защитной плёнкой. Альпинисты мобильны и не требуют установки громоздких лесов."
    },
    {
        question: "Как вы моете над работающими станками?",
        answer: "Используем технологию \"альпинистского зонта\" (сбор воды и грязи в подвесные лотки) или применяем только сухую вакуумную чистку."
    },
    {
        question: "Что делать с огромными отложениями пыли (5-10 см)?",
        answer: "Это уже не пыль, а спрессованная грязь. Решение: комбинированный метод — сначала механическая зачистка (шпатели/скребки), затем финальное обеспыливание."
    },
    {
        question: "Какие гарантии вы предоставляете?",
        answer: "На покраску органосиликатной краской — гарантия до 10 лет. На обеспыливание — акт выполненных работ с фотофиксацией до/после."
    }
];

export default function CeilingSanation() {
    useEffect(() => {
        document.title = "Обеспыливание и покраска потолков в цехах (промальп) | MSPRO";

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
            "name": "Обеспыливание и покраска потолков в производственных цехах",
            "description": "Профессиональная санация потолочных конструкций, ферм и кабельных трасс без остановки производства. Работаем на высоте от 5 до 50 метров.",
            "url": "https://mspro-ltd.ru/services/ceiling-sanation",
            "provider": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru" },
            "areaServed": { "@type": "Country", "name": "Россия" },
            "serviceType": "Санация потолков в производственных цехах"
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
            "mainEntity": ceilingSanationFaq.map(item => ({
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
            "headline": "Обеспыливание и покраска потолков в производственных цехах",
            "description": "Профессиональная санация потолочных конструкций, ферм и кабельных трасс без остановки производства. Работаем на высоте от 5 до 50 метров.",
            "url": "https://mspro-ltd.ru/services/ceiling-sanation",
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

    const painPoints = [
        {
            icon: AlertTriangle,
            title: "Пожарная безопасность",
            description: "Пылевые отложения на фермах и кабельных трассах — это \"пороховая бочка\". Искры от сварки или короткого замыкания могут вызвать объемный взрыв пыли."
        },
        {
            icon: Shield,
            title: "Штрафы надзорных органов",
            description: "Нарушение норм СанПиН и Технического регламента о требованиях пожарной безопасности влечёт серьёзные санкции."
        },
        {
            icon: Wrench,
            title: "Брак продукции",
            description: "Пыль с потолка падает на станки, свежеокрашенные детали или пищевую продукцию, приводя к браку."
        },
        {
            icon: Lightbulb,
            title: "Освещённость",
            description: "Грязный потолок поглощает до 30% света. После обеспыливания и покраски в белый цвет в цехе становится светлее без замены ламп."
        }
    ];

    const methods = [
        {
            icon: Wind,
            title: "Сухое обеспыливание",
            subtitle: "Промышленные пылесосы",
            description: "Применение: нельзя мочить оборудование, есть электропроводка, пыль не жирная.",
            detail: "Используются ранцевые пылесосы и щелевые насадки для труднодоступных мест (балки, уголки)."
        },
        {
            icon: Sparkles,
            title: "Обдув сжатым воздухом",
            subtitle: "Компрессоры",
            description: "Применение: огромные площади, возможность накрыть оборудование внизу плёнкой.",
            detail: "Самый быстрый способ сбросить \"шубы\" пыли с потолочных конструкций."
        },
        {
            icon: Droplets,
            title: "Влажная химчистка",
            subtitle: "АВД — Аппараты Высокого Давления",
            description: "Применение: жирная, масляная копоть, СОЖ, подготовка к покраске.",
            detail: "Требует сбора воды и защиты станков. Используем технологию \"альпинистского зонта\"."
        },
        {
            icon: PaintBucket,
            title: "Покраска",
            subtitle: "Безвоздушное распыление",
            description: "Технология: аппараты типа Graco/Wagner. До 1000 м² в смену.",
            detail: "Материалы: грунт-эмали \"3 в 1\" или специализированные огнезащитные составы."
        }
    ];

    const faq = ceilingSanationFaq;

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                            <HardHat className="h-4 w-4" />
                            Промышленный альпинизм
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Обеспыливание и покраска потолков в производственных цехах
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground">
                            Профессиональная санация потолочных конструкций, ферм и кабельных трасс
                            без остановки производства. Работаем на высоте от 5 до 50 метров.
                        </p>
                        <div className="mt-8 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                От 1500 ₽/м²
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Без остановки производства
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Работаем по всей России
                            </span>
                        </div>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/calculator">
                                <Button size="lg">
                                    Рассчитать стоимость
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/contacts">
                                <Button variant="outline" size="lg">
                                    Получить консультацию
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pain Points */}
            <section className="py-24 sm:py-32 bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Почему скапливание пыли на фермах опасно?
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            4 причины, почему нельзя откладывать обеспыливание
                        </p>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2">
                        {painPoints.map((item, index) => (
                            <Card key={index} className="border-destructive/20">
                                <CardHeader>
                                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                                        <item.icon className="h-6 w-6 text-destructive" />
                                    </div>
                                    <CardTitle>{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Methods */}
            <section className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Технологии очистки: от пылесоса до гидродинамики
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Выбираем метод в зависимости от типа загрязнения и условий работы
                        </p>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {methods.map((method, index) => (
                            <Card key={index} className="h-full">
                                <CardHeader>
                                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <method.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">{method.title}</CardTitle>
                                    <p className="text-sm text-primary font-medium">{method.subtitle}</p>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="text-sm text-muted-foreground">{method.description}</p>
                                    <p className="text-sm">{method.detail}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-24 sm:py-32 bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Цены на высотный клининг
                        </h2>
                    </div>
                    <div className="mx-auto mt-16 max-w-3xl">
                        <Card>
                            <CardContent className="pt-6">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="pb-4 text-left font-semibold">Услуга</th>
                                            <th className="pb-4 text-right font-semibold">Цена за м²</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr>
                                            <td className="py-4">Сухое обеспыливание (промышленные пылесосы)</td>
                                            <td className="py-4 text-right font-medium">от 1 500 ₽</td>
                                        </tr>
                                        <tr>
                                            <td className="py-4">Обдув сжатым воздухом</td>
                                            <td className="py-4 text-right font-medium">от 1 300 ₽</td>
                                        </tr>
                                        <tr>
                                            <td className="py-4">Влажная химчистка (АВД)</td>
                                            <td className="py-4 text-right font-medium">от 1 800 ₽</td>
                                        </tr>
                                        <tr>
                                            <td className="py-4">Покраска органосиликатной краской</td>
                                            <td className="py-4 text-right font-medium">от 2 000 ₽</td>
                                        </tr>
                                        <tr>
                                            <td className="py-4">Комплекс: обеспыливание + покраска</td>
                                            <td className="py-4 text-right font-medium text-primary">от 3 000 ₽</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p className="mt-6 text-sm text-muted-foreground text-center">
                                    * Точная стоимость зависит от высоты, площади, степени загрязнения и региона
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Часто задаваемые вопросы
                        </h2>
                    </div>
                    <div className="mx-auto mt-16 max-w-3xl space-y-4">
                        {faq.map((item, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{item.question}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{item.answer}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="bg-primary/5 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Закажите обеспыливание потолков
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Работаем без остановки вашего производства. Выезд специалиста для оценки — бесплатно.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/calculator">
                                <Button size="lg">
                                    Рассчитать стоимость
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/contacts">
                                <Button variant="outline" size="lg">
                                    Связаться с нами
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
