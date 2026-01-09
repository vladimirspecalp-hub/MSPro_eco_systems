import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Shield, CheckCircle2 } from "lucide-react";

export function Certificate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Сертификация MSPRO Quad
        </CardTitle>
        <CardDescription>
          Огнезащитное покрытие с международными сертификатами
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold">Сертификат пожарной безопасности</p>
              <p className="text-sm text-muted-foreground">
                Соответствует ГОСТ Р 53295-2009
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold">Экологическая безопасность</p>
              <p className="text-sm text-muted-foreground">
                Разрешено для использования в жилых зонах
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold">Европейский сертификат EN 13501-1</p>
              <p className="text-sm text-muted-foreground">
                Класс пожарной опасности A1
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-primary" />
            <p className="font-semibold">Гарантии качества</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Гарантия 20 лет</Badge>
            <Badge variant="secondary">Антикоррозионная защита</Badge>
            <Badge variant="secondary">Огнестойкость до 150 мин</Badge>
            <Badge variant="secondary">-50°C до +150°C</Badge>
          </div>
        </div>

        <div className="bg-accent/10 p-4 rounded-lg">
          <p className="text-sm">
            <strong>Примечание:</strong> Все сертификаты предоставляются заказчику 
            вместе с актом выполненных работ. Доступны для скачивания по запросу.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
