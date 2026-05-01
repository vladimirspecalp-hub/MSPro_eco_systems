import { useEffect } from "react";
import { Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { CREDENTIALS } from "@/content/copySystem";

const objectTypes = [
  {
    title: "Металлоконструкции и балки на высоте",
    body: "Фермы покрытий, несущие балки, колонны промышленных цехов и ангаров на высоте 6–30 м. Промальп-бригада разворачивается за 2–4 часа: навешивает верёвочные системы, монтирует беседки и начинает обработку без остановки производства в цехе.",
  },
  {
    title: "Трубопроводы и резервуары (снаружи)",
    body: "Трубопровод по эстакаде на высоте 10–15 м, резервуар с цилиндрической боковой поверхностью, недоступной с земли. Промальп работает снизу вверх, секция за секцией, не требуя временных платформ.",
  },
  {
    title: "Мосты, опоры, эстакады",
    body: "Металлические элементы мостовых пролётов и опор — сложные геометрические формы с обратными сторонами, фланцами и узлами. Альпинист работает в беседке и управляет углом подачи абразива вручную, что невозможно с вышки или лесов.",
  },
  {
    title: "Промышленные фасады и ограждения",
    body: "Профлист, сэндвич-панели, ограждения из профильных труб. Для таких конструкций очистка металла от ржавчины пескоструем и пескоструйная обработка перед покраской возвращают поверхности нужную шероховатость (Rz 40–70 мкм).",
  },
];

const saGrades = [
  {
    grade: "Sa 1 (лёгкая)",
    remains: "Рыхлая ржавчина и окалина удалены, плотная допускается",
    paint: "Временная защита, простые алкидные краски",
    price: "410 ₽/м² (металл)",
  },
  {
    grade: "Sa 2 (тщательная)",
    remains: "Почти вся ржавчина и окалина удалены, пятна до 33% площади",
    paint: "Алкидные и стандартные эпоксидные грунты",
    price: "~504 ₽/м²",
  },
  {
    grade: "Sa 2.5 (очень тщательная)",
    remains: "Металл блестит, пятна ≤5% площади",
    paint: "Высококачественные антикоррозийные системы, цинкнаполненные грунты",
    price: "~640 ₽/м²",
  },
  {
    grade: "Sa 3 (белый металл)",
    remains: "Полностью чистый серебристый металл, нет пятен",
    paint: "Подводные конструкции, судовые краски, специальные системы",
    price: "~955 ₽/м²",
  },
];

const steps = [
  {
    num: "01",
    title: "Обследование объекта",
    desc: "Выезд инженера, фотофиксация, определение исходной степени ржавления, согласование целевой степени Sa с заказчиком.",
  },
  {
    num: "02",
    title: "ППР и наряд-допуск",
    desc: "Оформление проекта производства работ, допуска на высоту, согласование времени начала работ с ответственным заказчика.",
  },
  {
    num: "03",
    title: "Монтаж снаряжения",
    desc: "Навеска анкеров, верёвочных систем, беседок; подключение компрессора и пескоструйного аппарата к сети или автономному генератору.",
  },
  {
    num: "04",
    title: "Подготовка поверхности",
    desc: "Обезжиривание сольвентом, удаление масляных пятен и хлоридов, контроль влажности (≤80%, точка росы ≥3°C).",
  },
  {
    num: "05",
    title: "Абразивно-струйная обработка",
    desc: "Абразивно-струйная очистка металла до целевого Sa: подача купершлака, кварцевого песка или стальной дроби, контроль профиля поверхности Rz.",
  },
  {
    num: "06",
    title: "Обеспыливание и контроль",
    desc: "Клининг сжатым воздухом, визуальная инспекция, замер шероховатости, фотофиксация, допуск к грунтованию.",
  },
];

const faq = [
  {
    q: "Что такое пескоструйная очистка металла и как она работает?",
    a: "Пескоструйная очистка металла — абразивно-струйная обработка поверхности частицами абразива (кварцевый песок, купершлак, стальная дробь), которые подаются сжатым воздухом под давлением 6–8 атм. Частицы удаляют ржавчину, окалину и старое покрытие, формируя шероховатость поверхности (Rz 40–100 мкм) для лучшей адгезии грунтовки.",
  },
  {
    q: "Чем отличается пескоструйная обработка промальпом от стационарной пескоструйки в цехе?",
    a: "Стационарная пескоструйка требует демонтажа конструкции и транспортировки в камеру. Пескоструйная обработка промальпом — работа на месте, на высоте, без демонтажа. Исключает затраты на транспортировку, риски повреждения при перевозке и простой объекта.",
  },
  {
    q: "Какую степень очистки выбрать: Sa 2, Sa 2.5 или Sa 3?",
    a: "Sa 2 подходит для бюджетных алкидных систем. Sa 2.5 — оптимальный выбор для двухкомпонентных эпоксидных и цинкнаполненных грунтов, используется в 80% проектов. Sa 3 («белый металл») нужен только под специальные покрытия для подводных или судовых конструкций. В большинстве случаев рекомендуем Sa 2.5.",
  },
  {
    q: "Сколько стоит пескоструйная очистка металлоконструкций за 1 м²?",
    a: "Цена пескоструйной обработки металлоконструкций — от 410 ₽/м² (Sa 1.0) до 955 ₽/м² (Sa 3.0). Для ориентира: пескоструйка металлоконструкций цена при Sa 2.5 — около 640 ₽/м² по металлу. Точный расчёт — в калькуляторе или по звонку.",
  },
  {
    q: "Можно ли делать пескоструйку без строительных лесов на высоте?",
    a: "Да — именно это наш основной профиль. Промышленные альпинисты MS-PRO выполняют пескоструйную очистку на высоте без лесов и без подъёмной техники. Используем верёвочные системы двойного страхования и специальные беседки. Максимальная высота работ — 200 м.",
  },
  {
    q: "Через какое время после пескоструйки нужно наносить грунтовку?",
    a: "Межоперационный интервал — не более 4–6 часов (температура >+5°C, влажность <80%). MS-PRO организует параллельную работу бригад: одна чистит, вторая грунтует следом, чтобы не допустить образования первичной ржавчины.",
  },
  {
    q: "Какой абразив лучше: кварцевый песок, купершлак или стальная дробь?",
    a: "Кварцевый песок — бюджетный вариант, однократный, не рекомендован в закрытых помещениях. Купершлак — оптимум по цене/качеству для открытых объектов, однократный. Стальная дробь — многоразовая, идеальна для закрытых камер. На высотных объектах применяем купершлак с пылеулавливающим оборудованием.",
  },
  {
    q: "Можно ли пескоструить при минусовой температуре или дожде?",
    a: "При дожде работы не ведём. При минусовой температуре (до -10°C) работа возможна при условии: влажность ≤75%, разница между температурой воздуха и точкой росы ≥3°C, поверхность прогрета выше нуля. Каждый случай согласовываем индивидуально.",
  },
];

export default function Sandblasting() {
  useEffect(() => {
    document.title = "Пескоструйная очистка металла без лесов | MS-PRO";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Пескоструйная обработка металлоконструкций без лесов. Степени Sa 1–Sa 3 (ISO 8501). Цена от 410 ₽/м². Выезд за 1–2 дня. Звоните: +7 (987) 909-29-38."
      );
    }

    // Schema.org
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: "Пескоструйная очистка металла промышленными альпинистами",
          description:
            "Абразивно-струйная очистка металлоконструкций, трубопроводов и резервуаров на высоте без лесов. Степени Sa 1–Sa 3 по ISO 8501.",
          provider: {
            "@type": "Organization",
            name: "MS-PRO",
            telephone: CREDENTIALS.phone,
          },
          areaServed: "Россия",
          offers: {
            "@type": "Offer",
            priceCurrency: "RUB",
            price: "410",
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice: "410",
              maxPrice: "955",
              priceCurrency: "RUB",
            },
          },
        },
        {
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        },
      ],
    };

    const scriptId = "schema-sandblasting";
    let existing = document.getElementById(scriptId);
    if (!existing) {
      existing = document.createElement("script");
      existing.id = scriptId;
      (existing as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(existing);
    }
    existing.textContent = JSON.stringify(schema);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-orange-400" />
            <span className="text-orange-400 font-medium uppercase tracking-wider text-sm">
              Пескоструйная очистка
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Пескоструйная очистка металла промышленными альпинистами
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl">
            Пескоструйная обработка металлоконструкций, трубопроводов и
            резервуаров на любой высоте — без строительных лесов и автовышек.
            До степени Sa&nbsp;3.0 по ISO&nbsp;8501. Выезд за 1–2 дня.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
              <Link href="/contacts">Оставить заявку</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/calculator">Рассчитать стоимость</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Object types */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-8">
            Для каких объектов применяется пескоструйная очистка
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {objectTypes.map((obj, idx) => (
              <Card key={idx} className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-800">
                    {obj.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm leading-relaxed">{obj.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-slate-600">
            Нет необходимости в строительных лесах: бригада{" "}
            <Link href="/services/rope-access" className="text-orange-500 hover:underline">
              промышленных альпинистов
            </Link>{" "}
            добирается до любой точки объекта с верёвочных систем.
          </p>
        </div>
      </section>

      {/* Sa grades */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-4">
            Степени очистки металла по ISO 8501 — что выбрать
          </h2>
          <p className="text-slate-600 mb-8">
            Стандарт ISO 8501 (ГОСТ 9.402) делит абразивно-струйную очистку
            металла на четыре степени по количеству остаточных загрязнений.
            Степень очистки Sa&nbsp;2.5 ISO&nbsp;8501 — самый популярный
            уровень для промышленных объектов.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="p-3 text-left">Степень</th>
                  <th className="p-3 text-left">Что остаётся</th>
                  <th className="p-3 text-left">Для каких ЛКМ</th>
                  <th className="p-3 text-left">Цена (металл)</th>
                </tr>
              </thead>
              <tbody>
                {saGrades.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="p-3 font-medium text-slate-800">{row.grade}</td>
                    <td className="p-3 text-slate-600">{row.remains}</td>
                    <td className="p-3 text-slate-600">{row.paint}</td>
                    <td className="p-3 font-medium text-orange-600">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-8">
            Технология работ — этапы пескоструйной обработки
          </h2>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm">
                  {step.num}
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{step.title}</div>
                  <div className="text-slate-600 text-sm mt-1">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              <strong>Важно:</strong> межоперационный интервал между
              пескоструйной очисткой и нанесением грунтовки — не более 4–6
              часов. MS-PRO работает двумя бригадами параллельно: одна чистит,
              вторая грунтует следом.{" "}
              <Link href="/services/anticorrosion-at-height" className="text-amber-700 underline">
                Подробнее об антикоррозийной защите
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-8">
            Почему пескоструйная очистка на высоте лучше, чем на земле с лесами
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Без строительных лесов",
                body: "Монтаж лесов добавляет 25–40% к смете. Пескоструйная обработка металлоконструкций промальп-бригадой ведётся с верёвочных систем — без разрешений и без простоя производства.",
              },
              {
                title: "Работа без остановки производства",
                body: "Альпинисты занимают только обрабатываемый участок. Пескоструйка без лесов не требует перегораживания дорог или демонтажа оборудования.",
              },
              {
                title: "Доступ к труднодоступным местам",
                body: "Обратные стороны балок, ребёра жёсткости, фланцы — куда вышка не дотянется. Альпинист работает в любом пространственном положении.",
              },
              {
                title: "Скорость выезда",
                body: "После согласования ТЗ бригада выезжает через 1–2 рабочих дня. Не нужно ждать доставки лесов или разрешений на перекрытие.",
              },
            ].map((adv, idx) => (
              <div key={idx} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold mb-1">{adv.title}</div>
                  <div className="text-slate-300 text-sm">{adv.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-4">
            Стоимость пескоструйной очистки металла
          </h2>
          <p className="text-slate-600 mb-6">
            Пескоструйка металлоконструкций: цена за 1&nbsp;м² зависит от
            степени Sa и материала поверхности.
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-3 text-left font-semibold">Материал</th>
                  <th className="p-3 text-center font-semibold">Sa 1.0</th>
                  <th className="p-3 text-center font-semibold">Sa 2.0</th>
                  <th className="p-3 text-center font-semibold">Sa 2.5</th>
                  <th className="p-3 text-center font-semibold">Sa 3.0</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Металл</td>
                  <td className="p-3 text-center">410 ₽/м²</td>
                  <td className="p-3 text-center">~504 ₽/м²</td>
                  <td className="p-3 text-center text-orange-600 font-medium">~640 ₽/м²</td>
                  <td className="p-3 text-center">~955 ₽/м²</td>
                </tr>
                <tr className="border-b bg-slate-50">
                  <td className="p-3 font-medium">Бетон</td>
                  <td className="p-3 text-center">430 ₽/м²</td>
                  <td className="p-3 text-center">~529 ₽/м²</td>
                  <td className="p-3 text-center">~671 ₽/м²</td>
                  <td className="p-3 text-center">~1002 ₽/м²</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Кирпич</td>
                  <td className="p-3 text-center">380 ₽/м²</td>
                  <td className="p-3 text-center">~467 ₽/м²</td>
                  <td className="p-3 text-center">~593 ₽/м²</td>
                  <td className="p-3 text-center">~885 ₽/м²</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
            <Link href="/calculator">Рассчитать в калькуляторе</Link>
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-8">
            FAQ — частые вопросы о пескоструйной очистке
          </h2>
          <div className="space-y-4">
            {faq.map((item, idx) => (
              <Card key={idx} className="border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-800">
                    {item.q}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Оставить заявку — ответим за 1 час
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            Выезд на объект, замеры и смета — бесплатно
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50" asChild>
              <Link href="/contacts">Оставить заявку</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-orange-600" asChild>
              <a href={`tel:${CREDENTIALS.phone}`}>{CREDENTIALS.phone}</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
