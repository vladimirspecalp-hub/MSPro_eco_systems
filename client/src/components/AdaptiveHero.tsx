import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, FileText, Shield, ArrowRight } from "lucide-react";
import { HERO_VARIANTS, getHeroVariant, TRUST_BLOCKS, type IntentType } from "@/content/copySystem";

interface AdaptiveHeroProps {
  overrideIntent?: IntentType;
}

function getIntentFromUrl(): IntentType {
  if (typeof window === "undefined") return "default";

  const params = new URLSearchParams(window.location.search);
  const intent = params.get("intent") as IntentType | null;
  const utmTerm = params.get("utm_term");

  if (intent && intent in HERO_VARIANTS) {
    return intent;
  }

  if (utmTerm) {
    const lowerTerm = utmTerm.toLowerCase();
    if (lowerTerm.includes("цена") || lowerTerm.includes("стоимость")) return "price";
    if (lowerTerm.includes("срочно") || lowerTerm.includes("быстро")) return "urgent";
    if (lowerTerm.includes("безопасност") || lowerTerm.includes("ппр")) return "safety";
    if (lowerTerm.includes("лэп") || lowerTerm.includes("опора")) return "lep";
    if (lowerTerm.includes("амс") || lowerTerm.includes("вышка")) return "ams";
    if (lowerTerm.includes("труб") || lowerTerm.includes("дымов")) return "stack";
    if (lowerTerm.includes("под ключ") || lowerTerm.includes("комплекс")) return "single";
  }

  return "default";
}

function getSecondaryCTARoute(label: string): string {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes("лицензи") || lowerLabel.includes("сро") || lowerLabel.includes("документ") || lowerLabel.includes("допуск")) {
    return "/documents";
  }
  if (lowerLabel.includes("калькулятор") || lowerLabel.includes("расчёт") || lowerLabel.includes("чек-лист")) {
    return "/calculator";
  }
  return "/contacts";
}

export function AdaptiveHero({ overrideIntent }: AdaptiveHeroProps) {
  const intent = overrideIntent || getIntentFromUrl();
  const variant = getHeroVariant(intent);
  const secondaryRoute = getSecondaryCTARoute(variant.ctaSecondaryLabel);

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero-bg.jpg"
          alt="Industrial Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium" data-testid="badge-mspro">
            <Shield className="h-4 w-4" />
            MS-PRO Промышленный альпинизм
          </div>

          <h1
            className="text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl"
            data-testid="text-hero-h1"
          >
            {variant.h1}
          </h1>

          <p
            className="mt-6 text-lg leading-8 text-gray-300 sm:text-xl"
            data-testid="text-hero-subhead"
          >
            {variant.subhead}
          </p>

          <ul className="mt-8 space-y-3 text-left sm:mx-auto sm:max-w-2xl" data-testid="list-hero-bullets">
            {variant.bullets.map((bullet, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="mt-1 h-5 w-5 flex-shrink-0 text-white" />
                <span className="text-gray-300">{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div className="flex flex-col items-center">
              <Link href="/calculator">
                <Button size="lg" className="gap-2 h-12 px-8" data-testid="button-hero-primary-cta">
                  {variant.ctaLabel}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              {variant.ctaMicrocopy && (
                <p className="mt-2 text-sm text-gray-400" data-testid="text-hero-primary-microcopy">
                  {variant.ctaMicrocopy}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center">
              <Link href={secondaryRoute}>
                <Button variant="outline" size="lg" className="gap-2 h-12 px-8 border-white/20 text-white hover:bg-white/10 hover:text-white" data-testid="button-hero-secondary-cta">
                  <FileText className="h-5 w-5" />
                  {variant.ctaSecondaryLabel}
                </Button>
              </Link>
              {variant.ctaSecondaryMicrocopy && (
                <p className="mt-2 text-sm text-gray-400" data-testid="text-hero-secondary-microcopy">
                  {variant.ctaSecondaryMicrocopy}
                </p>
              )}
            </div>
          </div>

          <div className="mt-12 rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-gray-400" data-testid="block-hero-trust">
            <p>{TRUST_BLOCKS.verified}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
