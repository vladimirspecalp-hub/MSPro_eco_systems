import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Truck, CheckCircle2 } from "lucide-react";
import { RussiaMap } from "./RussiaMap";
import { motion } from "framer-motion";

const regions = [
    { name: "Центральный ФО", cities: ["Москва", "Воронеж", "Ярославль"] },
    { name: "Северо-Западный ФО", cities: ["Санкт-Петербург", "Калининград", "Мурманск"] },
    { name: "Приволжский ФО", cities: ["Нижний Новгород", "Казань", "Самара", "Уфа"] },
    { name: "Уральский ФО", cities: ["Екатеринбург", "Челябинск", "Тюмень"] },
    { name: "Сибирский ФО", cities: ["Новосибирск", "Красноярск", "Омск"] },
    { name: "Южный ФО", cities: ["Ростов-на-Дону", "Краснодар", "Волгоград"] },
    { name: "Северо-Кавказский ФО", cities: ["Пятигорск", "Махачкала", "Грозный"] },
    { name: "Дальневосточный ФО", cities: ["Владивосток", "Хабаровск", "Якутск"] },
];

export function Geography() {
    const [activeDistrict, setActiveDistrict] = useState<string | null>(null);

    return (
        <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-transparent">
            {/* Subtle background glow effect for abstract depth in dark mode */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 dark:bg-red-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl mb-6 text-slate-900 dark:text-white">
                        География работ: <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-400 dark:to-orange-300">Вся Россия</span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        Мы не ограничены одним городом. Мобильные бригады промышленных альпинистов
                        готовы к выезду в любую точку страны в течение <span className="font-semibold text-slate-900 dark:text-white">24 часов</span>, включая новые субъекты РФ.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {/* Feature Card 1 */}
                    <Card className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                            <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-2xl mb-6 shadow-sm border border-red-100 dark:border-red-800/50">
                                <MapPin className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Федеральный охват</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Работаем во всех 89 субьектах РФ. Знаем специфику логистики от Калининграда до Владивостока.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Feature Card 2 */}
                    <Card className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                            <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-2xl mb-6 shadow-sm border border-orange-100 dark:border-orange-800/50">
                                <Truck className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Мобильные базы</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Собственный автопарк и оборудование позволяют автономно работать на удаленных объектах.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Feature Card 3 */}
                    <Card className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                            <div className="p-4 bg-rose-50 dark:bg-rose-900/30 rounded-2xl mb-6 shadow-sm border border-rose-100 dark:border-rose-800/50">
                                <Clock className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-white">Оперативный старт</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Выезд инженера на осмотр — бесплатно. Расчет сметы в день обращения.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="relative w-full max-w-[90rem] mx-auto flex flex-col mt-12">
                    {/* Full width Map Container */}
                    <div className="w-full relative z-20">
                        <div className="bg-slate-900/40 border border-slate-700/50 backdrop-blur-2xl rounded-[2rem] p-4 lg:p-8 shadow-2xl relative overflow-hidden group">
                            <RussiaMap activeDistrict={activeDistrict} onDistrictHover={setActiveDistrict} />

                            {/* Floating Glassmorphism Panel (Desktop only) */}
                            <div className={`hidden lg:block absolute top-6 right-6 lg:top-10 lg:right-10 w-72 md:w-80 bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl p-6 transition-all duration-500 ease-out z-50 pointer-events-none
                                ${activeDistrict ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
                            `}>
                                {activeDistrict ? (
                                    <>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-2 h-8 bg-red-500 rounded-full" />
                                            <h4 className="font-bold text-xl text-white">
                                                {activeDistrict}
                                            </h4>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-2">Обслуживаемые центры</p>
                                            <div className="flex flex-wrap gap-2">
                                                {regions.find(r => r.name === activeDistrict)?.cities.map((city, cIdx) => (
                                                    <span
                                                        key={cIdx}
                                                        className="px-3 py-1.5 bg-slate-800/80 border border-slate-700/50 rounded-lg text-sm font-medium text-slate-200 shadow-sm"
                                                    >
                                                        {city}
                                                    </span>
                                                ))}
                                                <span className="px-3 py-1.5 text-sm font-medium text-slate-500 underline underline-offset-2 decoration-dotted">
                                                    + др.
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-slate-400 text-center text-sm py-4">Наведите на карту</div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Inline Info Panel (Mobile/Tablet only) */}
                        <div className="lg:hidden mt-4">
                            <motion.div
                                initial={false}
                                animate={{
                                    height: activeDistrict ? "auto" : "56px",
                                    opacity: 1
                                }}
                                className="overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 shadow-lg rounded-2xl"
                            >
                                <div className="p-4">
                                    {activeDistrict ? (
                                        <div className="animate-in fade-in duration-500">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-1.5 h-6 bg-red-500 rounded-full" />
                                                <h4 className="font-bold text-lg text-white">
                                                    {activeDistrict}
                                                </h4>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Обслуживаемые центры</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {regions.find(r => r.name === activeDistrict)?.cities.map((city, cIdx) => (
                                                        <span
                                                            key={cIdx}
                                                            className="px-2.5 py-1 bg-slate-800/80 border border-slate-700/50 rounded-md text-xs font-medium text-slate-200"
                                                        >
                                                            {city}
                                                        </span>
                                                    ))}
                                                    <span className="px-2.5 py-1 text-xs font-medium text-slate-500 underline underline-offset-2 decoration-dotted">
                                                        + др.
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-6 text-slate-400 text-sm font-medium">
                                            <svg className="w-4 h-4 mr-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                            </svg>
                                            Нажмите на регион на карте
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Stats block below map */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="w-full mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 relative z-20"
                    >
                        {/* Summary Stat */}
                        <div className="bg-slate-900/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 backdrop-blur-xl rounded-[2rem] p-6 lg:p-10 flex items-center justify-between shadow-2xl">
                            <div>
                                <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-400">120+</div>
                                <div className="text-slate-800 dark:text-slate-300 font-medium mt-3 text-lg lg:text-xl leading-snug">Выполненных объектов высокой сложности</div>
                            </div>
                            <div className="hidden sm:flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 shrink-0 ml-4">
                                <CheckCircle2 className="w-10 h-10 text-red-500" />
                            </div>
                        </div>

                        {/* Notable Projects */}
                        <div className="bg-slate-900/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 backdrop-blur-xl rounded-[2rem] p-6 lg:p-10 flex flex-col justify-center shadow-2xl">
                            <div className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest mb-5">Знаковые объекты</div>
                            <ul className="space-y-4 text-slate-700 dark:text-slate-200 md:text-lg">
                                <li className="flex items-start md:items-center gap-3 group">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-2 md:mt-0 group-hover:scale-150 transition-transform"></div>
                                    <span>
                                        <span className="font-semibold text-slate-900 dark:text-white">Крымский мост</span>
                                        <span className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-normal ml-2">— Антикоррозийная защита и покраска</span>
                                    </span>
                                </li>
                                <li className="flex items-start md:items-center gap-3 group">
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-2 md:mt-0 group-hover:scale-150 transition-transform"></div>
                                    <span>
                                        <span className="font-semibold text-slate-900 dark:text-white">Башня РТПС, Новороссийск</span>
                                        <span className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-normal ml-2">— Монтаж АМС</span>
                                    </span>
                                </li>
                                <li className="flex items-start md:items-center gap-3 group">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-2 md:mt-0 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                                    <span>
                                        <span className="font-semibold text-slate-900 dark:text-white">г. Мариуполь</span>
                                        <span className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-normal ml-2">— Восстановление промышленных объектов</span>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div >
        </section >
    );
}
