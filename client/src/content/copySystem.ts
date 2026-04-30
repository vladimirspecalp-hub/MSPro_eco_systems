/**
 * Copy System v1.0 — MS-PRO Rope Access First
 * 
 * Система динамического копирайтинга для B2B промышленного альпинизма.
 * Главный продукт: высотные работы промышленными альпинистами.
 * Специализация: нанесение огнезащиты (ОГЗ) и антикоррозионной защиты (АКЗ).
 */

export type IntentType =
  | "default"
  | "price"
  | "urgent"
  | "safety"
  | "lep"
  | "ams"
  | "stack"
  | "single"
  | "fireproof"
  | "anticorr"
  | "geo";

export type ServiceType =
  | "rope-access"
  | "fireproofing-at-height"
  | "anticorrosion-at-height"
  | "demolition"
  | "default";

export interface CopyVariables {
  service?: string;
  objectType?: string;
  material?: string;
  region?: string;
  city?: string;
  intent?: IntentType;
  query?: string;
}

export interface CopyResult {
  title: string;
  description: string;
  h1: string;
  subhead: string;
  offer: string;
  bullets: string[];
  ctaLabel: string;
  ctaMicrocopy: string;
  ctaSecondaryLabel: string;
  ctaSecondaryMicrocopy: string;
  trustBlock: string;
  faq: Array<{ question: string; answer: string }>;
  answerBlock: string;
}

export interface HeroVariant {
  h1: string;
  subhead: string;
  bullets: string[];
  ctaLabel: string;
  ctaMicrocopy: string;
  ctaSecondaryLabel: string;
  ctaSecondaryMicrocopy: string;
}

export const HERO_VARIANTS: Record<IntentType, HeroVariant> = {
  default: {
    h1: "Высотные работы промышленными альпинистами для промобъектов",
    subhead: "Огнезащита и антикоррозионная защита металлоконструкций на высоте. Типовые объекты: ЛЭП, АМС/вышки связи, дымовые трубы (металл/ЖБ).",
    bullets: [
      "Работаем на действующих площадках: безопасная организация работ и согласование окон",
      "Контроль технологии нанесения и фиксация результата по этапам",
      "Исполнительная документация для ПТО/эксплуатации по договору",
      "Прозрачная ответственность: критерии приемки и границы по материалу/работам фиксируем заранее",
    ],
    ctaLabel: "Запросить расчёт по объекту",
    ctaMicrocopy: "Приложите ТЗ/фото — вернёмся с КП и составом работ.",
    ctaSecondaryLabel: "Смотреть лицензии и СРО",
    ctaSecondaryMicrocopy: "Подтверждения в открытом доступе.",
  },
  price: {
    h1: "Высотные работы промальпинистов: расчёт сметы на ОГЗ и АКЗ по ТЗ",
    subhead: "Посчитаем объём работ для ЛЭП, АМС, вышек связи и труб. В КП — состав работ, этапность, требования к доступу и документы на сдачу.",
    bullets: [
      "Расчёт по ведомости/проекту или по фото + параметрам объекта",
      "Этапы: подготовка → нанесение → контроль → сдача",
      "В КП фиксируем, что входит/не входит",
      "Материал: заказчика или поставка по согласованию",
    ],
    ctaLabel: "Получить КП и состав работ",
    ctaMicrocopy: "Уточним 2–3 вопроса и вернём расчёт в рабочее время.",
    ctaSecondaryLabel: "Скачать чек-лист для ТЗ",
    ctaSecondaryMicrocopy: "",
  },
  urgent: {
    h1: "Срочные высотные работы: промальп для огнезащиты и АКЗ на промобъектах",
    subhead: "Когда горит срок или нужен быстрый запуск — организуем безопасный доступ, этапность и контроль выполнения.",
    bullets: [
      "Быстрая оценка по фото/видео + вводные данные",
      "Поэтапное выполнение с учётом режима предприятия",
      "Фиксация выполненных объёмов по зонам/ярусам",
      "Документы на сдачу — по согласованному перечню",
    ],
    ctaLabel: "Нужен быстрый расчёт",
    ctaMicrocopy: "Напишите объект и сроки — предложим план работ и график.",
    ctaSecondaryLabel: "Согласовать окна работ",
    ctaSecondaryMicrocopy: "",
  },
  safety: {
    h1: "Высотные работы на промобъектах с приоритетом безопасности и регламентов",
    subhead: "Промальп + ОГЗ/АКЗ на высоте. Организация через ППР/наряд-допуск и требования заказчика.",
    bullets: [
      "Безопасная организация: ограждение зоны, порядок работ, контроль рисков",
      "Работа на действующих объектах с допусками по внутренним правилам площадки",
      "Фотофиксация и отчётность по этапам — чтобы было что «принимать»",
      "Исполнительная документация: акты/журналы/приложения по договору",
    ],
    ctaLabel: "Запросить пакет документов к КП",
    ctaMicrocopy: "Пришлём перечень и приложим подтверждения.",
    ctaSecondaryLabel: "Обсудить требования площадки",
    ctaSecondaryMicrocopy: "",
  },
  lep: {
    h1: "Высотные работы на ЛЭП: огнезащита и антикоррозионная защита металлоконструкций",
    subhead: "Подготовка поверхности, нанесение покрытия на высоте, контроль и документы для приемки.",
    bullets: [
      "Организация работ с учётом ограничений объекта",
      "Нанесение ОГЗ/АКЗ по согласованной технологии",
      "Контроль параметров покрытия и фиксация результата",
      "Документы на сдачу — по требованиям заказчика",
    ],
    ctaLabel: "Рассчитать работы по ЛЭП",
    ctaMicrocopy: "",
    ctaSecondaryLabel: "Согласовать технологию",
    ctaSecondaryMicrocopy: "",
  },
  ams: {
    h1: "Огнезащита и АКЗ на АМС и вышках связи — промышленный альпинизм",
    subhead: "Высотное нанесение покрытий на мачтах и башнях: подготовка, нанесение, контроль, исполнительная документация.",
    bullets: [
      "Работы в условиях ограниченного доступа и плотной инфраструктуры",
      "Поэтапность по зонам/ярусам для приемки",
      "Контроль качества нанесения на высоте",
      "Критерии приемки фиксируем заранее",
    ],
    ctaLabel: "Получить расчёт по АМС/вышке",
    ctaMicrocopy: "",
    ctaSecondaryLabel: "Запросить пример состава работ",
    ctaSecondaryMicrocopy: "",
  },
  stack: {
    h1: "Высотные работы на дымовых трубах: антикоррозионная защита и огнезащита",
    subhead: "Металлические и железобетонные трубы: подготовка, нанесение покрытия, контроль и отчётность по этапам.",
    bullets: [
      "Технология под высоту, ветровые условия и режим площадки",
      "Контроль по зонам/доступным участкам",
      "Отчётность: фотофиксация, акты и журналы по договору",
      "Планирование работ для минимального влияния на производство",
    ],
    ctaLabel: "Рассчитать работы по трубе",
    ctaMicrocopy: "",
    ctaSecondaryLabel: "Обсудить подготовку/обследование",
    ctaSecondaryMicrocopy: "",
  },
  single: {
    h1: "Один подрядчик на высоте: огнезащита и АКЗ с контролем и документами в одном договоре",
    subhead: "Чтобы не было «пинг-понга» между поставщиком материала и исполнителем, фиксируем технологию, контроль и критерии приемки.",
    bullets: [
      "Материал: заказчика (с входным контролем) или поставка по согласованию",
      "Контроль условий нанесения и параметров покрытия — по ТЗ/регламенту",
      "Исполнительная документация для приемки",
      "Прозрачные границы ответственности в договоре",
    ],
    ctaLabel: "Запросить КП с критериями приемки",
    ctaMicrocopy: "",
    ctaSecondaryLabel: "Разобрать риск «материал vs работы»",
    ctaSecondaryMicrocopy: "",
  },
  fireproof: {
    h1: "Огнезащита металлоконструкций на высоте (промышленный альпинизм)",
    subhead: "Наносим огнезащитные составы на высоте там, где требуется доступ без тяжелой техники: ЛЭП, АМС/вышки, трубы, фермы и площадки.",
    bullets: [
      "Вводные и осмотр (ТЗ/проект/фото)",
      "Подготовка поверхности по ТЗ",
      "Нанесение огнезащитного слоя по согласованной технологии",
      "Контроль по этапам (по ТЗ/регламенту)",
      "Исполнительная документация и сдача",
    ],
    ctaLabel: "Рассчитать огнезащиту на высоте",
    ctaMicrocopy: "",
    ctaSecondaryLabel: "Смотреть лицензию МЧС",
    ctaSecondaryMicrocopy: "",
  },
  anticorr: {
    h1: "Антикоррозионная защита металлоконструкций на высоте (АКЗ)",
    subhead: "Обновляем и наносим защитные покрытия на высоте для продления ресурса конструкций. Профильные объекты: ЛЭП, АМС/вышки, дымовые трубы, промэстакады и площадки.",
    bullets: [
      "Риск: «потом не доказать, кто виноват» → Решение: критерии приемки + контроль по этапам + фотофиксация",
      "Риск: «сложно принять высотные работы» → Решение: отчёт по зонам/ярусам, актирование по этапам",
      "Риск: «материал заказчика» → Решение: согласование условий + входной контроль и письменные предупреждения при несоответствиях",
    ],
    ctaLabel: "Рассчитать АКЗ на высоте",
    ctaMicrocopy: "",
    ctaSecondaryLabel: "Смотреть допуски СРО",
    ctaSecondaryMicrocopy: "",
  },
  geo: {
    h1: "Высотные работы промышленными альпинистами в {city}",
    subhead: "Огнезащита и антикоррозионная защита металлоконструкций на высоте. Выездные бригады по России.",
    bullets: [
      "Работаем на действующих площадках",
      "Контроль технологии и фиксация результата",
      "Исполнительная документация по договору",
      "Знаем местную специфику",
    ],
    ctaLabel: "Запросить расчёт в {city}",
    ctaMicrocopy: "Бригада уже в вашем регионе.",
    ctaSecondaryLabel: "Смотреть лицензии и СРО",
    ctaSecondaryMicrocopy: "",
  },
};

const SERVICE_NAMES: Record<ServiceType, string> = {
  "rope-access": "высотные работы промышленными альпинистами",
  "fireproofing-at-height": "огнезащита на высоте",
  "anticorrosion-at-height": "антикоррозионная защита на высоте",
  "demolition": "демонтаж на высоте",
  "default": "промышленные высотные работы",
};

const H1_TEMPLATES: Record<IntentType, string[]> = {
  default: [HERO_VARIANTS.default.h1],
  price: [HERO_VARIANTS.price.h1],
  urgent: [HERO_VARIANTS.urgent.h1],
  safety: [HERO_VARIANTS.safety.h1],
  lep: [HERO_VARIANTS.lep.h1],
  ams: [HERO_VARIANTS.ams.h1],
  stack: [HERO_VARIANTS.stack.h1],
  single: [HERO_VARIANTS.single.h1],
  fireproof: [HERO_VARIANTS.fireproof.h1],
  anticorr: [HERO_VARIANTS.anticorr.h1],
  geo: [HERO_VARIANTS.geo.h1],
};

const OFFERS: Record<IntentType, string> = {
  default: "Закрываем весь цикл: организация доступа на высоте, подготовка поверхности, нанесение покрытий, контроль и исполнительная документация для приёмки на промобъектах.",
  price: "Прозрачный расчёт стоимости работ. КП с разбивкой по статьям: подготовка, нанесение, контроль, документы.",
  urgent: "Быстрый запуск работ при сжатых сроках. Организуем доступ, согласуем этапность, выполняем с контролем.",
  safety: "Выполняем высотные работы с соблюдением требований безопасности, ППР и контролем качества результата.",
  lep: "ОГЗ и АКЗ на опорах ЛЭП: организация работ с учётом ограничений, нанесение по технологии, документы для сдачи.",
  ams: "Высотные работы на АМС и вышках связи: нанесение покрытий в условиях ограниченного доступа с контролем и отчётностью.",
  stack: "Огнезащита и АКЗ дымовых труб: подготовка, нанесение, контроль с минимальным влиянием на производство.",
  single: "Один договор на материал + работы + контроль. Прозрачные границы ответственности и критерии приемки.",
  fireproof: "Огнезащита металлоконструкций на высоте: подготовка, нанесение, контроль и исполнительная документация.",
  anticorr: "АКЗ на высоте: система покрытий, контроль по этапам, документы для эксплуатации.",
  geo: "Высотные работы в вашем регионе. Выездные бригады, материалы по согласованию.",
};

const CTA_LABELS: Record<IntentType, string> = {
  default: HERO_VARIANTS.default.ctaLabel,
  price: HERO_VARIANTS.price.ctaLabel,
  urgent: HERO_VARIANTS.urgent.ctaLabel,
  safety: HERO_VARIANTS.safety.ctaLabel,
  lep: HERO_VARIANTS.lep.ctaLabel,
  ams: HERO_VARIANTS.ams.ctaLabel,
  stack: HERO_VARIANTS.stack.ctaLabel,
  single: HERO_VARIANTS.single.ctaLabel,
  fireproof: HERO_VARIANTS.fireproof.ctaLabel,
  anticorr: HERO_VARIANTS.anticorr.ctaLabel,
  geo: HERO_VARIANTS.geo.ctaLabel,
};

const CTA_LABELS_SECONDARY: Record<string, string> = {
  default: HERO_VARIANTS.default.ctaSecondaryLabel,
  price: HERO_VARIANTS.price.ctaSecondaryLabel,
  urgent: HERO_VARIANTS.urgent.ctaSecondaryLabel,
  safety: HERO_VARIANTS.safety.ctaSecondaryLabel,
  lep: HERO_VARIANTS.lep.ctaSecondaryLabel,
  ams: HERO_VARIANTS.ams.ctaSecondaryLabel,
  stack: HERO_VARIANTS.stack.ctaSecondaryLabel,
  single: HERO_VARIANTS.single.ctaSecondaryLabel,
  fireproof: HERO_VARIANTS.fireproof.ctaSecondaryLabel,
  anticorr: HERO_VARIANTS.anticorr.ctaSecondaryLabel,
  geo: HERO_VARIANTS.geo.ctaSecondaryLabel,
};

const CTA_MICROCOPY: Record<IntentType, string> = {
  default: HERO_VARIANTS.default.ctaMicrocopy,
  price: HERO_VARIANTS.price.ctaMicrocopy,
  urgent: HERO_VARIANTS.urgent.ctaMicrocopy,
  safety: HERO_VARIANTS.safety.ctaMicrocopy,
  lep: HERO_VARIANTS.lep.ctaMicrocopy,
  ams: HERO_VARIANTS.ams.ctaMicrocopy,
  stack: HERO_VARIANTS.stack.ctaMicrocopy,
  single: HERO_VARIANTS.single.ctaMicrocopy,
  fireproof: HERO_VARIANTS.fireproof.ctaMicrocopy,
  anticorr: HERO_VARIANTS.anticorr.ctaMicrocopy,
  geo: HERO_VARIANTS.geo.ctaMicrocopy,
};

const CTA_MICROCOPY_SECONDARY: Record<string, string> = {
  default: HERO_VARIANTS.default.ctaSecondaryMicrocopy,
};

const BULLETS_DEFAULT: string[] = HERO_VARIANTS.default.bullets;

const BULLETS_BY_INTENT: Partial<Record<IntentType, string[]>> = {
  default: HERO_VARIANTS.default.bullets,
  price: HERO_VARIANTS.price.bullets,
  urgent: HERO_VARIANTS.urgent.bullets,
  safety: HERO_VARIANTS.safety.bullets,
  lep: HERO_VARIANTS.lep.bullets,
  ams: HERO_VARIANTS.ams.bullets,
  stack: HERO_VARIANTS.stack.bullets,
  single: HERO_VARIANTS.single.bullets,
  fireproof: HERO_VARIANTS.fireproof.bullets,
  anticorr: HERO_VARIANTS.anticorr.bullets,
  geo: HERO_VARIANTS.geo.bullets,
};

const TRUST_BLOCKS: Record<string, string> = {
  default: "Сканы документов (СРО/лицензии/регламенты/удостоверения персонала) прикладываем к коммерческому предложению и договору. По запросу — перечень ИД на сдачу работ под ваш внутренний стандарт.",
  verified: "Лицензия МЧС 63-06-2023-003418 (от 23.08.2023). СРО (стройка): Ассоциация «СРО «СВС», член №1623 (20.11.2024). СРО (проектирование): член №455 (06.12.2024).",
  credentials: "Лицензия МЧС: 63-06-2023-003418 (Л014-00101-63/00671086), дата предоставления 23.08.2023. СРО (стройка): Ассоциация «СРО «СВС», СРО-С-027-12082009, член №1623, дата регистрации 20.11.2024. СРО (проектирование): СРО-П-213-23072019, член №455, дата регистрации 06.12.2024.",
};

const FAQ_DEFAULT: Array<{ question: string; answer: string }> = [
  {
    question: "Где вы работаете?",
    answer: "По РФ, выездные бригады, формат работ согласуем под объект.",
  },
  {
    question: "Что нужно для расчёта?",
    answer: "ТЗ/ведомость или фото + высота/тип конструкции/примерный объём.",
  },
  {
    question: "Делаете работы на действующих объектах?",
    answer: "Да, с учётом режима площадки и требований заказчика.",
  },
  {
    question: "Какие документы выдаёте?",
    answer: "Перечень согласуем в договоре: акты, журналы, фотофиксация, отчёт по этапам.",
  },
  {
    question: "Работаете материалом заказчика?",
    answer: "Да, при согласовании условий и входного контроля.",
  },
  {
    question: "Как фиксируете качество?",
    answer: "Контроль параметров по ТЗ (по этапам), с фото и замерами при необходимости.",
  },
  {
    question: "Какие объекты ваш профиль?",
    answer: "ЛЭП, АМС/вышки, дымовые трубы, промметаллоконструкции.",
  },
  {
    question: "Как быстро можете начать?",
    answer: "После согласования доступа/окон работ и вводных данных.",
  },
  {
    question: "Как заказать?",
    answer: "Оставьте заявку или отправьте исходные данные — вернёмся с КП и перечнем документов.",
  },
];

const FAQ_DEMOLITION: Array<{ question: string; answer: string }> = [
  {
    question: "Что такое демонтаж на высоте промышленным альпинизмом?",
    answer: "Это разбор конструкций на высоте от 10 м с помощью канатного доступа вместо лесов и спецтехники. Альпинисты работают с беседки или верёвочной системы, режут, стропят и опускают элементы по частям. Метод позволяет вести безопасный демонтаж в стеснённых условиях, без остановки производства и без аренды крана.",
  },
  {
    question: "Когда выгоднее заказать демонтаж промальпом, а не краном?",
    answer: "Промальп выгоднее, когда: кран физически не заходит на площадку; высота превышает рабочий радиус подъёмника; объект находится в охранной зоне ЛЭП; нельзя останавливать производство рядом; конструкция внутри здания. В этих случаях снос на высоте методом промышленного альпинизма — единственный или самый дешёвый вариант.",
  },
  {
    question: "Какие документы нужны для демонтажа на высоте?",
    answer: "Обязательны: ППР (проект производства работ), наряд-допуск на высотные работы, акт технического осмотра конструкции. При работе вблизи ЛЭП — согласование с сетевой организацией. Если объект — объект культурного наследия или в охранной зоне — отдельное согласование с органами охраны. Всё оформляем самостоятельно.",
  },
  {
    question: "Сколько стоит демонтаж металлоконструкций на высоте?",
    answer: "От 2 000 ₽/м² для стандартных металлоконструкций. Дымовые трубы — от 3 500 ₽/м² (ЖБ) и от 2 500 ₽/м² (металл). АМС и вышки связи — по договорённости после замеров. Итоговая цена зависит от высоты, материала, региона и метода резки. Точный расчёт — после выезда инженера.",
  },
  {
    question: "Сколько времени занимает демонтаж дымовой трубы 30 м?",
    answer: "Металлическая труба 30 м — 3–5 рабочих дней, включая монтаж страховки, демонтаж и вывоз. ЖБ-труба той же высоты — 7–10 дней (алмазная резка медленнее). Сроки зависят от диаметра, состояния металла и погодных условий. При попутном ветре свыше 10 м/с работы приостанавливаем по регламенту безопасности.",
  },
  {
    question: "Можно ли демонтировать конструкции рядом с действующим производством?",
    answer: "Да. Мы ограждаем только рабочую зону (радиус падения фрагментов + 2 м), остальная территория цеха продолжает работать. Работы можно вести в ночные окна или выходные по согласованному графику. ППР включает раздел по смежным рискам с указанием зон ограниченного доступа.",
  },
  {
    question: "Как утилизируется металлолом после демонтажа?",
    answer: "Металлолом сортируем на площадке по типу сплава. Можем организовать вывоз и сдачу в ближайший пункт приёма — стоимость металла иногда частично компенсирует расходы. Строительный мусор (ЖБ, кирпич) — вывоз контейнерами, лом передаётся лицензированному переработчику с документом об утилизации.",
  },
  {
    question: "Какая максимальная высота работ?",
    answer: "Технически — до 150 м. Практически — все объекты свыше 100 м требуют вертолётного заброса или специальной системы SRT (single rope technique) с промежуточными точками. Работаем на высоте до 150 м — в том числе на промышленных дымовых трубах, телебашнях и мачтах связи.",
  },
];

const FAQ_BY_INTENT: Partial<Record<IntentType, Array<{ question: string; answer: string }>>> = {
  fireproof: [
    { question: "С какими материалами работаете?", answer: "Согласуем систему под требования объекта; возможен материал заказчика." },
    { question: "Можно ли сделать «под ключ» с поставкой?", answer: "Да, поставка по согласованию." },
    { question: "Как принимаются работы?", answer: "По согласованным критериям: объём/этапы/контроль/документы." },
    { question: "Делаете на действующих объектах?", answer: "Да, с учетом режима и требований заказчика." },
    { question: "Что нужно для расчёта?", answer: "ТЗ/проект или фото + параметры объекта." },
    { question: "Какие объекты ваш профиль?", answer: "ЛЭП, АМС/вышки, дымовые трубы, промметаллоконструкции." },
    { question: "Как контролируете качество?", answer: "Замеры параметров покрытия, фотофиксация, отчётность по этапам." },
    { question: "Как быстро можете начать?", answer: "После согласования доступа и вводных данных." },
  ],
  anticorr: [
    { question: "Почему покрытие «слезает»?", answer: "Чаще всего из-за подготовки поверхности, несовместимости слоёв или нарушений условий нанесения." },
    { question: "Делаете ли вы подготовку поверхности?", answer: "Да, это базовый этап АКЗ." },
    { question: "Работаете по системе заказчика?", answer: "Да, но фиксируем совместимость и входной контроль." },
    { question: "Можно ли сваривать/резать после окраски?", answer: "Обычно это разрушает систему; ограничения фиксируем в технологической части." },
    { question: "Как контролируете качество?", answer: "Контроль параметров покрытия и фиксация условий работ." },
    { question: "Делаете ли вы ИД?", answer: "Да, комплект сдачи работ по договору/стандартам заказчика." },
    { question: "Что нужно для расчёта?", answer: "Объём, состояние поверхности, среда, доступность, сроки." },
    { question: "Работаете ли на действующих объектах?", answer: "Да, по согласованным окнам и ППР." },
    { question: "Как снимаете риск «материал vs работа»?", answer: "Через входной контроль, фиксацию совместимости и прозрачные границы ответственности." },
  ],
  safety: [
    { question: "Работаете ли по наряд-допуску?", answer: "Да, организация работ на высоте оформляется по требованиям заказчика/объекта." },
    { question: "Можно ночью/в выходные?", answer: "По согласованию, если объект допускает такой режим." },
    { question: "Делаете ли вы ограждение зоны?", answer: "Да, обеспечиваем безопасную зону и порядок работ." },
    { question: "Что с погодой/температурой?", answer: "Ограничения по условиям фиксируем до старта, чтобы не ухудшать качество." },
    { question: "Можно ли только «подкрасить местами»?", answer: "Можно, но важно оценить совместимость с существующим покрытием." },
    { question: "Какой отчёт даёте?", answer: "Фотофиксация, акты по договору." },
    { question: "Сколько людей/времени нужно?", answer: "Определяется объёмом и доступом; предложим план после осмотра/данных." },
  ],
};

const ANSWER_BLOCKS: Record<ServiceType, string> = {
  "rope-access": `MSPRO выполняет высотные работы промышленными альпинистами на промышленных объектах: огнезащиту и антикоррозионную защиту металлоконструкций на высоте. Мы организуем безопасный доступ, согласуем порядок работ с режимом предприятия и фиксируем результат по этапам — подготовка поверхности, нанесение покрытия, контроль параметров по ТЗ, исполнительная документация для приемки. Типовые объекты: ЛЭП, АМС и вышки связи, дымовые трубы (металл/ЖБ). Чтобы исключить спор «материал виноват или работы», заранее согласуем технологию, критерии приемки и формат контроля. Для расчёта достаточно ТЗ/ведомости или фото с параметрами объекта.`,
  "fireproofing-at-height": `Огнезащита на высоте нужна, когда конструкцию нельзя быстро снять/остановить или подойти техникой. MSPRO выполняет огнезащитную обработку металлоконструкций промышленными альпинистами на ЛЭП, АМС и вышках связи, дымовых трубах и промышленных металлоконструкциях. Мы согласуем порядок работ с режимом объекта, выполняем подготовку поверхности по ТЗ, наносим огнезащитный слой по выбранной системе и фиксируем результат по этапам. Чтобы приемка проходила без спорных моментов, заранее определяем критерии контроля и состав исполнительной документации, которые заказчик получит на сдаче.`,
  "anticorrosion-at-height": `Антикоррозионная защита на высоте требуется, когда конструкции работают в агрессивной среде и доступ к ним ограничен: ЛЭП, АМС/вышки связи, дымовые трубы и промышленные металлоконструкции. MSPRO выполняет АКЗ промышленными альпинистами: согласуем технологию, подготавливаем поверхность по ТЗ, наносим систему покрытий по этапам и фиксируем результат. Для приемки заранее определяем критерии контроля и состав исполнительной документации. Возможна работа на материале заказчика либо поставка материалов по согласованию — чтобы исключить споры между поставщиком и исполнителем, границы ответственности прописываются в договоре.`,
  "demolition": `Мы выполняем демонтаж на высоте там, где кран не проходит, автовышка не дотягивается, а остановка производства обойдётся дороже самих работ. Промышленные альпинисты MSPRO разбирают дымовые трубы, металлоконструкции, АМС и аварийные участки кровли — поэтапно, без лесов и тяжёлой техники, с оформлением ППР под каждый объект. Базовая ставка — от 2 000 ₽/м². Для расчёта достаточно ТЗ/фото — вернём смету за 1 час.`,
  "default": `MSPRO — промышленный альпинизм для нанесения огнезащиты и антикоррозионной защиты металлоконструкций на высоте. Работаем на ЛЭП, АМС/вышках связи, дымовых трубах и промметаллоконструкциях. Организуем безопасный доступ, контроль технологии и исполнительную документации для приемки.`,
};

export const CREDENTIALS = {
  mchs: {
    number: "63-06-2023-003418",
    fullNumber: "Л014-00101-63/00671086",
    date: "23.08.2023",
    name: "Лицензия МЧС",
  },
  sroConstruction: {
    association: "Ассоциация «СРО «СВС»",
    sroNumber: "СРО-С-027-12082009",
    memberNumber: "1623",
    date: "20.11.2024",
    name: "СРО (строительство)",
  },
  sroDesign: {
    sroNumber: "СРО-П-213-23072019",
    memberNumber: "455",
    date: "06.12.2024",
    name: "СРО (проектирование)",
  },
};

export const FORM_MICROCOPY = {
  underButton: "Ответ инженера в рабочее время. Можно приложить ТЗ/фото/ведомость. Спам не рассылаем.",
  success: "Заявка принята. Инженер изучит вводные и свяжется с вами.",
};

export const NAV_ITEMS = [
  {
    name: "Услуги", href: "/services/rope-access", submenu: [
      { name: "Высотные работы", href: "/services/rope-access" },
      { name: "ОГЗ на высоте", href: "/services/fireproofing-at-height" },
      { name: "АКЗ на высоте", href: "/services/anticorrosion-at-height" },
    ]
  },
  { name: "Объекты", href: "#objects" },
  { name: "Документы", href: "/documents" },
  { name: "Калькулятор", href: "/calculator" },
  { name: "Новости", href: "/news" },
  { name: "Контакты", href: "/contacts" },
];

const CITIES: string[] = [
  "Москва", "Санкт-Петербург", "Самара", "Тольятти", "Казань", "Нижний Новгород",
  "Екатеринбург", "Новосибирск", "Красноярск", "Краснодар", "Ростов-на-Дону",
  "Уфа", "Челябинск", "Пермь", "Волгоград", "Саратов",
];

function extractCityFromQuery(query: string): string | null {
  const lowerQuery = query.toLowerCase();
  for (const city of CITIES) {
    if (lowerQuery.includes(city.toLowerCase())) {
      return city;
    }
  }
  return null;
}

export function getIntentFromKeywords(query: string): IntentType {
  const lowerQuery = query.toLowerCase();

  if (/цена|стоимость|сколько стоит|расценки|смета|бюджет/.test(lowerQuery)) {
    return "price";
  }
  if (/срочно|быстро|горит|аврал|экстренно/.test(lowerQuery)) {
    return "urgent";
  }
  if (/безопасност|ппр|наряд-допуск|охрана труда|регламент/.test(lowerQuery)) {
    return "safety";
  }
  if (/лэп|опора|линия электропередач/.test(lowerQuery)) {
    return "lep";
  }
  if (/амс|вышка связи|мачта|башня|сотовая/.test(lowerQuery)) {
    return "ams";
  }
  if (/труб|дымов|дымоход/.test(lowerQuery)) {
    return "stack";
  }
  if (/один подрядчик|единый договор|под ключ|комплекс/.test(lowerQuery)) {
    return "single";
  }
  if (/огнезащит|огнестойкост|пожар|r\d+|rei/.test(lowerQuery)) {
    return "fireproof";
  }
  if (/антикорроз|акз|ржав|коррозия|покрас/.test(lowerQuery)) {
    return "anticorr";
  }

  const city = extractCityFromQuery(query);
  if (city) {
    return "geo";
  }

  return "default";
}

function resolveTemplate(template: string, variables: CopyVariables): string {
  let result = template;

  if (variables.service) {
    result = result.replace(/{service}/g, variables.service);
  }
  if (variables.objectType) {
    result = result.replace(/{objectType}/g, variables.objectType);
  }
  if (variables.city) {
    result = result.replace(/{city}/g, variables.city);
  }
  if (variables.region) {
    result = result.replace(/{region}/g, variables.region);
  }

  result = result.replace(/{service}/g, "промышленные работы");
  result = result.replace(/{objectType}/g, "объекта");
  result = result.replace(/{city}/g, "вашем городе");
  result = result.replace(/{region}/g, "вашем регионе");

  return result;
}

export function resolveCopy(variables: CopyVariables = {}): CopyResult {
  let intent: IntentType = variables.intent || "default";
  let city = variables.city;

  if (variables.query) {
    const detectedIntent = getIntentFromKeywords(variables.query);
    if (detectedIntent !== "default") {
      intent = detectedIntent;
    }
    const extractedCity = extractCityFromQuery(variables.query);
    if (extractedCity && !city) {
      city = extractedCity;
    }
  }

  const heroVariant = HERO_VARIANTS[intent] || HERO_VARIANTS.default;
  const serviceName = variables.service || SERVICE_NAMES.default;
  const serviceType: ServiceType = "default";

  const resolvedVariables: CopyVariables = {
    ...variables,
    city,
    service: serviceName,
  };

  const h1 = resolveTemplate(heroVariant.h1, resolvedVariables);
  const subhead = resolveTemplate(heroVariant.subhead, resolvedVariables);
  const offer = resolveTemplate(OFFERS[intent] || OFFERS.default, resolvedVariables);

  const title = `${serviceName} | MSPRO — промышленный альпинизм`;
  const description = `${serviceName}: высотные работы промальпинистами на ЛЭП, АМС, дымовых трубах. Лицензия МЧС, СРО. Контроль качества и исполнительная документация.`;

  const bullets = heroVariant.bullets.map(b => resolveTemplate(b, resolvedVariables));
  const ctaLabel = resolveTemplate(heroVariant.ctaLabel, resolvedVariables);
  const ctaMicrocopy = resolveTemplate(heroVariant.ctaMicrocopy, resolvedVariables);
  const ctaSecondaryLabel = resolveTemplate(heroVariant.ctaSecondaryLabel, resolvedVariables);
  const ctaSecondaryMicrocopy = resolveTemplate(heroVariant.ctaSecondaryMicrocopy, resolvedVariables);

  const faq = FAQ_BY_INTENT[intent] || FAQ_DEFAULT;
  const answerBlock = ANSWER_BLOCKS[serviceType] || ANSWER_BLOCKS.default;

  return {
    title,
    description,
    h1,
    subhead,
    offer,
    bullets,
    ctaLabel,
    ctaMicrocopy,
    ctaSecondaryLabel,
    ctaSecondaryMicrocopy,
    trustBlock: TRUST_BLOCKS.default,
    faq,
    answerBlock,
  };
}

export function getHeroVariant(intent: IntentType = "default"): HeroVariant {
  return HERO_VARIANTS[intent] || HERO_VARIANTS.default;
}

export {
  SERVICE_NAMES,
  H1_TEMPLATES,
  OFFERS,
  CTA_LABELS,
  CTA_LABELS_SECONDARY,
  CTA_MICROCOPY,
  CTA_MICROCOPY_SECONDARY,
  BULLETS_DEFAULT,
  BULLETS_BY_INTENT,
  TRUST_BLOCKS,
  FAQ_DEFAULT,
  FAQ_DEMOLITION,
  FAQ_BY_INTENT,
  ANSWER_BLOCKS,
  CITIES,
};
