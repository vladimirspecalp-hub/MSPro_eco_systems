export interface Region {
    name: string;
    value: number;
}

export interface Hazard {
    code: string;
    description: string;
    value: number;
    group: string;
}

export type TierId = "budget" | "standard" | "premium";

export interface CoatingTierDef {
    tierId: TierId;
    pricePerSqm: number | null; // null = pending, Board дозаполнит
    systemName: string | null;
    note?: string;
}

export interface ServiceType {
    id: string;
    label: string;
    requiresGeometry: boolean;
    baseRate: number;
    coatingTiers: CoatingTierDef[];
}

export type ChimneyMaterial = "metal" | "concrete" | "brick";
export const CHIMNEY_MATERIALS: Record<ChimneyMaterial, { label: string }> = {
    metal:    { label: "Металлическая" },
    concrete: { label: "Железобетонная" },
    brick:    { label: "Кирпичная" },
};

export type SurfacePrep = "hydro" | "sand" | "manual";
export const SURFACE_PREP_OPTIONS: Record<SurfacePrep, { label: string; description: string }> = {
    hydro:  { label: "Гидроструйная",          description: "АВД ≥500 бар" },
    sand:   { label: "Пескоструйная",           description: "Sa 2.5 (ISO 8501)" },
    manual: { label: "Ручной инструмент",       description: "St 3 (ISO 8501)" },
};

export type AnticorrosionType = "metalstructures" | "tanks" | "silos" | "transport" | "heritage" | "thinsheet";
export const ANTICORROSION_TYPES: Record<AnticorrosionType, { label: string }> = {
    metalstructures: { label: "Металлоконструкции" },
    tanks:           { label: "Резервуары" },
    silos:           { label: "Силосы" },
    transport:       { label: "Транспорт" },
    heritage:        { label: "Объект культурного наследия" },
    thinsheet:       { label: "Тонколистовой металл сложной формы" },
};

export type FireproofingStructureType = "metalstructures" | "ducts" | "cables" | "concrete" | "walls" | "wood";
export const FIREPROOFING_STRUCTURE_TYPES: Record<FireproofingStructureType, { label: string }> = {
    metalstructures: { label: "Металлоконструкции (балки, колонны, фермы)" },
    ducts:           { label: "Воздуховоды (вентиляция)" },
    cables:          { label: "Кабельные линии и проходки" },
    concrete:        { label: "Железобетонные перекрытия" },
    walls:           { label: "Стены (несущие конструкции)" },
    wood:            { label: "Деревянные конструкции" },
};

export const COATING_TIER_META: Record<TierId, { label: string; description: string }> = {
    budget:   { label: "Бюджет",   description: "Базовая защита" },
    standard: { label: "Стандарт", description: "Рекомендованный уровень" },
    premium:  { label: "Премиум",  description: "Максимальная защита" },
};

// ─── Подготовка поверхности (блок P0.2, данные из АльпПРАЙС 2026-04-28) ───

export interface SurfacePrepMaterial {
    id: string;
    label: string;
    pricePerSqm: number;
}

export interface SurfacePrepGradeCoef {
    id: string;
    label: string;
    coef: number;
}

export interface SurfacePrepWidthCoef {
    id: string;
    label: string;
    coef: number;
}

// Коэфы по ширине элементов (АльпПРАЙС: листы «Пескоструйная», «Очистка металла»)
export const ELEMENT_WIDTH_COEFS: SurfacePrepWidthCoef[] = [
    { id: "w50",  label: "до 50 мм",     coef: 2.00 },
    { id: "w80",  label: "50–80 мм",     coef: 1.70 },
    { id: "w120", label: "81–120 мм",    coef: 1.50 },
    { id: "w180", label: "121–180 мм",   coef: 1.30 },
    { id: "w250", label: "181–250 мм",   coef: 1.20 },
    { id: "w999", label: "более 250 мм", coef: 1.00 },
];

export interface SurfacePrepService {
    id: string;
    label: string;
    description: string;
    materials: SurfacePrepMaterial[];
    gradeCoefs?: SurfacePrepGradeCoef[];  // Sa (пескоструй) или St (механика)
    widthCoefs?: SurfacePrepWidthCoef[];  // ширина элементов конструкции
}

export const SURFACE_PREP_SERVICES: SurfacePrepService[] = [
    {
        id: "sandblast",
        label: "Пескоструйная очистка",
        description: "Абразивно-струйная, Sa 1–3 (ISO 8501). Оборудование заказчика.",
        materials: [
            { id: "metal",    label: "Металл",  pricePerSqm: 410 },
            { id: "concrete", label: "Бетон",   pricePerSqm: 430 },
            { id: "brick",    label: "Кирпич",  pricePerSqm: 380 },
        ],
        gradeCoefs: [
            { id: "sweep", label: "Свипинг (Sa<1)", coef: 0.70 },
            { id: "sa1",   label: "Sa 1.0",          coef: 1.00 },
            { id: "sa2",   label: "Sa 2.0",          coef: 1.23 },
            { id: "sa25",  label: "Sa 2.5",          coef: 1.56 },
            { id: "sa3",   label: "Sa 3.0",          coef: 2.33 },
        ],
        widthCoefs: ELEMENT_WIDTH_COEFS,
    },
    {
        id: "mechanical",
        label: "Механическая очистка металла",
        description: "От ржавчины и старой краски (УШМ, щётка, шабер, кислота). St 2–3 (ISO 8501).",
        materials: [
            { id: "wire_brush",  label: "Проволочная щётка",                  pricePerSqm: 230 },
            { id: "grinder",     label: "УШМ (болгарка)",                      pricePerSqm: 250 },
            { id: "scraper",     label: "Шабер (труднодоступные места)",       pricePerSqm: 580 },
            { id: "matte",       label: "Матирование (наждачная бумага)",      pricePerSqm: 140 },
            { id: "acid",        label: "Кислотная промывка",                  pricePerSqm: 480 },
            { id: "chem_paste",  label: "Химсмывка (специальная паста)",       pricePerSqm: 620 },
        ],
        gradeCoefs: [
            { id: "st2", label: "St 2 (тщательная)",      coef: 1.0 },
            { id: "st3", label: "St 3 (очень тщательная)", coef: 1.3 },
        ],
        widthCoefs: ELEMENT_WIDTH_COEFS,
    },
    {
        id: "hydroblast",
        label: "Гидроструйная очистка (АВД)",
        description: "Высокое давление ≥500 бар. Без абразива. Металл, бетон, фасады.",
        materials: [
            { id: "metal",   label: "Металлоконструкции", pricePerSqm: 175 },
        ],
        widthCoefs: ELEMENT_WIDTH_COEFS,
    },
    {
        id: "facade_cleaning",
        label: "Очистка фасадов",
        description: "От высолов, копоти, потёков, биопоражений.",
        materials: [
            { id: "efflorescence", label: "Высолы",                      pricePerSqm: 660 },
            { id: "mortar",        label: "Раствор / цементное молочко", pricePerSqm: 900 },
            { id: "soot",          label: "Копоть и гарь",               pricePerSqm: 1050 },
            { id: "paint_drips",   label: "Потёки наливных полов",       pricePerSqm: 840 },
            { id: "sealant_drips", label: "Потёки акрилового герметика", pricePerSqm: 1150 },
        ],
    },
    {
        id: "dedusting",
        label: "Обеспыливание (клининг)",
        description: "Очистка поверхностей перед окраской.",
        materials: [
            { id: "air_blow", label: "Воздушным потоком (компрессор)", pricePerSqm: 79 },
            { id: "vacuum",   label: "Пылесосом",                      pricePerSqm: 130 },
            { id: "wet_mop",  label: "Влажный способ (швабра)",        pricePerSqm: 150 },
            { id: "hydro",    label: "Гидроструйная (пол/поверхность)", pricePerSqm: 73 },
        ],
    },
    {
        id: "grinding",
        label: "Шлифование поверхности",
        description: "Механическое шлифование (УШМ, лента, диск). Расценки уточняются у инженера.",
        materials: [
            // Лист «Шлифование поверхности» в АльпПРАЙС не заполнен (по состоянию 01.04.2026)
            // Расценки ожидают заполнения от Board. Отображается как «уточняется».
            { id: "grinder_disc", label: "УШМ / шлифовальный диск", pricePerSqm: 0 },
        ],
    },
];

export const CALCULATOR_DATA = {
    regions: [
        // ЦЕНТРАЛЬНЫЙ ФО
        { name: "Москва", value: 1.0 },
        { name: "Московская область", value: 1.0 },
        { name: "Белгород", value: 0.9 },
        { name: "Брянск", value: 0.9 },
        { name: "Владимир", value: 1.0 },
        { name: "Воронеж", value: 0.85 },
        { name: "Иваново", value: 0.9 },
        { name: "Калуга", value: 1.0 },
        { name: "Кострома", value: 0.9 },
        { name: "Курск", value: 0.9 },
        { name: "Липецк", value: 0.85 },
        { name: "Орёл", value: 0.9 },
        { name: "Рязань", value: 0.9 },
        { name: "Смоленск", value: 0.9 },
        { name: "Тамбов", value: 0.85 },
        { name: "Тверь", value: 1.0 },
        { name: "Тула", value: 0.9 },
        { name: "Ярославль", value: 0.9 },

        // СЕВЕРО-ЗАПАДНЫЙ ФО
        { name: "Санкт-Петербург", value: 1.0 },
        { name: "Ленинградская область", value: 1.0 },
        { name: "Архангельск", value: 1.2 },
        { name: "Северодвинск", value: 1.4 },
        { name: "Великий Новгород", value: 1.0 },
        { name: "Вологда", value: 1.0 },
        { name: "Череповец", value: 1.0 },
        { name: "Калининград", value: 1.15 },
        { name: "Мурманск", value: 1.4 },
        { name: "Петрозаводск (Карелия)", value: 1.15 },
        { name: "Псков", value: 1.0 },
        { name: "Сыктывкар (Коми)", value: 1.2 },
        { name: "Воркута", value: 1.6 },
        { name: "Нарьян-Мар", value: 1.5 },

        // ЮЖНЫЙ И СЕВЕРО-КАВКАЗСКИЙ ФО
        { name: "Ростов-на-Дону", value: 0.9 },
        { name: "Краснодар", value: 1.0 },
        { name: "Сочи", value: 1.2 },
        { name: "Новороссийск", value: 1.0 },
        { name: "Астрахань", value: 1.1 },
        { name: "Волгоград", value: 0.85 },
        { name: "Майкоп (Адыгея)", value: 0.9 },
        { name: "Элиста (Калмыкия)", value: 1.1 },
        { name: "Симферополь (Крым)", value: 1.0 },
        { name: "Севастополь", value: 1.0 },
        { name: "Ялта", value: 1.1 },
        { name: "Ставрополь", value: 0.9 },
        { name: "Пятигорск", value: 0.9 },
        { name: "Владикавказ", value: 0.9 },
        { name: "Грозный", value: 0.9 },
        { name: "Махачкала", value: 0.8 },
        { name: "Нальчик", value: 0.85 },

        // ПРИВОЛЖСКИЙ ФО
        { name: "Самара", value: 0.9 },
        { name: "Тольятти", value: 0.9 },
        { name: "Сызрань", value: 0.9 },
        { name: "Нижний Новгород", value: 0.9 },
        { name: "Казань (Татарстан)", value: 0.9 },
        { name: "Набережные Челны", value: 0.9 },
        { name: "Уфа (Башкортостан)", value: 0.9 },
        { name: "Стерлитамак", value: 0.9 },
        { name: "Пермь", value: 0.95 },
        { name: "Киров", value: 1.0 },
        { name: "Йошкар-Ола", value: 0.9 },
        { name: "Оренбург", value: 1.15 },
        { name: "Пенза", value: 0.9 },
        { name: "Саратов", value: 0.85 },
        { name: "Ижевск (Удмуртия)", value: 0.9 },
        { name: "Ульяновск", value: 0.9 },
        { name: "Чебоксары", value: 0.9 },

        // УРАЛЬСКИЙ ФО
        { name: "Екатеринбург", value: 0.95 },
        { name: "Нижний Тагил", value: 0.95 },
        { name: "Курган", value: 1.15 },
        { name: "Тюмень", value: 1.15 },
        { name: "Тобольск", value: 1.15 },
        { name: "Челябинск", value: 0.95 },
        { name: "Магнитогорск", value: 0.95 },
        { name: "Ханты-Мансийск (ХМАО)", value: 1.5 },
        { name: "Сургут", value: 1.5 },
        { name: "Нижневартовск", value: 1.5 },
        { name: "Салехард (ЯНАО)", value: 1.7 },
        { name: "Новый Уренгой", value: 1.7 },

        // СИБИРСКИЙ ФО
        { name: "Новосибирск", value: 1.1 },
        { name: "Омск", value: 1.0 },
        { name: "Томск", value: 1.15 },
        { name: "Кемерово (Кузбасс)", value: 1.1 },
        { name: "Новокузнецк", value: 1.1 },
        { name: "Барнаул (Алтай)", value: 1.0 },
        { name: "Горно-Алтайск", value: 1.2 },
        { name: "Красноярск", value: 1.15 },
        { name: "Норильск", value: 1.8 },
        { name: "Иркутск", value: 1.2 },
        { name: "Братск", value: 1.3 },
        { name: "Улан-Удэ (Бурятия)", value: 1.1 },
        { name: "Чита (Забайкалье)", value: 1.2 },
        { name: "Абакан (Хакасия)", value: 1.1 },
        { name: "Кызыл (Тыва)", value: 1.2 },

        // ДАЛЬНЕВОСТОЧНЫЙ ФО
        { name: "Владивосток", value: 1.3 },
        { name: "Находка", value: 1.3 },
        { name: "Уссурийск", value: 1.2 },
        { name: "Хабаровск", value: 1.3 },
        { name: "Комсомольск-на-Амуре", value: 1.3 },
        { name: "Благовещенск (Амурская обл.)", value: 1.2 },
        { name: "Биробиджан", value: 1.2 },
        { name: "Петропавловск-Камчатский", value: 1.8 },
        { name: "Магадан", value: 2.0 },
        { name: "Южно-Сахалинск", value: 1.6 },
        { name: "Якутск (Саха)", value: 1.7 },
        { name: "Мирный", value: 2.0 },
        { name: "Нерюнгри", value: 1.7 },
        { name: "Анадырь (Чукотка)", value: 2.0 },

        // СТРАНЫ СНГ
        { name: "Минск (Беларусь)", value: 0.9 },
        { name: "Астана (Казахстан)", value: 0.95 },
        { name: "Алматы (Казахстан)", value: 0.95 },
        { name: "Ташкент (Узбекистан)", value: 0.8 },
        { name: "Ереван (Армения)", value: 0.85 },
        { name: "Бишкек (Киргизия)", value: 0.8 },

        // Fallback
        { name: "Другие регионы", value: 1.0 }
    ] as Region[],

    hazards: [
        // Автономность
        { code: "A1", description: "Генератор / водоснабжение", value: 2.00, group: "Автономность" },

        // Естественные
        { code: "E1", description: "Жара +40…+50°C", value: 1.25, group: "Естественные" },
        { code: "E2", description: "Жара выше +50°C (спецкостюм)", value: 1.45, group: "Естественные" },
        { code: "E3", description: "Холод −10…−19°C", value: 1.18, group: "Естественные" },
        { code: "E4", description: "Холод −20…−29°C", value: 1.36, group: "Естественные" },
        { code: "E5", description: "Холод −30…−39°C", value: 1.54, group: "Естественные" },
        { code: "E6", description: "Холод ≤ −40°C", value: 1.72, group: "Естественные" },
        { code: "E7", description: "Влажность >90%", value: 1.20, group: "Естественные" },
        { code: "E8", description: "Биологическая опасность", value: 1.40, group: "Естественные" },

        // Опасная среда
        { code: "O1", description: "Высокое напряжение (ЭМ-поле)", value: 1.30, group: "Опасная среда" },
        { code: "O2", description: "Хим. вещества в воздухе", value: 1.80, group: "Опасная среда" },
        { code: "O3", description: "Пыль", value: 1.20, group: "Опасная среда" },
        { code: "O4", description: "Шум", value: 1.20, group: "Опасная среда" },

        // Режим времени
        { code: "T1", description: "Ночной график", value: 1.80, group: "Режим времени" },
        { code: "T2", description: "Новогодние праздники (день)", value: 2.00, group: "Режим времени" },
        { code: "T3", description: "Новогодние праздники (ночь)", value: 3.60, group: "Режим времени" },

        // Режимный объект
        { code: "R1", description: "Работа по графику объекта", value: 1.35, group: "Режимный объект" },

        // Сложные условия
        { code: "S1", description: "Работа с вертолётом", value: 1.45, group: "Сложные условия" },
        { code: "S2", description: "Движущиеся механизмы", value: 1.20, group: "Сложные условия" },
        { code: "S3", description: "Замкнутые пространства", value: 1.20, group: "Сложные условия" },
        { code: "S4", description: "Отрицательный уклон 3°–5°", value: 1.20, group: "Сложные условия" },
        { code: "S5", description: "Отрицательный уклон 6°–10°", value: 1.30, group: "Сложные условия" },
        { code: "S6", description: "Отрицательный уклон 11°–15°", value: 1.50, group: "Сложные условия" },
        { code: "S7", description: "Подземные сооружения", value: 1.68, group: "Сложные условия" },
        { code: "S8", description: "Работа над водой", value: 1.35, group: "Сложные условия" },
        { code: "S9", description: "Работа под потолком", value: 1.20, group: "Сложные условия" },

        // БПЛА
        { code: "B1", description: "Вероятность атаки БПЛА (НПЗ, военные объекты)", value: 1.73, group: "БПЛА" },
        { code: "B2", description: "По объекту уже была атака БПЛА", value: 2.26, group: "БПЛА" },
    ] as Hazard[]
};

export const SERVICE_TYPES: ServiceType[] = [
    {
        id: "chimney_painting",
        label: "Покраска дымовых труб",
        requiresGeometry: true,
        baseRate: 500,
        coatingTiers: [
            { tierId: "budget",   pricePerSqm: 250, systemName: "Эмаль (ГФ/ПФ)" },
            { tierId: "standard", pricePerSqm: 450, systemName: "Кремнийорганика (КО-8101)" },
            { tierId: "premium",  pricePerSqm: 900, systemName: "Импортное покрытие" },
        ],
    },
    {
        id: "anticorrosion",
        label: "Антикоррозионная защита",
        requiresGeometry: false,
        baseRate: 700,
        coatingTiers: [
            { tierId: "budget",   pricePerSqm: null, systemName: null },
            { tierId: "standard", pricePerSqm: 292,  systemName: "ECOMAST E280+E280+PU74", note: "сертификат ЦНИИС, 25+ лет" },
            { tierId: "premium",  pricePerSqm: null, systemName: null },
        ],
    },
    {
        id: "mspro_quad",
        label: "MSPRO Quad покрытие",
        requiresGeometry: false,
        baseRate: 1200,
        coatingTiers: [
            { tierId: "budget",   pricePerSqm: null, systemName: null },
            { tierId: "standard", pricePerSqm: 0,    systemName: "MSPRO Quad" },
            { tierId: "premium",  pricePerSqm: null, systemName: null },
        ],
    },
    {
        id: "fireproofing",
        label: "Огнезащита",
        requiresGeometry: false,
        baseRate: 900,
        coatingTiers: [
            { tierId: "budget",   pricePerSqm: 600,  systemName: "R45 (45 мин.)" },
            { tierId: "standard", pricePerSqm: 900,  systemName: "R60 (60 мин.)" },
            { tierId: "premium",  pricePerSqm: 1500, systemName: "R90 (90 мин.)" },
        ],
    },
    {
        id: "rope_access",
        label: "Промышленный альпинизм",
        requiresGeometry: false,
        baseRate: 2000,
        coatingTiers: [],
    },
    {
        id: "ceiling_sanation",
        label: "Санация/обеспыливание потолков",
        requiresGeometry: false,
        baseRate: 1500,
        coatingTiers: [
            { tierId: "budget",   pricePerSqm: 0,   systemName: "Сухое обеспыливание" },
            { tierId: "standard", pricePerSqm: 300, systemName: "Влажная химчистка (АВД)" },
            { tierId: "premium",  pricePerSqm: 500, systemName: "Покраска (органосиликатная)" },
        ],
    },
];
