import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">ООО «МСПРО»</h3>
            <p className="text-sm text-muted-foreground">
              Промышленный альпинизм для нанесения огнезащиты (ОГЗ) и антикоррозионной защиты (АКЗ) металлоконструкций на высоте.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Услуги</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/pokraska-dymovoj-truby"
                  className="text-muted-foreground hover:text-primary transition-colors" 
                  data-testid="footer-link-painting"
                >
                  Покраска дымовых труб
                </Link>
              </li>
              <li>
                <Link 
                  href="/antikorrozionnaya-zashchita"
                  className="text-muted-foreground hover:text-primary transition-colors" 
                  data-testid="footer-link-anticorrosion"
                >
                  Антикоррозионная защита
                </Link>
              </li>
              <li>
                <Link 
                  href="/mspro-quad"
                  className="text-muted-foreground hover:text-primary transition-colors" 
                  data-testid="footer-link-msproquad"
                >
                  MSPRO Quad покрытие
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Компания</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors" 
                  data-testid="footer-link-about"
                >
                  О компании
                </Link>
              </li>
              <li>
                <Link 
                  href="/calculator"
                  className="text-muted-foreground hover:text-primary transition-colors" 
                  data-testid="footer-link-calculator"
                >
                  Калькулятор стоимости
                </Link>
              </li>
              <li>
                <Link 
                  href="/contacts"
                  className="text-muted-foreground hover:text-primary transition-colors" 
                  data-testid="footer-link-contacts"
                >
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Контакты</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li data-testid="footer-phone">
                Тел: <a href="tel:+79879092938" className="hover:text-primary transition-colors">+7 (987) 909-29-38</a>
              </li>
              <li data-testid="footer-email">
                Email: <a href="mailto:info@mspro-ltd.ru" className="hover:text-primary transition-colors">info@mspro-ltd.ru</a>
              </li>
              <li data-testid="footer-address">
                443091, г. Самара, пр. Кирова, д. 275, оф. 29
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground" data-testid="footer-copyright">
            © {currentYear} ООО «МЕТАЛИУМ СИСТЕМ ПРОТЕКТ» (МСПРО). Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
