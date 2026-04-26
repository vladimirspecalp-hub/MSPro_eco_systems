import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, Info, ArrowRight, FileText, Calculator } from "lucide-react";
import { CALCULATOR_DATA, SERVICE_TYPES } from "@/lib/calculator-data";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export default function PricesPage() {
    // SEO Meta Tags
    useEffect(() => {
        document.title = "Прайс-лист 2026 на высотные работы | Цены MS-PRO";

        // Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', "Актуальные цены на услуги промышленного альпинизма и антикоррозийной защиты. Прайс-лист на покраску труб, металлоконструкций и огнезащиту. Скачать PDF.");

        // Canonical
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', "https://mspro-ltd.ru/prices");

        return () => {
            document.title = "MS-PRO — Промышленные высотные работы";
            // Cleanup if needed
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-24 pb-16 sm:pt-32 sm:pb-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <Badge variant="outline" className="mb-4 px-4 py-1 text-sm border-primary/30 bg-primary/5 text-primary">
                        Актуально на 2026 год
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/70">
                        Прайс-лист на услуги
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10">
                        Прозрачное ценообразование на высотные работы.
                        Стоимость зависит от объема, региона и сложности объекта.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/calculator">
                            <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20">
                                <Calculator className="mr-2 h-5 w-5" />
                                Рассчитать смету онлайн
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                            <FileText className="mr-2 h-5 w-5" />
                            Скачать PDF
                        </Button>
                    </div>
                </div>

                {/* Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
            </section>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-20">

                {/* Main Price Table */}
                <section id="base-prices">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold tracking-tight">Базовые расценки</h2>
                    </div>

                    <Card className="overflow-hidden border-muted/50 shadow-sm">
                        <Table>
                            <TableHeader className="bg-muted/40">
                                <TableRow>
                                    <TableHead className="w-[300px] sm:w-[400px]">Услуга</TableHead>
                                    <TableHead>Ед. изм.</TableHead>
                                    <TableHead>Стоимость работ</TableHead>
                                    <TableHead className="text-right">Материалы</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {SERVICE_TYPES.map((service) => (
                                    <TableRow key={service.id} className="group hover:bg-muted/20 transition-colors">
                                        <TableCell className="font-medium align-top py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-base">{service.label}</span>
                                                {service.id === 'mspro_quad' && (
                                                    <Badge variant="secondary" className="w-fit text-[10px] h-5 bg-amber-500/10 text-amber-600 border-amber-500/20">
                                                        Гарантия 20 лет
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-top py-4 text-muted-foreground">м²</TableCell>
                                        <TableCell className="align-top py-4">
                                            <span className="font-semibold text-primary">От {service.baseRate} ₽</span>
                                        </TableCell>
                                        <TableCell className="text-right align-top py-4">
                                            {service.coatingTiers && service.coatingTiers.length > 0 ? (
                                                <div className="flex flex-col gap-1 items-end">
                                                    {service.coatingTiers.map(tier => (
                                                        <div key={tier.tierId} className="text-sm text-muted-foreground whitespace-nowrap">
                                                            {tier.systemName ?? tier.tierId}: <span className="font-medium text-foreground">{tier.pricePerSqm !== null ? `${tier.pricePerSqm} ₽` : "уточн."}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                    <p className="mt-4 text-sm text-muted-foreground text-center sm:text-left">
                        * Цены указаны без учета НДС. Итоговая стоимость может меняться в зависимости от удаленности объекта и сложности доступа.
                    </p>
                </section>

                {/* Regional Coefficients */}
                <section id="regional-factors" className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="bg-primary/10 p-2 rounded-lg text-primary text-xl">📍</span>
                            Региональные коэффициенты
                        </h2>
                        <Card className="h-[400px] overflow-hidden flex flex-col">
                            <CardHeader className="pb-3 bg-muted/20">
                                <CardTitle className="text-lg">Карта коэффициентов</CardTitle>
                                <CardDescription>Влияние логистики на стоимость работ</CardDescription>
                            </CardHeader>
                            <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-background z-10">
                                        <TableRow>
                                            <TableHead>Регион</TableHead>
                                            <TableHead className="text-right">Коэффициент</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {CALCULATOR_DATA.regions
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map((region) => (
                                                <TableRow key={region.name} className="hover:bg-muted/30">
                                                    <TableCell className="py-2">{region.name}</TableCell>
                                                    <TableCell className="text-right py-2 font-mono">
                                                        {region.value === 1 ? (
                                                            <span className="text-muted-foreground">1.0</span>
                                                        ) : (
                                                            <Badge variant={region.value > 1.2 ? "destructive" : "secondary"} className="font-normal">
                                                                x{region.value}
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="bg-primary/10 p-2 rounded-lg text-primary text-xl">⚠️</span>
                            Усложняющие факторы
                        </h2>
                        <Card className="h-full border-dashed border-2">
                            <CardContent className="pt-6 grid gap-4">
                                {CALCULATOR_DATA.hazards.map((hazard) => (
                                    <div key={hazard.code} className="flex items-start justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                                            <div>
                                                <p className="font-medium text-sm">{hazard.description}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5 opacity-0 sm:opacity-70">Код: {hazard.code}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="ml-4 tabular-nums whitespace-nowrap bg-background">
                                            +{Math.round((hazard.value - 1) * 100)}%
                                        </Badge>
                                    </div>
                                ))}

                                <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                                    <h4 className="font-semibold text-primary mb-1 flex items-center gap-2">
                                        <Info className="h-4 w-4" />
                                        Как считается итоговая цена?
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Базовая ставка × Коэффициент региона × (Фактор 1 × Фактор 2...) + Стоимость материалов
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* CTA */}
                <section className="rounded-2xl bg-foreground text-background p-8 sm:p-16 text-center relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Получите точный расчет</h2>
                        <p className="text-muted-foreground/80 text-lg mb-8">
                            Воспользуйтесь нашим онлайн-калькулятором, чтобы узнать стоимость работ для вашего объекта за 1 минуту.
                        </p>
                        <Link href="/calculator">
                            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold w-full sm:w-auto">
                                Перейти в калькулятор
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                    {/* Background Gradient */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-3xl -z-0" />
                    <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-500/10 blur-3xl -z-0" />
                </section>

            </div>
        </div>
    );
}
