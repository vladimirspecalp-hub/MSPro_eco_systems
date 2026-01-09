import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Droplets, Shield, Zap } from "lucide-react";

export function ProductInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>MSPRO Quad - Инновационное огнезащитное покрытие</CardTitle>
          <CardDescription>
            Четырехкомпонентная система защиты промышленных объектов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            MSPRO Quad — это передовая технология огнезащиты металлоконструкций, 
            разработанная специально для промышленных объектов. Покрытие обеспечивает 
            комплексную защиту от огня, коррозии и агрессивных сред на срок до 20 лет.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">Преимущества</TabsTrigger>
          <TabsTrigger value="technical">Характеристики</TabsTrigger>
          <TabsTrigger value="application">Применение</TabsTrigger>
          <TabsTrigger value="warranty">Гарантия</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Flame className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Огнестойкость до 150 минут</h4>
                    <p className="text-sm text-muted-foreground">
                      Предел огнестойкости R150 согласно ГОСТ 30247
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Антикоррозионная защита</h4>
                    <p className="text-sm text-muted-foreground">
                      Эффективная защита от коррозии в агрессивных средах
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Droplets className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Влагостойкость</h4>
                    <p className="text-sm text-muted-foreground">
                      Устойчивость к атмосферным осадкам и влажности
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Zap className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Быстрое нанесение</h4>
                    <p className="text-sm text-muted-foreground">
                      Механизированное напыление, минимальные сроки выполнения
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <dl className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-semibold">Предел огнестойкости</dt>
                  <dd className="text-muted-foreground">R150 (150 минут)</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-semibold">Температурный диапазон</dt>
                  <dd className="text-muted-foreground">от -50°C до +150°C</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-semibold">Толщина покрытия</dt>
                  <dd className="text-muted-foreground">3-5 мм (стандарт)</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-semibold">Расход материала</dt>
                  <dd className="text-muted-foreground">4-6 кг/м²</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <dt className="font-semibold">Срок эксплуатации</dt>
                  <dd className="text-muted-foreground">20+ лет</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-semibold">Экологичность</dt>
                  <dd className="text-muted-foreground">Класс A+ (без токсичных компонентов)</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="application" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-4">Объекты применения:</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Металлоконструкции промышленных зданий</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Дымовые трубы и вентиляционные системы</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Нефтегазовое оборудование</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Резервуары и трубопроводы</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Эвакуационные пути и системы безопасности</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Торговые и логистические центры</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warranty" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Гарантия производителя: 20 лет</h4>
                  <p className="text-sm text-muted-foreground">
                    Официальная гарантия на огнезащитные свойства и сохранение 
                    технических характеристик покрытия.
                  </p>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg space-y-2">
                  <p className="font-semibold">Гарантия включает:</p>
                  <ul className="text-sm space-y-1">
                    <li>✓ Огнезащитные свойства (R150)</li>
                    <li>✓ Антикоррозионная защита</li>
                    <li>✓ Адгезия к основанию</li>
                    <li>✓ Устойчивость к атмосферным воздействиям</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Все работы выполняются сертифицированными специалистами 
                    с применением оригинальных материалов. По завершении работ 
                    предоставляется полный пакет документов и акт выполненных работ.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
