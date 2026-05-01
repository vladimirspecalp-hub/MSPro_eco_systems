import { useEffect } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { CREDENTIALS } from "@/content/copySystem";

const objects = [
  {
    title: "Металлоконструкции и балки на высоте",
    body: "Фермы покрытий, несущие балки, колонны промышленных цехов и ангаров — типичные объекты пескоструйной обработки металлоконструкций. Конструкции расположены на высоте 6–30 м, и монтаж лесов занял бы больше времени, чем сама работа. Промальп-бригада разворачивается за 2–4 часа: навешивает верёвочные системы, монтирует беседки и начинает обработку без остановки производства в цехе.",
  },
  {
    title: "Трубопроводы и резервуары (снаружи)",
    body: "Пескоструйная очистка трубопроводов и внешних поверхностей резервуаров перед нанесением антикоррозийной системы — один из самых частых запросов. Трубопровод идёт по эстакаде на высоте 10–15 м, резервуар имеет цилиндрическую боковую поверхность, недоступную с земли. Промальп работает снизу вверх, секция за секцией, не требуя временных платформ.",
  },
  {
    title: "Мосты, опоры, эстакады",
    body: "Металлические элементы мостовых пролётов и опор — сложные геометрические формы с обратными сторонами, фланцами и узлами. Пескоструйная очистка на высоте промышленными альпинистами позволяет обрабатывать их со всех сторон: альпинист работает в беседке и управляет углом подачи абразива вручную, что невозможно с вышки или лесов.",
  },
  {
    title: "Промышленные фасады и ограждения из металла",
    body: "Профлист, сэндвич-панели с металлическими стойками, ограждения из профильных труб — всё это накапливает коррозию там, где краска повреждена механически или под воздействием агрессивной среды. Для таких конструкций очистка металла от ржавчины пескоструем и пескоструйная обработка перед покраской возвращают поверхности нужную шероховатость (Rz 40–70 мкм) для повторного ЛКМ-покрытия.",
  },
];

const saDegrees = [
  {
    degree: "Sa 1 (лёгкая)",
    remains: "Рыхлая ржавчина и окалина удалены, плотная допускается",
    suitable: "Временная защита, простые алкидные краски",
    price: "410 ₽/м²",
  },
  {
    degree: "Sa 2 (тщательная)",
    remains: "Почти вся ржавчина и окалина удалены, допускаются пятна до 33% площади",
    suitable: "Алкидные и стандартные эпоксидные грунты",
    price: "~504 ₽/м²",
  },
  {
    degree: "Sa 2.5 (очень тщательная)",
    remains: "Металл металлически блестит, пятна ≤5% площади",
    suitable: "Высококачественные антикоррозийные системы, цинкнаполненные грунты",
    price: "~640 ₽/м²",
  },
  {
    degree: "Sa 3 (белый металл)",
    remains: "Полностью чистый серебристый металл, нет пятен",
    suitable: "Покрытия для подводных конструкций, судовые краски, специальные системы",
    price: "~955 ₽/м²",
  },
];

const steps = [
  {
    step: 1,
    title: "Обследование объекта",
    description: "Выезд инженера, фотофиксация, определение исходной степени ржавления, согласование целевой степени Sa с заказчиком.",
  },
  {
    step: 2,
    title: "ППР и наряд-допуск",
    description: "Оформление проекта производства работ, допуска на высоту, согласование времени начала работ с ответственным заказчика.",
  },
  {
    step: 3,
    title: "Монтаж промальп-снаряжения",
    description: "Навеска анкеров, верёвочных систем, беседок; подключение компрессора и пескоструйного аппарата к сети или автономному генератору.",
  },
  {
    step: 4,
    title: "Подготовка поверхности",
    description: "Обезжиривание сольвентом, удаление масляных пятен и хлоридов, контроль влажности (не выше 80% и точки росы ≥3°C).",
  },
  {
    step: 5,
    title: "Абразивно-струйная обработка",
    description: "Подача купершлака, кварцевого песка или стальной дроби до целевого Sa, контроль профиля поверхности Rz на каждом участке.",
  },
  {
    step: 6,
    title: "Обеспыливание",
    description: "Клининг сжатым воздухом, удаление остатков абразива с поверхности.",
  },
  {
    step: 7,
    title: "Контроль качества",
    description: "Визуальная инспекция, сравнение с эталонными пластинами ISO 8501, замер шероховатости, фотофиксация, допуск к грунтованию.",
  },
];

const advantages = [
  {
    title: "Без строительных лесов и подъёмников.",
    body: "Монтаж лесов для обработки фасада или эстакады добавляет 25–40% к общей смете. Пескоструйная обработка металлоконструкций промальп-бригадой ведётся с верёвочных систем и беседок — без разрешений на установку временных сооружений и без простоя производства.",
  },
  {
    title: "Работа без остановки производства.",
    body: "Альпинисты занимают только обрабатываемый участок — остальная площадь цеха или объекта остаётся в работе. Пескоструйка без лесов не требует перегораживания дорог или временного демонтажа оборудования под зоной работ.",
  },
  {
    title: "Доступ к труднодоступным местам.",
    body: "Обратные стороны балок, рёбра жёсткости, соединительные узлы и фланцы — места, куда вышка физически не дотянется. Промышленный альпинист работает в любом пространственном положении и управляет соплом вручную.",
  },
  {
    title: "Скорость выезда.",
    body: "После согласования ТЗ и передачи аванса бригада выезжает через 1–2 рабочих дня. Не нужно ждать доставки лесов, получать разрешение на перекрытие улицы или освобождать площадку.",
  },
  {
    title: "Работа в сложных условиях.",
    body: "При температуре до -10°C (с использованием инфракрасных нагревателей для подогрева поверхности до точки росы) и влажности воздуха ≤80% — возможна с ограничениями, согласованными с заказчиком.",
  },
];

const pricingRows = [
  { material: "Металл",  sa1: "410 ₽/м²",  sa2: "~504 ₽/м²",  sa25: "~640 ₽/м²",  sa3: "~955 ₽/м²"  },
  { material: "Бетон",   sa1: "430 ₽/м²",  sa2: "~529 ₽/м²",  sa25: "~671 ₽/м²",  sa3: "~1002 ₽/м²" },
  { material: "Кирпич",  sa1: "380 ₽/м²",  sa2: "~467 ₽/м²",  sa25: "~593 ₽/м²",  sa3: "~885 ₽/м²"  },
];

const pricingFactors = [
  { title: "Степень очистки (Sa)", body: "главный фактор: Sa 3.0 в 2.33 раза дороже Sa 1.0" },
  { title: "Материал поверхности", body: "бетон чуть дороже металла из-за большего расхода абразива" },
  { title: "Ширина элемента", body: "для узких элементов <50 мм применяется коэффициент ×2.00 (труднодоступность)" },
  { title: "Высота и регион", body: "региональные коэффициенты от 0.8 до 2.0 (Москва/Санкт-Петербург)" },
  { title: "Тип абразива", body: "купершлак дешевле стальной дроби, но одноразовый; стальная дробь многоразовая, подходит для закрытых помещений" },
];

const faq = [
  {
    question: "Что такое пескоструйная очистка металла и как она работает?",
    answer: "Пескоструйная очистка металла — это абразивно-струйная обработка поверхности частицами абразива (кварцевый песок, купершлак, стальная дробь), которые подаются сжатым воздухом под давлением 6–8 атм. Частицы ударяются о металл, удаляют ржавчину, окалину и старое покрытие, одновременно формируя шероховатость поверхности (профиль Rz 40–100 мкм) для лучшей адгезии грунтовки.",
  },
  {
    question: "Чем отличается пескоструйная обработка промальпом от стационарной пескоструйки в цехе?",
    answer: "Стационарная пескоструйка в цехе требует демонтажа конструкции и транспортировки в камеру. Пескоструйная обработка промальпом — это работа на месте, на высоте, без демонтажа. Мы приезжаем к объекту, навешиваем верёвочные системы и выполняем обработку непосредственно на конструкции. Это исключает затраты на транспортировку, риски повреждения при перевозке и простой объекта.",
  },
  {
    question: "Какую степень очистки выбрать: Sa 2, Sa 2.5 или Sa 3?",
    answer: "Выбор зависит от типа антикоррозийного покрытия. Sa 2 подходит для бюджетных алкидных систем. Sa 2.5 — оптимальный выбор для двухкомпонентных эпоксидных и цинкнаполненных грунтов, используется в 80% промышленных проектов. Sa 3 («белый металл») нужен только под специальные покрытия для подводных конструкций, судовых объектов или высокоагрессивных сред. В большинстве случаев мы рекомендуем Sa 2.5 как баланс качества и стоимости.",
  },
  {
    question: "Сколько стоит пескоструйная очистка металлоконструкций за 1 м²?",
    answer: "Цена пескоструйной обработки металлоконструкций — от 410 ₽/м² (Sa 1.0) до 955 ₽/м² (Sa 3.0). Для ориентира: пескоструйка металлоконструкций цена при Sa 2.5 — около 640 ₽/м² по металлу. Итоговая смета зависит от площади, степени очистки, типа материала, высоты объекта и региона. Точный расчёт — в калькуляторе или по звонку.",
  },
  {
    question: "Можно ли делать пескоструйку без строительных лесов на высоте?",
    answer: "Да — именно это наш основной профиль. Промышленные альпинисты MS-PRO выполняют пескоструйную очистку на высоте без лесов и без подъёмной техники. Используем верёвочные системы двойного страхования и специальные беседки для точного позиционирования у поверхности. Максимальная высота работ — 200 м.",
  },
  {
    question: "Через какое время после пескоструйки нужно наносить грунтовку?",
    answer: "Межоперационный интервал — не более 4–6 часов в нормальных условиях (температура >+5°C, влажность <80%). Если выдержать этот интервал невозможно, поверхность нужно загрунтовать предварительной защитной грунтовкой (wash-primer). MS-PRO организует параллельную работу бригад, чтобы чистка и грунтование шли в непрерывном потоке.",
  },
  {
    question: "Какой абразив лучше: кварцевый песок, купершлак или стальная дробь?",
    answer: "Зависит от условий работы. Кварцевый песок — бюджетный вариант, однократного применения, не рекомендован в закрытых помещениях из-за кремниевой пыли. Купершлак — оптимум по цене/качеству для открытых объектов, однократный. Стальная дробь — многоразовая, идеальна для закрытых дробемётных камер, даёт равномерный профиль поверхности. На объектах на высоте применяем купершлак или кварцевый песок с пылеулавливающим оборудованием.",
  },
  {
    question: "Можно ли пескоструить при минусовой температуре или дожде?",
    answer: "При дожде работы не ведём — влага на поверхности мгновенно окисляет очищенный металл. При минусовой температуре (до -10°C) работа возможна при условии: влажность ≤75%, разница между температурой воздуха и точкой росы ≥3°C, поверхность прогрета инфракрасными нагревателями выше нуля. Каждый случай согласовываем индивидуально.",
  },
];

export default function Sandblasting() {
  useEffect(() => {
    document.title = "Пескоструйная очистка металла без лесов | MS-PRO";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Пескоструйная обработка металлоконструкций без лесов. Степени Sa 1–Sa 3 (ISO 8501). Цена от 410 ₽/м². Выезд за 1–2 дня. Звоните: +7 (987) 909-29-38."
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
      "name": "Пескоструйная очистка металла промышленными альпинистами",
      "description": "Пескоструйная обработка металлоконструкций без лесов. Степени Sa 1–Sa 3 (ISO 8501). Цена от 410 ₽/м².",
      "url": "https://mspro-ltd.ru/services/sandblasting",
      "provider": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru" },
      "areaServed": { "@type": "Country", "name": "Россия" },
      "serviceType": "Пескоструйная очистка металла",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "RUB",
        "price": "410",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "410",
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
      "headline": "Пескоструйная очистка металла промышленными альпинистами",
      "description": "Пескоструйная обработка металлоконструкций без лесов. Степени Sa 1–Sa 3 (ISO 8501). Цена от 410 ₽/м².",
      "url": "https://mspro-ltd.ru/services/sandblasting",
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
            <Zap className="h-4 w-4" />
            СРО (стройка) член №{CREDENTIALS.sroConstruction.memberNumber}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-sandblasting-h1">
            Пескоструйная очистка металла промышленными альпинистами
          </h1>
          <p className="mt-6 text-lg text-muted-foreground" data-testid="text-sandblasting-intro">
            Пескоструйная очистка металла на высоте — без строительных лесов и автовышек — основной профиль MS-PRO.
            Промышленные альпинисты проводят пескоструйную обработку металлоконструкций, трубопроводов и резервуаров
            до степени Sa 3.0 по ISO 8501, обеспыливают поверхность и допускают её к нанесению грунтовки в течение
            одного выезда. Работаем на объектах высотой от 5 до 200 м. Выезд за 1–2 рабочих дня после согласования ТЗ.
            Выдаём акты скрытых работ и фотоотчёт по каждому участку.
          </p>
        </div>

        {/* Объекты */}
        <section className="mt-16" id="objects">
          <h2 className="text-2xl font-bold" data-testid="text-objects-heading">
            Для каких объектов применяется пескоструйная очистка
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
                    — следующий этап после пескоструйной очистки.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Степени Sa по ISO 8501 */}
        <section className="mt-16" id="sa-degrees">
          <h2 className="text-2xl font-bold" data-testid="text-sa-heading">
            Степени очистки металла по ISO 8501 — что выбрать
          </h2>
          <p className="mt-4 text-muted-foreground">
            Стандарт ISO 8501 (ГОСТ 9.402 в российской редакции) делит абразивно-струйную очистку металла
            на четыре степени по количеству остаточных загрязнений. Степень Sa 2.5 — наиболее востребованный уровень
            для промышленных объектов: обеспечивает адгезию ≥5 МПа для двухкомпонентных эпоксидных систем.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm" data-testid="sa-degrees-table">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-semibold">Степень</th>
                  <th className="py-3 text-left font-semibold">Что остаётся на поверхности</th>
                  <th className="py-3 text-left font-semibold">Для каких ЛКМ</th>
                  <th className="py-3 text-right font-semibold">Цена (металл)</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {saDegrees.map((row, index) => (
                  <tr key={index} className={`border-b last:border-0 ${index === 2 ? "font-medium" : ""}`}>
                    <td className="py-3 font-medium text-foreground whitespace-nowrap">{row.degree}</td>
                    <td className="py-3">{row.remains}</td>
                    <td className="py-3">{row.suitable}</td>
                    <td className="py-3 text-right font-semibold text-foreground whitespace-nowrap">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Этапы */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-steps-heading">
            Технология работ — этапы пескоструйной обработки
          </h2>
          <p className="mt-4 text-muted-foreground">
            Каждый этап влияет на итоговое качество. Межоперационный интервал между пескоструйной очисткой
            и нанесением грунтовки — не более 4–6 часов. MS-PRO работает двумя бригадами параллельно:
            одна чистит, вторая грунтует следом.
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

        {/* Почему лучше чем леса */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-advantages-heading">
            Почему пескоструйная очистка на высоте лучше, чем на земле с лесами
          </h2>
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
            Стоимость пескоструйной очистки металла
          </h2>
          <p className="mt-4 text-muted-foreground">
            Пескоструйка металлоконструкций: цена за 1 м² зависит от степени Sa и материала поверхности.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm" data-testid="pricing-table">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-semibold">Материал / Степень Sa</th>
                  <th className="py-3 text-right font-semibold">Sa 1.0</th>
                  <th className="py-3 text-right font-semibold">Sa 2.0</th>
                  <th className="py-3 text-right font-semibold">Sa 2.5</th>
                  <th className="py-3 text-right font-semibold">Sa 3.0</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {pricingRows.map((row, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 font-medium text-foreground">{row.material}</td>
                    <td className="py-3 text-right">{row.sa1}</td>
                    <td className="py-3 text-right">{row.sa2}</td>
                    <td className="py-3 text-right font-semibold text-foreground">{row.sa25}</td>
                    <td className="py-3 text-right">{row.sa3}</td>
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
                Рассчитать стоимость в калькуляторе
              </Button>
            </Link>
          </div>
          <p className="mt-4 font-medium">
            Введите площадь, тип материала, степень Sa и город — получите ориентировочную смету за 30 секунд.
            Звоните: +7 (987) 909-29-38.
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
            FAQ — частые вопросы о пескоструйной очистке
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
            Получить расчёт стоимости
          </h2>
          <p className="mt-2 text-muted-foreground">
            Оставьте заявку — перезвоним в течение 1 часа, уточним объём и согласуем выезд на объект.
            Работаем по всей России.
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
            <Link href="/services/rope-access" className="text-primary underline underline-offset-2">
              Промышленный альпинизм
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
