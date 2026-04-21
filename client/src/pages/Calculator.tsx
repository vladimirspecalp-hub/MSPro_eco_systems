import { CalculatorForm } from "@/modules/calculator/CalculatorForm";

export default function Calculator() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image as Background */}
      <div className="relative isolate min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/calculator-hero.jpg"
            alt="Industrial Background"
            className="w-full h-full object-cover filter grayscale contrast-125 opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/40 to-background z-10" />
        </div>

        {/* Content Container */}
        <div className="relative z-20 mx-auto max-w-4xl px-4 lg:px-8 py-12 w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground mb-4" data-testid="text-calculator-heading">
              Примерный расчет <span className="text-primary">стоимости</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-calculator-description">
              Прозрачная смета на промышленные работы за 60 секунд.
            </p>
          </div>

          <div className="bg-card/40 backdrop-blur-xl border border-white/10 shadow-2xl p-6 sm:p-10 rounded-3xl">
            <CalculatorForm />
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-xs font-mono uppercase tracking-[0.2em]">
              Industrial Safety & Quality Standards • 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

