import { useEffect } from "react";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { CREDENTIALS } from "@/content/copySystem";

const objects = [
  {
    title: "Металлоконструкции на высоте — балки, фермы, стойки, колонны",
    body: "Балки перекрытий, стропильные фермы и колонны каркасных зданий — типичные объекты для очистки металла от старой краски и продуктов коррозии. Промышленные альпинисты работают непосредственно у поверхности с беседки, обеспечивая равномерный результат на сложных профилях. Леса для таких конструкций потребовали бы нескольких недель монтажа и демонтажа — промальп справляется за 1–2 рабочих дня.",
  },
  {
    title: "Трубопроводы и трубные системы снаружи",
    body: "Наружные поверхности трубопроводов со временем покрываются слоями ржавчины и отслаивающейся краски. Механическая очистка металлоконструкций такого типа выполняется вдоль магистрали с помощью болгарки и проволочной щётки, а труднодоступные стыки и фланцы обрабатываются шабером. Промальп перемещается по горизонтальным и вертикальным участкам, не требуя стационарных подмостей.",
  },
  {
    title: "Промышленное оборудование — корпуса, ёмкости, резервуары",
    body: "Корпуса промышленных агрегатов, мешалки, реакторы и наружные поверхности резервуаров требуют регулярной очистки перед переокраской. Химсмывка размягчает отслоившееся покрытие без повреждения металла, а шабер удаляет остатки в рёбрах жёсткости и приварных патрубках. Промальп достигает верхних поясов ёмкостей и опорных конструкций без аренды телескопической вышки.",
  },
  {
    title: "Металлические фасады, ограждения и лестницы",
    body: "Фасадные панели из профнастила, металлические ограждения и лестничные марши с коррозионным поражением нуждаются в полной очистке поверхности перед покраской. Для таких работ подходят болгарка с лепестковым кругом и проволочная щётка — они быстро снимают рыхлую ржавчину и обеспечивают степень St 2, достаточную для большинства антикоррозийных систем.",
  },
];

const methods = [
  {
    name: "Матирование (наждачная бумага)",
    priceBase: "от 140 ₽/м²",
    priceSt3: "от 182 ₽/м²",
    description:
      "Лёгкая зачистка поверхности для улучшения адгезии перед покраской: не удаляет ржавчину, лишь придаёт металлу шероховатость. Применяется на относительно чистых поверхностях как межоперационная обработка между слоями ЛКМ.",
  },
  {
    name: "Проволочная щётка",
    priceBase: "от 230 ₽/м²",
    priceSt3: "от 299 ₽/м²",
    description:
      "Удаляет рыхлую ржавчину, отслаивающуюся краску и поверхностные загрязнения. Применяется при лёгкой степени коррозии или как финишный проход после болгарки. Не удаляет плотно сцепленную краску и окалину.",
  },
  {
    name: "УШМ (болгарка)",
    priceBase: "от 250 ₽/м²",
    priceSt3: "от 325 ₽/м²",
    description:
      "Основной рабочий инструмент: лепестковый круг или зачистной диск снимают ржавчину, стойкую краску и окалину за одну-две проходки. Обеспечивает степень St 2 и, при дополнительном проходе, St 3. Оптимальное решение для большинства задач.",
  },
  {
    name: "Кислотная промывка",
    priceBase: "от 480 ₽/м²",
    priceSt3: "от 624 ₽/м²",
    description:
      "Химическое растворение ржавчины фосфорной кислотой. Эффективна при диффузной коррозии. После кислоты обязательна нейтрализация и промывка. Применяется в паре с болгаркой: сначала кислота, затем финишная зачистка.",
  },
  {
    name: "Шабер",
    priceBase: "от 580 ₽/м²",
    priceSt3: "от 754 ₽/м²",
    description:
      "Инструмент для труднодоступных мест: узлов болтовых соединений, фланцев, ребристых поверхностей, сварных швов и внутренних углов, куда болгарка не достаёт. Незаменим для качественной очистки сложных профилей.",
  },
  {
    name: "Химсмывка",
    priceBase: "от 620 ₽/м²",
    priceSt3: "от 806 ₽/м²",
    description:
      "Применяется там, где очистка болгаркой невозможна из-за тонкостенного профиля или сложной геометрии. Щелочные составы или на основе метиленхлорида размягчают эпоксидные, алкидные, полиуретановые покрытия без повреждения металла.",
  },
];

const stDegrees = [
  {
    degree: "St 2 — тщательная",
    result: "Рыхлая ржавчина, отслаивающаяся краска и окалина удалены. Металл сероватый с остатками плотно сцепленных загрязнений.",
    suitable: "Стандартные антикоррозийные грунты: алкидные, эпоксидные, цинконаполненные",
    modifier: "базовая цена",
  },
  {
    degree: "St 3 — очень тщательная",
    result: "Все загрязнения удалены до металлического блеска. Результат визуально близок к пескоструйке Sa 2.",
    suitable: "Высококачественные многослойные эпоксидные и полиуретановые системы; агрессивные среды",
    modifier: "×1.3 к базовой цене",
  },
];

const steps = [
  {
    step: 1,
    title: "Обследование объекта",
    description:
      "Замеры, оценка степени коррозионного поражения, определение метода и требуемой степени St по ТЗ. Фотофиксация исходного состояния.",
  },
  {
    step: 2,
    title: "ППР и наряд-допуск",
    description:
      "Оформление проекта производства работ на высоте и наряда-допуска. Подготовка и проверка страховочного снаряжения, точек анкеровки.",
  },
  {
    step: 3,
    title: "Монтаж промальп-снаряжения",
    description: "Установка анкеров, навеска тросов, подготовка беседок. Инструктаж бригады по безопасности.",
  },
  {
    step: 4,
    title: "Подготовка поверхности",
    description:
      "Обдув сжатым воздухом, удаление пыли, следов масел и смазок. Влажная поверхность должна быть высушена — механическая обработка на влажном металле недопустима.",
  },
  {
    step: 5,
    title: "Механическая обработка",
    description:
      "Удаление ржавчины болгаркой, щёткой, шабером или нанесение химсмывки до достижения требуемой степени St. Труднодоступные узлы обрабатываются шабером и ручной щёткой.",
  },
  {
    step: 6,
    title: "Обеспыливание и контроль",
    description:
      "Сдув пыли и металлических частиц, осмотр поверхности на предмет пропущенных участков. Повторная обработка проблемных зон.",
  },
  {
    step: 7,
    title: "Допуск к грунтовке",
    description:
      "Фотофиксация результата, сравнение с эталонными образцами по ISO 8501. Акт выполненных работ с указанием достигнутой степени St.",
  },
];

const advantages = [
  {
    title: "Экономия на инфраструктуре.",
    body: "Монтаж строительных лесов для одного пролёта добавляет 25–40% к бюджету. При механической очистке на высоте промальп приступает к работе через 1–2 дня после согласования ТЗ — без разрешений на установку временных сооружений.",
  },
  {
    title: "Работа без остановки производства.",
    body: "Доступ только к нужному участку: цех продолжает работать, движение транспорта не перекрывается. Особенно важно для действующих промышленных объектов.",
  },
  {
    title: "Доступ в труднодоступные зоны.",
    body: "Обратные стороны балок, узлы, фланцы и ребристые поверхности — промальп добирается туда, куда не доходит рука с лесов. Шабер и ручная щётка обеспечивают требуемую степень St даже в самых узких местах.",
  },
  {
    title: "Совмещение операций в одном выезде.",
    body: "Механическая очистка металлоконструкций совмещается с грунтованием и нанесением первого слоя антикоррозийной системы — это сокращает время между очисткой и грунтовкой и снижает риск вторичного окисления.",
  },
  {
    title: "Скорость реакции.",
    body: "При аварийном коррозионном поражении выезд бригады — через 1–2 рабочих дня. Нет необходимости ждать монтажа лесов или согласования аренды подъёмника.",
  },
];

const pricingFactors = [
  {
    title: "Метод очистки",
    body: "от дешёвого матирования (140 ₽/м²) до химсмывки (620 ₽/м²)",
  },
  {
    title: "Степень очистки",
    body: "St 3 дороже St 2 на 30% (коэффициент ×1.3)",
  },
  {
    title: "Ширина элемента",
    body: "узкие профили менее 300 мм тарифицируются с повышающим коэффициентом",
  },
  {
    title: "Высота объекта",
    body: "увеличивает время монтажа промальп-снаряжения",
  },
  {
    title: "Регион",
    body: "+20% к базе для Москвы, −10% для ряда регионов",
  },
];

const faq = [
  {
    question: "Что такое механическая очистка металла и чем она отличается от пескоструйки?",
    answer:
      "Механическая очистка металла — удаление ржавчины, старых ЛКМ и окалины ручным или электроинструментом: болгаркой, щёткой, шабером. В отличие от пескоструйной очистки, она не создаёт выраженного профиля поверхности и достигает степеней St 2–St 3, а не Sa. Для стандартных антикоррозийных систем механической очистки до St 2–St 3 достаточно; для высококачественных многослойных покрытий нужна пескоструйка до Sa 2.5.",
  },
  {
    question: "Какой метод лучше: проволочная щётка, болгарка (УШМ) или химсмывка?",
    answer:
      "Зависит от задачи. Щётка подходит при лёгкой поверхностной ржавчине (230 ₽/м²). Болгарка — универсальный вариант для большинства случаев (250 ₽/м²): быстро, до St 2–St 3. Химсмывка (620 ₽/м²) нужна, когда надо снять старую эпоксидную или полиуретановую краску без механических нагрузок на металл. Для труднодоступных узлов применяется шабер (580 ₽/м²). Чаще всего методы комбинируются в одном выезде.",
  },
  {
    question: "Что означают степени St 2 и St 3 по ISO 8501 при механической очистке?",
    answer:
      "St 2 — тщательная очистка: удалена рыхлая ржавчина и краска, металл сероватый с остатками плотно сцепленных загрязнений. St 3 — очень тщательная: поверхность до металлического блеска, без видимых следов ржавчины, результат близок к пескоструйке Sa 2. St 3 применяется под высококачественные ЛКМ и в агрессивных условиях; стоит на 30% дороже St 2.",
  },
  {
    question: "Сколько стоит механическая очистка металлоконструкций за 1 м²?",
    answer:
      "Механическая очистка металла цена зависит от метода: матирование от 140 ₽/м², проволочная щётка от 230 ₽/м², болгарка от 250 ₽/м², кислотная промывка от 480 ₽/м², шабер от 580 ₽/м², химсмывка от 620 ₽/м². При степени St 3 добавляется коэффициент ×1.3. Региональные коэффициенты: Москва +20%, ряд регионов −10%. Точную смету — в калькуляторе.",
  },
  {
    question: "Можно ли делать механическую очистку металла на высоте без строительных лесов?",
    answer:
      "Да, это специализация MS-PRO: механическая очистка металлоконструкций промальпом выполняется без лесов и подъёмников. Промышленные альпинисты работают на беседках и тросовых системах, добираясь до балок, ферм, трубопроводов и фасадов на любой высоте. Экономия на отказе от лесов — 25–40% бюджета, время выезда — 1–2 рабочих дня.",
  },
  {
    question: "Через какое время после механической очистки нужно наносить грунтовку?",
    answer:
      "Не позднее 4–6 часов после очистки при температуре +5…+25°C и относительной влажности до 80%. При более высокой влажности металл начинает окисляться быстрее — грунтование нужно провести как можно скорее. Откладывать грунтовку нельзя: повторное ржавление потребует дополнительной очистки и увеличивает итоговую стоимость работ.",
  },
  {
    question: "Можно ли удалить старую краску и ржавчину за один проход?",
    answer:
      "В большинстве случаев — да. Болгарка с лепестковым кругом удаляет и краску, и ржавчину за одну операцию. При наличии нескольких слоёв стойкой краски рекомендуется предварительная обработка химсмывкой, затем — финишная зачистка болгаркой до нужной степени St. Такой тандем даёт оптимальное соотношение скорости и стоимости.",
  },
  {
    question: "Как очистить труднодоступные места: фланцы, узлы, ребристые поверхности?",
    answer:
      "Для фланцев, болтовых узлов, ребристых и угловых поверхностей применяется шабер — ручной инструмент с различной формой рабочей части (плоской, треугольной, крючковой). При необходимости используется проволочная щётка малого диаметра. Антикоррозийная защита в таких зонах наносится кистью, а не валиком, для гарантированного заполнения всех зазоров.",
  },
];

export default function MechanicalCleaning() {
  useEffect(() => {
    document.title = "Механическая очистка металла без лесов | MS-PRO";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Механическая очистка металлоконструкций от ржавчины промальпом. Болгарка, щётка, шабер, химсмывка. Степени St 2–St 3. От 140 ₽/м². Звоните: +7 (987) 909-29-38."
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
      "name": "Механическая очистка металла промышленными альпинистами",
      "description":
        "Механическая очистка металлоконструкций от ржавчины промальпом. Болгарка, щётка, шабер, химсмывка. Степени St 2–St 3. От 140 ₽/м².",
      "url": "https://mspro-ltd.ru/services/mechanical-cleaning",
      "provider": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru" },
      "areaServed": { "@type": "Country", "name": "Россия" },
      "serviceType": "Механическая очистка металла",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "RUB",
        "price": "140",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "140",
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
      "headline": "Механическая очистка металла промышленными альпинистами",
      "description":
        "Механическая очистка металлоконструкций от ржавчины промальпом. Болгарка, щётка, шабер, химсмывка. Степени St 2–St 3. От 140 ₽/м².",
      "url": "https://mspro-ltd.ru/services/mechanical-cleaning",
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
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-mechanical-cleaning-h1">
            Механическая очистка металла от ржавчины и старой краски промышленными альпинистами
          </h1>
          <p className="mt-6 text-lg text-muted-foreground" data-testid="text-mechanical-cleaning-intro">
            Механическая очистка металла от ржавчины и старой краски — одна из ключевых подготовительных операций
            перед нанесением антикоррозийных покрытий. MS-PRO выполняет механическую очистку металлоконструкций
            без строительных лесов и подъёмников на любой высоте: болгаркой, проволочной щёткой, шабером, химсмывкой.
            Степень очистки — от St 2 до St 3 по ISO 8501. Удаление ржавчины и снятие старых ЛКМ в одном выезде.
            Выезд за 1–2 рабочих дня. Звоните: +7&nbsp;(987)&nbsp;909-29-38.
          </p>
        </div>

        {/* Объекты */}
        <section className="mt-16" id="objects">
          <h2 className="text-2xl font-bold" data-testid="text-objects-heading">
            Для каких объектов применяется механическая очистка металла
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
                    — следующий этап после механической очистки.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Методы очистки */}
        <section className="mt-16" id="methods">
          <h2 className="text-2xl font-bold" data-testid="text-methods-heading">
            Методы механической очистки металла — что выбрать
          </h2>
          <p className="mt-4 text-muted-foreground">
            Выбор метода зависит от типа загрязнения, состояния поверхности, требуемой степени очистки и доступности
            участков. Ниже — все шесть методов с базовыми ценами из прайса MS-PRO.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm" data-testid="methods-table">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-semibold">Метод</th>
                  <th className="py-3 text-right font-semibold whitespace-nowrap">St 2 (базовая)</th>
                  <th className="py-3 text-right font-semibold whitespace-nowrap">St 3 (×1.3)</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {methods.map((m, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 font-medium text-foreground">{m.name}</td>
                    <td className="py-3 text-right font-semibold text-foreground whitespace-nowrap">{m.priceBase}</td>
                    <td className="py-3 text-right whitespace-nowrap">{m.priceSt3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 space-y-6">
            {methods.map((m, index) => (
              <div key={index} data-testid={`method-item-${index}`}>
                <h3 className="font-semibold">
                  {m.name} — {m.priceBase}
                </h3>
                <p className="mt-1 text-muted-foreground">{m.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Степени St */}
        <section className="mt-16" id="st-degrees">
          <h2 className="text-2xl font-bold" data-testid="text-st-heading">
            Степени очистки металла St 2 и St 3 по ISO 8501
          </h2>
          <p className="mt-4 text-muted-foreground">
            Степени ручной и механической очистки обозначаются по стандарту ISO 8501-1 через аббревиатуру St
            (ручная и механическая подготовка поверхности инструментом).
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm" data-testid="st-degrees-table">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-semibold">Степень</th>
                  <th className="py-3 text-left font-semibold">Результат</th>
                  <th className="py-3 text-left font-semibold">Для каких ЛКМ</th>
                  <th className="py-3 text-right font-semibold">Стоимость</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {stDegrees.map((row, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 font-medium text-foreground whitespace-nowrap">{row.degree}</td>
                    <td className="py-3">{row.result}</td>
                    <td className="py-3">{row.suitable}</td>
                    <td className="py-3 text-right font-semibold text-foreground whitespace-nowrap">{row.modifier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Важно не путать St (механическая очистка) и Sa (абразивно-струйная).{" "}
            <Link href="/services/sandblasting" className="text-primary underline underline-offset-2">
              Sa 2.5 и Sa 3 достигаются только пескоструйкой
            </Link>{" "}
            — это разные стандарты.
          </p>
        </section>

        {/* Этапы */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-steps-heading">
            Технология работ — этапы механической очистки
          </h2>
          <p className="mt-4 text-muted-foreground">
            После механической очистки металл начинает окисляться заново. Нанести антикоррозийную грунтовку нужно
            не позднее 4–6 часов после очистки при нормальных условиях; при высокой влажности — быстрее.
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
            Механическая очистка металла на высоте без лесов
          </h2>
          <p className="mt-4 text-muted-foreground">
            Механическая очистка на высоте без лесов избавляет заказчика от аренды подмостей, вышек и согласований
            на их установку. Промышленные альпинисты MS-PRO работают на беседках и тросовых системах, достигая
            любых участков несущих конструкций.
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
            Стоимость механической очистки металлоконструкций
          </h2>
          <p className="mt-4 text-muted-foreground">
            Механическая очистка металла цена за 1 м² зависит от метода и требуемой степени St.
            Базовые расценки (степень St 2, без учёта региональных коэффициентов):
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm" data-testid="pricing-table">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-semibold">Метод</th>
                  <th className="py-3 text-right font-semibold">St 2 (базовая)</th>
                  <th className="py-3 text-right font-semibold">St 3 (×1.3)</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {methods.map((m, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 font-medium text-foreground">{m.name}</td>
                    <td className="py-3 text-right font-semibold text-foreground whitespace-nowrap">{m.priceBase}</td>
                    <td className="py-3 text-right whitespace-nowrap">{m.priceSt3}</td>
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
            Введите площадь, метод очистки и город — получите ориентировочную смету за 30 секунд.
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
            FAQ — частые вопросы о механической очистке металла
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
            Опишите объект и задачу: высота, площадь, степень коррозионного поражения, предпочтительный метод.
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
            <Link href="/services/sandblasting" className="text-primary underline underline-offset-2">
              Пескоструйная очистка металла
            </Link>
            <Link href="/services/anticorrosion-at-height" className="text-primary underline underline-offset-2">
              Антикоррозийная защита металлоконструкций
            </Link>
            <Link href="/services/rope-access" className="text-primary underline underline-offset-2">
              Промышленный альпинизм
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
