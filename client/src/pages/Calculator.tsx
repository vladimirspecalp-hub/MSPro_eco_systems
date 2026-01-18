import { CalculatorForm } from "@/modules/calculator/CalculatorForm";

export default function Calculator() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-calculator-heading">
            Калькулятор стоимости
          </h1>
          <p className="mt-4 text-lg text-muted-foreground" data-testid="text-calculator-description">
            Рассчитайте предварительную стоимость работ с учетом региона и сложности
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <CalculatorForm />
        </div>
      </div>
    </div>
  );
}

