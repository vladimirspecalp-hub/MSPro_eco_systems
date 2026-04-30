import { useEffect } from "react";
import { Flame, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { CREDENTIALS } from "@/content/copySystem";

const objects = [
  {
    title: "Огнезащита ЛЭП и опор электропередач",
    body: "Металлические опоры воздушных линий электропередач относятся к объектам повышенного класса опасности. Охранная зона запрещает использование автокрана. Промышленный альпинизм — единственный нормативно допустимый метод нанесения огнезащитных составов без отключения линии. Применяем покрытия, стойкие к вибрационным нагрузкам, ультрафиолету и перепадам температур: от −40°C до +60°C. Работаем по нарядам-допускам, согласованным с сетевой организацией.",
    link: { href: "/services/anticorrosion-at-height", text: "Антикоррозионная защита металлоконструкций" },
    linkSuffix: " на тех же опорах — отдельная услуга в нашем портфеле.",
  },
  {
    title: "Огнезащита АМС, вышек и мачт связи",
    body: "Антенно-мачтовые сооружения высотой 50–150 м — один из наиболее технически сложных объектов огнезащитной обработки. Ограниченный доступ в каждой секции мачты, оцинкованные и заранее окрашенные поверхности, работающее телекоммуникационное оборудование. Тонкослойная вспучивающаяся краска — основной тип покрытия для АМС: минимальный вес, нанесение без остановки объекта, R-класс от R15 до R60. Подбираем состав совместимый с оцинкованным основанием.",
  },
  {
    title: "Огнезащита дымовых труб",
    body: "Промышленные дымовые трубы высотой до 150 м работают в условиях высоких температур поверхности (до 200°C и выше) и агрессивной среды. Стандартные огнезащитные краски не подходят — нужны термостойкие огнезащитные составы. MSPRO подбирает покрытия, сертифицированные как по огнезащитным, так и по термостойким характеристикам.",
    link: { href: "/services/demolition", text: "Демонтаж перед огнезащитой на высоте" },
    linkSuffix: " разрушенных элементов оголовка выполняем в рамках комплексного выезда.",
  },
  {
    title: "Огнезащита несущих металлоконструкций зданий",
    body: "Колонны, балки, фермы перекрытий, площадки обслуживания цехов и технологических корпусов — огнезащита этих конструкций нередко выполняется в условиях действующего производства. Промальп позволяет работать в ограниченной зоне без остановки смежных технологических процессов. Нанесение ведётся по согласованным рабочим зонам с нарядом-допуском и СОУТ. Для конструкций с требуемым R90–R120 применяем как тонкослойные многослойные системы, так и штукатурные составы.",
  },
];

const steps = [
  {
    step: 1,
    title: "Обследование: определение нормируемого R-класса",
    description: "Изучение проектной документации или предписания пожарного надзора, определение требуемого предела огнестойкости (R15–R120). Осмотр конструкций: степень коррозии, состояние существующих покрытий, условия доступа. По итогам — дефектная ведомость и рекомендации по системе огнезащиты.",
  },
  {
    step: 2,
    title: "Выбор системы покрытий",
    description: "Тонкослойная вспучивающаяся краска (R15–R90, слой 1–5 мм) или толстослойный штукатурный состав (R60–R120, слой 10–50 мм) — выбор определяется требуемым R-классом, типом конструкции, условиями эксплуатации. Согласовываем систему с заказчиком и проектировщиком до начала работ.",
  },
  {
    step: 3,
    title: "Подготовка поверхности",
    description: "Очистка от ржавчины, старых покрытий и загрязнений, обезжиривание. Критический параметр: влажность металла не более 4% перед нанесением (контролируем влагомером). Подготовка поверхности напрямую влияет на адгезию и фактический срок службы огнезащитного покрытия.",
  },
  {
    step: 4,
    title: "Нанесение огнезащитного слоя",
    description: "Нанесение по технологическому регламенту: контроль DFT (толщины сухого слоя) на каждом слое, соблюдение межслойной выдержки, фиксация условий работ (температура воздуха ≥ +5°C, относительная влажность ≤ 80%). Фотофиксация по захваткам.",
  },
  {
    step: 5,
    title: "Приёмо-сдаточный контроль и исполнительная документация",
    description: "Замер итогового DFT по ГОСТ Р 53295, проверка адгезии, оформление акта освидетельствования огнезащитного покрытия, передача сертификата соответствия состава. Комплект ИД — по стандартам заказчика или договора.",
  },
];

const whenNeeded = [
  {
    title: "Нет места для автовышки или крана.",
    body: "Плотная застройка промышленной зоны, узкие проходы между корпусами, внутреннее пространство цеха с низкими пролётами.",
    link: { href: "/services/rope-access", text: "Промышленный альпинизм на промобъектах" },
    linkSuffix: " — метод без ограничений по геометрии.",
  },
  {
    title: "Объект в охранной зоне ЛЭП.",
    body: "Кран в охранной зоне запрещён нормативно. Промальп — разрешённый метод без отключения линии и согласования с диспетчером энергосистемы.",
  },
  {
    title: "Действующее производство нельзя остановить.",
    body: "Работаем в согласованных рабочих зонах по нарядам-допускам. Огнезащита конструкций цеха выполняется в плановые технологические окна или в ограниченной зоне параллельно с производством.",
  },
  {
    title: "Разовые работы или небольшой объём.",
    body: "Монтаж строительных лесов для 50–200 м² огнезащиты обходится сопоставимо с самими работами. Промальп разворачивается за 2–4 часа без несущих конструкций.",
  },
  {
    title: "Высота 30–150 м: АМС, трубы, башни.",
    body: "Автовышка не дотянется, кран потеряет грузоподъёмность до нуля при малом вылете. Промальп работает на любой высоте в пределах длины верёвки и точек крепления.",
  },
];

const materials = [
  {
    title: "Тонкослойные вспучивающиеся покрытия (интумесцентные краски)",
    description: "Покрытия для R15–R90. Сухой слой 1–5 мм; при нагреве вспучиваются в 20–50 раз, образуя теплоизолирующий кокон. Лёгкие, эстетичные, наносятся безвоздушным распылением или кистью. Основной выбор для видимых конструкций на АМС, ЛЭП и в помещениях.",
  },
  {
    title: "Толстослойные огнезащитные штукатурки (цементные и гипсовые составы)",
    description: "Для R60–R120 при высоких требованиях. Слой 10–50 мм; значительная нагрузка на конструкцию. При работе на высоте методом промальп применяется реже из-за массы, но MSPRO имеет опыт нанесения на площадках обслуживания зданий.",
  },
  {
    title: "Огнезащитные лаки",
    description: "Для R15 там, где необходимо сохранить эстетику. Тонкий слой без изменения внешнего вида конструкции. Применяются в административных и торговых помещениях, реже — на промобъектах.",
  },
];

const faq = [
  {
    question: "Что такое огнезащита металлоконструкций?",
    answer: "Огнезащита металлоконструкций — нанесение специальных составов на стальные конструкции для повышения их предела огнестойкости. По требованиям ФЗ-123 и СП 2.13130 несущие металлоконструкции зданий обязаны иметь нормируемый R-класс. Без огнезащиты сталь теряет несущую способность при пожаре за 15–20 минут. Применяется на промышленных объектах, ЛЭП, АМС, дымовых трубах и несущих конструкциях зданий.",
  },
  {
    question: "Сколько стоит огнезащита металлоконструкций на высоте?",
    answer: "От 700 ₽/м² для стандартной тонкослойной системы R30 при работе методом промышленного альпинизма (материал MSPRO, объём от 100 м²). Итоговая цена зависит от требуемого R-класса, высоты и сложности доступа, состояния поверхности, объёма и наличия готового ТЗ. Точный расчёт — в калькуляторе или по запросу КП за 1 час.",
  },
  {
    question: "Какой предел огнестойкости нужен для металлоконструкций?",
    answer: "Нормируемый предел огнестойкости (R-класс) определяется по СП 2.13130 исходя из типа здания, класса функциональной пожарной опасности и степени огнестойкости. Для несущих конструкций промышленных объектов — обычно R60–R120; для вспомогательных — R15–R30. Точный R-класс указывается в проектной документации или предписании государственного пожарного надзора. Самостоятельно назначать R-класс без проекта нельзя.",
  },
  {
    question: "Чем отличается тонкослойная огнезащита от толстослойной?",
    answer: "Тонкослойная (интумесцентная краска) — сухой слой 1–5 мм, R15–R90, лёгкая, эстетичная, наносится безвоздушным распылением. При нагреве вспучивается, образуя теплоизолирующий слой. Толстослойная (штукатурный состав) — слой 10–50 мм, R60–R120, тяжелее, сложнее в нанесении на высоте. Для промальп-объектов предпочтительна тонкослойная: меньше нагрузка на конструкцию и проще технология.",
  },
  {
    question: "Можно ли выполнить огнезащиту металлоконструкций без лесов?",
    answer: "Да. Промышленные альпинисты обеспечивают доступ к металлоконструкциям на высоте до 150 м без строительных лесов и автовышки. Огнезащита без лесов применяется на ЛЭП, АМС, дымовых трубах и объектах с плотной застройкой. Работаем с лицензией МЧС. ППР и наряд-допуск — обязательны для каждого объекта.",
  },
  {
    question: "Нужна ли лицензия МЧС для огнезащиты металлоконструкций?",
    answer: "Да. По ФЗ-123 и Постановлению Правительства №1068 огнезащитные работы относятся к лицензируемым видам деятельности в области пожарной безопасности. Работать без лицензии МЧС нельзя — нарушение влечёт административную ответственность и предписание ГПН. MSPRO имеет действующую лицензию МЧС.",
  },
  {
    question: "Какие документы выдают после огнезащитной обработки?",
    answer: "По завершении работ MSPRO передаёт: акт освидетельствования огнезащитного покрытия, фотофиксацию по захваткам с замерами DFT на каждом слое, сертификат соответствия применённого состава (пожарный сертификат), технологический регламент нанесения, исполнительную документацию (ИД). Состав ИД согласовывается с заказчиком на стадии договора.",
  },
  {
    question: "Как проверяется качество нанесения огнезащитного покрытия?",
    answer: "Контроль на каждом слое: замер DFT (толщины сухого слоя) толщиномером по ГОСТ Р 53295, проверка адгезии, фиксация условий нанесения — температура воздуха (≥ +5°C), влажность металла (≤ 4%), относительная влажность воздуха (≤ 80%). По завершении — приёмо-сдаточные испытания и акт освидетельствования покрытия. Все данные передаются заказчику в составе ИД.",
  },
];

export default function FireproofingAtHeight() {
  useEffect(() => {
    document.title = "Огнезащита металлоконструкций на высоте промальп | MSPRO";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Огнезащита металлоконструкций на высоте промышленными альпинистами: ЛЭП, АМС, трубы, несущие конструкции. R15–R120. Лицензия МЧС. От 700 ₽/м². По всей России."
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
      "name": "Огнезащита металлоконструкций на высоте (промышленный альпинизм)",
      "description": "Огнезащита металлоконструкций на высоте промышленными альпинистами: ЛЭП, АМС, трубы, несущие конструкции. R15–R120. Лицензия МЧС. От 700 ₽/м².",
      "url": "https://mspro-ltd.ru/services/fireproofing-at-height",
      "provider": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru" },
      "areaServed": { "@type": "Country", "name": "Россия" },
      "serviceType": "Огнезащита металлоконструкций",
      "offers": { "@type": "Offer", "priceCurrency": "RUB", "price": "700", "priceSpecification": { "@type": "UnitPriceSpecification", "price": "700", "priceCurrency": "RUB", "unitText": "м²" } }
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
      "headline": "Огнезащита металлоконструкций на высоте (промышленный альпинизм)",
      "description": "Огнезащита металлоконструкций на высоте промышленными альпинистами: ЛЭП, АМС, трубы, несущие конструкции. R15–R120. Лицензия МЧС. От 700 ₽/м².",
      "url": "https://mspro-ltd.ru/services/fireproofing-at-height",
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 dark:bg-orange-900/30 px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400">
            <Flame className="h-4 w-4" />
            Лицензия МЧС {CREDENTIALS.mchs.number}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-fireproofing-h1">
            Огнезащита металлоконструкций на высоте (промышленный альпинизм)
          </h1>
          <p className="mt-6 text-lg text-muted-foreground" data-testid="text-fireproofing-intro">
            MSPRO выполняет огнезащиту металлоконструкций на высоте методом промышленного альпинизма — нанесение
            огнезащитных составов там, где кран не зайдёт и производство нельзя останавливать. Работаем на ЛЭП,
            АМС, дымовых трубах и несущих металлоконструкциях промышленных зданий. Огнезащита промышленным
            альпинизмом — лицензированный вид работ по ФЗ-123. MSPRO выполняет полный цикл: обследование,
            выбор системы, подготовку поверхности, нанесение и приёмо-сдаточную документацию.
          </p>
        </div>

        {/* Когда нужна */}
        <section className="mt-16" id="objects">
          <h2 className="text-2xl font-bold" data-testid="text-objects-heading">
            Когда нужна огнезащита металлоконструкций
          </h2>
          <p className="mt-4 text-muted-foreground">
            По требованиям ФЗ-123 «Технический регламент о требованиях пожарной безопасности» и СП 2.13130 все
            несущие металлоконструкции зданий и сооружений обязаны иметь нормируемый предел огнестойкости
            металлоконструкций. Без огнезащиты стальная балка теряет несущую способность уже через 15–20 минут
            при температуре 500–600°C. Нормируемый R-класс (R15, R30, R60, R90, R120) определяется по проекту
            или предписанию государственного пожарного надзора.
          </p>
          <div className="mt-8 space-y-8">
            {objects.map((obj, index) => (
              <div key={index} data-testid={`object-item-${index}`}>
                <h3 className="text-lg font-semibold">{obj.title}</h3>
                <p className="mt-2 text-muted-foreground">{obj.body}</p>
                {obj.link && (
                  <p className="mt-2 text-muted-foreground">
                    <Link href={obj.link.href} className="text-primary underline underline-offset-2">
                      {obj.link.text}
                    </Link>
                    {obj.linkSuffix}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Этапы */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-steps-heading">Этапы огнезащитной обработки на высоте</h2>
          <p className="mt-4 text-muted-foreground">
            Огнезащитная обработка металлоконструкций — не однослойное нанесение краски. Каждый этап обязателен:
            пропустить или совместить невозможно без потери гарантии и снижения фактического R-класса.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-5">
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

        {/* Когда промальп выгоднее */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-when-heading">
            Когда промальп для огнезащиты выгоднее лесов и крана
          </h2>
          <p className="mt-4 text-muted-foreground">
            Огнезащита без лесов — реальная альтернатива в пяти типовых ситуациях:
          </p>
          <ol className="mt-6 space-y-4">
            {whenNeeded.map((item, index) => (
              <li key={index} className="flex gap-4" data-testid={`when-item-${index}`}>
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <div>
                  <span className="font-semibold">{item.title}</span>{" "}
                  {item.link ? (
                    <span className="text-muted-foreground">
                      {item.body}{" "}
                      <Link href={item.link.href} className="text-primary underline underline-offset-2">
                        {item.link.text}
                      </Link>
                      {item.linkSuffix}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{item.body}</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Материалы */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-materials-heading">Материалы: как выбираем систему огнезащиты</h2>
          <p className="mt-4 text-muted-foreground">
            Система огнезащитных составов для стальных конструкций подбирается по требуемому R-классу, условиям
            эксплуатации и типу конструкции. MSPRO не применяет «один состав на всё» — система согласовывается
            с заказчиком до начала работ.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {materials.map((mat, index) => (
              <Card key={index} data-testid={`card-material-${index}`}>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <CheckCircle2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-base mt-3">{mat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{mat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-muted-foreground">
            Если материал предоставляет заказчик, MSPRO проводит входной контроль, проверяет наличие сертификата
            пожарной безопасности и совместимость с поверхностью конструкции. Результаты и ответственность сторон
            фиксируются в договоре.
          </p>
        </section>

        {/* Лицензия и допуски */}
        <section className="mt-16 rounded-lg bg-muted/50 p-8">
          <h2 className="text-xl font-semibold" data-testid="text-license-heading">Лицензия МЧС и допуски</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed" data-testid="text-license-body">
            Огнезащитные работы по ФЗ-123 и Постановлению Правительства №1068 подлежат лицензированию.
            Работать без лицензии МЧС нельзя — это административное нарушение и основание для предписания ГПН.
            MSPRO имеет лицензию МЧС №{CREDENTIALS.mchs.number}, действующую с 2023 года.{" "}
            <Link href="/documents" className="text-primary underline underline-offset-2">
              Документы и допуски
            </Link>{" "}
            доступны на сайте.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Все промышленные альпинисты аттестованы по 5-му разряду. Работы ведутся по ППР и наряду-допуску в
            соответствии с ГОСТ Р ИСО 22846 и СНиП 12-03-2001. MSPRO — член СРО строительства
            №{CREDENTIALS.sroConstruction.memberNumber} (ассоциация «СРО «СВС»). Работы застрахованы по СМР.
            Страховочные системы — двойные (рабочая и страховочная линии).
          </p>
        </section>

        {/* Стоимость */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-pricing-heading">Стоимость огнезащиты на высоте</h2>
          <p className="mt-4 text-muted-foreground">
            Ориентировочная стоимость огнезащиты металлоконструкций на высоте —
            от 700 ₽/м² (стандартная тонкослойная система R30, материал MSPRO, объём от 100 м²).
          </p>
          <p className="mt-4 text-muted-foreground">Итоговая цена зависит от:</p>
          <ul className="mt-4 space-y-2 text-muted-foreground" data-testid="list-pricing-factors">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Требуемый R-класс</strong> — R15 дешевле R90: разные составы и число слоёв. R60 и выше требуют более дорогих систем и большего DFT.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Высота и сложность доступа</strong> — объекты выше 80 м увеличивают трудозатраты на такелаж и смену точек крепления.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Состояние поверхности</strong> — степень коррозии и объём подготовительных работ влияют на итоговую трудоёмкость.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Материал</strong> — поставка материала MSPRO или работа с материалом заказчика (с входным контролем).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Объём</strong> — при объёме от 300 м² возможна сниженная ставка.</span>
            </li>
          </ul>
          <div className="mt-6">
            <Link href="/calculator">
              <Button variant="outline" data-testid="button-pricing-calculator">Рассчитать огнезащиту в калькуляторе</Button>
            </Link>
          </div>
          <p className="mt-4 font-medium">
            Для точного расчёта нужны: требуемый R-класс, площадь конструкций в м², фото объекта или ТЗ.
            Звоните: +7 (987) 909-29-38 — КП подготовим за 1 час.
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
            Запросить КП по огнезащите на высоте
          </h2>
          <p className="mt-2 text-muted-foreground">
            Пришлите ТЗ, проект или фото объекта — подготовим коммерческое предложение за 1 час. Работаем по всей России.
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
