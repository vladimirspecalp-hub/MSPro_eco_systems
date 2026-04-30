import { useEffect } from "react";
import { ArrowRight, Mountain, Zap, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";

const faq = [
  {
    question: "Что такое промышленный альпинизм?",
    answer: "Промышленный альпинизм — метод производства работ на высоте с применением верёвочной техники канатного доступа. Альпинист фиксируется на страховочной и рабочей системах и перемещается по конструкции без лесов, вышек и кранов. В отличие от спортивного скалолазания, промальп регламентирован ГОСТ Р ИСО 22846, ведётся по ППР и наряду-допуску и применяется на промышленных объектах для нанесения покрытий, демонтажа, осмотра и санации.",
  },
  {
    question: "Какие виды работ выполняются методом промышленного альпинизма?",
    answer: "Методом промальп выполняются: огнезащита металлоконструкций, антикоррозионная защита (АКЗ), демонтаж конструктивных элементов, санация железобетона, мойка и осмотр конструкций, монтаж оборудования на высотных опорах. MSPRO специализируется на огнезащите, АКЗ и демонтаже на промышленных объектах — дымовых трубах, опорах ЛЭП, АМС и промышленных металлоконструкциях.",
  },
  {
    question: "Когда промышленный альпинизм выгоднее лесов и крана?",
    answer: "Промальп выгоднее в четырёх сценариях: (1) кран или леса физически не проходят на объект — стеснённые условия или охранная зона ЛЭП; (2) работы точечные или разовые — монтаж лесов дороже самих работ; (3) производство нельзя остановить — промальп работает без захвата больших зон; (4) высота более 40 м при ограниченном вылете крана, когда грузоподъёмность машины резко падает.",
  },
  {
    question: "Что нужно для расчёта стоимости высотных работ?",
    answer: "Для подготовки коммерческого предложения достаточно: фото объекта (или выезд нашего инженера), высота работ, тип работ (огнезащита / АКЗ / демонтаж), объём в м² или погонных метрах. Если есть готовое ТЗ или проект — сметный расчёт будет точнее и займёт меньше времени. Оставьте заявку на сайте, и инженер перезвонит в течение часа.",
  },
  {
    question: "Сколько стоит промышленный альпинизм?",
    answer: "Ориентировочные цены: огнезащита металлоконструкций на высоте — от 900 ₽/м² (R60, базовая система); R90/R120 — по калькулятору. АКЗ — 450–900 ₽/м² (стандарт → премиум, кремнийорганика → эпоксидно-полиуретановые системы). Демонтаж — от 2 000 ₽/м². Итоговая стоимость зависит от высоты, объёма, типа покрытия, региона и срочности. Для точного расчёта — Калькулятор или оставьте заявку — коммерческое предложение подготовим за 1 час.",
  },
  {
    question: "Какие объекты обслуживают промышленные альпинисты?",
    answer: "Промышленные альпинисты MSPRO работают на: опорах ЛЭП (высота до 50 м, охранная зона); АМС, вышках и мачтах связи (40–150 м); промышленных дымовых трубах (60–150 м, металл, железобетон, кирпич); металлоконструкциях — эстакадах, фермах, площадках обслуживания на нефтехимических, энергетических и химических объектах.",
  },
  {
    question: "Какие документы выдаёт подрядчик по промальп?",
    answer: "По завершении работ MSPRO передаёт: акты выполненных работ, исполнительную документацию (ИД) с привязкой к конструктивам, фотоотчёт по этапам, сертификаты на применённые материалы. При огнезащите дополнительно — протоколы контрольных испытаний толщины покрытия. ППР остаётся у заказчика как часть исполнительной документации объекта.",
  },
  {
    question: "Можно ли работать на высоте при действующем производстве?",
    answer: "Да. Промальп позволяет работать в ограниченной зоне без остановки смежных операций. Безопасность обеспечивается: индивидуальным ППР, нарядом-допуском с описанием мер защиты смежных зон, СОУТ рабочих мест, ограждением рабочей зоны и инструктажем персонала заказчика. MSPRO выполняет работы на объектах с непрерывным производственным циклом — в том числе на нефтеперерабатывающих и химических производствах.",
  },
];

const services = [
  {
    title: "Огнезащита металлоконструкций на высоте",
    description: "Нанесение огнезащитных составов на металлические фермы, балки, колонны, прогоны и несущие опоры на высоте от 15 до 150 м. Стоимость — от 900 ₽/м² (R60, базовая система).",
    href: "/services/fireproofing-at-height",
    icon: Zap,
  },
  {
    title: "Антикоррозионная защита металлоконструкций на высоте",
    description: "АКЗ металлоконструкций на промышленных объектах: подготовка поверхности, нанесение грунта и финишного лакокрасочного покрытия. Стоимость — от 450 ₽/м² (стандарт — КО-8101).",
    href: "/services/anticorrosion-at-height",
    icon: Shield,
  },
  {
    title: "Демонтаж на высоте",
    description: "Демонтаж конструктивных элементов, навесных панелей и оголовков дымовых труб методом канатного доступа в стеснённых условиях. Стоимость — от 2 000 ₽/м².",
    href: "/services/demolition",
    icon: Mountain,
  },
  {
    title: "Подготовка поверхности и санация",
    description: "Очистка металла и железобетона от ржавчины, старых покрытий и промышленных загрязнений. Санация железобетонных конструкций. Как самостоятельная работа или в составе комплексного контракта.",
    href: null,
    icon: FileText,
  },
];

const objects = [
  {
    title: "ЛЭП и опоры электропередач",
    description: "Металлические опоры ЛЭП высотой до 50 м в охранной зоне. Промальп — нормативно допустимый метод при действующем напряжении.",
  },
  {
    title: "АМС, вышки и мачты связи",
    description: "Антенно-мачтовые сооружения высотой 40–150 м. АКЗ несущих секций, огнезащита, замена элементов без остановки оборудования.",
  },
  {
    title: "Дымовые трубы (металл/ЖБ)",
    description: "Промышленные трубы высотой 60–150 м. Химически стойкие АКЗ-покрытия, огнезащита, демонтаж оголовков и молниеотводов.",
  },
  {
    title: "Промышленные металлоконструкции",
    description: "Эстакады, фермы перекрытий, площадки обслуживания и технологические мосты на нефтеперерабатывающих, химических и энергетических предприятиях.",
  },
];

const whenNeeded = [
  {
    title: "Нет места для крана или подъёмника.",
    body: "Плотная застройка промышленной зоны, внутреннее пространство цеха, разъезды ЖД-путей, межблочные коридоры — везде, куда кран физически не проедет. Промальп работает от любой точки крепления вне зависимости от геометрии объекта.",
  },
  {
    title: "Объект находится в охранной зоне ЛЭП.",
    body: "Кран в охранной зоне запрещён нормативно (ПУЭ). Канатный доступ — разрешённый и безопасный метод проведения высотных работ без вывода линии из работы и без согласования отключения.",
  },
  {
    title: "Производство нельзя остановить.",
    body: "Работаем в ограждённой зоне параллельно с действующим технологическим процессом. Наряд-допуск и СОУТ обеспечивают безопасность смежных операций и документируют границы рабочей зоны.",
  },
  {
    title: "Высота 30–150 м при ограниченном радиусе крана.",
    body: "При большой высоте и малом вылете стрелы грузоподъёмность крана падает до 0,5–1 т — машина не справляется с оборудованием и материалами. Промальп при действующем производстве не зависит от радиуса и грузоподъёмности.",
  },
  {
    title: "Разовые работы, где леса экономически нецелесообразны.",
    body: "Монтаж строительных лесов на объём 50–200 м² обходится сопоставимо или дороже самих работ. Промальп разворачивается за 2–4 часа без такелажа и монтажа несущих конструкций.",
  },
  {
    title: "Срочный аварийный выезд.",
    body: "Локальный ремонт или осмотр после инцидента: бригада промальпинистов выезжает в течение нескольких часов, а не дней подготовки крана или строительства лесов.",
  },
];

const steps = [
  {
    step: 1,
    title: "Обследование объекта",
    description: "Выезд инженера ИТР: фотофиксация, обмеры конструкций, оценка доступа и состояния поверхности, определение точек крепления страховочных систем. По итогам — техническое заключение и КП.",
  },
  {
    step: 2,
    title: "ППР и наряд-допуск",
    description: "Разработка проекта производства работ в соответствии с ГОСТ Р ИСО 22846 и СНиП 12-03-2001. Согласование ППР с заказчиком и надзорными органами.",
  },
  {
    step: 3,
    title: "Монтаж страховочных систем",
    description: "Установка точек крепления, такелаж, ограждение зоны работ. Проверка снаряжения перед каждым выходом: беседки, страховочные устройства, верёвки по SRT.",
  },
  {
    step: 4,
    title: "Выполнение работ",
    description: "Огнезащита, АКЗ, демонтаж или санация согласно ТЗ и ППР. Ежедневная фотофиксация прогресса по захваткам.",
  },
  {
    step: 5,
    title: "Сдача и документы",
    description: "Акты выполненных работ, фотоотчёт по этапам, исполнительная документация с привязкой к конструктивам. При огнезащите — протоколы контрольных испытаний толщины покрытия.",
  },
];

const pricing = [
  { service: "Огнезащита металлоконструкций на высоте", price: "от 900 ₽/м² (R60)", href: "/calculator" },
  { service: "Антикоррозионная защита (АКЗ) на высоте", price: "450–900 ₽/м² (стандарт → премиум)", href: "/calculator" },
  { service: "Демонтаж на высоте", price: "от 2 000 ₽/м²", href: null },
];

export default function RopeAccess() {
  useEffect(() => {
    document.title = "Промышленный альпинизм (промальп) | MSPRO — работы на высоте";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Промышленный альпинизм на промобъектах: огнезащита, АКЗ, демонтаж на высоте. Работаем там, где кран не зайдёт. По всей России. Звоните: +7 (987) 909-29-38.");
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
      "name": "Промышленный альпинизм и высотные работы на промобъектах",
      "description": "Промышленный альпинизм на промобъектах: огнезащита, АКЗ, демонтаж на высоте. Работаем там, где кран не зайдёт. По всей России.",
      "url": "https://mspro-ltd.ru/services/rope-access",
      "provider": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru" },
      "areaServed": { "@type": "Country", "name": "Россия" },
      "serviceType": "Промышленный альпинизм"
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
      "headline": "Промышленный альпинизм и высотные работы на промобъектах",
      "description": "Промышленный альпинизм на промобъектах: огнезащита, АКЗ, демонтаж на высоте. Работаем там, где кран не зайдёт. По всей России.",
      "url": "https://mspro-ltd.ru/services/rope-access",
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
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-rope-access-h1">
            Промышленный альпинизм и высотные работы на промобъектах
          </h1>
          <p className="mt-6 text-lg text-muted-foreground" data-testid="text-rope-access-intro">
            Промышленный альпинизм (промальп) — это метод выполнения работ на высоте с применением верёвочной техники
            канатного доступа, без строительных лесов и без автокрана. Работы на высоте промальп применяются там,
            где кран физически не зайдёт, высота от 15 м, а производство нельзя останавливать. MSPRO специализируется
            на трёх направлениях высотных работ на промобъектах: огнезащита металлоконструкций, антикоррозионная защита
            (АКЗ) и демонтаж методом канатного доступа. Работаем по всей России — от разовых выездов до долгосрочных
            контрактов на обслуживание объектов.
          </p>
        </div>

        {/* Услуги */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-services-heading">
            Услуги промышленного альпинизма MSPRO
          </h2>
          <p className="mt-4 text-muted-foreground">
            Высотные работы промышленными альпинистами охватывают четыре основных направления. Для каждого MSPRO
            разрабатывает индивидуальный ППР, выставляет аттестованных альпинистов 5-го разряда и фиксирует результат
            в исполнительной документации.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {services.map((service, index) => (
              <Card key={index} className="hover-elevate" data-testid={`card-service-${index}`}>
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <service.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription className="mt-2">{service.description}</CardDescription>
                  </div>
                </CardHeader>
                {service.href && (
                  <CardContent>
                    <Link href={service.href}>
                      <Button variant="ghost" size="sm" className="gap-2">
                        Подробнее <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/calculator">
                      <Button variant="ghost" size="sm" className="gap-2 ml-2">
                        Калькулятор <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Типовые объекты */}
        <section className="mt-16" id="objects">
          <h2 className="text-2xl font-bold" data-testid="text-objects-heading">Типовые объекты</h2>
          <p className="mt-4 text-muted-foreground">
            Промальп на промобъектах применяется там, где использование стандартных подъёмных механизмов затруднено
            или нормативно запрещено.
          </p>
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

        {/* Когда необходим */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-when-heading">
            Когда промышленный альпинизм необходим
          </h2>
          <p className="mt-4 text-muted-foreground">
            Правильно выбрать метод работы на высоте — значит не переплачивать за кран или леса там, где они не нужны.
            Промальп оптимален в следующих ситуациях:
          </p>
          <ol className="mt-6 space-y-4">
            {whenNeeded.map((item, index) => (
              <li key={index} className="flex gap-4" data-testid={`when-item-${index}`}>
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <div>
                  <span className="font-semibold">{item.title}</span>{" "}
                  <span className="text-muted-foreground">{item.body}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Этапы работ */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-steps-heading">Как мы работаем: этапы</h2>
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
                {index < steps.length - 1 && (
                  <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-4 w-4 text-muted-foreground hidden sm:block" />
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Безопасность */}
        <section className="mt-16 rounded-lg bg-muted/50 p-8">
          <h2 className="text-xl font-semibold" data-testid="text-safety-heading">Безопасность и допуски</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed" data-testid="text-safety-body">
            Все альпинисты MSPRO аттестованы по 5-му разряду промышленных альпинистов. Работы ведутся исключительно
            по наряду-допуску. Под каждый объект разрабатывается индивидуальный ППР в соответствии с
            ГОСТ Р ИСО 22846 «Работы на высоте с использованием верёвок» и СНиП 12-03-2001
            «Безопасность труда в строительстве».
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Страховочные системы — двойные: независимая рабочая и страховочная линии. Снаряжение проходит проверку
            перед каждым выходом. Работы застрахованы по СМР. СОУТ включает оценку рисков для смежных
            производственных зон при совместных работах — персонал заказчика проходит инструктаж до начала работ.
          </p>
        </section>

        {/* Стоимость */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-pricing-heading">Стоимость высотных работ</h2>
          <p className="mt-4 text-muted-foreground">
            Ориентировочная стоимость по видам работ методом промышленного альпинизма:
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-pricing">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-semibold">Вид работ</th>
                  <th className="pb-3 text-left font-semibold">Стоимость</th>
                </tr>
              </thead>
              <tbody>
                {pricing.map((row, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 pr-4">{row.service}</td>
                    <td className="py-3">
                      {row.price}
                      {row.href && (
                        <Link href={row.href}>
                          <span className="ml-2 text-primary underline underline-offset-2 cursor-pointer">
                            — Калькулятор
                          </span>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-muted-foreground">
            Цена на промышленный альпинизм зависит от: высоты и сложности доступа, объёма работ (м²), типа конструкции
            и покрытия, региона (командировочный коэффициент), сроков и срочности, наличия ТЗ и проекта,
            а также от того, работаем ли мы с материалом заказчика или поставляем собственный.
          </p>
          <div className="mt-6">
            <Link href="/calculator">
              <Button variant="outline" data-testid="button-pricing-calculator">Рассчитать в калькуляторе</Button>
            </Link>
          </div>
          <p className="mt-4 font-medium">
            Остались вопросы? Звоните: +7 (987) 909-29-38 — инженер ответит в течение часа.
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
            Опишите задачу — инженер MSPRO свяжется с вами, уточнит детали и подготовит КП. Работаем по всей России.
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
