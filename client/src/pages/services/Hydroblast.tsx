import { useEffect } from "react";
import { Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { CREDENTIALS } from "@/content/copySystem";

const objects = [
  {
    title: "Металлоконструкции и балки на высоте",
    body: "Стропильные фермы, колонны, ригели и балки перекрытий — объекты, где устаревшее антикоррозийное покрытие требует полного снятия перед переокраской. Применяется гидроструйная мойка металлоконструкций: промальп-бригада проходит вдоль конструкции с беседки, равномерно обрабатывая каждый сантиметр поверхности. Результат: поверхность готова к грунтовке за один выезд, без недель монтажа подмостей.",
  },
  {
    title: "Трубопроводы и резервуары снаружи",
    body: "Наружные поверхности трубопроводов покрываются несколькими слоями ржавчины и отслоившейся краски, которые трудно снять механическим инструментом без риска повреждения. Вода высокого давления проникает в каждую трещину и сварной шов, удаляя загрязнения без механического контакта. Промальп перемещается вдоль горизонтальных и вертикальных участков, а гибкий шланг подаётся непосредственно к месту работы.",
  },
  {
    title: "Мосты, опоры, эстакады и рельсовые пути",
    body: "Металлические пролёты мостов и несущие опоры эстакад — крупные объекты со сложной геометрией, где строительные леса потребовали бы масштабного перекрытия проезда. Промальп + АВД — оптимальная связка: один рабочий с беседки обрабатывает секцию за секцией без остановки движения транспорта. Гидродинамическая очистка металла удаляет накопленные отложения, ржавчину и старые покрытия, не повреждая профиль несущих элементов.",
  },
  {
    title: "Промышленные фасады и железобетонные конструкции",
    body: "Металлические фасадные кассеты, защитные кожухи оборудования и наружные поверхности железобетонных конструкций очищаются гидроструйным методом без повреждения поверхностного слоя. Давление подбирается индивидуально: для деликатной очистки бетона — ниже, для плотных ЛКМ на металле — выше. Промальп добирается до верхних ярусов и труднодоступных участков без аренды вышки.",
  },
];

const pressureRanges = [
  {
    name: "Низкое давление — до 350 бар",
    description:
      "Предварительная промывка от рыхлых отложений, солей, пыли и маслянистых загрязнений. Не удаляет прочно сцепленную краску и окалину. Применяется как подготовительная стадия перед основной очисткой.",
    wjClass: "—",
  },
  {
    name: "Высокое давление — 500–1000 бар",
    description:
      "Основной рабочий диапазон MS-PRO. Эффективно удаляет ржавчину, большинство антикоррозийных покрытий, загрязнения и окалину. Без абразива, без пыли, без химического воздействия на металл.",
    wjClass: "WJ-2, WJ-3",
  },
  {
    name: "Ультравысокое давление — 1000–2500 бар",
    description:
      "Применяется для удаления плотных покрытий (эпоксидные, каменноугольные смолы), коксовых отложений и тяжёлой ржавчины. Ультравысокое давление также используется для очистки жаропрочных покрытий на оборудовании.",
    wjClass: "WJ-1",
  },
];

const wjClasses = [
  {
    code: "WJ-1",
    description: "Очистка до металла — без следов ржавчины, покрытий и загрязнений",
  },
  {
    code: "WJ-2",
    description: "Очистка без рыхлого налёта и большей части покрытия",
  },
  {
    code: "WJ-3",
    description: "Удаление большей части покрытия; остатки прочно сцеплены",
  },
  {
    code: "WJ-4",
    description: "Удаление рыхлых загрязнений и flash rust",
  },
];

const steps = [
  {
    step: 1,
    title: "Обследование объекта",
    description:
      "Замеры площади, оценка состояния покрытия и степени коррозии, определение давления и класса WJ по ТЗ заказчика. Фотофиксация исходного состояния поверхности.",
  },
  {
    step: 2,
    title: "ППР и наряд-допуск",
    description:
      "Оформление проекта производства работ на высоте и наряда-допуска. Проверка страховочного снаряжения и точек анкеровки. Определение схемы подвода воды к объекту.",
  },
  {
    step: 3,
    title: "Монтаж промальп-снаряжения",
    description:
      "Установка анкеров, навеска тросов, подготовка беседок. Инструктаж бригады по безопасности. Прокладка шлангов водоснабжения к рабочей зоне.",
  },
  {
    step: 4,
    title: "Подвод воды и тест оборудования",
    description:
      "Подключение насосного агрегата АВД, проверка давления, тест пистолета-форсунки на давление и расход. Обеспечение источника воды (подключение к городской сети или автоцистерна).",
  },
  {
    step: 5,
    title: "Гидроструйная обработка",
    description:
      "Очистка металла водой под давлением — движение пистолета-форсунки по поверхности с равномерной скоростью, выбранным режимом давления. Труднодоступные места обрабатываются форсункой с вращающейся головкой.",
  },
  {
    step: 6,
    title: "Обеспыливание и сушка",
    description:
      "Продувка поверхности сжатым воздухом, визуальный контроль на предмет пропущенных участков. Flash rust начинает образовываться в течение 30–60 минут при высокой влажности.",
  },
  {
    step: 7,
    title: "Контроль качества и допуск к грунтовке",
    description:
      "Фотофиксация результата, сравнение с эталонными образцами SSPC-SP WJ. Составление акта выполненных работ с указанием достигнутого класса WJ.",
  },
];

const advantages = [
  {
    title: "Экономия на инфраструктуре.",
    body: "Монтаж строительных лесов для одного пролёта — несколько дней работы и 25–40% дополнительного бюджета. Промальп выезжает через 1–2 дня после согласования ТЗ.",
  },
  {
    title: "Нет абразивных отходов.",
    body: "Пескоструйная очистка требует утилизации отработанного абразива. При гидроструйке отходы — только вода и смытые загрязнения; экологичная альтернатива для объектов в жилых кварталах и на действующих производствах.",
  },
  {
    title: "Не повреждает геометрию металла.",
    body: "Вода не создаёт абразивного износа: не изменяет профиль металла и не срезает тонкостенные элементы. Подходит для конструкций, где допуски на толщину важны.",
  },
  {
    title: "Доступ к труднодоступным местам.",
    body: "Обратные стороны балок, узлы, сварные швы — промальп достигает любой точки объекта. Шланг гибкий, форсунка с вращающейся головкой обрабатывает полости без прямой видимости.",
  },
  {
    title: "Скорость выезда.",
    body: "При аварийной необходимости бригада выезжает через 1–2 рабочих дня. Нет ожидания разрешений на установку лесов или аренды подъёмника.",
  },
];

const widthPricing = [
  { width: "До 50 мм (фланцы, ребристые профили)", coef: "×2.0", price: "от 350 ₽/м²" },
  { width: "50–80 мм", coef: "×1.7", price: "от 297 ₽/м²" },
  { width: "80–120 мм", coef: "×1.5", price: "от 262 ₽/м²" },
  { width: "Более 250 мм (листы, широкие панели)", coef: "×1.0", price: "175 ₽/м²" },
];

const pricingFactors = [
  { title: "Класс WJ", body: "чем выше требуемая степень очистки — тем дороже" },
  { title: "Ширина элемента", body: "узкие профили дороже широких" },
  { title: "Высота объекта", body: "влияет на время монтажа снаряжения" },
  { title: "Регион", body: "+20% Москва, −10% для ряда регионов" },
  { title: "Доступность водоснабжения", body: "подключение к сети или использование автоцистерны" },
];

const faq = [
  {
    question: "Что такое гидроструйная очистка металла и чем она отличается от пескоструйки?",
    answer:
      "Гидроструйная очистка металла — удаление ржавчины и покрытий струёй воды под высоким давлением (≥500 бар) без абразивов и химии. В отличие от пескоструйной очистки, не создаёт пылевого загрязнения, не требует утилизации абразива и не вносит посторонних частиц на поверхность. Результат — класс WJ по SSPC-SP WJ вместо Sa по ISO 8501.",
  },
  {
    question: "Какое давление нужно для очистки металла: 500, 1000 или 2000 бар?",
    answer:
      "Зависит от задачи. 500–700 бар — для удаления рыхлой ржавчины и большинства старых покрытий (WJ-2/WJ-3). 1000–2000 бар — для плотных эпоксидных или полиуретановых покрытий и тяжёлой ржавчины (WJ-1). Мы подбираем давление под конкретный объект и уровень загрязнения. Избыточное давление — лишние расходы без прироста качества.",
  },
  {
    question: "Можно ли делать гидроструйную очистку на высоте без строительных лесов?",
    answer:
      "Да, это специализация MS-PRO. Промышленные альпинисты работают на беседках и тросовых системах, обрабатывая конструкции на любой высоте без лесов. Промальп + АВД — компактная связка: бригада из 2–3 человек заменяет мобилизацию бригады лесостроителей и недели монтажа. Экономия: 25–40% от общего бюджета.",
  },
  {
    question: "Сколько стоит гидроструйная очистка металлоконструкций за 1 м²?",
    answer:
      "Базовая расценка для металлоконструкций — 175 ₽/м² при ширине элемента более 250 мм. Узкие профили до 50 мм — от 350 ₽/м² (коэффициент ×2.0). Итоговая стоимость зависит от класса WJ, ширины элементов, высоты и региона. Точную смету — в калькуляторе.",
  },
  {
    question: "Почему после гидроструйки нужно сразу грунтовать поверхность?",
    answer:
      "После гидроструйной очистки металл мокрый и химически активный. Без защитного покрытия в течение 30–60 минут (при влажности выше 70%) образуется flash rust — тонкий слой вторичной ржавчины. Нанести антикоррозийную грунтовку нужно не позднее 2–4 часов при нормальных условиях. Промедление потребует повторной очистки.",
  },
  {
    question: "Подходит ли гидродинамическая очистка для удаления ржавчины с металла?",
    answer:
      "Да, гидродинамическая очистка металла эффективно удаляет поверхностную и глубокую ржавчину. При давлении 700–1000 бар вода проникает в поры и трещины коррозионного поражения, размывая продукты окисления без механического контакта. Результат — до WJ-2 (без рыхлого налёта) и WJ-1 (до металла) при ультравысоком давлении.",
  },
  {
    question: "Можно ли делать гидроструйку в морозную погоду или под дождём?",
    answer:
      "При температуре ниже 0°C работа не ведётся — вода замерзает в шлангах и на поверхности, что опасно для оборудования и персонала. При дожде работы также приостанавливаются: влажная поверхность не даёт нужного качества адгезии при последующей грунтовке. Оптимальный диапазон: +5…+30°C, влажность до 80%.",
  },
  {
    question: "Что такое flash rust и как его избежать после гидроструйной промывки?",
    answer:
      "Flash rust (мгновенная ржавчина) — тонкий оранжевый слой окиси железа, образующийся на очищенном металле в течение 30–60 минут при высокой влажности. Избежать: нанести грунтовку до 2–4 часов после очистки. В условиях высокой влажности применяется ингибитор flash rust или быстросохнущий грунт. Промальп-бригада MS-PRO совмещает очистку и грунтование в одном выезде.",
  },
];

export default function Hydroblast() {
  useEffect(() => {
    document.title = "Гидроструйная очистка металла АВД без лесов | MS-PRO";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Гидроструйная очистка металлоконструкций давлением ≥500 бар без строительных лесов. Без абразива. Металл — 175 ₽/м². Звоните: +7 (987) 909-29-38."
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
      "name": "Гидроструйная очистка металла промышленными альпинистами",
      "description":
        "Гидроструйная очистка металлоконструкций давлением ≥500 бар без строительных лесов. Без абразива. Металл — 175 ₽/м².",
      "url": "https://mspro-ltd.ru/services/hydroblast",
      "provider": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru" },
      "areaServed": { "@type": "Country", "name": "Россия" },
      "serviceType": "Гидроструйная очистка металла",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "RUB",
        "price": "175",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "175",
          "priceCurrency": "RUB",
          "unitText": "м²",
        },
      },
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
        "acceptedAnswer": { "@type": "Answer", "text": item.answer },
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
      "headline": "Гидроструйная очистка металла промышленными альпинистами",
      "description":
        "Гидроструйная очистка металлоконструкций давлением ≥500 бар без строительных лесов. Без абразива. Металл — 175 ₽/м².",
      "url": "https://mspro-ltd.ru/services/hydroblast",
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400">
            <Droplets className="h-4 w-4" />
            СРО (стройка) член №{CREDENTIALS.sroConstruction.memberNumber}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-hydroblast-h1">
            Гидроструйная очистка металла промышленными альпинистами
          </h1>
          <p className="mt-6 text-lg text-muted-foreground" data-testid="text-hydroblast-intro">
            Гидроструйная очистка металла — удаление ржавчины, старых лакокрасочных покрытий и загрязнений струёй
            воды под давлением от 500 до 2000 бар. Промышленные альпинисты MS-PRO выполняют гидроструйную очистку
            металлоконструкций без строительных лесов и подъёмников на любой высоте. Без абразива, без химии,
            без пыли — только вода и давление. Степень очистки по SSPC-SP WJ 1–4. Выезд через 1–2 рабочих дня.
            Звоните: +7&nbsp;(987)&nbsp;909-29-38.
          </p>
        </div>

        {/* Объекты */}
        <section className="mt-16" id="objects">
          <h2 className="text-2xl font-bold" data-testid="text-objects-heading">
            Для каких объектов применяется гидроструйная очистка
          </h2>
          <div className="mt-8 space-y-8">
            {objects.map((obj, index) => (
              <div key={index} data-testid={`object-item-${index}`}>
                <h3 className="text-lg font-semibold">{obj.title}</h3>
                <p className="mt-2 text-muted-foreground">{obj.body}</p>
                {index === 0 && (
                  <p className="mt-2 text-muted-foreground">
                    <Link href="/services/anticorrosion-at-height" className="text-primary underline underline-offset-2">
                      Антикоррозийная защита металлоконструкций
                    </Link>{" "}
                    — следующий этап после гидроструйной очистки.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Давления и классы */}
        <section className="mt-16" id="pressure">
          <h2 className="text-2xl font-bold" data-testid="text-pressure-heading">
            Давления и классы гидроструйной очистки
          </h2>
          <p className="mt-4 text-muted-foreground">
            Гидродинамическая очистка металла — профессиональное название того, что называют очистка металла водой под
            давлением. Классификация ведётся по давлению рабочей струи и стандарту SSPC-SP WJ (Waterjet Cleaning).
            В отличие от{" "}
            <Link href="/services/sandblasting" className="text-primary underline underline-offset-2">
              пескоструйной очистки
            </Link>
            , гидроструйная обработка не создаёт пылевого загрязнения, не требует абразивных материалов и не вносит
            вторичных загрязнений на поверхность металла.
          </p>
          <div className="mt-8 space-y-6">
            {pressureRanges.map((range, index) => (
              <div key={index} className="border-l-4 border-primary pl-4" data-testid={`pressure-item-${index}`}>
                <h3 className="font-semibold">{range.name}</h3>
                <p className="mt-1 text-muted-foreground">{range.description}</p>
                {range.wjClass !== "—" && (
                  <p className="mt-1 text-sm font-medium text-primary">Соответствует: {range.wjClass}</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="font-semibold text-lg">Классы очистки SSPC-SP WJ</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm" data-testid="wj-classes-table">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-semibold whitespace-nowrap">Класс</th>
                    <th className="py-3 text-left font-semibold">Описание</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {wjClasses.map((cls, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 font-medium text-foreground whitespace-nowrap">{cls.code}</td>
                      <td className="py-3">{cls.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Этапы */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-steps-heading">
            Технология работ — этапы гидроструйной очистки на высоте
          </h2>
          <p className="mt-4 text-muted-foreground">
            После гидроструйки металл окисляется быстрее, чем после механической очистки. Нанести антикоррозийную
            грунтовку нужно не позднее 2–4 часов при нормальных условиях. При высокой влажности — немедленно.
            Промедление потребует повторной очистки.
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

        {/* Преимущества */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-advantages-heading">
            Почему гидроструйная очистка на высоте без лесов выгоднее
          </h2>
          <p className="mt-4 text-muted-foreground">
            Гидроструйная очистка на высоте без лесов — специализация MS-PRO: промальп-бригада работает на беседках
            и тросовых системах, устраняя необходимость в строительных лесах и подъёмниках.
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
            Стоимость гидроструйной очистки металла
          </h2>
          <p className="mt-4 text-muted-foreground">
            Базовая расценка MS-PRO для металлоконструкций — <strong className="text-foreground">175 ₽/м²</strong> при
            ширине элемента более 250 мм. Для узких элементов применяются коэффициенты ширины:
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm" data-testid="pricing-table">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-semibold">Ширина элемента</th>
                  <th className="py-3 text-center font-semibold">Коэффициент</th>
                  <th className="py-3 text-right font-semibold">Цена</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {widthPricing.map((row, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 text-foreground">{row.width}</td>
                    <td className="py-3 text-center font-semibold text-foreground">{row.coef}</td>
                    <td className="py-3 text-right font-semibold text-foreground whitespace-nowrap">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            <Link href="/calculator">
              <Button variant="outline" data-testid="button-pricing-calculator">
                Рассчитать в калькуляторе
              </Button>
            </Link>
          </div>
          <p className="mt-4 font-medium">
            Точная смета с учётом вашего объекта и региона. Звоните: +7 (987) 909-29-38.
          </p>
        </section>

        {/* Безопасность */}
        <section className="mt-16 rounded-lg bg-muted/50 p-8">
          <h2 className="text-xl font-semibold" data-testid="text-safety-heading">Безопасность и допуски</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Все промышленные альпинисты MSPRO аттестованы по 5-му разряду. Работы ведутся по наряду-допуску
            и индивидуальному ППР на каждый объект — в соответствии с ГОСТ Р ИСО 22846 и СНиП 12-03-2001.
            Страховочные системы — двойные (рабочая и страховочная линии). Работы застрахованы по СМР.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            MSPRO — член СРО строительства №{CREDENTIALS.sroConstruction.memberNumber}.
            Лицензия МЧС №{CREDENTIALS.mchs.number}.
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-faq-heading">
            FAQ — частые вопросы
          </h2>
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
            Оставьте заявку — ответим за 1 час
          </h2>
          <p className="mt-2 text-muted-foreground">
            Опишите объект: высота, площадь, тип покрытия, доступность воды на объекте. Выезд на замер — бесплатно.
            Промальп-бригада MS-PRO готова приступить через 1–2 рабочих дня после согласования ТЗ.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/contacts">
              <Button size="lg" data-testid="button-cta-contacts">
                Оставить заявку
              </Button>
            </Link>
            <Link href="/calculator">
              <Button variant="outline" size="lg" data-testid="button-cta-calculator">
                Рассчитать стоимость
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link href="/services/sandblasting" className="text-primary underline underline-offset-2">
              Пескоструйная очистка металла
            </Link>
            <Link href="/services/mechanical-cleaning" className="text-primary underline underline-offset-2">
              Механическая очистка металла
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
