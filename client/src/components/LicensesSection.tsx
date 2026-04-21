import React from "react";
import { motion } from "framer-motion";
// ═══════════════════════════════════════════════════════════
// 🔥 SHIELD FLAME — Большой щит с горящим пламенем внутри
// ═══════════════════════════════════════════════════════════
const ShieldFlameIcon = () => (
    <div className="relative group perspective-1000">
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-red-600/50 via-orange-500/20 to-transparent blur-[28px] license-fire-glow transition-all duration-700 group-hover:scale-125 group-hover:from-red-600/70" />

        <svg viewBox="0 0 140 140" fill="none" className="w-[140px] h-[140px] relative z-10 transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-2 drop-shadow-2xl">
            <defs>
                {/* --- METALLIC BASE GRADIENTS --- */}
                {/* Main heavy armor plate */}
                <linearGradient id="armor-base" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="50%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                {/* Bright bevel highlight for top-left edge */}
                <linearGradient id="armor-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="30%" stopColor="#475569" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                </linearGradient>
                {/* Deep bevel shadow for bottom-right edge */}
                <linearGradient id="armor-shadow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#000000" stopOpacity="0" />
                    <stop offset="70%" stopColor="#000000" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
                </linearGradient>

                {/* --- INNER REACTOR/SHIELD CORE --- */}
                {/* Dark inner cavity */}
                <linearGradient id="cavity" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#000000" />
                    <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                {/* Ruby Red Energy Shield */}
                <linearGradient id="ruby-shield" x1="50" y1="20" x2="50" y2="120" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ef4444" stopOpacity="0.15" />
                    <stop offset="1" stopColor="#991b1b" stopOpacity="0.6" />
                </linearGradient>
                {/* Shield Glowing Edge */}
                <linearGradient id="ruby-edge" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop stopColor="#fca5a5" />
                    <stop offset="0.3" stopColor="#dc2626" />
                    <stop offset="1" stopColor="#450a0a" />
                </linearGradient>

                {/* --- FIRE GRADIENTS --- */}
                <linearGradient id="flame-outer" x1="70" y1="95" x2="70" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7f1d1d" />
                    <stop offset="0.3" stopColor="#dc2626" />
                    <stop offset="0.7" stopColor="#ea580c" />
                    <stop offset="1" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="flame-mid" x1="70" y1="90" x2="70" y2="50" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#dc2626" />
                    <stop offset="0.4" stopColor="#f97316" />
                    <stop offset="1" stopColor="#fbbf24" />
                </linearGradient>
                <linearGradient id="flame-core" x1="70" y1="85" x2="70" y2="60" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fb923c" />
                    <stop offset="0.5" stopColor="#fbbf24" />
                    <stop offset="1" stopColor="#fef9c3" />
                </linearGradient>

                {/* --- FILTERS --- */}
                <filter id="forge-drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.8" />
                    <feDropShadow dx="0" dy="24" stdDeviation="16" floodColor="#000000" floodOpacity="0.5" />
                </filter>
                <filter id="fire-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                    <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 0.3 0 0 0  0 0 0.1 0 0  0 0 0 0.8 0" result="warm" />
                    <feMerge>
                        <feMergeNode in="warm" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="glass-shine">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* ========================================= */}
            {/* 1. THE ARMOR BASE (Heavy Metal Shield)    */}
            {/* ========================================= */}
            <g filter="url(#forge-drop-shadow)">
                {/* Main heavy block */}
                <path
                    d="M70 12 L18 34v40c0 30 22 50 52 62 30-12 52-32 52-62V34L70 12z"
                    fill="url(#armor-base)"
                />
                {/* Highlight edge (top-left) */}
                <path
                    d="M70 12 L18 34v40c0 30 22 50 52 62 30-12 52-32 52-62V34L70 12z"
                    fill="none" stroke="url(#armor-highlight)" strokeWidth="3"
                />
                {/* Shadow edge (bottom-right) */}
                <path
                    d="M70 12 L18 34v40c0 30 22 50 52 62 30-12 52-32 52-62V34L70 12z"
                    fill="none" stroke="url(#armor-shadow)" strokeWidth="4"
                    className="translate-x-[1px] translate-y-[1px]"
                />

                {/* Diagonal hazard/enforcement grooves in the metal */}
                <path d="M 28 45 L 45 28 M 28 65 L 65 28 M 28 85 L 85 28 M 38 100 L 100 38 M 55 108 L 112 51 M 80 110 L 112 78 M 105 105 L 112 98"
                      stroke="#020617" strokeWidth="4" opacity="0.4" strokeLinecap="round" />
                <path d="M 28 45 L 45 28 M 28 65 L 65 28 M 28 85 L 85 28 M 38 100 L 100 38 M 55 108 L 112 51 M 80 110 L 112 78 M 105 105 L 112 98"
                      stroke="#475569" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" className="-translate-x-[1px] -translate-y-[1px]" />
            </g>

            {/* ========================================= */}
            {/* 2. THE INNER REACTOR (Cavity & Shield)    */}
            {/* ========================================= */}
            {/* Dark deep cavity */}
            <path
                d="M70 24 L30 42v32c0 24 16 38 40 48 24-10 40-24 40-48V42L70 24z"
                fill="url(#cavity)"
                stroke="#000" strokeWidth="4"
            />
            {/* Inner rim reflection from fire */}
            <path
                d="M70 24 L30 42v32c0 24 16 38 40 48 24-10 40-24 40-48V42L70 24z"
                fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.3"
                filter="url(#glass-shine)"
            />

            {/* Glowing Ruby Energy Shield Plate */}
            <path
                d="M70 28 L35 44v28c0 20 13 32 35 40 22-8 35-20 35-40V44L70 28z"
                fill="url(#ruby-shield)"
                stroke="url(#ruby-edge)" strokeWidth="2"
                filter="url(#glass-shine)"
            />

            {/* ========================================= */}
            {/* 3. THE FIRE (Protected inside)            */}
            {/* ========================================= */}
            <g filter="url(#fire-glow)">
                <path d="M70 48 C66 52 53 62 53 80 C53 88 61 96 70 96 C79 96 87 88 87 80 C87 74 85 68 81 63 C80 70 76 75 73 76 C70 77 66 74 65 70 C64 66 65 61 66 58 C68 54 70 51 70 48z" fill="url(#flame-outer)" opacity="0.85" className="lf-outer" />
                <path d="M63 56 C60 60 55 68 56 78 C57 82 59 84 62 85 C58 80 57 73 61 65 C62 61 63 59 63 56z" fill="url(#flame-outer)" opacity="0.6" className="lf-tongue-l" />
                <path d="M77 56 C80 60 85 68 84 78 C83 82 81 84 78 85 C82 80 83 73 79 65 C78 61 77 59 77 56z" fill="url(#flame-outer)" opacity="0.6" className="lf-tongue-r" />
                <path d="M70 56 C67 60 59 68 59 80 C59 86 64 91 70 91 C76 91 81 86 81 80 C81 74 79 70 76 66 C75 71 72 75 70 75 C68 75 66 73 65 71 C64 68 66 64 68 60 C69 58 70 57 70 56z" fill="url(#flame-mid)" opacity="0.95" className="lf-mid" />
                <path d="M70 66 C68 69 64 74 64 81 C64 85 67 87 70 87 C73 87 76 85 76 81 C76 76 74 73 72 70 C71 73 71 75 70 76 C69 76 68 75 67 73 C67 71 69 68 70 66z" fill="url(#flame-core)" opacity="1" className="lf-core" />
                <ellipse cx="70" cy="82" rx="3.5" ry="6" fill="#fef3c7" opacity="0.9" className="lf-hot" />
            </g>

            {/* Sparks */}
            <circle cx="62" cy="52" r="1.5" fill="#fbbf24" opacity="0.8" className="lf-spark-1" />
            <circle cx="78" cy="55" r="1.2" fill="#fde68a" opacity="0.6" className="lf-spark-2" />
            <circle cx="66" cy="48" r="1.2" fill="#fb923c" opacity="0.7" className="lf-spark-3" />
            <circle cx="74" cy="50" r="1" fill="#fef3c7" opacity="0.5" className="lf-spark-4" />

            {/* ========================================= */}
            {/* 4. DETAILS (Industrial Rivets)            */}
            {/* ========================================= */}
            <g fill="#1e293b" stroke="#020617" strokeWidth="1.5">
                <circle cx="70" cy="20" r="2.5" />
                <circle cx="27" cy="41" r="2.5" />
                <circle cx="113" cy="41" r="2.5" />
                <circle cx="70" cy="118" r="2.5" />
            </g>
            <g fill="#64748b" opacity="0.5">
                <circle cx="69.5" cy="19.5" r="1" />
                <circle cx="26.5" cy="40.5" r="1" />
                <circle cx="112.5" cy="40.5" r="1" />
                <circle cx="69.5" cy="117.5" r="1" />
            </g>
        </svg>
    </div>
);

// 🏗 SRO ICON — Документ с Сургучной Печатью (Допуск СРО Still-Life)
const ShieldBoltIcon = () => (
    <div className="relative group perspective-1000 flex items-center justify-center cursor-pointer" style={{width: 140, height: 140}}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-orange-600/50 via-red-500/20 to-transparent blur-[28px] license-bolt-glow transition-all duration-700 group-hover:scale-125 group-hover:from-orange-600/70" />

        <div className="relative z-10 w-[140px] h-[140px] transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-2">
            <img 
                src="/icons/icon_sro_neon.png?v=3" 
                alt="Допуски СРО" 
                className="w-full h-full drop-shadow-2xl rounded-2xl object-cover border border-slate-700/50 group-hover:brightness-110 group-hover:border-amber-500/50 transition-all duration-700" 
            />
            
            {/* Точечная анимированная подсветка основы сургуча */}
            <div className="absolute z-20 bottom-[10px] right-[10px] w-[50px] h-[50px] rounded-full bg-red-600/0 group-hover:bg-amber-500/30 blur-[10px] transition-all duration-700 pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />

            {/* Эксклюзивный эффект: отрисовка золотистого орла SVG поверх PNG-картинки */}
            <style>{`
                .golden-eagle-path {
                    stroke-dasharray: 40;
                    stroke-dashoffset: 40;
                    transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .group:hover .golden-eagle-path {
                    stroke-dashoffset: 0;
                }
            `}</style>
            <svg viewBox="0 0 40 40" className="absolute z-30 bottom-[6px] right-[4px] w-[60px] h-[60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <g fill="none" stroke="#fbbf24" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" style={{filter: 'drop-shadow(0 0 4px rgba(251,191,36,1))'}}>
                    {/* Two heads */}
                    <path d="M 17,14 C 15,12 13,13 12,15" className="golden-eagle-path" />
                    <path d="M 23,14 C 25,12 27,13 28,15" className="golden-eagle-path" />
                    {/* Body */}
                    <path d="M 20,14 L 20,24" className="golden-eagle-path" />
                    {/* Wings spread */}
                    <path d="M 19,17 C 15,14 11,16 9,20" className="golden-eagle-path" />
                    <path d="M 21,17 C 25,14 29,16 31,20" className="golden-eagle-path" />
                    {/* Tail */}
                    <path d="M 17,24 L 20,28 L 23,24" className="golden-eagle-path" />
                    {/* Shield on chest */}
                    <rect x="18" y="18" width="4" height="5" rx="0.5" className="golden-eagle-path" />
                </g>
            </svg>
        </div>
    </div>
);

// 🏅 SHIELD BADGE — Удостоверения
const ShieldBadgeIcon = () => (
    <div className="relative group perspective-1000">
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-rose-600/50 via-pink-500/20 to-transparent blur-[28px] license-badge-glow transition-all duration-700 group-hover:scale-125 group-hover:from-rose-600/70" />

        <svg viewBox="0 0 140 140" fill="none" className="w-[140px] h-[140px] relative z-10 transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-2 drop-shadow-2xl">
            <defs>
                <linearGradient id="armor-base-c" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="50%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                <linearGradient id="armor-highlight-c" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="30%" stopColor="#475569" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="armor-shadow-c" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#000000" stopOpacity="0" />
                    <stop offset="70%" stopColor="#000000" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="cavity-c" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#000000" />
                    <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                <linearGradient id="rose-shield" x1="50" y1="20" x2="50" y2="120" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#e11d48" stopOpacity="0.15" />
                    <stop offset="1" stopColor="#881337" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="rose-edge" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop stopColor="#fda4af" />
                    <stop offset="0.3" stopColor="#e11d48" />
                    <stop offset="1" stopColor="#4c0519" />
                </linearGradient>

                <linearGradient id="badge-energy" x1="70" y1="40" x2="70" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffe4e6" />
                    <stop offset="0.3" stopColor="#fb7185" />
                    <stop offset="0.7" stopColor="#e11d48" />
                    <stop offset="1" stopColor="#9f1239" />
                </linearGradient>

                <filter id="badge-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feColorMatrix in="blur" type="matrix" values="1 0.2 0 0 0  0 0.1 0 0 0  0 0.2 0 0 0  0 0 0 0.8 0" result="warm" />
                    <feMerge>
                        <feMergeNode in="warm" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <g filter="url(#forge-drop-shadow)">
                <path d="M70 12 L18 34v40c0 30 22 50 52 62 30-12 52-32 52-62V34L70 12z" fill="url(#armor-base-c)" />
                <path d="M70 12 L18 34v40c0 30 22 50 52 62 30-12 52-32 52-62V34L70 12z" fill="none" stroke="url(#armor-highlight-c)" strokeWidth="3" />
                <path d="M70 12 L18 34v40c0 30 22 50 52 62 30-12 52-32 52-62V34L70 12z" fill="none" stroke="url(#armor-shadow-c)" strokeWidth="4" className="translate-x-[1px] translate-y-[1px]" />
                <path d="M 28 45 L 45 28 M 28 65 L 65 28 M 28 85 L 85 28 M 38 100 L 100 38 M 55 108 L 112 51 M 80 110 L 112 78 M 105 105 L 112 98" stroke="#020617" strokeWidth="4" opacity="0.4" strokeLinecap="round" />
            </g>

            <path d="M70 24 L30 42v32c0 24 16 38 40 48 24-10 40-24 40-48V42L70 24z" fill="url(#cavity-c)" stroke="#000" strokeWidth="4" />
            <path d="M70 24 L30 42v32c0 24 16 38 40 48 24-10 40-24 40-48V42L70 24z" fill="none" stroke="#e11d48" strokeWidth="2" opacity="0.3" filter="url(#glass-shine)" />
            <path d="M70 28 L35 44v28c0 20 13 32 35 40 22-8 35-20 35-40V44L70 28z" fill="url(#rose-shield)" stroke="url(#rose-edge)" strokeWidth="2" filter="url(#glass-shine)" />

            <g filter="url(#badge-glow)">
                <circle cx="70" cy="68" r="18" stroke="url(#badge-energy)" strokeWidth="3.5" fill="none" />
                <path d="M70 54v-7M70 89v-7M50 68h-7M97 68h-7" stroke="url(#badge-energy)" strokeWidth="3" strokeLinecap="round" />
                <path d="M70 54l4 8 9.5 1.5-6.8 6.8 1.5 9.5L70 75l-8.2 4.8 1.5-9.5-6.8-6.8 9.5-1.5L70 54z" fill="url(#badge-energy)" opacity="0.9" />
            </g>

            <g fill="#1e293b" stroke="#020617" strokeWidth="1.5">
                <circle cx="70" cy="20" r="2.5" />
                <circle cx="27" cy="41" r="2.5" />
                <circle cx="113" cy="41" r="2.5" />
                <circle cx="70" cy="118" r="2.5" />
            </g>
        </svg>
    </div>
);

const licenses = [
    {
        Icon: ShieldFlameIcon,
        title: "Лицензия МЧС",
        description: "На осуществление работ по огнезащите материалов, изделий и конструкций",
        glowColor: "rgba(239,68,68,0.3)",
        glowHover: "rgba(239,68,68,0.55)",
        accentFrom: "from-red-600",
        accentTo: "to-orange-500",
    },
    {
        Icon: ShieldBoltIcon,
        title: "Допуски СРО",
        description: "Свидетельство о допуске к работам, влияющим на безопасность объектов капстроительства",
        glowColor: "rgba(249,115,22,0.3)",
        glowHover: "rgba(249,115,22,0.55)",
        accentFrom: "from-orange-500",
        accentTo: "to-red-600",
    },
    {
        Icon: ShieldBadgeIcon,
        title: "Удостоверения",
        description: "Все сотрудники имеют действующие удостоверения промышленных альпинистов и наряды-допуски",
        glowColor: "rgba(244,63,94,0.3)",
        glowHover: "rgba(244,63,94,0.55)",
        accentFrom: "from-rose-500",
        accentTo: "to-red-600",
    },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};
const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export function LicensesSection() {
    return (
        <section className="relative py-24 sm:py-32 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-600/8 blur-[100px] rounded-full pointer-events-none" />

            <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10">
                <motion.div
                    initial="hidden" whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={headingVariants}
                    className="mx-auto max-w-2xl text-center mb-16"
                >
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl mb-5">
                        Лицензии{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
                            и допуски
                        </span>
                    </h2>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Работаем официально с соблюдением всех норм безопасности и законодательства РФ
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden" whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={containerVariants}
                    className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3"
                >
                    {licenses.map(({ Icon, title, description, accentFrom, accentTo, glowColor, glowHover }, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            whileHover={{ y: -6, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="group relative"
                        >
                            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-red-500/30 via-transparent to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[0.5px]" />

                            <div
                                className="relative bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 text-center h-full flex flex-col items-center transition-all duration-500"
                                style={{ boxShadow: `0 4px 24px -4px ${glowColor}` }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = `0 8px 40px -4px ${glowHover}`;
                                    e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = `0 4px 24px -4px ${glowColor}`;
                                    e.currentTarget.style.borderColor = "rgba(51,65,85,0.5)";
                                }}
                            >
                                {/* ICON — big, centered, with glow ring */}
                                <div className="relative mb-8 flex items-center justify-center">
                                    <div
                                        className="absolute rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                        style={{
                                            width: "120px", height: "120px",
                                            background: `conic-gradient(from 0deg, transparent, ${glowColor}, transparent, ${glowColor}, transparent)`,
                                            animation: "license-spin 4s linear infinite",
                                            filter: "blur(10px)",
                                        }}
                                    />
                                    <Icon />
                                </div>

                                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-orange-300 transition-all duration-300">
                                    {title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                                    {description}
                                </p>
                                <div className="mt-auto pt-6 w-full">
                                    <div className={`h-0.5 w-0 group-hover:w-full mx-auto bg-gradient-to-r ${accentFrom} ${accentTo} rounded-full transition-all duration-700 ease-out`} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <style>{`
                @keyframes license-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                /* === FIRE BACKGROUND GLOW === */
                .license-fire-glow {
                    animation: fire-bg-pulse 2s ease-in-out infinite alternate;
                }
                @keyframes fire-bg-pulse {
                    0% { opacity: 0.4; transform: scale(0.9); }
                    100% { opacity: 0.7; transform: scale(1.1); }
                }
                .license-bolt-glow {
                    animation: fire-bg-pulse 3s ease-in-out infinite alternate;
                }
                .license-badge-glow {
                    animation: fire-bg-pulse 2.5s ease-in-out infinite alternate;
                }
                /* === OUTER FLAME — slow sway === */
                .lf-outer {
                    animation: lf-sway 2.5s ease-in-out infinite alternate;
                    transform-origin: 50px 68px;
                }
                @keyframes lf-sway {
                    0% { transform: scaleX(1) scaleY(1); }
                    33% { transform: scaleX(1.05) scaleY(0.97); }
                    66% { transform: scaleX(0.95) scaleY(1.03); }
                    100% { transform: scaleX(1.02) scaleY(0.98); }
                }
                /* === LEFT TONGUE === */
                .lf-tongue-l {
                    animation: lf-tongue-l-sway 2s ease-in-out infinite alternate;
                    transform-origin: 40px 55px;
                }
                @keyframes lf-tongue-l-sway {
                    0% { transform: rotate(0deg) scaleY(1); opacity: 0.5; }
                    50% { transform: rotate(-3deg) scaleY(1.1); opacity: 0.65; }
                    100% { transform: rotate(2deg) scaleY(0.9); opacity: 0.4; }
                }
                /* === RIGHT TONGUE === */
                .lf-tongue-r {
                    animation: lf-tongue-r-sway 2.2s ease-in-out infinite alternate;
                    transform-origin: 60px 55px;
                }
                @keyframes lf-tongue-r-sway {
                    0% { transform: rotate(0deg) scaleY(1); opacity: 0.5; }
                    50% { transform: rotate(3deg) scaleY(1.1); opacity: 0.65; }
                    100% { transform: rotate(-2deg) scaleY(0.9); opacity: 0.4; }
                }
                /* === MIDDLE FLAME === */
                .lf-mid {
                    animation: lf-mid-sway 1.8s ease-in-out infinite alternate;
                    transform-origin: 50px 62px;
                }
                @keyframes lf-mid-sway {
                    0% { transform: scaleX(1) scaleY(1) translateX(0); }
                    50% { transform: scaleX(0.93) scaleY(1.06) translateX(-1px); }
                    100% { transform: scaleX(1.07) scaleY(0.95) translateX(1px); }
                }
                /* === CORE FLAME — fastest === */
                .lf-core {
                    animation: lf-core-pulse 1.2s ease-in-out infinite alternate;
                    transform-origin: 50px 58px;
                }
                @keyframes lf-core-pulse {
                    0% { transform: scaleY(1) scaleX(1); opacity: 0.95; }
                    50% { transform: scaleY(1.15) scaleX(0.88); opacity: 1; }
                    100% { transform: scaleY(0.88) scaleX(1.12); opacity: 0.85; }
                }
                /* === WHITE HOT center === */
                .lf-hot {
                    animation: lf-hot-pulse 1s ease-in-out infinite alternate;
                }
                @keyframes lf-hot-pulse {
                    0% { opacity: 0.5; rx: 2.5; ry: 4; }
                    100% { opacity: 0.8; rx: 3; ry: 5; }
                }
                /* === SPARKS float up === */
                .lf-spark-1 { animation: lf-spark 2s ease-out infinite; }
                .lf-spark-2 { animation: lf-spark 2.5s ease-out infinite 0.4s; }
                .lf-spark-3 { animation: lf-spark 1.8s ease-out infinite 0.8s; }
                .lf-spark-4 { animation: lf-spark 2.2s ease-out infinite 1.2s; }
                @keyframes lf-spark {
                    0% { opacity: 0.8; transform: translateY(0) scale(1); }
                    40% { opacity: 1; transform: translateY(-6px) scale(1.4); }
                    100% { opacity: 0; transform: translateY(-16px) scale(0.2); }
                }
            `}</style>
        </section>
    );
}
