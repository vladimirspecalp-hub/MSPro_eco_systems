import { useEffect } from "react";
import { Droplets, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { CREDENTIALS } from "@/content/copySystem";

const contaminationTypes = [
  {
    title: "Высолы (белые соляные налёты)",
    body: "Высолы — кристаллы растворимых солей, которые мигрируют с водой из кирпичной кладки или цементного раствора на поверхность стены. Появляются на новых зданиях (первые 2–3 года) и после протечек. Метод очистки фасадов от высолов: нейтрализующий кислотосодержащий состав (pH 2–3) → выдержка 5–15 мин → смыв АВД → гидрофобизация для предотвращения повторного выхода солей.",
  },
  {
    title: "Цементное молочко и строительные пятна",
    body: "Цементное молочко — тонкая белёсая плёнка после строительных работ. Со временем полимеризуется и бросается в глаза на тёмном клинкере или стеклопакетах. Удаляем кислотосодержащими очистителями (1:5–1:10) с нейтральным смывом. На стёклах — механически, специализированными скребками без царапин.",
  },
  {
    title: "Копоть и гарь",
    body: "Копоть появляется после пожара, рядом с промышленными трубами или на карнизах над вентиляционными выбросами. Метод очистки фасадов от копоти: щелочной обезжиривающий состав с ПАВ (pH 10–12) → выдержка 20–30 мин → смыв горячей водой АВД до 150 бар. Пропитанные слои дополнительно обрабатываем механическими щётками с нейлоновым ворсом.",
  },
  {
    title: "Биопоражения: мох, лишайник, плесень",
    body: "Мох и лишайник закрепляются в швах кладки и шероховатых поверхностях, особенно на северных фасадах. Биоцидный состав наносим орошением, выдерживаем 24–48 часов — микроорганизмы погибают. Затем смываем АВД. На пористых поверхностях — дополнительно фунгицидный грунт. Срок защиты — 3–5 лет.",
  },
  {
    title: "Граффити (спреевые краски, маркеры)",
    body: "Граффити проще всего убираются в первые 48–72 часа после нанесения. На бетонных стенах — специализированный граффити-ремувер без разрушения подложки. На клинкерном кирпиче — горячая вода АВД (80–90 °С, 150–200 бар). На больших площадях (от 20 м²) — пескоструйная или «сода-бластинг» очистка. Удаление граффити на высоте промальп-методом возможно без остановки работы здания.",
  },
];

const methods = [
  {
    title: "Гидроструйная очистка фасадов (АВД ≥ 500 бар)",
    description: "Холодная или горячая вода под высоким давлением — основной метод для большинства загрязнений. Бетон, кирпич, клинкер, металл. Не требует химии при умеренных загрязнениях. Производительность: 80–120 м²/час.",
  },
  {
    title: "Химическая очистка (ПАВ, биоцидные и кислотные составы)",
    description: "Применяется когда давление воды само не справляется: биопоражения, высолы, граффити, въевшаяся копоть. Реагент наносится, выдерживается по регламенту, смывается водой. Составы сертифицированы, нейтральны при смыве.",
  },
  {
    title: "Ручная механическая обработка",
    description: "Для деликатных поверхностей (лепнина, натуральный камень, старая штукатурка): щётки, скребки без абразива. Применяется совместно с химическим методом в труднодоступных зонах.",
  },
  {
    title: "Пескоструйная и сода-бластинг очистка",
    description: "Для грубых промышленных загрязнений: ржавые потёки, полимерные покрытия, прочно приставшие граффити. Применяется точечно на промышленных объектах.",
  },
];

const steps = [
  {
    step: 1,
    title: "Осмотр и дефектация",
    description: "Выезд инженера: фиксация типов загрязнений, материала облицовки, состояния швов и остекления. Пробное нанесение реагента на тестовом участке 0,5 м². По результатам — технологическая карта.",
  },
  {
    step: 2,
    title: "ППР и наряд-допуск",
    description: "Проект производства работ по ГОСТ Р ИСО 22846 и СНиП 12-03-2001. Наряд-допуск на каждый выезд. Временное ограждение рабочей зоны.",
  },
  {
    step: 3,
    title: "Монтаж и пробная мойка",
    description: "Крепление рабочей и страховочной линий на кровле или анкерных точках. Пробный участок 2–5 м² — проверка реагента и давления. Согласование результата с заказчиком.",
  },
  {
    step: 4,
    title: "Нанесение → выдержка → смыв",
    description: "Основной цикл: реагент → выдержка по паспорту → смыв АВД или вручную. Работа ведётся сверху вниз секциями по 3–5 м.",
  },
  {
    step: 5,
    title: "Финальный осмотр и фотоотчёт",
    description: "Проход инженера, фотофиксация до/в процессе/после по захваткам. Акт выполненных работ с объёмом (м²) и применёнными материалами.",
  },
];

const faq = [
  {
    question: "Что такое промышленная мойка фасадов промышленным альпинизмом?",
    answer: "Промышленная мойка фасадов промышленным альпинизмом — метод высотной очистки наружных поверхностей зданий с помощью промышленных альпинистов на верёвочном снаряжении. Альпинисты работают с АВД и химическими реагентами, перемещаясь по фасаду по верёвочным линиям без строительных лесов. Применим на любой высоте и для любого типа облицовки.",
  },
  {
    question: "Чем отличается мойка фасадов промальпом от мойки с лесов или автовышки?",
    answer: "Промальп не требует монтажа конструкций: бригада разворачивается за 2–3 часа, не перекрывает тротуар и вход. Автовышка ограничена высотой 40–50 м и прямым вылетом — эркеры и скрытые зоны недоступны. Леса монтируются 3–4 недели и блокируют весь периметр. Мойка фасада промальп-методом обходится на 30–50% дешевле лесов при высоте от 20 м.",
  },
  {
    question: "Сколько стоит очистка фасада промышленными альпинистами?",
    answer: "Стоимость зависит от типа загрязнения: высолы — от 660 ₽/м², копоть — от 1 050 ₽/м², биопоражения — от 660–900 ₽/м², граффити — по объёму. Минимальный выезд — от 15 000 ₽. Точный расчёт — через калькулятор или после осмотра инженером. Для объектов от 300 м² КП готовим за 1 час.",
  },
  {
    question: "Как убрать высолы с кирпичного фасада?",
    answer: "Высолы убирают нейтрализующим кислотосодержащим составом (pH 2–3): наносят на сухую поверхность, выдерживают 10–15 минут, смывают АВД холодной водой. После очистки обязательна гидрофобизация — иначе соли выйдут снова через 1–2 сезона. MSPRO использует сертифицированные составы с паспортами безопасности.",
  },
  {
    question: "Можно ли отмыть граффити промышленным методом на высоте?",
    answer: "Да. Свежее граффити (до 72 часов) убирается горячей водой АВД без реагентов. Застарелое — специализированным граффити-ремувером. На промышленных объектах применяем сода-бластинг. Гарантируем полное удаление или повторный выезд за наш счёт.",
  },
  {
    question: "Как часто нужно мыть фасад многоэтажного здания или завода?",
    answer: "Жилые и коммерческие здания в городской среде — раз в 2–3 года. Промышленные объекты вблизи труб и котельных — ежегодно. Биопоражения с фунгицидным грунтом — раз в 3–5 лет. Ориентир: если фасад визуально потерял цвет или появились серые потёки — пора.",
  },
  {
    question: "При какой температуре можно мыть фасад?",
    answer: "Оптимальный диапазон — от +5 °С до +30 °С. При температуре ниже +5 °С реагенты не работают, вода замерзает в швах. Горячая вода АВД (60–80 °С) позволяет работать при +3...+5 °С в безветренную погоду — только экстренно. Плановую промышленную очистку фасадов планируем на апрель–октябрь.",
  },
  {
    question: "Какие реагенты используются при очистке фасадов?",
    answer: "Подбираем реагенты под тип загрязнения: для высолов — кислотные составы на основе молочной кислоты; для биопоражений — биоцидные препараты с DDAC; для жировых и сажевых загрязнений — щелочные ПАВ (биопав). Все реагенты нейтральны после смыва, не повреждают почву и растения. Паспорта безопасности (MSDS) предоставляем по запросу.",
  },
];

export default function FacadeCleaning() {
  useEffect(() => {
    document.title = "Очистка и мойка фасадов промышленными альпинистами | MSPRO";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Мойка фасадов на высоте без лесов. Очистка от высолов, копоти, граффити, биопоражений. Гидроструйный и химический методы. Звоните: +7 (987) 909-29-38."
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
      "name": "Очистка и мойка фасадов промышленными альпинистами",
      "description": "Мойка фасадов на высоте без лесов. Очистка от высолов, копоти, граффити, биопоражений. Гидроструйный и химический методы.",
      "url": "https://mspro-ltd.ru/services/facade-cleaning",
      "provider": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru" },
      "areaServed": { "@type": "Country", "name": "Россия" },
      "serviceType": "Очистка фасадов",
      "offers": { "@type": "Offer", "priceCurrency": "RUB", "price": "660", "priceSpecification": { "@type": "UnitPriceSpecification", "price": "660", "priceCurrency": "RUB", "unitText": "м²" } }
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
      "headline": "Очистка и мойка фасадов промышленными альпинистами",
      "description": "Мойка фасадов на высоте без лесов. Очистка от высолов, копоти, граффити, биопоражений. Гидроструйный и химический методы.",
      "url": "https://mspro-ltd.ru/services/facade-cleaning",
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-sky-100 dark:bg-sky-900/30 px-4 py-2 text-sm font-medium text-sky-600 dark:text-sky-400">
            <Droplets className="h-4 w-4" />
            СРО (стройка) член №{CREDENTIALS.sroConstruction.memberNumber}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-facade-h1">
            Очистка и мойка фасадов промышленными альпинистами
          </h1>
          <p className="mt-6 text-lg text-muted-foreground" data-testid="text-facade-intro">
            Очистка фасадов промышленными альпинистами — это мойка фасадов на высоте без строительных лесов,
            подъёмников и закрытия прилегающей территории. Промышленная мойка фасадов методом промальпа занимает
            1–2 рабочих дня и не требует остановки работы объекта. Убираем высолы, копоть, биопоражения, граффити
            и строительные пятна — с кирпича, бетона, стеклопакетов и навесных фасадных систем.
          </p>
        </div>

        {/* Типы загрязнений */}
        <section className="mt-16" id="contamination-types">
          <h2 className="text-2xl font-bold" data-testid="text-contamination-heading">
            Что и от чего очищаем
          </h2>
          <p className="mt-4 text-muted-foreground">
            Загрязнения фасадов делятся на пять основных категорий. Каждая требует своего реагента и метода.
            Неверный выбор — повреждение облицовки или возврат пятна через месяц.
          </p>
          <div className="mt-8 space-y-8">
            {contaminationTypes.map((ct, index) => (
              <div key={index} data-testid={`contamination-item-${index}`}>
                <h3 className="text-lg font-semibold">{ct.title}</h3>
                <p className="mt-2 text-muted-foreground">{ct.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Методы */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-methods-heading">Методы очистки фасадов на высоте</h2>
          <p className="mt-4 text-muted-foreground">
            Выбор метода зависит от типа загрязнения, материала поверхности и требуемого результата.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {methods.map((m, index) => (
              <Card key={index} data-testid={`card-method-${index}`}>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/30">
                    <CheckCircle2 className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <CardTitle className="text-base mt-3">{m.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Почему промальп */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-why-heading">
            Почему промальп, а не леса или автовышка
          </h2>
          <p className="mt-4 text-muted-foreground">
            Мойка фасада без лесов методом промышленного альпинизма — не только дешевле, но и практичнее.
          </p>
          <ol className="mt-6 space-y-4">
            {[
              { title: "Не занимает территорию.", body: "Промышленный альпинист работает на верёвке — требуется только временное ограждение зоны падения воды (2–3 м от стены). Тротуар и парковка свободны." },
              { title: "Фасад сложной формы — не проблема.", body: "Эркеры, башни, ризалиты, навесные конструкции — леса строятся только по прямой. Промальп обходит любую геометрию." },
              { title: "Минимальный простой.", body: "Вход в здание не перекрывается, витрины и двери открыты. Жильцы, покупатели, сотрудники работают в штатном режиме." },
              { title: "Скорость выезда 1–2 рабочих дня.", body: "Бригада из 2–3 человек разворачивается за 2–3 часа. Полный фасад 5-этажного здания (400–600 м²) — за 1–2 дня." },
              { title: "Высота без ограничений.", body: "Автовышка — до 40–50 м. Промышленный альпинизм работает на 150 м и выше без ограничений по радиусу." },
            ].map((item, index) => (
              <li key={index} className="flex gap-4" data-testid={`why-item-${index}`}>
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <div>
                  <span className="font-semibold">{item.title}</span>{" "}
                  {index === 4 ? (
                    <span className="text-muted-foreground">
                      {item.body}{" "}
                      <Link href="/services/rope-access" className="text-primary underline underline-offset-2">
                        Промышленный альпинизм на промобъектах
                      </Link>.
                    </span>
                  ) : (
                    <span className="text-muted-foreground">{item.body}</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Этапы */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-steps-heading">Этапы работы</h2>
          <p className="mt-4 text-muted-foreground">
            Все работы ведутся по технологической карте. Результат фиксируется фотоотчётом.
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

        {/* Стоимость */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-pricing-heading">Стоимость очистки фасадов</h2>
          <p className="mt-4 text-muted-foreground">
            Цена рассчитывается за 1 м² по типу загрязнения. Базовые расценки MSPRO (работа + реагент):
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm" data-testid="pricing-table">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-semibold">Тип загрязнения</th>
                  <th className="py-3 text-right font-semibold">Цена от</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  ["Высолы", "660 ₽/м²"],
                  ["Цементное молочко / строительные пятна", "900 ₽/м²"],
                  ["Копоть и гарь", "1 050 ₽/м²"],
                  ["Потёки наливных полов", "840 ₽/м²"],
                  ["Потёки акрилового герметика", "1 150 ₽/м²"],
                  ["Гидроструйная очистка АВД", "от 175 ₽/м²"],
                ].map(([name, price], index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3">{name}</td>
                    <td className="py-3 text-right font-semibold text-foreground">{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Высота объекта:</strong> чем выше — тем дольше такелаж и организация зоны.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Площадь:</strong> при объёме от 300 м² возможна пониженная ставка.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Тип и степень загрязнения:</strong> тяжёлая копоть или граффити на пористой поверхности — несколько циклов.</span>
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
            Для точного расчёта достаточно фото фасада и площади объекта.
            Звоните: +7 (987) 909-29-38 — инженер ответит в течение часа.
          </p>
        </section>

        {/* Безопасность */}
        <section className="mt-16 rounded-lg bg-muted/50 p-8">
          <h2 className="text-xl font-semibold" data-testid="text-safety-heading">Безопасность и допуски</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Все промышленные альпинисты MSPRO аттестованы по 5-му разряду. Работы ведутся по наряду-допуску
            и индивидуальному ППР на каждый объект — ГОСТ Р ИСО 22846 и СНиП 12-03-2001.
            Страховочные системы двойные (рабочая и страховочная линии). СОУТ включает оценку рисков
            для персонала заказчика при совместных работах.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            MSPRO — член СРО строительства №{CREDENTIALS.sroConstruction.memberNumber}.
            Лицензия МЧС №{CREDENTIALS.mchs.number}.
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
            Оставьте заявку или позвоните — инженер осмотрит фасад, подберёт метод и реагенты,
            назовёт точную стоимость. Работаем по всей России.
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
