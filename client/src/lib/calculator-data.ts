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
