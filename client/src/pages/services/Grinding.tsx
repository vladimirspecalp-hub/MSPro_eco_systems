import { useEffect } from "react";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { CREDENTIALS } from "@/content/copySystem";

const whenCases = [
  {
    title: "Зачистка сварных швов и удаление грата",
    body: "После сварки металлоконструкций на шве образуются грат, брызги расплава и зоны термического окисления. Наносить антикоррозийный грунт поверх грата недопустимо: под твёрдой чешуей скрывается активная коррозия, которая разрушает покрытие изнутри. Промышленный альпинист с УШМ и зачистным диском снимает грат за один проход, обеспечивая ровный профиль поверхности под систему ЛКМ.",
  },
  {
    title: "Подготовка поверхности под антикоррозийный ЛКМ",
    body: "Антикоррозийные грунтовки требуют определённой шероховатости для адгезии. Шлифование создаёт равномерный профиль Ra 3.2–6.3 мкм — достаточный для большинства эпоксидных и цинконаполненных грунтов. Для металла без пескоструйки лепестковый диск P80–P120 обеспечивает требуемую шероховатость без дорогостоящего абразивного оборудования.",
  },
  {
    title: "Шлифование старого покрытия перед ремонтным окрашиванием",
    body: "При ремонтном окрашивании без полного снятия старого ЛКМ существующее покрытие матируется для улучшения межслойной адгезии. Зернистость P120–P180 не повреждает адгезионный слой. Промальп-бригада работает последовательно: зашлифовал — обеспылил — нанёс грунт — перешёл дальше.",
  },
  {
    title: "Удаление поверхностного окисления и точечной коррозии",
    body: "На металлоконструкциях без активного коррозионного поражения достаточно лёгкой зачистки от flash rust: абразивное шлифование металла лепестковым кругом P80 снимает тонкий слой окисла за 1–2 проходки. Метод для регламентных работ, когда капитальная очистка избыточна, а поверхность нужно привести в норму перед межсезонным окрашиванием.",
  },
];

const methods = [
  {
    name: "УШМ (болгарка) со шлифовальным диском",
    description:
      "Универсальный инструмент для открытых площадей: балки, листовой металл, широкие горизонтальные и вертикальные поверхности. Зачистной или лепестковый диск снимает грат, остатки сварной окалины за одну операцию. Зернистость P40–P60 для агрессивного снятия, P80–P120 для выравнивания, P150–P180 для финишного матирования. Высокая производительность на ровных поверхностях.",
  },
  {
    name: "Шлифовальная лента (ленточная шлифмашина)",
    description:
      "Обеспечивает равномерный профиль шероховатости на листовом металле и плоских конструкциях. Лента даёт меньше рисок по сравнению с дисками УШМ — стабильный Ra по всей обрабатываемой плоскости. Применяется при высоких требованиях к однородности поверхности для многослойных эпоксидных систем.",
  },
  {
    name: "Абразивные лепестковые диски (финишное матирование)",
    description:
      "Финишная обработка зернистостью P120–P180 перед нанесением промежуточного или финишного слоя ЛКМ. Лепестковый диск работает мягче зачистного — создаёт равномерную шероховатость на уже подготовленной поверхности. Используется между слоями в многослойных системах покрытия.",
  },
  {
    name: "Ручное шлифование (наждачная бумага, тёрка)",
    description:
      "Применяется в узлах, углах, фланцах, сварных швах в труднодоступных местах. Промальп работает вплотную к поверхности с беседки: ручная шлифовка обратных сторон балок, ребристых профилей, соединительных муфт. Неотъемлемая часть комплексной подготовки сложных конструкций.",
  },
];

const steps = [
  {
    step: 1,
    title: "Обследование объекта",
    description:
      "Замеры площади, оценка состояния покрытия и металла, определение объёма и метода шлифования по ТЗ заказчика. Согласование зернистости абразива с требованиями системы ЛКМ.",
  },
  {
    step: 2,
    title: "ППР и наряд-допуск",
    description:
      "Проект производства работ на высоте и наряд-допуск для каждого объекта. Проверка страховочного снаряжения, осмотр точек анкеровки, маршрут движения по объекту.",
  },
  {
    step: 3,
    title: "Монтаж промальп-снаряжения",
    description: "Установка анкеров, навеска тросов, подготовка беседок. Подключение электроинструмента через переносные розетки на высоте или длинные кабели с земли.",
  },
  {
    step: 4,
    title: "Шлифование участка за участком",
    description:
      "Последовательная обработка конструкции с заданной зернистостью. При необходимости — смена диска или переход к ленточной шлифмашине. Особое внимание — к зонам сварных швов, краям и углам.",
  },
  {
    step: 5,
    title: "Обеспыливание",
    description:
      "Обдув сжатым воздухом или промышленный пылесос после каждой секции. Металлическая пыль блокирует адгезию грунтовки — обеспыливание обязательно после каждого участка.",
  },
  {
    step: 6,
    title: "Визуальный контроль",
    description:
      "Осмотр поверхности под косым освещением, тест по профилометру при необходимости. Повторная обработка мест с недостаточным профилем. Грунтование откладывать нельзя — металл окисляется.",
  },
  {
    step: 7,
    title: "Допуск к грунтовке",
    description:
      "Фотофиксация результата, акт выполненных работ. Межоперационный интервал — минимальный: антикоррозийная защита наносится немедленно после обеспыливания.",
  },
];

const advantages = [
  {
    title: "Экономия на инфраструктуре.",
    body: "Монтаж строительных лесов для одного пролёта — 3–7 дней работы и 30–40% дополнительного бюджета. Промальп выезжает через 1–2 дня после согласования ТЗ без разрешений на временные сооружения.",
  },
  {
    title: "Работа без остановки производства.",
    body: "Промальп-бригада занимает только тот участок, где ведётся шлифование. Цех продолжает работать, движение транспорта не блокируется — критически важно для действующих промышленных объектов.",
  },
  {
    title: "Доступ к труднодоступным местам.",
    body: "Обратные стороны балок, ребристые профили, узлы сварных швов — промальп добирается туда, куда не дотянуться с лесов. Ручная шлифовка узлов ведётся непосредственно у поверхности с беседки.",
  },
  {
    title: "Совмещение с антикоррозийной обработкой.",
    body: "Шлифование поверхности промышленными альпинистами совмещается с обеспыливанием и нанесением антикоррозийного грунта в один выезд — без риска повторного окисления при ожидании следующей бригады.",
  },
  {
    title: "Скорость реакции.",
    body: "Выезд через 1–2 рабочих дня после согласования ТЗ. Нет ожидания монтажа лесов, согласования стационарных подмостей или аренды телескопической вышки.",
  },
];

const pricingFactors = [
  { title: "Площадь и конфигурация объекта", body: "открытые плоскости дешевле сложных профилей" },
  { title: "Метод шлифования", body: "УШМ быстрее, лента равномернее, ручная работа в узлах требует больше времени" },
  { title: "Зернистость и количество проходов", body: "финишное матирование P180 занимает больше времени, чем грубая зачистка P60" },
  { title: "Высота и доступность объекта", body: "влияет на время монтажа промальп-снаряжения" },
  { title: "Регион", body: "базовый коэффициент 0.8–2.0 (100+ городов), Москва +20%" },
];

const faq = [
  {
    question: "Зачем нужно шлифование металла перед покраской?",
    answer:
      "Шлифование металла перед покраской создаёт шероховатость поверхности, необходимую для адгезии антикоррозийного грунта. Без шлифовки покрытие ложится на гладкий или загрязнённый металл и отслаивается при первом термическом или механическом воздействии. Кроме того, шлифование снимает грат после сварки, остатки старых ЛКМ и продукты поверхностного окисления.",
  },
  {
    question: "Чем шлифование металла отличается от механической очистки или пескоструйки?",
    answer: null, // rendered inline with links
    schemaAnswer:
      "Механическая очистка металла болгаркой и щёткой — удаление ржавчины до степени St 2–St 3. Шлифование — создание заданного профиля шероховатости под систему ЛКМ. Пескоструйная очистка достигает степени Sa 2.5–Sa 3 с выраженным профилем Ra 40–80 мкм. Шлифование даёт более мягкий профиль Ra 3.2–25 мкм. Выбор метода определяет производитель ЛКМ в техническом листе грунтовки.",
  },
  {
    question: "Какую зернистость абразива выбрать для шлифования металлоконструкций?",
    answer:
      "Зависит от задачи: P40–P60 для агрессивной зачистки грата и окалины; P80–P120 для создания профиля под антикоррозийный грунт; P150–P180 для матирования между слоями ЛКМ. Конкретная зернистость определяется по техническому листу грунтовки — производитель указывает минимальный Ra. MS-PRO согласовывает зернистость с заказчиком до начала работ.",
  },
  {
    question: "Сколько стоит шлифование металлоконструкций?",
    answer:
      "По запросу «шлифование металлоконструкций цена» — расценки рассчитываются индивидуально: зависит от площади объекта, конфигурации конструкции, выбранного метода (УШМ, лента, ручное шлифование) и требуемой зернистости абразива. В калькуляторе MS-PRO услуга отображается как «уточняется у инженера». Опишите задачу — рассчитаем стоимость и ответим за 1 час.",
  },
  {
    question: "Можно ли делать шлифование металла на высоте без строительных лесов?",
    answer:
      "Да — это специализация MS-PRO. Промышленные альпинисты ведут шлифование металлоконструкций на беседках и тросовых системах на любой высоте: балки, фермы, трубопроводы, опоры мостов. Без лесов, без вышек, без разрешений на временные сооружения. Экономия на отказе от лесов — 30–40% бюджета, время выезда — 1–2 рабочих дня.",
  },
  {
    question: "Через какое время после шлифования нужно грунтовать металл?",
    answer:
      "Немедленно — не позднее 2–4 часов при нормальных условиях (+5…+25°C, влажность до 80%). Зашлифованный металл химически активен: flash rust начинает образовываться уже через 30–60 минут при повышенной влажности. Промальп-бригада MS-PRO совмещает шлифование, обеспыливание и грунтование в одном выезде.",
  },
  {
    question: "Подходит ли болгарка для шлифования сварных швов?",
    answer:
      "Да, УШМ с зачистным диском — стандартный инструмент для зачистки грата и сварной окалины. Для финишного шлифования шва под покраску применяют лепестковый диск P80–P120, который сглаживает переход «шов–металл» без чрезмерного снятия материала. На труднодоступных участках дополнительно применяется ручная наждачная бумага.",
  },
  {
    question: "Нужно ли шлифовать металл, если его уже пескоструили?",
    answer:
      "После пескоструйной очистки до Sa 2.5–Sa 3 шлифование, как правило, не требуется: профиль поверхности уже создан. Шлифование после пескоструйки применяется точечно — для сглаживания грубого профиля перед тонкослойными покрытиями или для матирования отдельных участков. В остальных случаях — обеспыливание и немедленное грунтование.",
  },
];

export default function Grinding() {
  useEffect(() => {
    document.title = "Шлифование металлоконструкций без лесов промальпом | MS-PRO";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Шлифование металлоконструкций промышленными альпинистами: УШМ, лента, диск. Зачистка швов, подготовка под ЛКМ. Цена — по заявке. Звоните: +7 (987) 909-29-38."
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
      "name": "Шлифование металлоконструкций промышленными альпинистами",
      "description":
        "Шлифование металлоконструкций промышленными альпинистами: УШМ, лента, диск. Зачистка швов, подготовка под ЛКМ. Цена — по заявке.",
      "url": "https://mspro-ltd.ru/services/grinding",
      "provider": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru" },
      "areaServed": { "@type": "Country", "name": "Россия" },
      "serviceType": "Шлифование металлоконструкций",
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
      "mainEntity": faq.map((item) => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.schemaAnswer ?? item.answer },
      })),
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
      "headline": "Шлифование металлоконструкций промышленными альпинистами",
      "description":
        "Шлифование металлоконструкций промышленными альпинистами: УШМ, лента, диск. Зачистка швов, подготовка под ЛКМ.",
      "url": "https://mspro-ltd.ru/services/grinding",
      "image": "https://mspro-ltd.ru/site-industrial-theme-v5.jpg",
      "author": { "@type": "Organization", "name": "MSPRO" },
      "publisher": {
        "@type": "Organization",
        "name": "MSPRO",
        "url": "https://mspro-ltd.ru",
        "logo": { "@type": "ImageObject", "url": "https://mspro-ltd.ru/assets/logo-live.jpg" },
      },
      "datePublished": "2026-05-01",
      "dateModified": new Date().toISOString().split("T")[0],
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
            <Wrench className="h-4 w-4" />
            СРО (стройка) член №{CREDENTIALS.sroConstruction.memberNumber}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-grinding-h1">
            Шлифование металлоконструкций промышленными альпинистами
          </h1>
          <p className="mt-6 text-lg text-muted-foreground" data-testid="text-grinding-intro">
            Шлифование металла на высоте без строительных лесов — задача для промышленных альпинистов MS-PRO.
            Мы выполняем шлифование металлоконструкций: зачистку сварных швов, матирование поверхности под покраску,
            удаление окисления и старых ЛКМ на балках, трубопроводах, опорах и фасадах любой высоты.
            Шлифование металла перед покраской совмещается с обеспыливанием и грунтованием в одном выезде.
            Без лесов, без подъёмников, без простоя производства. Выезд — через 1–2 рабочих дня.
            Звоните: +7&nbsp;(987)&nbsp;909-29-38.
          </p>
        </div>

        {/* Когда нужно */}
        <section className="mt-16" id="when">
          <h2 className="text-2xl font-bold" data-testid="text-when-heading">
            Когда нужно шлифование металлоконструкций
          </h2>
          <p className="mt-4 text-muted-foreground">
            Шлифование металлоконструкций применяется на нескольких ключевых этапах антикоррозийной подготовки поверхности:
            от зачистки сварных швов до матирования финальных слоёв ЛКМ.
          </p>
          <div className="mt-8 space-y-8">
            {whenCases.map((obj, index) => (
              <div key={index} data-testid={`when-item-${index}`}>
                <h3 className="text-lg font-semibold">{obj.title}</h3>
                <p className="mt-2 text-muted-foreground">{obj.body}</p>
                {index === whenCases.length - 1 && (
                  <p className="mt-2 text-muted-foreground">
                    <Link href="/services/anticorrosion-at-height" className="text-primary underline underline-offset-2">
                      Антикоррозийная защита металлоконструкций
                    </Link>{" "}
                    — следующий этап после шлифования.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Методы шлифования */}
        <section className="mt-16" id="methods">
          <h2 className="text-2xl font-bold" data-testid="text-methods-heading">
            Методы шлифования металла — что выбрать
          </h2>
          <p className="mt-4 text-muted-foreground">
            В арсенале MS-PRO — шлифование поверхности промышленными альпинистами четырьмя методами в зависимости от задачи,
            геометрии конструкции и требований системы ЛКМ.
          </p>
          <div className="mt-8 space-y-6">
            {methods.map((m, index) => (
              <div key={index} data-testid={`method-item-${index}`}>
                <h3 className="font-semibold">{m.name}</h3>
                <p className="mt-1 text-muted-foreground">{m.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Этапы */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-steps-heading">
            Технология шлифования металла на высоте — этапы работ
          </h2>
          <p className="mt-4 text-muted-foreground">
            Абразивное шлифование металла промальпом ведётся по отработанной технологии: от обследования объекта до допуска к грунтовке.
            После шлифования металл начинает окисляться — нанести грунтовку нужно не позднее 2–4 часов.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-4 lg:grid-cols-7">
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

        {/* Преимущества промальп */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-advantages-heading">
            Шлифование металла на высоте без лесов — преимущества промальпа
          </h2>
          <p className="mt-4 text-muted-foreground">
            Шлифование металла на высоте без строительных лесов — ключевое преимущество MS-PRO перед подрядчиками,
            работающими с лесами или вышками.
          </p>
          <ol className="mt-6 space-y-4">
            {advantages.map((item, index) => (
              <li key={index} className="flex gap-4" data-testid={`advantage-item-${index}`}>
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <div>
                  <span className="font-semibold">{item.title}</span>{" "}
                  {index === 0 ? (
                    <span className="text-muted-foreground">
                      {item.body}{" "}
                      <Link href="/services/rope-access" className="text-primary underline underline-offset-2">
                        Промышленный альпинизм
                      </Link>{" "}
                      — доступ без лесов на любую высоту.
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{item.body}</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Стоимость */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-pricing-heading">
            Стоимость шлифования металлоконструкций
          </h2>
          <p className="mt-4 text-muted-foreground">
            Цена шлифования металлоконструкций рассчитывается индивидуально:
            в калькуляторе MS-PRO услуга отображается со статусом «уточняется у инженера».
            Конкретные расценки зависят от нескольких факторов:
          </p>
          <ul className="mt-6 space-y-2 text-muted-foreground" data-testid="list-pricing-factors">
            {pricingFactors.map((factor, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                <span>
                  <strong className="text-foreground">{factor.title}</strong> — {factor.body}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Link href="/contacts">
              <Button data-testid="button-pricing-request">
                Запросить расчёт стоимости
              </Button>
            </Link>
          </div>
          <p className="mt-4 font-medium">
            Опишите объект: площадь, высота, тип конструкции, задача (зачистка швов, матирование, удаление ржавчины).
            Рассчитаем стоимость и ответим за 1 час. Звоните: +7 (987) 909-29-38.
          </p>
        </section>

        {/* Безопасность */}
        <section className="mt-16 rounded-lg bg-muted/50 p-8">
          <h2 className="text-xl font-semibold" data-testid="text-safety-heading">Безопасность и допуски</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Все промышленные альпинисты MSPRO аттестованы по 5-му разряду. Работы ведутся по наряду-допуску
            и индивидуальному ППР на каждый объект — в соответствии с ГОСТ Р ИСО 22846 и СНиП 12-03-2001.
            Страховочные системы — двойные (рабочая и страховочная линии).
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            MSPRO — член СРО строительства №{CREDENTIALS.sroConstruction.memberNumber}.
            Лицензия МЧС №{CREDENTIALS.mchs.number}.
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-faq-heading">
            FAQ — частые вопросы о шлифовании металла
          </h2>
          <div className="mt-8 space-y-6">
            {faq.map((item, index) => (
              <div key={index} className="border-b pb-6" data-testid={`faq-item-${index}`}>
                <h3 className="font-semibold">{item.question}</h3>
                <div className="mt-2 text-muted-foreground">
                  {index === 1 ? (
                    <p>
                      <Link href="/services/mechanical-cleaning" className="text-primary underline underline-offset-2">
                        Механическая очистка металла
                      </Link>{" "}
                      болгаркой и щёткой — удаление ржавчины до степени St 2–St 3. Шлифование — создание заданного
                      профиля шероховатости под систему ЛКМ.{" "}
                      <Link href="/services/sandblasting" className="text-primary underline underline-offset-2">
                        Пескоструйная очистка
                      </Link>{" "}
                      достигает степени Sa 2.5–Sa 3 с выраженным профилем Ra 40–80 мкм. Шлифование даёт более мягкий
                      профиль Ra 3.2–25 мкм. Выбор метода определяет производитель ЛКМ в техническом листе грунтовки.
                    </p>
                  ) : (
                    <p>{item.answer}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 rounded-lg border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold" data-testid="text-cta-heading">
            Оставьте заявку — ответим за 1 час
          </h2>
          <p className="mt-2 text-muted-foreground">
            Опишите объект и задачу: высота, площадь, тип конструкции, цель шлифования (зачистка швов, матирование, удаление окисления).
            Выезд на замер — бесплатно. Промышленные альпинисты MS-PRO готовы приступить через 1–2 дня.
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
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/services/mechanical-cleaning" className="text-primary underline underline-offset-2">
              Механическая очистка металла
            </Link>
            <Link href="/services/sandblasting" className="text-primary underline underline-offset-2">
              Пескоструйная очистка
            </Link>
            <Link href="/services/anticorrosion-at-height" className="text-primary underline underline-offset-2">
              Антикоррозийная защита металлоконструкций
            </Link>
            <Link href="/contacts" className="text-primary underline underline-offset-2">
              Контакты и заявка
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
