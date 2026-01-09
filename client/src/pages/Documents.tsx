import { useEffect } from "react";
import { FileText, Download, ExternalLink, Shield, Building2, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CREDENTIALS } from "@/content/copySystem";

export default function Documents() {
  useEffect(() => {
    document.title = "Документы и допуски MSPRO | Лицензия МЧС, СРО строительство, СРО проектирование";
  }, []);
  const credentials = [
    {
      icon: Shield,
      title: CREDENTIALS.mchs.name,
      number: CREDENTIALS.mchs.number,
      fullNumber: CREDENTIALS.mchs.fullNumber,
      date: `Дата предоставления: ${CREDENTIALS.mchs.date}`,
      description: "Лицензия на деятельность по монтажу, техническому обслуживанию и ремонту средств обеспечения пожарной безопасности зданий и сооружений.",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      pdfUrl: "/documents/license-mchs.pdf",
    },
    {
      icon: Building2,
      title: CREDENTIALS.sroConstruction.name,
      number: `Член №${CREDENTIALS.sroConstruction.memberNumber}`,
      fullNumber: CREDENTIALS.sroConstruction.sroNumber,
      date: `Дата регистрации: ${CREDENTIALS.sroConstruction.date}`,
      description: `${CREDENTIALS.sroConstruction.association}. Допуск к строительным работам.`,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      pdfUrl: "/documents/sro-construction.pdf",
    },
    {
      icon: Ruler,
      title: CREDENTIALS.sroDesign.name,
      number: `Член №${CREDENTIALS.sroDesign.memberNumber}`,
      fullNumber: CREDENTIALS.sroDesign.sroNumber,
      date: `Дата регистрации: ${CREDENTIALS.sroDesign.date}`,
      description: "Допуск к работам по подготовке проектной документации.",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      pdfUrl: "/documents/sro-design.pdf",
    },
  ];

  return (
    <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-documents-h1">
              Документы и допуски MSPRO
            </h1>
            <p className="mt-4 text-lg text-muted-foreground" data-testid="text-documents-description">
              Скан/выписка размещены для проверки контрагентами. Актуальные данные можно проверить в реестрах.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-1 lg:grid-cols-3">
            {credentials.map((cred, index) => (
              <Card key={index} className="relative overflow-hidden" data-testid={`card-credential-${index}`}>
                <CardHeader>
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${cred.bgColor}`}>
                    <cred.icon className={`h-6 w-6 ${cred.color}`} />
                  </div>
                  <CardTitle className="text-xl">{cred.title}</CardTitle>
                  <CardDescription className="space-y-1">
                    <span className="block font-medium text-foreground">{cred.number}</span>
                    <span className="block text-sm">{cred.fullNumber}</span>
                    <span className="block text-sm">{cred.date}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-6 text-sm text-muted-foreground">{cred.description}</p>
                  <div className="flex flex-col gap-2">
                    <a href={cred.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full gap-2" data-testid={`button-view-${index}`}>
                        <ExternalLink className="h-4 w-4" />
                        Смотреть выписку
                      </Button>
                    </a>
                    <a href={cred.pdfUrl} download>
                      <Button variant="ghost" size="sm" className="w-full gap-2" data-testid={`button-download-${index}`}>
                        <Download className="h-4 w-4" />
                        Скачать PDF
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-3xl rounded-lg border bg-card p-6 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold" data-testid="text-request-docs-heading">
              Нужен полный пакет документов к КП?
            </h2>
            <p className="mt-2 text-muted-foreground">
              По запросу прикладываем сканы лицензий, выписки СРО, удостоверения персонала и перечень ИД на сдачу работ.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="/documents/company-card.pdf" download>
                <Button variant="outline" className="gap-2" data-testid="button-download-company-card">
                  <Download className="h-4 w-4" />
                  Скачать карту предприятия (PDF)
                </Button>
              </a>
              <Button data-testid="button-request-docs">
                Запросить документы
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
}
