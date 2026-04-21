import React, { useState } from 'react';
import { drawPath } from './RussiaPaths';

const DISTRICTS_MAP: Record<string, string[]> = {
    "Центральный ФО": ["Belgorod", "Bryansk", "Vladimir", "Voronezh", "Ivanovo", "Kaluga", "Kostroma", "Kursk", "Lipetsk", "Moscow City", "Moskva", "Orel", "Ryazan'", "Smolensk", "Tambov", "Tver'", "Tula", "Yaroslavl'"],
    "Северо-Западный ФО": ["Karelia", "Komi", "Arkhangel'sk", "Vologda", "Kaliningrad", "Leningrad", "Murmansk", "Novgorod", "Pskov", "Saint Petersburg City", "Nenets"],
    "Приволжский ФО": ["Bashkortostan", "Mariy-El", "Mordovia", "Tatarstan", "Udmurt", "Chuvash", "Perm'", "Kirov", "Nizhegorod", "Orenburg", "Penza", "Samara", "Saratov", "Ul'yanovsk"],
    "Уральский ФО": ["Kurgan", "Sverdlovsk", "Tyumen'", "Chelyabinsk", "Khanty-Mansiy", "Yamal-Nenets"],
    "Сибирский ФО": ["Altay", "Gorno-Altay", "Buryat", "Tuva", "Khakass", "Zabaykal'ye", "Krasnoyarsk", "Irkutsk", "Kemerovo", "Novosibirsk", "Omsk", "Tomsk"],
    "Южный ФО": ["Adygey", "Kalmyk", "Krasnodar", "Astrakhan'", "Volgograd", "Rostov", "Crimea", "Sevastopol'", "Lugansk", "Donetsk", "Zaporozhye", "Kherson"],
    "Северо-Кавказский ФО": ["Dagestan", "Ingush", "Kabardin-Balkar", "Karachay-Cherkess", "North Ossetia", "Chechnya", "Stavropol'"],
    "Дальневосточный ФО": ["Sakha", "Kamchatka", "Primor'ye", "Khabarovsk", "Amur", "Magadan", "Sakhalin", "Yevrey", "Chukot"],
};

// Inverse map for fast lookup
const stateToDistrict: Record<string, string> = {};
Object.entries(DISTRICTS_MAP).forEach(([district, states]) => {
    states.forEach(state => {
        stateToDistrict[state] = district;
    });
});

interface CityMarker {
    name: string;
    x: number;
    y: number;
    icons: string[];
    description: string;
}

const MARKERS: CityMarker[] = [
    { name: "Москва", x: 153, y: 615, icons: ["/icons/icon_smokestack_red.png"], description: "Дымовые трубы" },
    { name: "Санкт-Петербург", x: 95, y: 490, icons: ["/icons/icon_pylon_red.png", "/icons/icon_smokestack_red.png"], description: "ЛЭП, Дымовые трубы" },
    { name: "Орёл", x: 145, y: 635, icons: ["/icons/icon_hangar_red.png"], description: "Металлоконструкции" },
    { name: "Краснодар", x: 147, y: 765, icons: ["/icons/icon_amc_red.png"], description: "АМС / Вышки" },
    { name: "Новороссийск", x: 135, y: 780, icons: ["/icons/icon_amc_red.png"], description: "АМС / Вышки" },
    { name: "Туапсе", x: 155, y: 785, icons: ["/icons/icon_hangar_red.png"], description: "Металлоконструкции" },
    { name: "Симферополь", x: 105, y: 800, icons: ["/icons/icon_smokestack_red.png"], description: "Южный филиал" },
    { name: "Севастополь", x: 92, y: 815, icons: ["/icons/icon_hangar_red.png"], description: "Восстановление" },
    { name: "Мариуполь", x: 115, y: 745, icons: ["/icons/icon_pylon_red.png"], description: "Новые территории" },
    { name: "Мурманск", x: 215, y: 390, icons: ["/icons/icon_pylon_red.png"], description: "ЛЭП" },
    { name: "Ухта", x: 275, y: 460, icons: ["/icons/icon_smokestack_red.png"], description: "Дымовые трубы" },
    { name: "Норильск", x: 530, y: 310, icons: ["/icons/icon_smokestack_red.png"], description: "Трубы" },
    { name: "Новосибирск", x: 460, y: 690, icons: ["/icons/icon_pylon_red.png"], description: "ЛЭП" },
    { name: "Нижний Новгород", x: 195, y: 595, icons: ["/icons/icon_hangar_red.png"], description: "Ангары" },
    { name: "Казань", x: 235, y: 605, icons: ["/icons/icon_hangar_red.png"], description: "Металлоконструкции" },
    { name: "Тольятти", x: 245, y: 625, icons: ["/icons/icon_smokestack_red.png"], description: "Дымовые трубы" },
    { name: "Балаково", x: 220, y: 645, icons: ["/icons/icon_pylon_red.png"], description: "ЛЭП" },
    { name: "Челябинск", x: 290, y: 635, icons: ["/icons/icon_hangar_red.png"], description: "Металлоконструкции" },
];

interface RussiaMapProps {
    activeDistrict: string | null;
    onDistrictHover: (district: string | null) => void;
}

export function RussiaMap({ activeDistrict, onDistrictHover }: RussiaMapProps) {
    // viewBox boundaries roughly derived from paths
    const viewBox = "0 300 1250 550";
    const [hoveredMarker, setHoveredMarker] = useState<CityMarker | null>(null);

    return (
        <div className="relative w-full overflow-visible">
            <svg
                viewBox={viewBox}
                className="w-full h-auto drop-shadow-2xl relative z-0 md:scale-[1.03] transition-transform duration-500"
                preserveAspectRatio="xMidYMid meet"
                onMouseLeave={() => setHoveredMarker(null)}
            >
                <g stroke="#ffffff" strokeWidth="1" strokeLinejoin="round">
                    {Object.entries(drawPath).map(([stateName, pathData]) => {
                        const district = stateToDistrict[stateName] || "Дальневосточный ФО";
                        const isActive = activeDistrict === district;

                        return (
                            <path
                                key={stateName}
                                d={pathData as string}
                                className={"transition-all duration-500 cursor-pointer outline-none"}
                                fill={isActive ? "rgba(239, 68, 68, 0.4)" : "rgba(30, 41, 59, 0.6)"}
                                stroke={isActive ? "rgba(248, 113, 113, 0.8)" : "rgba(51, 65, 85, 0.8)"}
                                strokeWidth={isActive ? 1.5 : 0.5}
                                onMouseEnter={() => onDistrictHover(district)}
                                onMouseLeave={() => onDistrictHover(null)}
                            />
                        );
                    })}
                </g>

                {MARKERS.map((marker, idx) => {
                    const isHovered = hoveredMarker?.name === marker.name;
                    return (
                        <g key={idx}>
                            {/* Dedicated invisible hitbox for stable hover events */}
                            <circle
                                cx={marker.x}
                                cy={marker.y}
                                r="28"
                                fill="transparent"
                                className="cursor-pointer peer"
                                style={{ pointerEvents: 'all' }}
                                onMouseEnter={() => setHoveredMarker(marker)}
                            />
                            {/* Wrapper for the interactive elements */}
                            <g className="pointer-events-none">
                                {/* Pulsing glow ring */}
                                <circle
                                    cx={marker.x}
                                    cy={marker.y}
                                    r="20"
                                    fill="rgba(239, 68, 68, 0.2)"
                                    className={`animate-ping transition-all duration-300 ${isHovered ? 'opacity-100 fill-red-500/40' : 'opacity-70'}`}
                                />

                                {/* The icons */}
                                {marker.icons.map((icon, i) => {
                                    const offset = marker.icons.length > 1 ? (i === 0 ? -12 : 12) : 0;
                                    return (
                                        <image
                                            key={i}
                                            href={icon}
                                            x={marker.x - 15 + offset}
                                            y={marker.y - 15}
                                            width="30"
                                            height="30"
                                            className={`transition-transform duration-300 origin-center drop-shadow-md ${isHovered ? 'scale-[1.35]' : 'scale-100'}`}
                                            style={{ transformOrigin: `${marker.x + offset}px ${marker.y}px` }}
                                        />
                                    );
                                })}
                            </g>
                        </g>
                    );
                })}
            </svg>

            {/* Premium Glassmorphism Tooltip - rendered OUTSIDE SVG for 100% browser compatibility */}
            <div
                className={`absolute pointer-events-none transition-all duration-300 ease-out z-50 flex flex-col items-center justify-end ${hoveredMarker ? 'opacity-100 scale-100 -translate-y-4' : 'opacity-0 scale-95 translate-y-0'
                    }`}
                style={{
                    // Convert SVG viewBox coordinates to percentages for absolute CSS positioning
                    left: hoveredMarker ? `${(hoveredMarker.x / 1250) * 100}%` : '50%',
                    top: hoveredMarker ? `${((hoveredMarker.y - 300) / 550) * 100}%` : '50%',
                    transform: 'translate(-50%, -100%) mt-[-20px]',
                    width: '250px',
                    /** Use marginTop to lift it precisely above the icon */
                    marginTop: '-25px'
                }}
            >
                <div className="bg-slate-900/85 backdrop-blur-xl border border-red-500/30 shadow-[0_8px_32px_rgba(239,68,68,0.25)] rounded-xl py-2 px-4 flex flex-col items-center min-w-[140px] max-w-full">
                    <span className="text-white font-bold text-sm sm:text-base tracking-wide whitespace-nowrap">
                        {hoveredMarker?.name}
                    </span>
                    <span className="text-red-400/90 text-[10px] sm:text-xs uppercase font-bold mt-0.5 tracking-wider whitespace-nowrap text-center">
                        {hoveredMarker?.description}
                    </span>
                </div>
                {/* Arrow pointing down */}
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-slate-900/85 -mt-[1px] filter drop-shadow-[0_2px_4px_rgba(239,68,68,0.2)]"></div>
            </div>
        </div>
    );
}
