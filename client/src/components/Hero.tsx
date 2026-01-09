import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  primaryCta: {
    text: string;
    href: string;
    microcopy?: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
  trustText?: string;
}

export function Hero({ title, subtitle, description, primaryCta, secondaryCta, backgroundImage, trustText }: HeroProps) {
  return (
    <div className="relative isolate overflow-hidden">
      {backgroundImage && (
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/75" />
          <img
            src={backgroundImage}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}
      
      <div className="mx-auto max-w-7xl px-4 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent" data-testid="text-hero-subtitle">
            {subtitle}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" data-testid="text-hero-title">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground" data-testid="text-hero-description">
            {description}
          </p>
          <div className="mt-10 flex flex-col gap-y-3">
            <div className="flex items-center gap-x-6 flex-wrap gap-y-4">
              <Link href={primaryCta.href}>
                <Button size="lg" data-testid="button-hero-primary">
                  {primaryCta.text}
                </Button>
              </Link>
              {secondaryCta && (
                <Link href={secondaryCta.href}>
                  <Button variant="outline" size="lg" data-testid="button-hero-secondary">
                    {secondaryCta.text}
                  </Button>
                </Link>
              )}
            </div>
            {primaryCta.microcopy && (
              <p className="text-sm text-muted-foreground" data-testid="text-hero-microcopy">
                {primaryCta.microcopy}
              </p>
            )}
          </div>
          
          {trustText && (
            <p className="mt-6 text-sm text-muted-foreground border-l-2 border-accent pl-4" data-testid="text-hero-trust">
              {trustText}
            </p>
          )}
          
          <div className="mt-10 flex items-center gap-x-6 text-sm">
            <div className="flex items-center gap-x-2" data-testid="text-hero-stat-1">
              <span className="font-semibold text-primary">20+ лет</span>
              <span className="text-muted-foreground">опыта</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-x-2" data-testid="text-hero-stat-2">
              <span className="font-semibold text-primary">500+</span>
              <span className="text-muted-foreground">объектов</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-x-2" data-testid="text-hero-stat-3">
              <span className="font-semibold text-accent">Гарантия</span>
              <span className="text-muted-foreground">качества</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
