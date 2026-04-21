import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LiveLogo } from "./LiveLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const servicesSubmenu = [
  { name: "Высотные работы", href: "/services/rope-access" },
  { name: "ОГЗ на высоте", href: "/services/fireproofing-at-height" },
  { name: "АКЗ на высоте", href: "/services/anticorrosion-at-height" },
  { name: "Санация потолков", href: "/services/ceiling-sanation" },
  { name: "Демонтаж на высоте", href: "/services/demolition" },
];

const navigation = [
  // "Главная" removed (logo is home)
  // "Документы" removed (duplicated by button)
  { name: "Калькулятор", href: "/calculator" },
  { name: "Новости", href: "/news" },
  { name: "Контакты", href: "/contacts" },
];

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isServicesActive = location.startsWith("/services");

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Changed max-w-7xl to max-w-6xl to bring logo closer to center (move right) */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:hidden">
          <Link href="/" className="-m-1.5 p-1.5" data-testid="link-home-mobile">
            <LiveLogo />
          </Link>
        </div>

        <div className="flex gap-2 lg:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </Button>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-10">
          <Link href="/" className="-m-1.5 p-1.5" data-testid="link-home">
            <LiveLogo />
          </Link>

          <div className="flex lg:gap-x-8 items-center border-l pl-10 border-border/50">
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-1 text-sm font-semibold leading-6 transition-colors hover:text-primary ${isServicesActive ? "text-primary" : "text-foreground"
                }`} data-testid="dropdown-услуги">
                Услуги <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {servicesSubmenu.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link href={item.href} className="cursor-pointer" data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold leading-6 transition-colors hover:text-primary ${location === item.href ? "text-primary" : "text-foreground"
                  }`}
                data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/documents">
              <Button variant="outline" size="sm" data-testid="button-view-docs">
                Смотреть документы
              </Button>
            </Link>
            <Link href="/calculator">
              <Button data-testid="button-get-quote">
                Запросить расчёт
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block rounded-md px-3 py-2 text-base font-medium ${location === "/"
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted"
                }`}
              data-testid="mobile-link-главная"
            >
              Главная
            </Link>

            <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">Услуги</div>
            {servicesSubmenu.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-md px-6 py-2 text-base font-medium ${location === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
                  }`}
                data-testid={`mobile-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.name}
              </Link>
            ))}

            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium ${location === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
                  }`}
                data-testid={`mobile-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Link href="/documents" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full" data-testid="mobile-button-docs">
                  Смотреть документы
                </Button>
              </Link>
              <Link href="/calculator" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full" data-testid="mobile-button-get-quote">
                  Запросить расчёт
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
