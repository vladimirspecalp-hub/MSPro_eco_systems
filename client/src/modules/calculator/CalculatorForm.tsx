import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, ChevronsUpDown, Info } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { trackCalcStart, trackCalcSubmit } from "@/modules/analytics";
import { useLocation } from "wouter";
import { CALCULATOR_DATA, SERVICE_TYPES, COATING_TIER_META, TierId, ChimneyMaterial, SurfacePrep, CHIMNEY_MATERIALS, SURFACE_PREP_OPTIONS, AnticorrosionType, ANTICORROSION_TYPES, FireproofingStructureType, FIREPROOFING_STRUCTURE_TYPES, SURFACE_PREP_SERVICES, ELEMENT_WIDTH_COEFS } from "@/lib/calculator-data";
import { cn } from "@/lib/utils";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";

interface CalculationResult {
  serviceType: string;
  surfaceArea: number;
  height: number | null;
  diameter: number | null;
  region: string;
  hazards: string[];
  estimatedCost: number;
  costMin: number;
  costMax: number;
  laborCost: number;
  materialCost: number;
  materialName: string | null;
  coatingIsPending: boolean;
  baseDays: number;
  optimisticDays: number;
  surfacePrepCost: number;
  prepServiceLabel: string | null;
  chimneyMaterialLabel?: string;
  surfacePrepLabel?: string;
  anticorrosionTypeLabel?: string;
  fireproofingStructureLabel?: string;
}

// Counter animation hook for Concept C hero number
function useCounter(target: number, duration = 350): number {
  const [displayed, setDisplayed] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = prevRef.current;
    const end = target;
    if (start === end) { setDisplayed(end); return; }
    prevRef.current = end;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (end - start) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return displayed;
}

const SERVICE_EMOJI: Record<string, string> = {
  chimney_painting: "🏭",
  anticorrosion:    "⚙️",
  mspro_quad:       "🔧",
  fireproofing:     "🔥",
  rope_access:      "🧗",
  ceiling_sanation: "🏗️",
};

export function CalculatorForm() {
  const [, setLocation] = useLocation();

  const [selectedService, setSelectedService] = useState(SERVICE_TYPES[0].id);
  const [selectedRegion, setSelectedRegion] = useState(CALCULATOR_DATA.regions[0].name);
  const [selectedHazards, setSelectedHazards] = useState<string[]>([]);
  const [selectedTier, setSelectedTier] = useState<TierId>("standard");
  const [openRegion, setOpenRegion] = useState(false);

  // Controlled inputs for real-time calculation
  const [height, setHeight] = useState("");
  const [diameter, setDiameter] = useState("");
  const [area, setArea] = useState("");

  const [chimneyMaterial, setChimneyMaterial] = useState<ChimneyMaterial>("metal");
  const [surfacePrep, setSurfacePrep] = useState<SurfacePrep>("manual");
  const [anticorrosionType, setAnticorrosionType] = useState<AnticorrosionType>("metalstructures");
  const [fireproofingStructureType, setFireproofingStructureType] = useState<FireproofingStructureType>("metalstructures");
  const [prepServiceId, setPrepServiceId] = useState<string | null>(null);
  const [prepMaterialId, setPrepMaterialId] = useState<string>("metal");
  const [prepGradeId, setPrepGradeId] = useState<string>("sa25");
  const [prepWidthId, setPrepWidthId] = useState<string>("w999");

  const hasTrackedStart = useRef(false);

  const currentService = useMemo(() =>
    SERVICE_TYPES.find(s => s.id === selectedService) || SERVICE_TYPES[0],
    [selectedService]
  );

  useEffect(() => {
    if (currentService.coatingTiers.length === 0) return;
    const hasStandard = currentService.coatingTiers.some(t => t.tierId === "standard");
    setSelectedTier(hasStandard ? "standard" : currentService.coatingTiers[0].tierId);
  }, [currentService.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFirstInteraction = () => {
    if (!hasTrackedStart.current) {
      trackCalcStart();
      hasTrackedStart.current = true;
    }
  };

  const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') e.preventDefault();
  };

  const handleNumericPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (e.clipboardData.getData('text').includes('-')) e.preventDefault();
  };

  const toggleHazard = (code: string) => {
    handleFirstInteraction();
    setSelectedHazards(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  // Real-time calculation — replaces form submit
  const calcResult = useMemo<CalculationResult | null>(() => {
    let surfaceArea = 0;
    if (currentService.requiresGeometry) {
      const h = parseFloat(height) || 0;
      const d = parseFloat(diameter) || 0;
      surfaceArea = Math.PI * d * h;
    } else {
      surfaceArea = parseFloat(area) || 0;
    }
    if (surfaceArea <= 0) return null;

    const regionData = CALCULATOR_DATA.regions.find(r => r.name === selectedRegion);
    const k_reg = regionData ? regionData.value : 1.0;

    const k_hazards = selectedHazards.reduce((acc, code) => {
      const hazard = CALCULATOR_DATA.hazards.find(h => h.code === code);
      return acc * (hazard ? hazard.value : 1.0);
    }, 1.0);

    const laborCost = surfaceArea * currentService.baseRate * k_reg * k_hazards;

    let materialCost = 0;
    let materialName: string | null = null;
    let coatingIsPending = false;
    if (currentService.coatingTiers.length > 0) {
      const tier = currentService.coatingTiers.find(t => t.tierId === selectedTier);
      if (tier) {
        const meta = COATING_TIER_META[tier.tierId];
        materialName = tier.systemName ? `${meta.label}: ${tier.systemName}` : meta.label;
        coatingIsPending = tier.pricePerSqm === null;
        materialCost = tier.pricePerSqm !== null ? surfaceArea * tier.pricePerSqm : 0;
      }
    }

    let surfacePrepCost = 0;
    let surfacePrepLabel: string | null = null;
    if (prepServiceId) {
      const prepService = SURFACE_PREP_SERVICES.find(s => s.id === prepServiceId);
      if (prepService) {
        const material = prepService.materials.find(m => m.id === prepMaterialId) || prepService.materials[0];
        const gradeCoef = prepService.gradeCoefs?.find(g => g.id === prepGradeId)?.coef ?? 1.0;
        const widthCoef = prepService.widthCoefs?.find(w => w.id === prepWidthId)?.coef ?? 1.0;
        surfacePrepCost = parseFloat((surfaceArea * material.pricePerSqm * gradeCoef * widthCoef).toFixed(2));
        const gradeLabel = prepService.gradeCoefs?.find(g => g.id === prepGradeId)?.label;
        const widthLabel = prepService.widthCoefs?.find(w => w.id === prepWidthId)?.label;
        surfacePrepLabel = [prepService.label, material.label, gradeLabel, widthLabel ? `ш. ${widthLabel}` : null]
          .filter(Boolean).join(", ");
      }
    }

    const totalCost = laborCost + materialCost + surfacePrepCost;

    return {
      serviceType: currentService.label,
      surfaceArea: parseFloat(surfaceArea.toFixed(2)),
      height: currentService.requiresGeometry ? (parseFloat(height) || null) : null,
      diameter: currentService.requiresGeometry ? (parseFloat(diameter) || null) : null,
      region: selectedRegion,
      hazards: selectedHazards.map(code => CALCULATOR_DATA.hazards.find(h => h.code === code)?.description || code),
      estimatedCost: parseFloat(totalCost.toFixed(2)),
      costMin: Math.round(totalCost * 0.85),
      costMax: Math.round(totalCost * 1.15),
      laborCost: parseFloat(laborCost.toFixed(2)),
      materialCost: parseFloat(materialCost.toFixed(2)),
      materialName,
      coatingIsPending,
      baseDays: Math.ceil(surfaceArea / 80),
      optimisticDays: Math.ceil(surfaceArea / 500),
      surfacePrepCost,
      prepServiceLabel: surfacePrepLabel,
      chimneyMaterialLabel: selectedService === "chimney_painting" ? CHIMNEY_MATERIALS[chimneyMaterial].label : undefined,
      surfacePrepLabel: (selectedService === "chimney_painting" || selectedService === "anticorrosion" || selectedService === "fireproofing")
        ? SURFACE_PREP_OPTIONS[surfacePrep].label : undefined,
      anticorrosionTypeLabel: selectedService === "anticorrosion" ? ANTICORROSION_TYPES[anticorrosionType].label : undefined,
      fireproofingStructureLabel: selectedService === "fireproofing" ? FIREPROOFING_STRUCTURE_TYPES[fireproofingStructureType].label : undefined,
    };
  }, [selectedService, currentService, height, diameter, area, selectedRegion, selectedHazards, selectedTier,
      chimneyMaterial, surfacePrep, anticorrosionType, fireproofingStructureType,
      prepServiceId, prepMaterialId, prepGradeId, prepWidthId]);

  // Counter animation for hero number
  const displayedCost = useCounter(calcResult?.estimatedCost ?? 0);

  // Hazard complexity multiplier for P0.1 info
  const hazardCoef = selectedHazards.reduce((acc, code) => {
    const h = CALCULATOR_DATA.hazards.find(h => h.code === code);
    return acc * (h ? h.value : 1.0);
  }, 1.0);

  const handleGetProposal = () => {
    if (!calcResult) return;

    // P0.7: sessionStorage prefill for /contacts
    try {
      sessionStorage.setItem('calcSummary', JSON.stringify({
        objectType: calcResult.serviceType,
        area: calcResult.surfaceArea,
        region: calcResult.region,
        tier: calcResult.materialName,
        surfacePrep: calcResult.surfacePrepLabel,
        estimate: calcResult.estimatedCost,
        range: { min: calcResult.costMin, max: calcResult.costMax },
        activeFactors: calcResult.hazards,
      }));
    } catch (_e) { /* ignore */ }

    trackCalcSubmit();
    hasTrackedStart.current = false;

    const details = [
      `Услуга: ${calcResult.serviceType}`,
      `Регион: ${calcResult.region}`,
      `Площадь: ${calcResult.surfaceArea} м²`,
      calcResult.height ? `Высота: ${calcResult.height} м` : null,
      calcResult.chimneyMaterialLabel ? `Материал трубы: ${calcResult.chimneyMaterialLabel}` : null,
      calcResult.surfacePrepLabel ? `Подготовка поверхности: ${calcResult.surfacePrepLabel}` : null,
      calcResult.anticorrosionTypeLabel ? `Тип конструкции: ${calcResult.anticorrosionTypeLabel}` : null,
      calcResult.fireproofingStructureLabel ? `Тип конструкции: ${calcResult.fireproofingStructureLabel}` : null,
      calcResult.materialName ? `Покрытие: ${calcResult.materialName} (${calcResult.materialCost.toLocaleString('ru-RU')} ₽)` : null,
      `Работа: ${calcResult.laborCost.toLocaleString('ru-RU')} ₽`,
      calcResult.hazards.length > 0 ? `Факторы: ${calcResult.hazards.join(", ")}` : null,
      `Ориентировочная стоимость: ${calcResult.costMin.toLocaleString('ru-RU')} – ${calcResult.costMax.toLocaleString('ru-RU')} ₽ (±15%)`,
    ].filter(Boolean).join("\n");

    const params = new URLSearchParams();
    params.set("service", selectedService);
    params.set("details", details);
    setLocation(`/contacts?${params.toString()}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="space-y-6" onFocus={handleFirstInteraction}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Рассчитайте стоимость защиты</CardTitle>
          <CardDescription>Прозрачная смета за 60 секунд · Обновляется в реальном времени</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* 1. Service type — radio pills (Concept C icon-first) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Тип услуги</Label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_TYPES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { handleFirstInteraction(); setSelectedService(s.id); }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium transition-all",
                    selectedService === s.id
                      ? "border-[#820101] bg-[#820101] text-white shadow-md"
                      : "border-border hover:border-[#820101]/50 hover:bg-[#820101]/5"
                  )}
                >
                  <span aria-hidden="true">{SERVICE_EMOJI[s.id] || "🔧"}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Geometry / area inputs */}
          {currentService.requiresGeometry ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg border">
              <div className="space-y-2">
                <Label htmlFor="height">Высота трубы (м) *</Label>
                <Input
                  id="height" type="number" step="0.1" min="0.1" placeholder="30"
                  value={height}
                  onChange={e => { handleFirstInteraction(); setHeight(e.target.value); }}
                  onKeyDown={handleNumericKeyDown}
                  onPaste={handleNumericPaste}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diameter">Диаметр трубы (м) *</Label>
                <Input
                  id="diameter" type="number" step="0.1" min="0.1" placeholder="2.5"
                  value={diameter}
                  onChange={e => { handleFirstInteraction(); setDiameter(e.target.value); }}
                  onKeyDown={handleNumericKeyDown}
                  onPaste={handleNumericPaste}
                />
              </div>
              {calcResult && (
                <p className="col-span-full text-xs text-muted-foreground px-1">
                  Площадь боковой поверхности: {calcResult.surfaceArea} м²
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2 p-4 bg-muted/20 rounded-lg border">
              <Label htmlFor="area">Площадь поверхности (м²) *</Label>
              <Input
                id="area" type="number" step="1" min="1" placeholder="1000"
                value={area}
                onChange={e => { handleFirstInteraction(); setArea(e.target.value); }}
                onKeyDown={handleNumericKeyDown}
                onPaste={handleNumericPaste}
              />
            </div>
          )}

          {/* 3. Region picker */}
          <div className="space-y-2">
            <Label>Регион объекта *</Label>
            <Popover open={openRegion} onOpenChange={setOpenRegion}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openRegion} className="justify-between w-full font-normal">
                  {selectedRegion}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Поиск региона..." />
                  <CommandList>
                    <CommandEmpty>Регион не найден.</CommandEmpty>
                    <CommandGroup>
                      {CALCULATOR_DATA.regions.map((region) => (
                        <CommandItem
                          key={region.name}
                          value={region.name}
                          onSelect={(v) => { setSelectedRegion(v); setOpenRegion(false); }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", selectedRegion === region.name ? "opacity-100" : "opacity-0")} />
                          {region.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* 4. HERO NUMBER BLOCK — live result with counter animation + P0.4 disclaimer */}
          {calcResult ? (
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: '#1A0808', border: '1px solid rgba(130,1,1,0.3)' }}
            >
              <div className="p-6">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 text-center">
                  Предварительная стоимость
                </p>

                {/* Hero number */}
                <p
                  className="font-extrabold text-center mb-1"
                  style={{
                    fontFamily: "'Manrope', 'Montserrat', sans-serif",
                    fontSize: 'clamp(36px, 7vw, 64px)',
                    color: '#820101',
                    lineHeight: 1.1,
                  }}
                >
                  {displayedCost.toLocaleString('ru-RU')} ₽
                </p>

                {/* Range + ±15% badge */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-sm text-gray-400">
                    {calcResult.costMin.toLocaleString('ru-RU')} — {calcResult.costMax.toLocaleString('ru-RU')} ₽
                  </span>
                  <span
                    className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                    style={{ background: 'rgba(177,65,65,0.15)', border: '1px solid rgba(177,65,65,0.3)', color: '#B14141' }}
                  >
                    ±15%
                  </span>
                </div>

                {/* Compact breakdown */}
                <p className="text-xs text-center text-gray-500 mb-4">
                  Работы: {calcResult.laborCost.toLocaleString('ru-RU')} ₽
                  {calcResult.materialCost > 0 && ` · Материалы: ${calcResult.materialCost.toLocaleString('ru-RU')} ₽`}
                  {calcResult.surfacePrepCost > 0 && ` · Подготовка: ${calcResult.surfacePrepCost.toLocaleString('ru-RU')} ₽`}
                </p>

                {/* P0.4 Engineer disclaimer */}
                <div
                  className="rounded-md px-3 py-2"
                  style={{ background: 'rgba(0,0,0,0.35)', borderLeft: '2px solid rgba(130,1,1,0.5)' }}
                >
                  <p className="text-xs text-gray-500">
                    ⚙️ <span className="font-medium text-gray-400">Смета предварительная.</span>{' '}
                    Точная стоимость уточняется инженером при осмотре объекта.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl p-6 text-center"
              style={{ background: 'rgba(130,1,1,0.04)', border: '1px dashed rgba(130,1,1,0.2)' }}
            >
              <p className="text-sm text-muted-foreground">
                Введите размеры объекта — стоимость появится здесь автоматически
              </p>
            </div>
          )}

          {/* 5. Accordion "Уточнить расчёт" */}
          <Accordion type="single" collapsible className="w-full border rounded-lg overflow-hidden">
            <AccordionItem value="refine" className="border-0">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-medium">
                <span className="flex items-center gap-2">
                  + Уточнить расчёт
                  {(selectedHazards.length > 0 || prepServiceId) && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ background: '#820101', color: '#fff' }}
                    >
                      {selectedHazards.length + (prepServiceId ? 1 : 0)}
                    </span>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2 space-y-6">

                {/* Coating Tier */}
                {currentService.coatingTiers.length > 0 && (
                  <div className="space-y-2">
                    <Label>Уровень покрытия</Label>
                    <ToggleGroup
                      type="single"
                      value={selectedTier}
                      onValueChange={(v) => v && setSelectedTier(v as TierId)}
                      variant="outline"
                      className="w-full"
                    >
                      {currentService.coatingTiers.map((t) => {
                        const meta = COATING_TIER_META[t.tierId];
                        return (
                          <ToggleGroupItem
                            key={t.tierId}
                            value={t.tierId}
                            className="flex-1 flex-col h-auto py-2.5 gap-0.5 data-[state=on]:bg-[#820101] data-[state=on]:text-white data-[state=on]:border-[#820101]"
                          >
                            <span className="font-semibold text-sm">{meta.label}</span>
                            <span className="text-xs font-normal opacity-70">
                              {t.pricePerSqm !== null ? `${t.pricePerSqm} ₽/м²` : "уточняется"}
                            </span>
                          </ToggleGroupItem>
                        );
                      })}
                    </ToggleGroup>
                    {currentService.coatingTiers
                      .filter(t => t.tierId === selectedTier)
                      .map(tier => (
                        <p key={tier.tierId} className="text-xs text-muted-foreground px-1">
                          {tier.systemName
                            ? `${tier.systemName}${tier.note ? ` · ${tier.note}` : ""}`
                            : `${COATING_TIER_META[tier.tierId].label}: система уточняется`
                          }
                        </p>
                      ))
                    }
                  </div>
                )}

                {/* Chimney-specific options */}
                {selectedService === "chimney_painting" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Материал трубы</Label>
                      <ToggleGroup
                        type="single" value={chimneyMaterial}
                        onValueChange={(v) => v && setChimneyMaterial(v as ChimneyMaterial)}
                        variant="outline" className="w-full"
                      >
                        {(Object.entries(CHIMNEY_MATERIALS) as [ChimneyMaterial, { label: string }][]).map(([id, { label }]) => (
                          <ToggleGroupItem key={id} value={id}
                            className="flex-1 data-[state=on]:bg-[#820101] data-[state=on]:text-white data-[state=on]:border-[#820101]">
                            {label}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Подготовка поверхности</Label>
                      <ToggleGroup
                        type="single" value={surfacePrep}
                        onValueChange={(v) => v && setSurfacePrep(v as SurfacePrep)}
                        variant="outline" className="w-full"
                      >
                        {(Object.entries(SURFACE_PREP_OPTIONS) as [SurfacePrep, { label: string; description: string }][]).map(([id, { label, description }]) => (
                          <ToggleGroupItem key={id} value={id}
                            className="flex-1 flex-col h-auto py-2.5 gap-0.5 data-[state=on]:bg-[#820101] data-[state=on]:text-white data-[state=on]:border-[#820101]">
                            <span className="font-semibold text-sm">{label}</span>
                            <span className="text-xs font-normal opacity-70">{description}</span>
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>
                  </div>
                )}

                {/* Anticorrosion-specific options */}
                {selectedService === "anticorrosion" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Тип конструкции</Label>
                      <ToggleGroup
                        type="single" value={anticorrosionType}
                        onValueChange={(v) => v && setAnticorrosionType(v as AnticorrosionType)}
                        variant="outline" className="grid grid-cols-3 gap-2"
                      >
                        {(Object.entries(ANTICORROSION_TYPES) as [AnticorrosionType, { label: string }][]).map(([id, { label }]) => (
                          <ToggleGroupItem key={id} value={id}
                            className="w-full h-auto py-2 whitespace-normal text-center leading-snug data-[state=on]:bg-[#820101] data-[state=on]:text-white data-[state=on]:border-[#820101]">
                            {label}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Подготовка поверхности</Label>
                      <ToggleGroup
                        type="single" value={surfacePrep}
                        onValueChange={(v) => v && setSurfacePrep(v as SurfacePrep)}
                        variant="outline" className="grid grid-cols-3 gap-2"
                      >
                        {(Object.entries(SURFACE_PREP_OPTIONS) as [SurfacePrep, { label: string; description: string }][]).map(([id, { label, description }]) => (
                          <ToggleGroupItem key={id} value={id}
                            className="w-full h-auto py-2.5 flex-col gap-0.5 whitespace-normal text-center data-[state=on]:bg-[#820101] data-[state=on]:text-white data-[state=on]:border-[#820101]">
                            <span className="font-semibold text-sm">{label}</span>
                            <span className="text-xs font-normal opacity-70">{description}</span>
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>
                  </div>
                )}

                {/* Fireproofing-specific options */}
                {selectedService === "fireproofing" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Тип конструкции</Label>
                      <ToggleGroup
                        type="single" value={fireproofingStructureType}
                        onValueChange={(v) => v && setFireproofingStructureType(v as FireproofingStructureType)}
                        variant="outline" className="grid grid-cols-3 gap-2"
                      >
                        {(Object.entries(FIREPROOFING_STRUCTURE_TYPES) as [FireproofingStructureType, { label: string }][]).map(([id, { label }]) => (
                          <ToggleGroupItem key={id} value={id}
                            className="w-full h-auto py-2 whitespace-normal text-center leading-snug data-[state=on]:bg-[#820101] data-[state=on]:text-white data-[state=on]:border-[#820101]">
                            {label}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Подготовка поверхности</Label>
                      <ToggleGroup
                        type="single" value={surfacePrep}
                        onValueChange={(v) => v && setSurfacePrep(v as SurfacePrep)}
                        variant="outline" className="grid grid-cols-3 gap-2"
                      >
                        {(Object.entries(SURFACE_PREP_OPTIONS) as [SurfacePrep, { label: string; description: string }][]).map(([id, { label, description }]) => (
                          <ToggleGroupItem key={id} value={id}
                            className="w-full h-auto py-2.5 flex-col gap-0.5 whitespace-normal text-center data-[state=on]:bg-[#820101] data-[state=on]:text-white data-[state=on]:border-[#820101]">
                            <span className="font-semibold text-sm">{label}</span>
                            <span className="text-xs font-normal opacity-70">{description}</span>
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </div>
                  </div>
                )}

                {/* Hazards — grouped accordion with P0.1 info box */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="font-medium">Усложняющие факторы</Label>
                    {selectedHazards.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: 'rgba(130,1,1,0.1)', color: '#820101' }}>
                        {selectedHazards.length} выбрано
                      </span>
                    )}
                  </div>

                  {/* P0.1 Hazard multiplication info — shown when any hazard is selected */}
                  {selectedHazards.length > 0 && (
                    <div
                      className="p-3 rounded-lg text-xs"
                      style={{ background: 'rgba(130,1,1,0.07)', border: '1px solid rgba(130,1,1,0.2)' }}
                    >
                      <p className="font-semibold mb-1" style={{ color: '#B14141' }}>
                        ℹ️ Как учитываются факторы
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Каждый фактор перемножает стоимость работ по методике MSPRO.
                        При {selectedHazards.length} факт.: итоговый коэф. сложности ×{hazardCoef.toFixed(2)}.
                        Точный множитель подтверждает инженер при осмотре объекта.
                      </p>
                    </div>
                  )}

                  <div className="border rounded-lg overflow-hidden">
                    <Accordion type="multiple" className="w-full">
                      {Object.entries(
                        CALCULATOR_DATA.hazards.reduce<Record<string, typeof CALCULATOR_DATA.hazards>>((acc, h) => {
                          if (!acc[h.group]) acc[h.group] = [];
                          acc[h.group].push(h);
                          return acc;
                        }, {})
                      ).map(([group, factors]) => {
                        const selectedInGroup = factors.filter(f => selectedHazards.includes(f.code)).length;
                        return (
                          <AccordionItem key={group} value={group} className="border-b last:border-b-0">
                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 text-sm font-medium">
                              <span className="flex items-center gap-2">
                                {group}
                                {selectedInGroup > 0 && (
                                  <span className="text-xs px-1.5 py-0.5 rounded-full leading-none"
                                    style={{ background: '#820101', color: '#fff' }}>
                                    {selectedInGroup}
                                  </span>
                                )}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-0">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-4 py-3 bg-muted/10">
                                {factors.map((hazard) => (
                                  <div key={hazard.code} className="flex items-start space-x-2">
                                    <Checkbox
                                      id={hazard.code}
                                      checked={selectedHazards.includes(hazard.code)}
                                      onCheckedChange={() => toggleHazard(hazard.code)}
                                    />
                                    <div className="grid gap-0.5 leading-none">
                                      <Label htmlFor={hazard.code} className="text-sm cursor-pointer leading-tight">
                                        {hazard.description}
                                      </Label>
                                      <span className="text-xs text-muted-foreground">×{hazard.value.toFixed(2)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </div>
                </div>

                {/* Optional surface prep service */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="enable-surface-prep"
                      checked={prepServiceId !== null}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          const svc = SURFACE_PREP_SERVICES[0];
                          setPrepServiceId(svc.id);
                          setPrepMaterialId(svc.materials[0]?.id || "");
                          setPrepGradeId(svc.gradeCoefs?.[0]?.id || "");
                          setPrepWidthId("w999");
                        } else {
                          setPrepServiceId(null);
                        }
                      }}
                    />
                    <Label htmlFor="enable-surface-prep" className="cursor-pointer font-medium">
                      Добавить подготовку поверхности
                    </Label>
                  </div>

                  {prepServiceId && (() => {
                    const prepSvc = SURFACE_PREP_SERVICES.find(s => s.id === prepServiceId);
                    return (
                      <div className="space-y-4 p-4 bg-muted/20 rounded-lg border">
                        <div className="space-y-2">
                          <Label>Вид подготовки</Label>
                          <Select
                            value={prepServiceId}
                            onValueChange={(v) => {
                              const svc = SURFACE_PREP_SERVICES.find(s => s.id === v)!;
                              setPrepServiceId(v);
                              setPrepMaterialId(svc.materials[0]?.id || "");
                              setPrepGradeId(svc.gradeCoefs?.[0]?.id || "");
                              setPrepWidthId("w999");
                            }}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {SURFACE_PREP_SERVICES.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {prepSvc && <p className="text-xs text-muted-foreground">{prepSvc.description}</p>}
                        </div>

                        {prepSvc && prepSvc.materials.length > 1 && (
                          <div className="space-y-2">
                            <Label>Поверхность / способ</Label>
                            <Select value={prepMaterialId} onValueChange={setPrepMaterialId}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {prepSvc.materials.map(m => (
                                  <SelectItem key={m.id} value={m.id}>
                                    {m.label}{m.pricePerSqm > 0 ? ` — ${m.pricePerSqm} ₽/м²` : " — уточняется"}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {prepSvc?.gradeCoefs && prepSvc.gradeCoefs.length > 0 && (
                          <div className="space-y-2">
                            <Label>Степень очистки</Label>
                            <Select value={prepGradeId} onValueChange={setPrepGradeId}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {prepSvc.gradeCoefs.map(g => (
                                  <SelectItem key={g.id} value={g.id}>{g.label} (×{g.coef})</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {prepSvc?.widthCoefs && prepSvc.widthCoefs.length > 0 && (
                          <div className="space-y-2">
                            <Label className="flex items-center gap-1">
                              Ширина элементов
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent className="text-xs max-w-xs">
                                    Коэф. по ширине узких элементов (балки, трубы, профили). Для больших плоских поверхностей — «более 250 мм».
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Select value={prepWidthId} onValueChange={setPrepWidthId}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {ELEMENT_WIDTH_COEFS.map(w => (
                                  <SelectItem key={w.id} value={w.id}>{w.label} (×{w.coef})</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* 6. CTA — P0.7 prefill → /contacts */}
          {calcResult && (
            <Button
              size="lg"
              className="w-full text-base h-12 font-semibold transition-all hover:opacity-90"
              style={{ background: '#820101', color: '#fff', border: 'none' }}
              onClick={handleGetProposal}
            >
              Отправить заявку на эту смету
            </Button>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
