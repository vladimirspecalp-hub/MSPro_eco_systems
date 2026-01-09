import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { trackCalcStart, trackCalcSubmit } from "@/modules/analytics";

interface CalculationResult {
  serviceType: string;
  surfaceArea: number;
  height: number;
  estimatedCost: number;
}

export function CalculatorForm() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const hasTrackedStart = useRef(false);

  const handleFormInteraction = () => {
    if (!hasTrackedStart.current) {
      trackCalcStart();
      hasTrackedStart.current = true;
    }
  };

  const handleCalculate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCalculating(true);

    try {
      const formData = new FormData(e.currentTarget);
      const serviceType = formData.get("serviceType") as string;
      const height = parseFloat(formData.get("height") as string);
      const diameter = parseFloat(formData.get("diameter") as string);

      const surfaceArea = Math.PI * diameter * height;
      const baseCost = serviceType === "chimney_painting" ? 500 : 
                       serviceType === "anticorrosion" ? 700 : 1200;
      const estimatedCost = surfaceArea * baseCost;

      const calculationData = {
        serviceType,
        height: height.toString(),
        diameter: diameter.toString(),
        surfaceArea: surfaceArea.toFixed(2),
        coatingType: formData.get("coatingType") || null,
        estimatedCost: estimatedCost.toFixed(2)
      };

      const response = await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(calculationData)
      });

      if (response.ok) {
        trackCalcSubmit();
        setResult({
          serviceType,
          surfaceArea: parseFloat(surfaceArea.toFixed(2)),
          height,
          estimatedCost: parseFloat(estimatedCost.toFixed(2))
        });
        hasTrackedStart.current = false;
      }
    } catch (error) {
      console.error("Calculation error:", error);
    } finally {
      setIsCalculating(false);
    }
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
            Рассчитайте примерную стоимость работ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCalculate} className="space-y-6" onFocus={handleFormInteraction}>
            <div className="space-y-2">
              <Label htmlFor="serviceType">Тип услуги *</Label>
              <Select name="serviceType" required>
                <SelectTrigger data-testid="select-service-type">
                  <SelectValue placeholder="Выберите услугу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chimney_painting">Покраска дымовых труб</SelectItem>
                  <SelectItem value="anticorrosion">Антикоррозионная защита</SelectItem>
                  <SelectItem value="mspro_quad">MSPRO Quad покрытие</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Высота (м) *</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  step="0.1"
                  required
                  placeholder="30"
                  data-testid="input-height"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diameter">Диаметр (м) *</Label>
                <Input
                  id="diameter"
                  name="diameter"
                  type="number"
                  step="0.1"
                  required
                  placeholder="2.5"
                  data-testid="input-diameter"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coatingType">Тип покрытия (опционально)</Label>
              <Select name="coatingType">
                <SelectTrigger data-testid="select-coating">
                  <SelectValue placeholder="Выберите покрытие" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Стандартное</SelectItem>
                  <SelectItem value="premium">Премиум</SelectItem>
                  <SelectItem value="fireproof">Огнезащитное</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isCalculating}
              data-testid="button-calculate"
            >
              {isCalculating ? "Расчёт..." : "Рассчитать стоимость"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Результат расчёта</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Площадь поверхности</p>
                <p className="text-2xl font-bold" data-testid="text-surface-area">
                  {result.surfaceArea} м²
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Высота</p>
                <p className="text-2xl font-bold" data-testid="text-height">
                  {result.height} м
                </p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">Примерная стоимость</p>
              <p className="text-3xl font-bold text-primary" data-testid="text-estimated-cost">
                {result.estimatedCost.toLocaleString('ru-RU')} ₽
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                * Точная стоимость определяется после выезда специалиста
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
