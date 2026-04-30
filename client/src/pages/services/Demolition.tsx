import { useEffect } from "react";
import { AlertTriangle, Building2, CheckCircle2, Hammer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FAQ_DEMOLITION } from "@/content/copySystem";

const CONSTRUCTION_TYPES = [
    {
        icon: Building2,
        title: "Дымовые трубы",
        body: "Демонтаж металлических и железобетонных труб от 15 до 150 м высотой. Разбор сверху вниз: альпинист спускается по наружной поверхности, режет секции болгаркой или газорезкой, куски стропятся и опускаются такелажным оборудованием. ЖБ-трубы — алмазная резка по армированному поясу без взрывчатки и вибрации фундамента.",
    },
    {
        icon: Hammer,
        title: "Высотные металлоконструкции (фермы, перекрытия, балки)",
        body: "Фермы пролётом до 36 м, балки перекрытий, рамные конструкции цехов и эстакад. Газовая резка или плазма — в зависимости от толщины металла. Разбор перекрытий в действующих цехах без остановки смежных участков: работаем в ночные окна по согласованному графику.",
    },
    {
        icon: Zap,
        title: "АМС, вышки связи и мачты",
        body: "Демонтаж решётчатых и трубчатых конструкций высотой до 120 м. Поярусно: снимаем антенное оборудование, демонтируем оттяжки, затем разбираем секции мачты снизу вверх по схеме «журавль». При наличии технической зоны — укладка целых секций на землю с разбором на площадке.",
    },
    {
        icon: AlertTriangle,
        title: "Аварийные участки кровли и фасадов",
        body: "Срочный выезд в течение 4 часов в пределах региона. Фасадные элементы, нависающие козырьки, деформированные парапеты, повреждённые балки — без строительных лесов. В стеснённых условиях (внутренние дворы, охранные зоны) применяем узкий такелаж: полиспасты, коренные блоки, мягкие стропы.",
    },
];

const STAGES = [
    {
        title: "Выезд инженера, обмеры, дефектация",
        desc: "ИТР осматривает объект: фиксирует высоту, конструктив, состояние металла, доступность для такелажа, соседние коммуникации. По итогам — техническое заключение с выбором метода демонтажа.",
    },
    {
        title: "ППР, наряд-допуск, согласование",
        desc: "Разрабатываем Проект производства работ (ППР) согласно СНиП 12-03-2001 и СП 43.13330. Оформляем наряд-допуск на высотные работы. При необходимости — согласуем с владельцем ЛЭП или Ростехнадзором.",
    },
    {
        title: "Монтаж страховочных систем",
        desc: "Устанавливаем анкерные точки, перильные страховки, ограждение рабочей зоны. СОУТ выполнена, все альпинисты — 5-й разряд, сертификаты IRATA/FISAT. Страхование ответственности — включено в стоимость.",
    },
    {
        title: "Поэтапный демонтаж сверху вниз",
        desc: "Работы ведутся по схеме из ППР: секция за секцией, с фиксацией каждого элемента перед резкой. Инструмент — газорезка, болгарка, алмазный диск — выбирается по материалу. Металлолом сортируем на площадке.",
    },
    {
        title: "Спуск, такелаж, вывоз",
        desc: "Элементы опускаются стропами или полиспастом в безопасную зону приёма. Металлолом передаём на утилизацию — можем организовать выкуп через партнёра. Строительный мусор (бетон, кирпич) — вывоз контейнерами. Площадка сдаётся чистой.",
    },
];

const DOCS = [
    "Лицензия МЧС на проведение работ по огнезащите и промальпу",
    "Допуск СРО (свидетельство о членстве)",
    "ППР под каждый объект",
    "Наряд-допуск на высотные работы",
    "СОУТ рабочих мест",
    "Страховой полис ответственности",
];

export default function Demolition() {
    useEffect(() => {
        document.title = "Демонтаж металлоконструкций на высоте 2026 — MS-PRO";

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
            "name": "Демонтаж на высоте промышленными альпинистами",
            "description": "Демонтаж дымовых труб, ферм, АМС промышленными альпинистами. Без крана, без остановки производства. Лицензия МЧС, допуск СРО. Расчёт за 1 час: +7 (987) 909-29-38.",
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
            "mainEntity": FAQ_DEMOLITION.map(item => ({
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
            "headline": "Демонтаж на высоте промышленными альпинистами",
            "description": "Демонтаж дымовых труб, ферм, АМС промышленными альпинистами. Без крана, без остановки производства. Лицензия МЧС, допуск СРО.",
            "url": "https://mspro-ltd.ru/services/demolition",
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
        <div className="py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">

                {/* Hero */}
                <div className="mx-auto max-w-3xl">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-demolition-h1">
                        Демонтаж на высоте промышленными альпинистами
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground" data-testid="text-demolition-intro">
                        Мы выполняем демонтаж на высоте там, где кран не проходит, автовышка не дотягивается,
                        а остановка производства обойдётся дороже самих работ. Промышленные альпинисты MSPRO
                        разбирают дымовые трубы, металлоконструкции, АМС и аварийные участки кровли — поэтапно,
                        без лесов и тяжёлой техники, с оформлением ППР под каждый объект.
                    </p>
                    <p className="mt-4 font-medium">
                        Звоните:{" "}
                        <a href="tel:+79879092938" className="text-primary hover:underline">
                            +7 (987) 909-29-38
                        </a>{" "}
                        — расчёт за 1 час.
                    </p>
                </div>

                {/* H2: Какие конструкции демонтируем */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold" data-testid="text-services-heading">Какие конструкции демонтируем</h2>
                    <p className="mt-4 text-muted-foreground">
                        Работаем с металлом, железобетоном, кирпичом и комбинированными конструкциями на высоте от 10 до 150 м.
                        Демонтаж промальп — ручной разбор с беседки или верёвочной системы, без ударной техники
                        и без риска для несущих конструкций рядом.
                    </p>
                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        {CONSTRUCTION_TYPES.map((item, index) => (
                            <div key={index} className="rounded-lg border p-6" data-testid={`card-service-${index}`}>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                                    <item.icon className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* H2: Когда промальп выгоднее крана */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold">Когда промальп выгоднее крана и спецтехники</h2>
                    <p className="mt-4 text-muted-foreground">
                        Промышленный альпинизм для демонтажа — экономически обоснованное решение в пяти типичных ситуациях:
                    </p>
                    <ol className="mt-6 space-y-4">
                        {[
                            {
                                title: "Плотная городская застройка",
                                desc: "нет места для аутригеров автокрана, дорога перекрыта. Промальп работает вертикально, без захвата горизонтальной площадки.",
                            },
                            {
                                title: "Действующее производство",
                                desc: "цех останавливать нельзя. Альпинисты работают локально в ограждённой зоне, не затрагивая соседние участки и не требуя эвакуации персонала.",
                            },
                            {
                                title: "Объект внутри здания",
                                desc: "вентшахты, техподполья, внутренние конструкции, куда кран-стрела физически не заходит. Беседка и верёвочная система — единственный вариант.",
                            },
                            {
                                title: "Высота 30+ м при ограниченном радиусе крана",
                                desc: "при больших вылетах стрелы кран резко теряет грузоподъёмность. Промальп снимает этот предел: разбиваем конструкцию на фрагменты нужного веса.",
                            },
                            {
                                title: "Охранная зона ЛЭП",
                                desc: "кран запрещён по ПУЭ. Промальп не использует металлические стрелы под напряжением. Работаем с согласованием ФСК/МРСК при необходимости.",
                            },
                        ].map((item, i) => (
                            <li key={i} className="flex gap-4">
                                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                    {i + 1}
                                </span>
                                <p className="text-muted-foreground">
                                    <strong className="text-foreground">{item.title}</strong> — {item.desc}
                                </p>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* H2: Как мы работаем */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold">Как мы работаем — этапы</h2>
                    <div className="mt-8 space-y-4">
                        {STAGES.map((stage, i) => (
                            <div key={i} className="flex gap-4 rounded-lg border p-6">
                                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                    {i + 1}
                                </span>
                                <div>
                                    <h3 className="font-semibold">{stage.title}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">{stage.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-muted-foreground">
                        После демонтажа оставшиеся металлоконструкции нередко требуют антикоррозионной защиты —{" "}
                        <Link href="/services/anticorrosion-at-height" className="text-primary hover:underline">
                            АКЗ на высоте
                        </Link>{" "}
                        выполняем той же бригадой без повторной мобилизации.
                    </p>
                </section>

                {/* H2: Безопасность и допуски */}
                <section className="mt-16 rounded-lg bg-muted/50 p-8">
                    <h2 className="text-2xl font-bold mb-4">Безопасность и допуски</h2>
                    <p className="text-muted-foreground mb-6">
                        Все высотные работы MSPRO соответствуют требованиям СНиП 12-03-2001,
                        СП 43.13330.2012 и ПБ 10-382-00 для грузоподъёмных операций при такелаже.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {DOCS.map((doc, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                                <span className="text-sm">{doc}</span>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-sm text-muted-foreground">
                        Альпинисты — <strong>5-й разряд</strong>, подтверждённый квалификационными удостоверениями.
                        Ежегодная аттестация по охране труда, медосмотр. Оборудование — сертифицированное (EN 363, ГОСТ Р 58695).
                    </p>
                </section>

                {/* H2: Стоимость */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold">Стоимость демонтажа на высоте</h2>
                    <p className="mt-4 text-lg font-medium">
                        Базовая ставка — <strong>от 2 000 ₽/м²</strong> (металлоконструкции, типовые условия).
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <li>• <strong className="text-foreground">Высота</strong> — каждые 10 м сверх 30 м добавляют 10–15% к стоимости</li>
                        <li>• <strong className="text-foreground">Тип материала</strong> — металл дешевле ЖБ, ЖБ с армированием — дороже</li>
                        <li>• <strong className="text-foreground">Доступность</strong> — стеснённые условия, охранные зоны — наценка 20–30%</li>
                        <li>• <strong className="text-foreground">Метод резки</strong> — газорезка дешевле алмазной; плазма — средняя цена</li>
                        <li>• <strong className="text-foreground">Утилизация</strong> — вывоз и утилизация включается в смету или оплачивается отдельно</li>
                        <li>• <strong className="text-foreground">Регион</strong> — базовый коэффициент от 0,8 (малые города) до 2,0 (Москва, Сахалин)</li>
                    </ul>
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <Link href="/calculator">
                            <Button size="lg" data-testid="button-cta-calculator">
                                Рассчитать в калькуляторе
                            </Button>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Точную смету выдаём после выезда инженера — бесплатно для объектов от 200 м².
                        </p>
                    </div>
                </section>

                {/* H2: FAQ */}
                <section className="mt-16">
                    <h2 className="text-2xl font-bold" data-testid="text-faq-heading">Частые вопросы о демонтаже на высоте</h2>
                    <div className="mt-8 space-y-6">
                        {FAQ_DEMOLITION.map((item, index) => (
                            <div key={index} className="border-b pb-6" data-testid={`faq-item-${index}`}>
                                <h3 className="font-semibold">{item.question}</h3>
                                <p className="mt-2 text-muted-foreground">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="mt-16 rounded-lg border bg-card p-8 text-center">
                    <h2 className="text-xl font-semibold" data-testid="text-cta-heading">
                        Получить расчёт
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Опишите объект — вышлем смету за 1 час. Выезд инженера для объектов от 200 м² — бесплатно.
                    </p>
                    <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Link href="/contacts">
                            <Button size="lg" data-testid="button-cta-contacts">
                                Связаться с нами
                            </Button>
                        </Link>
                        <Link href="/calculator">
                            <Button variant="outline" size="lg" data-testid="button-cta-calc">
                                Калькулятор стоимости
                            </Button>
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
}
