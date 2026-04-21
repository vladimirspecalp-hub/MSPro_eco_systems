export interface Region {
    name: string;
    value: number;
}

export interface Hazard {
    code: string;
    description: string;
    value: number;
}

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
        { code: "H1", description: "Работа на высоте > 5м", value: 1.2 },
        { code: "H2", description: "Опасный производственный объект (ОПО)", value: 1.3 },
        { code: "H3", description: "Работа в замкнутом пространстве", value: 1.5 },
        { code: "H4", description: "Наличие вредных газов/паров", value: 1.4 },
        { code: "H5", description: "Взрывопожароопасная зона", value: 1.35 },
        { code: "H6", description: "Экстремальные температуры", value: 1.25 },
        { code: "H7", description: "Работа над водой", value: 1.3 },
        { code: "H8", description: "Срочность (ночная смена)", value: 1.5 }
    ] as Hazard[]
};

export const SERVICE_TYPES = [
    {
        id: "chimney_painting",
        label: "Покраска дымовых труб",
        requiresGeometry: true,
        baseRate: 500,
        coatingOptions: [
            { id: "enamel", label: "Эмаль (ГФ/ПФ)", price: 250 },
            { id: "ko_enamel", label: "Кремнийорганика (КО-8101)", price: 450 },
            { id: "premium_import", label: "Импортное покрытие", price: 900 }
        ]
    },
    {
        id: "anticorrosion",
        label: "Антикоррозионная защита",
        requiresGeometry: false,
        baseRate: 700,
        coatingOptions: [
            { id: "primer_enamel", label: "Грунт-эмаль 3в1", price: 300 },
            { id: "epoxy", label: "Эпоксидная система", price: 850 },
            { id: "polyurethane", label: "Полиуретановая система", price: 1100 },
            { id: "zinc_rich", label: "Цинконаполненный состав", price: 1200 }
        ]
    },
    {
        id: "mspro_quad",
        label: "MSPRO Quad покрытие",
        requiresGeometry: false,
        baseRate: 1200,
        coatingOptions: [
            { id: "quad_standard", label: "MSPRO Quad (Стандарт)", price: 0 } // Included in base? Or add explicit material cost.
        ]
    },
    {
        id: "fireproofing",
        label: "Огнезащита",
        requiresGeometry: false,
        baseRate: 900,
        coatingOptions: [
            { id: "r45", label: "R45 (45 минут)", price: 600 },
            { id: "r60", label: "R60 (60 минут)", price: 900 },
            { id: "r90", label: "R90 (90 минут)", price: 1500 },
            { id: "r120", label: "R120 (120 минут)", price: 2200 }
        ]
    },
    {
        id: "rope_access",
        label: "Промышленный альпинизм",
        requiresGeometry: false,
        baseRate: 2000,
        coatingOptions: []
    },
    {
        id: "ceiling_sanation",
        label: "Санация/обеспыливание потолков",
        requiresGeometry: false,
        baseRate: 1500,
        coatingOptions: [
            { id: "dry_vacuum", label: "Сухое обеспыливание (пылесосы)", price: 0 },
            { id: "compressed_air", label: "Обдув сжатым воздухом", price: -200 },
            { id: "wet_cleaning", label: "Влажная химчистка (АВД)", price: 300 },
            { id: "organosilicate", label: "Покраска (органосиликатная краска)", price: 500 }
        ]
    }
];
