import { Shield, Users, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="flex flex-col">
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" data-testid="text-about-heading">
              О компании MS-PRO Ecosystems
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground" data-testid="text-about-description">
              Мы специализируемся на промышленных высотных работах, покраске дымовых труб, 
              антикоррозионной защите и инновационных огнезащитных покрытиях MSPRO Quad.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              <div className="flex flex-col" data-testid="feature-experience">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7">
                  <Award className="h-6 w-6 text-primary" />
                  Опыт и экспертиза
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Более 20 лет успешной работы в сфере промышленных услуг. 
                    Наша команда состоит из высококвалифицированных специалистов.
                  </p>
                </dd>
              </div>

              <div className="flex flex-col" data-testid="feature-quality">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7">
                  <Shield className="h-6 w-6 text-primary" />
                  Гарантия качества
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Предоставляем официальную гарантию на все виды работ до 20 лет. 
                    Используем только сертифицированные материалы.
                  </p>
                </dd>
              </div>

              <div className="flex flex-col" data-testid="feature-team">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7">
                  <Users className="h-6 w-6 text-primary" />
                  Профессиональная команда
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Штат опытных промышленных альпинистов и инженеров. 
                    Регулярное обучение и повышение квалификации.
                  </p>
                </dd>
              </div>

              <div className="flex flex-col" data-testid="feature-projects">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Реализованные проекты
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Более 500 успешно завершенных объектов по всей России. 
                    Работаем с крупнейшими промышленными предприятиями.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-accent/10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-cta-heading">
              Готовы обсудить ваш проект?
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground" data-testid="text-cta-description">
              Свяжитесь с нами для получения бесплатной консультации и расчета стоимости
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link href="/contacts">
                <Button size="lg" data-testid="button-contact">
                  Связаться с нами
                </Button>
              </Link>
              <Link href="/calculator">
                <Button variant="outline" size="lg" data-testid="button-calculator">
                  Рассчитать стоимость
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
