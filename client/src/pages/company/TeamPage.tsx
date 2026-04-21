import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, HardHat, Award, ShieldCheck } from 'lucide-react';

const TeamPage = () => {
    const leadership = [
        {
            name: "Алексей Смирнов",
            role: "Генеральный директор",
            bio: "15 лет опыта в промышленном строительстве и управлении проектами. Руководит стратегическим развитием компании и ключевыми партнерствами.",
            icon: Building2
        },
        {
            name: "Дмитрий Иванов",
            role: "Технический директор",
            bio: "Эксперт в области АКЗ и огнезащиты. Разработчик технических регламентов и технологии нанесения MSPRO Quad.",
            icon: ShieldCheck
        }
    ];

    const specialists = [
        {
            name: "Сергей Петров",
            role: "Начальник участка (Север)",
            bio: "Специалист по работе в условиях Крайнего Севера. Руководил проектами в Норильске и Певеке.",
            icon: HardHat
        },
        {
            name: "Андрей Сидоров",
            role: "Главный инженер проектов",
            bio: "Аттестованный специалист NACE/FROSIO. Контроль качества подготовки поверхности и нанесения покрытий.",
            icon: Award
        },
        {
            name: "Максим Волков",
            role: "Бригадир альпинистов",
            bio: "Альпинист 3-й группы допуска. Опыт работы на высоте более 150 метров (дымовые трубы, мачты).",
            icon: HardHat
        },
        {
            name: "Команда ИТР",
            role: "Инженерно-технический состав",
            bio: "В штате компании 12 аттестованных инженеров, готовых к командировкам в любую точку России.",
            icon: Building2
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Команда MS-PRO | Руководство и специалисты</title>
                <meta name="description" content="Познакомьтесь с командой MS-PRO. Квалифицированные инженеры, промышленные альпинисты и эксперты по АКЗ. Опыт работы по всей России." />
                <link rel="canonical" href="https://mspro-ltd.ru/company/team" />
            </Helmet>

            <main className="container mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Наша Команда</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Профессионалы, которые обеспечивают безопасность и долговечность ваших промышленных объектов.
                    </p>
                </div>

                {/* Leadership Section */}
                <section className="mb-20">
                    <h2 className="text-2xl font-semibold mb-8 border-l-4 border-primary pl-4">Руководство</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {leadership.map((person, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow bg-card/50 backdrop-blur">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarFallback className="bg-primary/10">
                                            <person.icon className="h-8 w-8 text-primary" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle>{person.name}</CardTitle>
                                        <CardDescription className="text-base font-medium text-primary">
                                            {person.role}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{person.bio}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Specialists Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-8 border-l-4 border-primary pl-4">Ключевые специалисты</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {specialists.map((person, index) => (
                            <Card key={index} className="hover:border-primary/50 transition-colors">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback>
                                            <person.icon className="h-6 w-6 text-muted-foreground" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">{person.name}</CardTitle>
                                        <CardDescription>{person.role}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{person.bio}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mt-20 text-center bg-primary/5 rounded-2xl p-8 lg:p-12">
                    <h2 className="text-2xl font-bold mb-4">Хотите присоединиться к нам?</h2>
                    <p className="mb-8 text-muted-foreground">
                        Мы всегда ищем талантливых промышленных альпинистов и инженеров.
                    </p>
                    <a href="/contacts" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                        Связаться с нами
                    </a>
                </section>
            </main>
        </div>
    );
};

export default TeamPage;
