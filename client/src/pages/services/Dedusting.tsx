import { useEffect } from "react";
import { Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { CREDENTIALS } from "@/content/copySystem";

const whenNeeded = [
  {
    title: "После пескоструйной или гидроструйной очистки металла",
    body: "Пескоструйная очистка металла до Sa 2.5 оставляет на поверхности до 5 г/м² остатков абразива — корунда, стальной дроби или купрошлака. Частицы забиваются в профиль поверхности и мешают адгезии грунтовки. Аналогичная картина после гидроструйной очистки: флэш-раст и минеральные отложения с водой оседают вновь. Обеспыливание компрессором после пескоструйки — стандартная часть операции; без неё результат деградирует за первые 6 месяцев эксплуатации.",
  },
  {
    title: "После механической очистки (УШМ, шабер, щётка)",
    body: "Механическая очистка металла болгаркой, шабером и проволочной щёткой генерирует металлическую пыль, мелкую стальную стружку и частицы старых ЛКМ. Эти загрязнения электростатически притягиваются к поверхности и не сдуваются ветром. Промышленный пылесос или компрессор снимает их за одну проходку. Без обеспыливания грунтовка ложится неравномерно: проявляются «пустоты» под плёнкой, которые служат очагами коррозии.",
  },
  {
    title: "После шлифования или матирования поверхности",
    body: "Матирование наждачной бумагой между слоями ЛКМ оставляет тонкую пыль на поверхности: абразивные зёрна и частицы старой краски. Нанести следующий слой без очистки пыли перед нанесением ЛКМ — значит получить межслойное расслоение уже через 1–2 сезона. Для межоперационного обеспыливания достаточно обдува компрессором или промышленного пылесоса малой мощности.",
  },
  {
    title: "Бетонные, кирпичные и железобетонные конструкции",
    body: "Бетонное основание перед нанесением защитных пропиток и красок требует удаления цементного молочка, строительной пыли и продуктов разрушения. Обеспыливание строительных конструкций из бетона и кирпича выполняется пылесосом (при высоком требовании к чистоте) или влажным способом (для плоских горизонтальных поверхностей). Важно: бетон не должен быть влажным перед нанесением ЛКМ — после влажного обеспыливания технологический перерыв 24–48 часов.",
  },
];

const methods = [
  {
    name: "Гидроструйная промывка (АВД, низкое давление)",
    price: "от 73 ₽/м²",
    description:
      "Промывка струёй воды под низким давлением (до 100 бар) удаляет солевые загрязнения, цементный налёт и хлориды с поверхности металла и бетона. Самый дешёвый вариант для горизонтальных поверхностей и полов. Требует, чтобы поверхность допускала контакт с водой, а грунтование производилось после полного высыхания.",
  },
  {
    name: "Обдув компрессором (воздушный поток)",
    price: "от 79 ₽/м²",
    description:
      "Воздушный поток под давлением 4–6 атм выдувает сыпучую пыль, остатки абразива и металлическую стружку. Самый быстрый и дешёвый метод для металла: применяется после пескоструйки, гидроструйки и механической очистки. Не подходит для влажных поверхностей и пыли с жировыми включениями — требует дополнительного обезжиривания.",
  },
  {
    name: "Промышленный пылесос",
    price: "от 130 ₽/м²",
    description:
      "Пылесос с HEPA-фильтром улавливает частицы диаметром от 0.3 мкм: мелкодисперсную металлическую пыль, продукты разрушения краски и минеральные загрязнения. Рекомендован при повышенных требованиях к адгезии (агрессивные среды, многослойные эпоксидные системы), а также для работы в закрытых помещениях, где выдувание пыли в воздух недопустимо.",
  },
  {
    name: "Влажный способ (швабра / влажная ветошь)",
    price: "от 150 ₽/м²",
    description:
      "Влажная уборка применяется для бетонных полов, плоских конструкций и поверхностей с жировыми загрязнениями. Не применяется на металле без немедленной сушки сжатым воздухом: открытый металл после намокания начинает корродировать в течение 30–60 минут. После влажного обеспыливания межоперационный интервал до грунтовки — не менее 1–2 часов при стандартных условиях.",
  },
];

const steps = [
  {
    step: 1,
    title: "Обследование объекта",
    description:
      "Замеры площади, тип загрязнений (остатки абразива, металлическая пыль, цементный налёт, жировые плёнки), выбор метода обеспыливания согласно ТЗ. Фотофиксация исходного состояния поверхности.",
  },
  {
    step: 2,
    title: "ППР и наряд-допуск",
    description:
      "Оформление проекта производства работ на высоте и наряда-допуска для промальп-бригады. Проверка страховочного снаряжения, осмотр точек анкеровки.",
  },
  {
    step: 3,
    title: "Монтаж промальп-снаряжения",
    description:
      "Установка анкеров, навеска тросов, сборка беседок. Подготовка оборудования: компрессор, промышленный пылесос, шланги.",
  },
  {
    step: 4,
    title: "Подготовка оборудования",
    description:
      "Подключение компрессора к источнику воздуха или пылесоса — к питанию. Тест давления и расхода. Очистка пыли перед нанесением ЛКМ ведётся сухим инструментом при влажности воздуха до 80%.",
  },
  {
    step: 5,
    title: "Обеспыливание секция за секцией",
    description:
      "Равномерная проходка вдоль конструкции. Компрессор держат под углом 30–45° к поверхности; пылесос — вплотную. Труднодоступные узлы: фланцы, ребра жёсткости, сварные швы — обрабатываются с насадкой или ручной щёткой.",
  },
  {
    step: 6,
    title: "Визуальный контроль",
    description:
      "Осмотр поверхности на предмет остаточной пыли и пропущенных участков. Тест: белой тканевой перчаткой провести по поверхности — должно быть чисто. Повторная обработка дефектных зон.",
  },
  {
    step: 7,
    title: "Допуск к грунтовке",
    description:
      "Составление акта выполненных работ, передача поверхности под антикоррозийную защиту. Межоперационный интервал минимален — грунтовку наносят незамедлительно после обеспыливания.",
  },
];

const advantages = [
  {
    title: "Экономия на инфраструктуре.",
    body: "Строительные леса для одного пролёта — несколько дней монтажа и 30–40% добавки к бюджету. Промальп выезжает через 1–2 дня после согласования ТЗ без дополнительных разрешений.",
  },
  {
    title: "Работа без остановки производства.",
    body: "Промальп-бригада занимает только тот участок, где ведётся обеспыливание. Цех работает, транспорт не перекрывается — особенно важно на действующих промышленных объектах.",
  },
  {
    title: "Совмещение операций за один выезд.",
    body: "Механическая очистка + обеспыливание + грунтование в один визит. Промальп не уходит с объекта между этапами — нет риска повторного загрязнения поверхности в ожидании следующей бригады.",
  },
  {
    title: "Доступ к труднодоступным местам.",
    body: "Обратные стороны балок, узлы болтовых соединений, фланцы, ребристые поверхности — промальп добирается с насадкой к каждому сантиметру. Пылесос с гибким шлангом проходит туда, куда не дотянуться с лесов.",
  },
  {
    title: "Скорость выезда.",
    body: "При срочной необходимости (например, перед нанесением покрытия в погодное «окно») бригада выезжает через 1–2 рабочих дня. Нет ожидания монтажа подмостей или согласования аренды подъёмника.",
  },
];

const pricingFactors = [
  {
    title: "Метод обеспыливания",
    body: "компрессор (79 ₽/м²) — дешевле, пылесос (130 ₽/м²) — дороже",
  },
  {
    title: "Площадь и геометрия",
    body: "узкие профили дороже плоских поверхностей",
  },
  {
    title: "Высота и доступность",
    body: "влияет на время монтажа промальп-снаряжения",
  },
  {
    title: "Совмещение операций",
    body: "скидка при комплексном выезде (очистка + обеспыливание + грунтование)",
  },
  {
    title: "Регион",
    body: "+20% Москва, −10% для ряда регионов",
  },
];

const faq = [
  {
    question: "Зачем нужно обеспыливание перед покраской металла?",
    answer:
      "Обеспыливание перед покраской металла устраняет частицы пыли, абразива и продуктов коррозии, которые снижают адгезию ЛКМ. Один слой загрязнения толщиной 10–50 мкм достаточен, чтобы покрытие отслоилось через 1–2 сезона под нагрузкой. По ГОСТ 9.402 адгезия должна составлять не ниже 1–2 балла; без очистки поверхности этот показатель не достигается.",
  },
  {
    question: "Какой метод обеспыливания лучше: компрессор, пылесос или влажный?",
    answer:
      "Зависит от ситуации. Компрессор (79 ₽/м²) — оптимален после пескоструйки на металле: быстро, дёшево, без влаги. Пылесос (130 ₽/м²) — при высоких требованиях к чистоте или в закрытых помещениях. Влажный способ (150 ₽/м²) — для бетона, плоских поверхностей. Гидроструйная промывка (73 ₽/м²) — для горизонтальных поверхностей с солевыми загрязнениями.",
  },
  {
    question: "Сколько стоит обеспыливание металлоконструкций за 1 м²?",
    answer:
      "Обеспыливание металлоконструкций стоит от 73 ₽/м² (гидроструйная промывка) до 150 ₽/м² (влажный способ). Компрессорный обдув — от 79 ₽/м², пылесос — от 130 ₽/м². Итоговая стоимость зависит от метода, площади, высоты и региона. Точная смета — в калькуляторе или по заявке.",
  },
  {
    question: "Можно ли красить металл без предварительного обеспыливания?",
    answer:
      "Теоретически — да, практически — нет. Краска ляжет визуально ровно, но адгезия будет нарушена: уже через 6–12 месяцев эксплуатации появятся вздутия и расслоения. Стоимость повторного нанесения покрытия плюс очистки обходится в 2–3 раза дороже, чем обеспыливание до первой окраски.",
  },
  {
    question: "Через какое время после обеспыливания нужно наносить грунтовку?",
    answer:
      "Немедленно — в идеале в течение 30–60 минут при нормальных условиях (+5…+25°C, влажность до 80%). Для металла это особенно критично: очищенная поверхность начинает окисляться через 30 минут при высокой влажности. Промальп-бригада MS-PRO совмещает обеспыливание и грунтование в одном выезде — минимизирует межоперационный интервал.",
  },
  {
    question: "Можно ли делать обеспыливание на высоте без строительных лесов?",
    answer:
      "Да — это основной формат работы MS-PRO. Промышленные альпинисты выполняют обеспыливание строительных конструкций, металлоконструкций и фасадов на любой высоте с беседок и тросовых систем. Без лесов, без вышек, без дополнительных разрешений на временные сооружения. Экономия на инфраструктуре — от 30% бюджета.",
  },
  {
    question: "Обеспыливание нужно только для металла или для бетона тоже?",
    answer:
      "Для бетона тоже обязательно. Бетонные, кирпичные и железобетонные конструкции перед нанесением пропиток, красок и защитных составов требуют удаления цементного молочка, строительной пыли и загрязнений. Метод выбирается по типу основания: для бетонных полов — влажный способ или пылесос, для вертикальных поверхностей — компрессор или пылесос.",
  },
  {
    question: "Чем обеспыливание отличается от промывки водой?",
    answer:
      "Промывка водой (гидроструйная) — один из методов обеспыливания при низком давлении, направленный на удаление водорастворимых загрязнений: солей, хлоридов, цементного налёта. Компрессорный обдув и пылесос удаляют сухие частицы без контакта с водой. Для металла влажные методы требуют немедленного грунтования во избежание вторичного ржавления.",
  },
];

export default function Dedusting() {
  useEffect(() => {
    document.title = "Обеспыливание перед покраской металла и бетона | MS-PRO";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Обеспыливание поверхностей промальпом перед нанесением ЛКМ: компрессор, пылесос, влажный способ, гидро. От 73 ₽/м². Без лесов. Звоните: +7 (987) 909-29-38."
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
      "name": "Обеспыливание поверхностей промышленными альпинистами",
      "description":
        "Обеспыливание поверхностей промальпом перед нанесением ЛКМ: компрессор, пылесос, влажный способ, гидро. От 73 ₽/м². Без лесов.",
      "url": "https://mspro-ltd.ru/services/dedusting",
      "provider": { "@type": "Organization", "name": "MSPRO", "url": "https://mspro-ltd.ru" },
      "areaServed": { "@type": "Country", "name": "Россия" },
      "serviceType": "Обеспыливание поверхностей",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "RUB",
        "price": "73",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "73",
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
      "headline": "Обеспыливание поверхностей промышленными альпинистами",
      "description":
        "Обеспыливание поверхностей промальпом перед нанесением ЛКМ: компрессор, пылесос, влажный способ, гидро. От 73 ₽/м². Без лесов.",
      "url": "https://mspro-ltd.ru/services/dedusting",
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
            <Wind className="h-4 w-4" />
            СРО (стройка) член №{CREDENTIALS.sroConstruction.memberNumber}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-dedusting-h1">
            Обеспыливание поверхности перед покраской промышленными альпинистами
          </h1>
          <p className="mt-6 text-lg text-muted-foreground" data-testid="text-dedusting-intro">
            MS-PRO предлагает обеспыливание поверхности перед нанесением ЛКМ — обязательный этап подготовки
            металла и бетона к антикоррозийным покрытиям. Специализация: обеспыливание металлоконструкций,
            бетонных и строительных конструкций без строительных лесов и подъёмников: промышленные альпинисты
            работают на беседках, добираясь до любой высоты. Обеспыливание металла перед окраской совмещается
            с очисткой или антикоррозийной обработкой в одном выезде. Выезд — за 1–2 рабочих дня.
            Звоните: +7&nbsp;(987)&nbsp;909-29-38.
          </p>
        </div>

        {/* Когда необходимо */}
        <section className="mt-16" id="when-needed">
          <h2 className="text-2xl font-bold" data-testid="text-when-heading">
            Когда необходимо обеспыливание
          </h2>
          <p className="mt-4 text-muted-foreground">
            Пыль, абразивные частицы и продукты коррозии снижают адгезию лакокрасочных покрытий с металлом и
            бетоном. Один слой строительной пыли (кремнезём, цемент, окись железа) достаточен, чтобы
            антикоррозийная грунтовка потеряла от 30 до 70% адгезионной прочности по ГОСТ 9.402.
          </p>
          <div className="mt-8 space-y-8">
            {whenNeeded.map((item, index) => (
              <div key={index} data-testid={`when-item-${index}`}>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">
                  {index === 0 ? (
                    <>
                      Пескоструйная очистка металла до Sa 2.5 оставляет на поверхности до 5 г/м² остатков
                      абразива — корунда, стальной дроби или купрошлака. Частицы забиваются в профиль поверхности
                      и мешают адгезии грунтовки. Аналогичная картина после{" "}
                      <Link href="/services/hydroblast" className="text-primary underline underline-offset-2">
                        гидроструйной очистки
                      </Link>
                      : флэш-раст и минеральные отложения с водой оседают вновь. Обеспыливание компрессором после
                      пескоструйки — стандартная часть операции; без неё результат деградирует за первые 6 месяцев
                      эксплуатации.
                    </>
                  ) : index === 1 ? (
                    <>
                      <Link href="/services/mechanical-cleaning" className="text-primary underline underline-offset-2">
                        Механическая очистка металла
                      </Link>{" "}
                      болгаркой, шабером и проволочной щёткой генерирует металлическую пыль, мелкую стальную
                      стружку и частицы старых ЛКМ. Эти загрязнения электростатически притягиваются к поверхности
                      и не сдуваются ветром. Промышленный пылесос или компрессор снимает их за одну проходку.
                      Без обеспыливания грунтовка ложится неравномерно: проявляются «пустоты» под плёнкой,
                      которые служат очагами коррозии.
                    </>
                  ) : (
                    item.body
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Методы */}
        <section className="mt-16" id="methods">
          <h2 className="text-2xl font-bold" data-testid="text-methods-heading">
            Методы обеспыливания поверхностей
          </h2>
          <p className="mt-4 text-muted-foreground">
            Обеспыливание поверхности выполняется четырьмя методами; выбор зависит от типа загрязнения,
            материала основания и требований нормативной документации.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm" data-testid="methods-table">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-semibold">Метод</th>
                  <th className="py-3 text-right font-semibold">Цена за м²</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {methods.map((m, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 font-medium text-foreground">{m.name}</td>
                    <td className="py-3 text-right font-semibold text-foreground whitespace-nowrap">{m.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 space-y-6">
            {methods.map((m, index) => (
              <div key={index} data-testid={`method-item-${index}`}>
                <h3 className="font-semibold">
                  {m.name} — {m.price}
                </h3>
                <p className="mt-1 text-muted-foreground">{m.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Этапы */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-steps-heading">
            Технология обеспыливания на высоте — этапы работ
          </h2>
          <p className="mt-4 text-muted-foreground">
            Промышленное обеспыливание на высоте ведётся промальп-бригадой без строительных лесов. Промышленные
            альпинисты MS-PRO добираются до балок, трубопроводов, фасадов и перекрытий на беседках и тросовых
            системах.
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
            Обеспыливание промышленное без лесов — преимущества промальпа
          </h2>
          <p className="mt-4 text-muted-foreground">
            MS-PRO предлагает обеспыливание промышленное на высоте без строительных лесов как ключевую
            специализацию. Промышленные альпинисты работают там, куда не пройдёт ни лесостроительная бригада,
            ни телескопическая вышка за разумные деньги.
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
            Стоимость обеспыливания металла и бетона
          </h2>
          <p className="mt-4 text-muted-foreground">
            Стоимость обеспыливания металлоконструкций зависит от выбранного метода. Базовые расценки MS-PRO
            (степень очистки стандартная, без учёта региональных коэффициентов):
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm" data-testid="pricing-table">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-semibold">Метод</th>
                  <th className="py-3 text-right font-semibold">Цена за м²</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {methods.map((m, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 font-medium text-foreground">{m.name}</td>
                    <td className="py-3 text-right font-semibold text-foreground whitespace-nowrap">{m.price}</td>
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
            Введите площадь, метод и город — получите смету за 30 секунд.
            Звоните: +7 (987) 909-29-38.
          </p>
        </section>

        {/* Безопасность */}
        <section className="mt-16 rounded-lg bg-muted/50 p-8">
          <h2 className="text-xl font-semibold" data-testid="text-safety-heading">Безопасность и допуски</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Все промышленные альпинисты MSPRO аттестованы по 5-му разряду. Работы ведутся по наряду-допуску
            и ППР на каждый объект — согласно ГОСТ Р ИСО 22846 и СНиП 12-03-2001. Страховочные системы двойные:
            рабочая и страховочная линии. Работы застрахованы по СМР.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            MSPRO — член СРО строительства №{CREDENTIALS.sroConstruction.memberNumber}.
            Лицензия МЧС №{CREDENTIALS.mchs.number}.
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold" data-testid="text-faq-heading">
            FAQ — частые вопросы об обеспыливании
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
            Опишите объект и задачу: тип поверхности (металл / бетон), площадь, высота, предыдущая операция
            (пескоструйка / механическая очистка / шлифование). Выезд на замер — бесплатно.
            Промышленные альпинисты MS-PRO готовы приступить через 1–2 дня.
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
            <Link href="/services/anticorrosion-at-height" className="text-primary underline underline-offset-2">
              Антикоррозийная защита металлоконструкций
            </Link>
            <Link href="/services/mechanical-cleaning" className="text-primary underline underline-offset-2">
              Механическая очистка металла
            </Link>
            <Link href="/services/sandblasting" className="text-primary underline underline-offset-2">
              Пескоструйная очистка металла
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
