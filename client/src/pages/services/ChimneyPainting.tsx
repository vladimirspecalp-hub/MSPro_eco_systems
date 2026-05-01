import { useEffect } from "react";
import { Paintbrush, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { CREDENTIALS } from "@/content/copySystem";

const coatingSystems = [
  {
    title: "Эмаль ГФ-021 + ПФ-115 (до 120 °С)",
    description: "Алкидные эмали для газовых котельных с умеренным нагревом трубы. Оптимальный выбор по цене. Ориентир материала: 250 ₽/м².",
  },
  {
    title: "Кремнийорганика КО-8101 (до 400 °С)",
    description: "Наиболее востребованная система в России для промышленных труб, ТЭЦ, цементных заводов. Широкий температурный диапазон и стойкость к атмосфере. Ориентир материала: 450 ₽/м².",
  },
  {
    title: "Импортное высокотемпературное покрытие (до 700 °С)",
    description: "Для доменных печей и агрессивной кислотной среды. Держит до 700 °С, устойчиво к кислотным конденсатам. Ориентир материала: от 900 ₽/м².",
  },
];

const steps = [
  {
    step: 1,
    title: "Обследование объекта",
    description: "Выезд инженера: осмотр, замер диаметра и высоты, оценка состояния поверхности, определение температурного режима уходящих газов. По результатам — техническое предложение с системой покрытий.",
  },
  {
    step: 2,
    title: "ППР и наряд-допуск",
    description: "Проект производства работ по ГОСТ Р ИСО 22846 и СНиП 12-03-2001. Наряд-допуск согласовывается с заказчиком и при необходимости с теплоснабжающей организацией. Разметка рабочей зоны.",
  },
  {
    step: 3,
    title: "Очистка поверхности",
    description: "Механическая или дробеструйная очистка до степени Sa 2.5 по ISO 8501. На кирпиче и ЖБ — пескоструй или АВД ≥ 500 бар. Обезжиривание перед грунтованием.",
  },
  {
    step: 4,
    title: "Нанесение грунта",
    description: "Ингибирующий или фосфатирующий грунт под основную систему покрытий. Для КО-8101 — кремнийорганический грунт. DFT (толщина сухого слоя) контролируется толщиномером.",
  },
  {
    step: 5,
    title: "Нанесение финишного покрытия",
    description: "1–2 слоя основного состава с соблюдением межслойной сушки. Нанесение кистью, валиком или безвоздушным распылением в зависимости от геометрии. Итоговый DFT фиксируется в протоколе.",
  },
  {
    step: 6,
    title: "Приёмка и документация",
    description: "Акт выполненных работ, фотоотчёт «до и после», исполнительная документация, паспорт покрытия. Документы передаются заказчику для архива и страхового случая.",
  },
];

const pipeTypes = [
  {
    title: "Покраска металлических дымовых труб",
    body: "Металлические трубы работают при температуре поверхности 80–400 °С и выше. Покраска трубы котельной на газовом топливе (нагрев до 120 °С) — самый распространённый случай: применяются алкидные эмали ГФ-021 + ПФ-115. Для промышленных котлов, ТЭЦ и цементных заводов — кремнийорганическая краска для дымовых труб марки КО-8101 (рабочий диапазон до 400 °С). Срок службы окраски металлической дымовой трубы: 5–8 лет без термостойкой защиты; 10–12 лет с кремнийорганикой.",
  },
  {
    title: "Покраска железобетонных дымовых труб",
    body: "Бетон стареет по двум механизмам: карбонизация (снижение pH → ржавение арматуры) и хлоридная коррозия (трещины → попадание влаги). Применяем паропроницаемые акриловые и эпокси-акрилатные системы — они дышат, не дают влаге скапливаться внутри конструкции. Перед нанесением покрытия трещины шире 0,2 мм заполняем ремонтным составом. Срок службы покрытия: 8–12 лет.",
  },
  {
    title: "Покраска кирпичных дымовых труб",
    body: "Кирпичная кладка страдает от высолов и биологического поражения. Применяем кремнийорганические составы и силикатные краски: они паропроницаемы и устойчивы к ультрафиолету. Схема: грунт-пенетрант → финишный слой. После нанесения кладка защищена от солевой деструкции на 7–10 лет.",
  },
];

const faq = [
  {
    question: "Какую краску используют для покраски дымовых труб?",
    answer: "Выбор зависит от температуры поверхности трубы. При нагреве до 120 °С применяют алкидные эмали (ГФ-021, ПФ-115) — дёшево, доступно, подходит для газовых котельных. До 400 °С — кремнийорганическая эмаль КО-8101: универсальный выбор для большинства промышленных объектов. При температурах выше 400 °С — импортные высокотемпературные покрытия с рабочим диапазоном до 700 °С. Ошибка в выборе системы — главная причина раннего отслоения покрытия.",
  },
  {
    question: "Сколько стоит покраска дымовой трубы?",
    answer: "Ориентировочный диапазон: от 750 до 1 400+ ₽/м² в зависимости от системы покрытия (работа + материал). Площадь рассчитывается по формуле: π × диаметр × высота. Труба диаметром 1 м, высота 30 м — около 94 м², покраска кремнийорганикой ≈ 89 000 ₽ «под ключ». Точный расчёт — через онлайн-калькулятор или после осмотра объекта инженером.",
  },
  {
    question: "Как покрасить дымовую трубу без лесов?",
    answer: "Методом промышленного альпинизма (канатного доступа, SRT): альпинисты крепятся к верхней части трубы и поэтапно спускаются, нанося покрытие секциями по 3–5 м. Метод безопасен, не требует остановки производства и применим на высотах от 15 до 150 м и выше. Бригада из 2–3 человек обрабатывает 60–100 м² трубы за рабочий день.",
  },
  {
    question: "Нужно ли останавливать котельную для покраски трубы?",
    answer: "Как правило — нет. Покраска выполняется снаружи трубы, в то время как котельная продолжает работать. Основное условие: температура наружной поверхности трубы в момент нанесения не должна превышать допустимую для выбранной системы (обычно +40–50 °С). Если труба горячее — работы планируются на технологические паузы. Наряд-допуск согласовывается с теплоснабжающей организацией.",
  },
  {
    question: "Как часто нужно красить дымовую трубу?",
    answer: "Периодичность зависит от материала и системы защиты. Металлические трубы без специального покрытия — раз в 3–5 лет. С кремнийорганикой КО-8101 — раз в 10–12 лет при нормальной агрессивности среды. ЖБ и кирпичные трубы с паропроницаемым покрытием — раз в 8–12 лет. Реальный срок зависит от агрессивности дымовых газов и климатического района объекта.",
  },
  {
    question: "Можно ли красить железобетонную дымовую трубу?",
    answer: "Да. Для железобетонных труб используют паропроницаемые покрытия на акриловой или эпокси-акрилатной основе. Перед нанесением обязательна подготовка: трещины шире 0,2 мм ремонтируются инъекционным составом, поверхность обрабатывается гидрофобизирующим грунтом. Паропроницаемость критична: плёнкообразующее покрытие «запечатает» влагу внутри ЖБ → ускорит коррозию арматуры. Срок службы правильно выполненного покрытия — 8–12 лет.",
  },
  {
    question: "Какие документы выдаёт подрядчик после покраски трубы?",
    answer: "Акт выполненных работ с указанием объёма (м²) и применённых материалов, фотоотчёт «до/в процессе/после» с привязкой к геометрии объекта, исполнительная документация (схема покрытия, протоколы DFT), паспорт покрытия с указанием системы, партии и даты нанесения. Эти документы необходимы для приёмки, подтверждения гарантии и страхового случая.",
  },
];

export default function ChimneyPainting() {
  useEffect(() => {
    document.title = "Покраска дымовых труб промышленным альпинизмом | MSPRO";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Покраска дымовых труб: металл, ЖБ, кирпич. Без лесов, при работающей котельной. Кремнийорганика КО-8101, от 750 ₽/м². Звоните: +7 (987) 909-29-38."
      );
    }

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
      "name": "Покраска дымовых труб промышленным альпинизмом",
      "description": "Покраска дымовых труб: металл, ЖБ, кирпич. Без лесов, при работающей котельной. Кремнийорганика КО-8101, от 750 ₽/м².",
      "url": "https://mspro-ltd.ru/services/chimney-painting",
      "provider": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru" },
      "areaServed": { "@type": "Country", "name": "Россия" },
      "serviceType": "Покраска дымовых труб",
      "offers": { "@type": "Offer", "priceCurrency": "RUB", "price": "750", "priceSpecification": { "@type": "UnitPriceSpecification", "price": "750", "priceCurrency": "RUB", "unitText": "м²" } }
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
      "mainEntity": faq.map(item => ({
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
      "headline": "Покраска дымовых труб промышленным альпинизмом",
      "description": "Покраска дымовых труб: металл, ЖБ, кирпич. Без лесов, при работающей котельной. Кремнийорганика КО-8101, от 750 ₽/м².",
      "url": "https://mspro-ltd.ru/services/chimney-painting",
      "image": "https://mspro-ltd.ru/site-industrial-theme-v5.jpg",
      "author": { "@type": "Organization", "name": "MSPRO" },
      "publisher": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru", "logo": { "@type": "ImageObject", "url": "https://mspro-ltd.ru/assets/logo-live.jpg" } },
      "datePublished": "2026-05-01",
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 dark:bg-orange-900/30 px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400">
            <Paintbrush className="h-4 w-4" />
            СРО (стройка) член №{CREDENTIALS.sroConstruction.memberNumber}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-chimney-h1">
            Покраска дымовых труб промышленным альпинизмом
          </h1>
          <p className="mt-6 text-lg text-muted-foreground" data-testid="text-chimney-intro">
            Покраска дымовых труб — защитное покрытие наружной поверхности трубы, которое останавливает коррозию
            металла, карбонизацию бетона и выветривание кирпичной кладки. Без регулярной окраски дымовых труб
            срок службы промышленной трубы сокращается в 2–3 раза. Мы выполняем покраску дымовых труб
            промышленным альпинизмом на высоте 20–150 м — без лесов, без крана и без остановки котельной.
            Используем кремнийорганические эмали (КО-8101), высокотемпературные покрытия и материалы под разные
            типы конструкций.
          </p>
        </div>

        {/* Типы труб */}
        <section className="mt-16" id="pipe-types">
          <h2 className="text-2xl font-bold" data-testid="text-pipetypes-heading">
            Типы труб и системы покрытий
          </h2>
          <p className="mt-4 text-muted-foreground">
            Правильный выбор системы покрытия зависит от материала стенки трубы и температуры уходящих газов.
            Ошибка в выборе материала — и покрытие отслоится через 1–2 сезона.
          </p>
          <div className="mt-8 space-y-8">
            {pipeTypes.map((pt, index) => (
              <div key={index} data-testid={`pipetype-item-${index}`}>
                <h3 className="text-lg font-semibold">{pt.title}</h3>
                <p className="mt-2 text-muted-foreground">{pt.body}</p>
                {index === 0 && (
                  <p className="mt-2 text-muted-foreground">
                    <Link href="/services/anticorrosion-at-height" className="text-primary underline underline-offset-2">
                      Антикоррозионная защита металлоконструкций на высоте
                    </Link>{" "}
                    — комплексная защита металлических конструкций, включая дымовые трубы.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Почему промальп */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-whyalpinism-heading">
            Почему нужен промышленный альпинизм при покраске труб
          </h2>
          <p className="mt-4 text-muted-foreground">
            Окраска металлической дымовой трубы на высоте 30–150 м методом промышленного альпинизма — стандартная
            практика в России и Европе. Промышленный альпинизм покраска труб на высоте — экономия 40–60%
            по сравнению с лесами на средних и высоких трубах.
          </p>
          <ol className="mt-6 space-y-4">
            <li className="flex gap-4" data-testid="why-item-0">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">1</span>
              <div>
                <span className="font-semibold">Высота 30–150 м — леса нерентабельны.</span>{" "}
                <span className="text-muted-foreground">Строительство лесов на трубу высотой 80 м занимает 3–4 недели и стоит дороже самой покраски. Промышленные альпинисты разворачивают работы за 1 день.</span>
              </div>
            </li>
            <li className="flex gap-4" data-testid="why-item-1">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">2</span>
              <div>
                <span className="font-semibold">Труба в охранной зоне ЛЭП — кран запрещён.</span>{" "}
                <span className="text-muted-foreground">Нормативы запрещают работу грузоподъёмных механизмов в охранной зоне ЛЭП. Покраска труб без лесов методом промальпа — единственный допустимый вариант.</span>
              </div>
            </li>
            <li className="flex gap-4" data-testid="why-item-2">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">3</span>
              <div>
                <span className="font-semibold">Котельная работает — остановка невозможна.</span>{" "}
                <span className="text-muted-foreground">Покраска выполняется снаружи трубы в ограждённой зоне, труба продолжает функционировать. Наряд-допуск согласовывается с теплоснабжающей организацией заранее.</span>
              </div>
            </li>
            <li className="flex gap-4" data-testid="why-item-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">4</span>
              <div>
                <span className="font-semibold">Разовый плановый ремонт.</span>{" "}
                <span className="text-muted-foreground">Мобильная бригада с канатным доступом (SRT) закрывает объект за 1–3 выезда. Подробнее:&nbsp;
                  <Link href="/services/rope-access" className="text-primary underline underline-offset-2">промышленный альпинизм на промобъектах</Link>.
                </span>
              </div>
            </li>
          </ol>
        </section>

        {/* Этапы */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-steps-heading">Этапы покраски дымовой трубы</h2>
          <p className="mt-4 text-muted-foreground">
            Работы ведутся строго по технологической карте. Каждый этап задокументирован, итоговый акт
            подписывается заказчиком.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {steps.map((item, index) => (
              <Card key={index} className="relative" data-testid={`card-step-${index}`}>
                <CardHeader className="pb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    {item.step}
                  </div>
                  <CardTitle className="text-base mt-3">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Системы покрытий */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-coatings-heading">Системы покрытий и применение</h2>
          <p className="mt-4 text-muted-foreground">
            Выбор материала определяет стоимость и срок службы защиты. Покраска дымовой трубы цена зависит
            в первую очередь от выбранной системы. Кремнийорганическая краска для дымовых труб — наиболее
            востребованная система в России.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {coatingSystems.map((sys, index) => (
              <Card key={index} data-testid={`card-coating-${index}`}>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <CheckCircle2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-base mt-3">{sys.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{sys.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-muted-foreground">
            Антикоррозионная покраска дымовых труб с правильно подобранной системой — долгосрочная инвестиция.
            Подробнее об антикоррозионной защите металлоконструкций:{" "}
            <Link href="/services/anticorrosion-at-height" className="text-primary underline underline-offset-2">
              Антикоррозионная защита на высоте
            </Link>.
          </p>
        </section>

        {/* Безопасность */}
        <section className="mt-16 rounded-lg bg-muted/50 p-8">
          <h2 className="text-xl font-semibold" data-testid="text-safety-heading">Безопасность и допуски</h2>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">5-й разряд промышленного альпиниста</strong> у каждого исполнителя. Подтверждается удостоверением установленного образца.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">ППР под каждый объект</strong> — составляется инженером по охране труда по ГОСТ Р ИСО 22846 и СНиП 12-03-2001.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Наряд-допуск</strong> — оформляется на каждый выезд и согласовывается с заказчиком.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Страхование СМР</strong> — полис страхования строительно-монтажных рисков.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Котельная не останавливается</strong> — бригада работает в ограждённой зоне без прекращения функционирования объекта.</span>
            </li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            MSPRO — член СРО строительства №{CREDENTIALS.sroConstruction.memberNumber} (ассоциация «СРО «СВС»).
            Лицензия МЧС №{CREDENTIALS.mchs.number}.
          </p>
        </section>

        {/* Стоимость */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-pricing-heading">Стоимость покраски дымовых труб</h2>
          <p className="mt-4 text-muted-foreground">
            Покраска промышленных труб оценивается по площади боковой поверхности (π × диаметр × высота).
            Цена за 1 м² включает работу (500 ₽/м²) и материал.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm" data-testid="pricing-table">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-semibold">Система</th>
                  <th className="py-3 text-right font-semibold">Работа</th>
                  <th className="py-3 text-right font-semibold">Материал</th>
                  <th className="py-3 text-right font-semibold">Итого от</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b">
                  <td className="py-3">ГФ/ПФ эмали (до 120 °С)</td>
                  <td className="py-3 text-right">500 ₽/м²</td>
                  <td className="py-3 text-right">250 ₽/м²</td>
                  <td className="py-3 text-right font-semibold text-foreground">750 ₽/м²</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Кремнийорганика КО-8101 (до 400 °С)</td>
                  <td className="py-3 text-right">500 ₽/м²</td>
                  <td className="py-3 text-right">450 ₽/м²</td>
                  <td className="py-3 text-right font-semibold text-foreground">950 ₽/м²</td>
                </tr>
                <tr>
                  <td className="py-3">Импортное ВТ-покрытие (до 700 °С)</td>
                  <td className="py-3 text-right">500 ₽/м²</td>
                  <td className="py-3 text-right">от 900 ₽/м²</td>
                  <td className="py-3 text-right font-semibold text-foreground">от 1 400 ₽/м²</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-muted-foreground text-sm">
            Пример: труба диаметром 2 м, высотой 50 м, кремнийорганика КО-8101 — площадь ~314 м²,
            ориентир стоимости 298 000 ₽ «под ключ». Это в 2–3 раза дешевле лесов на той же высоте.
          </p>
          <ul className="mt-4 space-y-2 text-muted-foreground text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Геометрия трубы:</strong> высота × диаметр = площадь боковой поверхности.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Материал стенки:</strong> металл, ЖБ или кирпич — разная трудоёмкость подготовки.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Состояние поверхности:</strong> требуется ли пескоструй, ремонт трещин.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Регион:</strong> командировочный коэффициент за пределами Самарской области.</span>
            </li>
          </ul>
          <div className="mt-6">
            <Link href="/calculator">
              <Button variant="outline" data-testid="button-pricing-calculator">Рассчитать стоимость в калькуляторе</Button>
            </Link>
          </div>
          <p className="mt-4 font-medium">
            Для точного расчёта достаточно фото объекта, высоты и диаметра трубы.
            Звоните: +7 (987) 909-29-38 — инженер ответит в течение часа.
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-faq-heading">FAQ — частые вопросы</h2>
          <div className="mt-8 space-y-6">
            {faq.map((item, index) => (
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
            Получить коммерческое предложение за 1 час
          </h2>
          <p className="mt-2 text-muted-foreground">
            Оставьте заявку или позвоните — инженер выедет на объект, замерит трубу, подберёт систему
            покрытий и назовёт точную стоимость. Работаем по всей России.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/contacts">
              <Button size="lg" data-testid="button-cta-contacts">
                Оставить заявку
              </Button>
            </Link>
            <Link href="/calculator">
              <Button variant="outline" size="lg" data-testid="button-cta-calculator">
                Калькулятор стоимости
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
