import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator as CalculatorIcon, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const calculatorSchema = z.object({
  serviceType: z.string().min(1, "Выберите тип услуги"),
  height: z.string().min(1, "Укажите высоту").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Высота должна быть положительным числом",
  }),
  diameter: z.string().optional(),
  surfaceArea: z.string().min(1, "Укажите площадь").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Площадь должна быть положительным числом",
  }),
  coatingType: z.string().min(1, "Выберите тип покрытия"),
});

type CalculatorFormData = z.infer<typeof calculatorSchema>;

interface CalculationResult {
  basePrice: number;
  materialCost: number;
  laborCost: number;
  totalCost: number;
  breakdown: {
    label: string;
    amount: number;
  }[];
}

export default function Calculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      serviceType: "",
      height: "",
      diameter: "",
      surfaceArea: "",
      coatingType: "",
    },
  });

  const calculateCost = (data: CalculatorFormData): CalculationResult => {
    const height = Number(data.height);
    const surfaceArea = Number(data.surfaceArea);
    
    let baseRatePerSqm = 500;
    let materialMultiplier = 1;
    let complexityMultiplier = 1;

    if (data.serviceType === "chimney-painting") {
      baseRatePerSqm = 600;
      if (data.coatingType === "premium") materialMultiplier = 1.5;
      if (data.coatingType === "fireproof") materialMultiplier = 2;
    } else if (data.serviceType === "anti-corrosion") {
      baseRatePerSqm = 550;
      if (data.coatingType === "premium") materialMultiplier = 1.6;
      if (data.coatingType === "epoxy") materialMultiplier = 1.8;
    } else if (data.serviceType === "mspro-quad") {
      baseRatePerSqm = 800;
      materialMultiplier = 1.3;
    }

    if (height > 50) complexityMultiplier = 1.3;
    else if (height > 30) complexityMultiplier = 1.2;
    else if (height > 15) complexityMultiplier = 1.1;

    const materialCost = surfaceArea * baseRatePerSqm * materialMultiplier;
    const laborCost = surfaceArea * 400 * complexityMultiplier;
    const totalCost = materialCost + laborCost;

    return {
      basePrice: baseRatePerSqm,
      materialCost,
      laborCost,
      totalCost,
      breakdown: [
        { label: "Материалы", amount: materialCost },
        { label: "Работа", amount: laborCost },
      ],
    };
  };

  const onSubmit = (data: CalculatorFormData) => {
    const calculationResult = calculateCost(data);
    setResult(calculationResult);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-calculator-heading">
            Калькулятор стоимости
          </h1>
          <p className="mt-4 text-lg text-muted-foreground" data-testid="text-calculator-description">
            Рассчитайте предварительную стоимость работ
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalculatorIcon className="h-5 w-5" />
                Параметры проекта
              </CardTitle>
              <CardDescription>
                Введите данные для расчета стоимости
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип услуги *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-calc-service-type">
                              <SelectValue placeholder="Выберите услугу" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="chimney-painting" data-testid="option-calc-chimney">
                              Покраска дымовых труб
                            </SelectItem>
                            <SelectItem value="anti-corrosion" data-testid="option-calc-anticorrosion">
                              Антикоррозионная защита
                            </SelectItem>
                            <SelectItem value="mspro-quad" data-testid="option-calc-msproquad">
                              MSPRO Quad покрытие
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Высота (м) *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="30" {...field} data-testid="input-calc-height" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="diameter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Диаметр (м)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="2.5" {...field} data-testid="input-calc-diameter" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="surfaceArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Площадь поверхности (м²) *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="150" {...field} data-testid="input-calc-area" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coatingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип покрытия *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-calc-coating">
                              <SelectValue placeholder="Выберите покрытие" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard" data-testid="option-coating-standard">
                              Стандартное
                            </SelectItem>
                            <SelectItem value="premium" data-testid="option-coating-premium">
                              Премиум
                            </SelectItem>
                            <SelectItem value="fireproof" data-testid="option-coating-fireproof">
                              Огнезащитное
                            </SelectItem>
                            <SelectItem value="epoxy" data-testid="option-coating-epoxy">
                              Эпоксидное
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" data-testid="button-calculate">
                    Рассчитать стоимость
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {result ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Результат расчета</CardTitle>
                    <CardDescription>
                      Предварительная стоимость проекта
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.breakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-center" data-testid={`result-breakdown-${index}`}>
                        <span className="text-muted-foreground">{item.label}:</span>
                        <span className="font-semibold">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Итого:</span>
                        <span className="text-2xl font-bold text-primary" data-testid="text-total-cost">
                          {formatCurrency(result.totalCost)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      * Окончательная стоимость определяется после осмотра объекта
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-accent/10 border-accent">
                  <CardContent className="pt-6">
                    <p className="font-semibold mb-4">Получить точный расчет</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Оставьте заявку и наш инженер произведет детальный расчет с учетом всех особенностей объекта
                    </p>
                    <Link href="/contacts">
                      <Button className="w-full" data-testid="button-request-quote">
                        Получить коммерческое предложение
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <CalculatorIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Заполните форму для расчета стоимости</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
