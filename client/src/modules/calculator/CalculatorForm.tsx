import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calculator, Check, ChevronsUpDown, Info } from "lucide-react";
import { trackCalcStart, trackCalcSubmit } from "@/modules/analytics";
import { useLocation } from "wouter";
import { CALCULATOR_DATA, SERVICE_TYPES, COATING_TIER_META, TierId } from "@/lib/calculator-data";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
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
}


export function CalculatorForm() {
  const [location, setLocation] = useLocation();
  const [selectedService, setSelectedService] = useState(SERVICE_TYPES[0].id);
  const [selectedRegion, setSelectedRegion] = useState(CALCULATOR_DATA.regions[0].name);
  const [selectedHazards, setSelectedHazards] = useState<string[]>([]);
  const [selectedTier, setSelectedTier] = useState<TierId>("standard");
  const [openRegion, setOpenRegion] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Form refs for manual inputs
  const formRef = useRef<HTMLFormElement>(null);
  const hasTrackedStart = useRef(false);

  const currentService = useMemo(() =>
    SERVICE_TYPES.find(s => s.id === selectedService) || SERVICE_TYPES[0],
    [selectedService]
  );

  // Reset tier to "standard" when service changes
  useEffect(() => {
    const hasStandard = currentService.coatingTiers.some(t => t.tierId === "standard");
    if (currentService.coatingTiers.length === 0) return;
    setSelectedTier(hasStandard ? "standard" : currentService.coatingTiers[0].tierId);
  }, [currentService.id]); // eslint-disable-line react-hooks/exhaustive-deps


  const handleFormInteraction = () => {
    if (!hasTrackedStart.current) {
      trackCalcStart();
      hasTrackedStart.current = true;
    }
  };

  const toggleHazard = (code: string) => {
    setSelectedHazards(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const handleCalculate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCalculating(true);

    try {
      const formData = new FormData(e.currentTarget);

      // 1. Geometry Calculation
      let userHeight = 0;
      let userDiameter = 0;
      let surfaceArea = 0;

      if (currentService.requiresGeometry) {
        userHeight = parseFloat(formData.get("height") as string) || 0;
        userDiameter = parseFloat(formData.get("diameter") as string) || 0;
        surfaceArea = Math.PI * userDiameter * userHeight;
      } else {
        surfaceArea = parseFloat(formData.get("area") as string) || 0;
      }

      if (surfaceArea <= 0) throw new Error("Некорректная площадь");

      // 2. Labor Cost Calculation
      const regionData = CALCULATOR_DATA.regions.find(r => r.name === selectedRegion);
      const k_reg = regionData ? regionData.value : 1.0;

      const k_hazards = selectedHazards.reduce((acc, code) => {
        const hazard = CALCULATOR_DATA.hazards.find(h => h.code === code);
        return acc * (hazard ? hazard.value : 1.0);
      }, 1.0);

      const laborBaseRate = currentService.baseRate;
      const laborCost = surfaceArea * laborBaseRate * k_reg * k_hazards;

      // 3. Material Cost Calculation (No coefficients applied)
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

      // 4. Total
      const totalCost = laborCost + materialCost;

      const calculationData: CalculationResult = {
        serviceType: currentService.label,
        surfaceArea: parseFloat(surfaceArea.toFixed(2)),
        height: currentService.requiresGeometry ? userHeight : null,
        diameter: currentService.requiresGeometry ? userDiameter : null,
        region: selectedRegion,
        hazards: selectedHazards.map(code => CALCULATOR_DATA.hazards.find(h => h.code === code)?.description || code),
        estimatedCost: parseFloat(totalCost.toFixed(2)),
        costMin: Math.round(totalCost * 0.85),
        costMax: Math.round(totalCost * 1.15),
        // Store breakdown details in result for UI
        laborCost: parseFloat(laborCost.toFixed(2)),
        materialCost: parseFloat(materialCost.toFixed(2)),
        materialName: materialName
      };

      trackCalcSubmit();
      setResult(calculationData);
      hasTrackedStart.current = false;

    } catch (error) {
      console.error("Calculation error:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleGetProposal = () => {
    if (!result) return;
    const details = [
      `Услуга: ${result.serviceType}`,
      `Регион: ${result.region}`,
      `Площадь: ${result.surfaceArea} м²`,
      result.height ? `Высота: ${result.height} м` : null,
      result.materialName ? `Материал: ${result.materialName} (${result.materialCost.toLocaleString('ru-RU')} ₽)` : null,
      `Работа: ${result.laborCost.toLocaleString('ru-RU')} ₽`,
      result.hazards.length > 0 ? `Факторы: ${result.hazards.join(", ")}` : null,
      `Ориентировочная стоимость: ${result.costMin.toLocaleString('ru-RU')} – ${result.costMax.toLocaleString('ru-RU')} ₽ (±15%)`
    ].filter(Boolean).join("\n");

    const params = new URLSearchParams();
    params.set("service", selectedService);
    params.set("details", details);
    setLocation(`/contacts?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Калькулятор стоимости
          </CardTitle>
          <CardDescription>
            Учтем регион, сложность, материалы и объем работ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleCalculate} className="space-y-6" onFocus={handleFormInteraction}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Тип услуги *</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger><SelectValue placeholder="Выберите услугу" /></SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex flex-col">
                <Label className="mb-2">Регион объекта *</Label>
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
                              onSelect={(currentValue) => {
                                setSelectedRegion(currentValue);
                                setOpenRegion(false);
                              }}
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
            </div>

            {/* Coating Type Selector (Dynamic) */}
            {currentService.coatingOptions && currentService.coatingOptions.length > 0 && (
              <div className="space-y-2">
                <Label>Тип покрытия / Материал *</Label>
                <Select value={selectedCoating} onValueChange={setSelectedCoating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите материал" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentService.coatingOptions.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.label} ({opt.price > 0 ? `${opt.price} ₽/м²` : "Включено в базу"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {currentService.requiresGeometry ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="height">Высота трубы (м) *</Label>
                  <Input id="height" name="height" type="number" step="0.1" required placeholder="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diameter">Диаметр трубы (м) *</Label>
                  <Input id="diameter" name="diameter" type="number" step="0.1" required placeholder="2.5" />
                </div>
              </div>
            ) : (
              <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                <Label htmlFor="area">Общая площадь поверхности (м²) *</Label>
                <Input id="area" name="area" type="number" step="1" required placeholder="1000" />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label>Усложняющие факторы (влияют на стоимость работ)</Label>
                {selectedHazards.length > 0 && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {selectedHazards.length} выбрано
                  </span>
                )}
              </div>
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
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30 text-sm font-medium">
                          <span className="flex items-center gap-2">
                            {group}
                            {selectedInGroup > 0 && (
                              <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full leading-none">
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

            <Button type="submit" className="w-full text-lg h-12" disabled={isCalculating}>
              {isCalculating ? "Считаем..." : "Рассчитать стоимость"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Card className="border-primary/50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
          <CardHeader>
            <CardTitle>Итоговый расчет</CardTitle>
            <CardDescription>
              Регион: <span className="font-semibold text-primary">{result.region}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Площадь</p>
                <p className="text-xl font-semibold">{result.surfaceArea} м²</p>
              </div>

              <div className="bg-muted p-3 rounded-md flex flex-col justify-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Услуга</p>
                <p className="text-xs font-medium leading-tight line-clamp-2" title={result.serviceType}>{result.serviceType}</p>
              </div>

              {/* Region or Height Box */}
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Регион (Работа)</p>
                <p className="text-xl font-semibold">x{(CALCULATOR_DATA.regions.find(r => r.name === result.region)?.value || 1).toFixed(2)}</p>
              </div>

              <div className="bg-muted p-3 rounded-md">
                <div className="flex items-center gap-1 mb-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Сложность (Работа)</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground cursor-help shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-xs">
                        Коэффициенты перемножаются по методике компании. Итоговый множитель уточнит инженер.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {/* Back-calculate labor complexity factor for display */}
                <p className="text-xl font-semibold">×{((result.laborCost / (result.surfaceArea * currentService.baseRate * (CALCULATOR_DATA.regions.find(r => r.name === result.region)?.value || 1))) || 1.0).toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              {/* Labor Line */}
              <div className="flex justify-between items-baseline pb-2">
                <span className="text-muted-foreground">Стоимость работ (База: {currentService.baseRate} ₽/м²)</span>
                <span className="font-mono font-semibold">{result.laborCost?.toLocaleString()} ₽</span>
              </div>

              {/* Material Line */}
              {result.materialName && (
                <div className="flex justify-between items-baseline pb-2">
                  <span className="text-muted-foreground">Материалы: {result.materialName}</span>
                  <span className="font-mono font-semibold">{result.materialCost?.toLocaleString()} ₽</span>
                </div>
              )}

              {result.hazards.length > 0 && (
                <div className="text-sm text-muted-foreground mt-2 border-t pt-2 border-dashed">
                  <p className="mb-1 font-medium">Учтенные факторы:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1">
                    {result.hazards.map(h => <li key={h}>{h}</li>)}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-col items-center gap-4 bg-accent/5 p-4 rounded-lg mt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Ориентировочная стоимость под ключ</p>
                <p className="text-3xl font-extrabold text-primary">
                  {result.costMin.toLocaleString('ru-RU')} – {result.costMax.toLocaleString('ru-RU')} ₽
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">±15%</span>
                  <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">уточнит инженер</span>
                </div>
              </div>

              <Button size="lg" className="w-full md:w-auto px-8 animate-pulse hover:animate-none" onClick={handleGetProposal}>
                Отправить заявку на эту смету
              </Button>
              <p className="text-xs text-muted-foreground text-center max-w-sm">
                * Вилка ±15% от базового расчёта. Точную стоимость подтвердит инженер после осмотра объекта.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
