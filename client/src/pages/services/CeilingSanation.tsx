import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    CheckCircle2, ArrowRight, AlertTriangle, Lightbulb, Shield,
    Wrench, HardHat, Sparkles, Wind, Droplets, PaintBucket, Factory, FlaskConical, UtensilsCrossed, Warehouse
} from "lucide-react";

const ceilingSanationFaq = [
    {
        question: "Что такое санация потолков в производственном цехе?",
        answer: "Санация потолков — комплекс работ по очистке, обеспыливанию и восстановлению потолочных конструкций промышленного здания. Включает удаление пыли, жирных отложений и копоти; при необходимости — грунтование и покраску. Выполняется методом промышленного альпинизма без установки лесов. Цель санации — соответствие нормам СанПиН и пожарной безопасности, а также восстановление функциональных характеристик помещения: освещённости, чистоты среды и пожарной безопасности."
    },
    {
        question: "Сколько стоит обеспыливание потолков в цехе?",
        answer: "Ориентир: от 1 300 ₽/м² (сухое обеспыливание) до 3 000 ₽/м² (комплекс очистка + покраска). Факторы влияния: высота потолков (до 10 м / 10–30 м / 30–50 м), тип загрязнения, ночной режим работ (+20–30%), общая площадь объекта. При объёме от 1 000 м² ставка снижается. Точный расчёт — через онлайн-калькулятор или коммерческое предложение после осмотра."
    },
    {
        question: "Чем опасны пылевые отложения на потолке производственного здания?",
        answer: "Органическая и металлическая пыль взрывоопасна при концентрации выше КПВ. Искра от сварки или короткое замыкание может вызвать объёмный взрыв — наиболее опасный тип ЧС на производстве. Помимо взрывного риска, накопление пыли нарушает нормы СанПиН 1.2.3685-21 и ФЗ-123, что влечёт предписания Роспотребнадзора и Госпожнадзора со штрафами и административным приостановлением деятельности."
    },
    {
        question: "Можно ли выполнить обеспыливание потолков без остановки производства?",
        answer: "Да — промышленные альпинисты работают в ночные смены и выходные дни. Зона работ изолируется защитным плёночным укрытием: оборудование не страдает, производственный цикл не прерывается. В пищевых производствах время согласовывается с главным технологом — как правило, это санитарные «окна» по регламенту ХАССП. Ночной режим: надбавка +20–30% к базовой ставке."
    },
    {
        question: "В чём разница между сухим и влажным обеспыливанием потолков?",
        answer: "Сухое обеспыливание (пылесосы / обдув сжатым воздухом) — применяется там, где нельзя мочить оборудование: открытая электропроводка, прецизионные станки, лёгкая сухая пыль. Влажное (АВД) — для жирных масляных отложений, копоти и СОЖ; требует укрытия станков и сбора воды через альпинистский зонт. Комбинация методов определяется по результатам предварительного осмотра объекта."
    },
    {
        question: "Нужна ли лицензия для обеспыливания потолков на высоте?",
        answer: "Высотные работы регулируются СНиП 12-03-2001 и ГОСТ Р ИСО 22846 — для их выполнения требуются допуски 5-го разряда промышленного альпиниста, ППР и наряд-допуск. При совмещении с огнезащитными работами — дополнительно лицензия МЧС. MSPRO имеет допуск СРО №1623, лицензию МЧС и все необходимые квалификационные документы для высотных работ на промышленных объектах."
    },
    {
        question: "Какие документы выдают по итогам санации потолков?",
        answer: "По итогам работ заказчик получает: акт выполненных работ, фотофиксацию до/после по каждой зоне, накладные на использованные материалы с сертификатами качества (при покраске — паспорта на ЛКМ), журнал нарядов-допусков на высотные работы. Состав документации определяется условиями договора и требованиями заказчика."
    },
    {
        question: "Через сколько времени снова нужно обеспыливать цех?",
        answer: "Периодичность зависит от типа производства. В машиностроении и деревообработке — раз в 6–12 месяцев. В пищевых производствах — по регламенту ХАССП, как правило ежеквартально. При наличии органосиликатного покрытия (ОС-51-03) — повторная покраска раз в 7–10 лет. Уточнить периодичность для конкретного объекта можно в техническом задании, подготовленном по итогам обследования."
    }
];

export default function CeilingSanation() {
    useEffect(() => {
        const titleText = "Обеспыливание потолков в цехах — промальп | MSPRO";
        const descText = "Обеспыливание и покраска потолков в производственных цехах промышленными альпинистами. Высота 5–50 м, без остановки производства. Звоните: +7 (987) 909-29-38.";
        const pageUrl = "https://mspro-ltd.ru/services/ceiling-sanation";

        document.title = titleText;

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", descText);
        }

        const upsertMeta = (selector: string, attr: string, attrValue: string, content: string) => {
            let el = document.querySelector(selector);
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute(attr, attrValue);
                document.head.appendChild(el);
            }
            el.setAttribute("content", content);
        };
        upsertMeta('meta[property="og:title"]', "property", "og:title", titleText);
        upsertMeta('meta[property="og:description"]', "property", "og:description", descText);
        upsertMeta('meta[property="og:url"]', "property", "og:url", pageUrl);
        upsertMeta('meta[property="og:type"]', "property", "og:type", "article");

        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
        }
        canonical.setAttribute("href", pageUrl);

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
            "description": "Обеспыливание и покраска потолков в производственных цехах промышленными альпинистами. Высота 5–50 м, без остановки производства.",
            "url": "https://mspro-ltd.ru/services/ceiling-sanation",
            "provider": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru" },
            "areaServed": { "@type": "Country", "name": "Россия" },
            "serviceType": "Санация потолков в производственных цехах",
            "offers": { "@type": "Offer", "priceCurrency": "RUB", "price": "1300", "priceSpecification": { "@type": "UnitPriceSpecification", "price": "1300", "priceCurrency": "RUB", "unitText": "м²" } }
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
            "description": "Обеспыливание и покраска потолков в производственных цехах промышленными альпинистами. Высота 5–50 м, без остановки производства.",
            "url": "https://mspro-ltd.ru/services/ceiling-sanation",
            "image": "https://mspro-ltd.ru/site-industrial-theme-v5.jpg",
            "author": { "@type": "Organization", "name": "MSPRO" },
            "publisher": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru", "logo": { "@type": "ImageObject", "url": "https://mspro-ltd.ru/assets/logo-live.jpg" } },
            "datePublished": "2026-01-09",
            "dateModified": new Date().toISOString().split("T")[0]
        });

        return () => {
            document.getElementById(svcId)?.remove();
            document.getElementById(faqId)?.remove();
            document.getElementById(artId)?.remove();
        };
    }, []);

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
                            MSPRO выполняет санацию потолков промышленных предприятий методом промышленного альпинизма —
                            обеспыливание потолков промышленным альпинизмом, влажная химчистка и покраска на высоте 5–50 м
                            без лесов и автовышки. Работаем в действующих производственных цехах машиностроительных,
                            химических и пищевых предприятий, на складах и в логистических терминалах. Главное требование
                            заказчиков: обеспыливание производственного помещения без остановки производства — промышленные
                            альпинисты закрывают эту задачу в ночные смены и выходные дни без нарушения производственного цикла.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                от 1 300 ₽/м²
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Без остановки производства
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                Высота 5–50 м
                            </span>
                        </div>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/contacts">
                                <Button size="lg">
                                    Получить расчёт стоимости
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/calculator">
                                <Button variant="outline" size="lg">
                                    Калькулятор стоимости
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Почему нельзя откладывать */}
            <section className="py-24 sm:py-32 bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Почему нельзя откладывать обеспыливание потолков в цеху
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Пылевые отложения на потолочных фермах и балках — нормируемый фактор риска,
                            контролируемый Роспотребнадзором (СанПиН 1.2.3685-21) и Госпожнадзором (ФЗ-123, СП 4.13130)
                        </p>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2">
                        <Card className="border-destructive/20">
                            <CardHeader>
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                                    <AlertTriangle className="h-6 w-6 text-destructive" />
                                </div>
                                <CardTitle>Взрывоопасная пыль — риск объёмного взрыва</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Угольная, деревянная, металлическая и мучная пыль становятся взрывоопасными при достижении КПВ.
                                    Для металлической пыли — от 15 г/м³, для деревянной — от 12 г/м³. Пыль, накопившаяся
                                    на перекрытиях, при одном толчке поднимается в воздух и воспламеняется от сварочной искры
                                    или короткого замыкания.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-destructive/20">
                            <CardHeader>
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                                    <Shield className="h-6 w-6 text-destructive" />
                                </div>
                                <CardTitle>Предписания и штрафы надзорных органов</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Роспотребнадзор проверяет по СанПиН 1.2.3685-21 — нарушение влечёт предписание
                                    вплоть до административного приостановления деятельности на 90 суток
                                    (для юридических лиц — штраф до 200 000 ₽). Предписание с коротким сроком исполнения —
                                    самая частая причина экстренных заказов на обеспыливание.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-destructive/20">
                            <CardHeader>
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                                    <Wrench className="h-6 w-6 text-destructive" />
                                </div>
                                <CardTitle>Брак продукции и загрязнение оборудования</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Пыль с потолочных конструкций постепенно оседает вниз: на прецизионные узлы станков —
                                    это абразив, сокращающий ресурс; на свежеокрашенные поверхности — брак, требующий
                                    перекраски; на продукты питания или фармацевтическое сырьё — загрязнение с прямыми
                                    финансовыми последствиями.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-destructive/20">
                            <CardHeader>
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                                    <Lightbulb className="h-6 w-6 text-destructive" />
                                </div>
                                <CardTitle>Снижение освещённости и видимости</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Запылённый серый потолок поглощает 20–30% светового потока по сравнению с чистой
                                    белой поверхностью. После санации и покраски в светлый цвет освещённость рабочих мест
                                    возрастает без замены светильников.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Методы обеспыливания */}
            <section className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Методы обеспыливания и санации потолков на высоте
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Метод выбирается после обследования объекта. Нередко применяется комбинация двух методов в рамках одного выезда
                        </p>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="h-full">
                            <CardHeader>
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Wind className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg">Сухое обеспыливание</CardTitle>
                                <p className="text-sm text-primary font-medium">Промышленные пылесосы с HEPA-фильтрами</p>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Применяется там, где нельзя допустить намокания: открытая электропроводка, прецизионное оборудование,
                                    лёгкая сухая пыль.
                                </p>
                                <p className="text-sm">
                                    Альпинисты работают с ранцевыми пылесосами классов L и M — щелевые насадки достают до внутренних полок
                                    балок и уголков ферм.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="h-full">
                            <CardHeader>
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Sparkles className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg">Обдув сжатым воздухом</CardTitle>
                                <p className="text-sm text-primary font-medium">Компрессоры 8–10 бар</p>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Самый быстрый метод сброса «шубы» пыли с потолочных конструкций на больших площадях.
                                    Перед началом оборудование накрывается защитной плёнкой.
                                </p>
                                <p className="text-sm">
                                    Применяется в производственных цехах с устойчивым оборудованием, а также как предварительный этап
                                    перед влажной чисткой.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="h-full">
                            <CardHeader>
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Droplets className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg">Влажная химчистка АВД</CardTitle>
                                <p className="text-sm text-primary font-medium">Аппараты высокого давления</p>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Для жирных масляных отложений, копоти и загрязнений СОЖ. Альпинисты работают с АВД, используя
                                    технику «альпинистского зонта»: подвесные лотки собирают воду, не давая ей попасть на оборудование.
                                </p>
                                <p className="text-sm">Стандартная подготовка поверхности перед покраской.</p>
                            </CardContent>
                        </Card>
                        <Card className="h-full">
                            <CardHeader>
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <PaintBucket className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg">Покраска безвоздушным распылением</CardTitle>
                                <p className="text-sm text-primary font-medium">Graco / Wagner, до 1 000 м² за смену</p>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Стандартные материалы: органосиликатная краска ОС-51-03 (стойкость к температурам, влаге, химии),
                                    грунт-эмаль «3 в 1».
                                </p>
                                <p className="text-sm">
                                    При совмещении с противопожарными работами применяем{" "}
                                    <Link href="/services/fireproofing-at-height" className="text-primary underline-offset-4 hover:underline">
                                        огнезащитные составы для металлоконструкций
                                    </Link>{" "}
                                    — одна мобилизация, комплексный результат.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Когда промальп выгоднее лесов */}
            <section className="py-24 sm:py-32 bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Когда промальп для клининга цехов выгоднее лесов и крана
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Высотный клининг цехов методом{" "}
                            <Link href="/services/rope-access" className="text-primary underline-offset-4 hover:underline">
                                промышленного альпинизма
                            </Link>{" "}
                            имеет преимущества в пяти типовых ситуациях
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-3xl space-y-4">
                        {[
                            {
                                title: "Высота 5–50 м",
                                text: "Автовышка упирается в перекрытие или не вписывается в проходы между оборудованием. Кран не помещается в пролёт. Промышленный альпинизм — единственный вариант без перестановки станков и демонтажа оборудования."
                            },
                            {
                                title: "Действующее производство",
                                text: "Леса блокируют технологические проходы и линии на весь период монтажа/демонтажа. Промальп работает в согласованных «окнах» — ночные смены, выходные. Зона работ изолирована локально, остальной цех работает в штатном режиме."
                            },
                            {
                                title: "Разовые работы на отдельных участках",
                                text: "Монтаж лесов экономически оправдан при длительных работах на фиксированном участке. Для уборки нескольких пролётов — нецелесообразно: стоимость лесов перекрывает стоимость самих работ."
                            },
                            {
                                title: "Сложная геометрия конструкций",
                                text: "Фермы, стропильные конструкции, трёхпоясные перекрытия, балки разной высоты — альпинист добирается до любой точки с одной навески, меняя позицию за минуты."
                            },
                            {
                                title: "Жёсткие сроки и ограниченный бюджет",
                                text: "Мобилизация бригады промальпа — 1–2 дня. Монтаж лесов — 1–2 недели. Простой производства на время монтажа не нужен."
                            }
                        ].map((item, i) => (
                            <Card key={i}>
                                <CardContent className="pt-6">
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="mt-1 text-muted-foreground">{item.text}</p>
                                </CardContent>
                            </Card>
                        ))}
                        <div className="pt-4 text-center">
                            <p className="text-muted-foreground">Остались вопросы? Звоните: +7 (987) 909-29-38</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Этапы санации */}
            <section className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Этапы санации потолков на промышленном предприятии
                        </h2>
                    </div>
                    <div className="mx-auto mt-16 max-w-3xl space-y-6">
                        {[
                            {
                                step: 1,
                                title: "Обследование объекта",
                                text: "Определение типа и площади загрязнений, высоты потолков, условий доступа, режима работы производства. Фиксируем наличие открытой электропроводки, тип пыли (взрывопожароопасная / инертная), состояние конструкций. Результат — техническое задание и коммерческое предложение с разбивкой по методам."
                            },
                            {
                                step: 2,
                                title: "Разработка ППР и согласование графика",
                                text: "Оформление наряда-допуска на высотные работы, схемы зон оцепления, согласование «ночных окон» с диспетчером или главным механиком производства. Координация с пожарной службой предприятия при работе в зонах с взрывопожароопасной пылью."
                            },
                            {
                                step: 3,
                                title: "Защита оборудования",
                                text: "Укрытие станков, конвейерных лент, электрощитов и открытой проводки защитной полиэтиленовой плёнкой. Организация сбора загрязнений — лотки, поддоны, промышленный пылесос внизу. Зона работ отгораживается сигнальной лентой."
                            },
                            {
                                step: 4,
                                title: "Обеспыливание и чистка",
                                text: "Применение метода согласно ТЗ — сухое, обдув или АВД. Работы ведутся поэтапно по зонам без пересечения с производственным персоналом. При обнаружении повреждений конструкций — немедленное уведомление заказчика."
                            },
                            {
                                step: 5,
                                title: "Покраска и сдача (если в ТЗ)",
                                text: "Нанесение ЛКМ безвоздушным распылением после контроля сухости поверхности. Приёмка: акт выполненных работ с фотофиксацией до/после по каждой зоне, накладные на материалы с сертификатами, журнал нарядов-допусков."
                            }
                        ].map((item) => (
                            <div key={item.step} className="flex gap-6">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                    {item.step}
                                </div>
                                <div>
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="mt-1 text-muted-foreground">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Объекты */}
            <section className="py-24 sm:py-32 bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Объекты: на каких производствах работаем
                        </h2>
                    </div>
                    <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Factory className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Машиностроительные и металлообрабатывающие заводы</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Металлическая пыль в сочетании с парами СОЖ на потолочных балках — типичный сценарий.
                                    КПВ металлической пыли достигается при 15 г/м³. Чистка потолочных ферм на высоте
                                    координируется с крановщиком. При комплексных выездах совмещаем клининг с{" "}
                                    <Link href="/services/anticorrosion-at-height" className="text-primary underline-offset-4 hover:underline">
                                        антикоррозионной защитой металлических балок и ферм
                                    </Link>{" "}
                                    — одна мобилизация, две задачи.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <FlaskConical className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Химические и нефтехимические производства</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Агрессивные пары и конденсат на потолке, плюс требования к взрывозащите инструмента (Ex-исполнение)
                                    по классификации помещений ПУЭ. Работы согласовываются с технологическим регламентом
                                    и главным технологом предприятия. Применяем инструмент в Ex-исполнении в зонах класса 1 и 2.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <UtensilsCrossed className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Пищевые производства и склады</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Требования ХАССП обязывают к регулярной санации производственных помещений, включая потолки
                                    и скрытые конструкции. Все применяемые ЛКМ соответствуют санитарным нормам для пищевых производств.
                                    Периодичность — по регламенту ХАССП: как правило, ежеквартально.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Warehouse className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Склады, логистические терминалы и ангары</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Высота перекрытий 12–30 м, площади от 5 000 м² — установка лесов физически и экономически
                                    нецелесообразна. Стандартный сценарий: предварительный обдув всего объёма + покраска в светлый цвет
                                    для увеличения светоотражения. Ночная работа без остановки складских операций.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Стоимость обеспыливания и покраски потолков в цехе
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">Ценовые ориентиры (без учёта НДС)</p>
                    </div>
                    <div className="mx-auto mt-16 max-w-3xl">
                        <Card>
                            <CardContent className="pt-6">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="pb-4 text-left font-semibold">Вид работ</th>
                                            <th className="pb-4 text-right font-semibold">Стоимость</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr>
                                            <td className="py-4">Сухое обеспыливание</td>
                                            <td className="py-4 text-right font-medium">от 1 300 ₽/м²</td>
                                        </tr>
                                        <tr>
                                            <td className="py-4">Влажная химчистка АВД</td>
                                            <td className="py-4 text-right font-medium">от 1 800 ₽/м²</td>
                                        </tr>
                                        <tr>
                                            <td className="py-4">Покраска</td>
                                            <td className="py-4 text-right font-medium">от 2 000 ₽/м²</td>
                                        </tr>
                                        <tr>
                                            <td className="py-4">Комплекс: обеспыливание + покраска</td>
                                            <td className="py-4 text-right font-medium text-primary">от 3 000 ₽/м²</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                                    <p><span className="font-medium text-foreground">Факторы, влияющие на итоговую цену:</span></p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Высота перекрытий: до 10 м — базовая ставка; 10–30 м — надбавка за сложность; 30–50 м — спецтехника навески</li>
                                        <li>Тип загрязнения: сухая лёгкая пыль — минимум; жирная копоть с СОЖ — требует АВД, трудоёмкость выше</li>
                                        <li>Режим работы: ночные смены и выходные — +20–30% к ставке бригады</li>
                                        <li>Площадь: при объёме от 1 000 м² возможно снижение ставки</li>
                                    </ul>
                                </div>
                                <p className="mt-6 text-sm text-muted-foreground text-center">
                                    Точный расчёт — через онлайн-калькулятор или по выезду инженера на объект
                                </p>
                            </CardContent>
                        </Card>
                        <div className="mt-8 text-center">
                            <Link href="/calculator">
                                <Button size="lg">
                                    Рассчитать стоимость в калькуляторе
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 sm:py-32 bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Часто задаваемые вопросы
                        </h2>
                    </div>
                    <div className="mx-auto mt-16 max-w-3xl space-y-4">
                        {ceilingSanationFaq.map((item, index) => (
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
                            Получите КП по обеспыливанию потолков
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Работаем без остановки вашего производства. Выезд специалиста для оценки — бесплатно.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link href="/contacts">
                                <Button size="lg">
                                    Связаться с нами
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/calculator">
                                <Button variant="outline" size="lg">
                                    Калькулятор стоимости
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
