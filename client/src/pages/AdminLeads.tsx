import { useQuery } from "@tanstack/react-query";
import { type Lead } from "@shared/schema";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function AdminLeads() {
    const { data: leads, isLoading } = useQuery<Lead[]>({
        queryKey: ["/api/leads"],
    });

    if (isLoading) {
        return (
            <div className="container py-8">
                <h1 className="text-2xl font-bold mb-4">Загрузка данных...</h1>
            </div>
        );
    }

    return (
        <div className="container py-8 mx-auto max-w-7xl">
            <Card>
                <CardHeader>
                    <CardTitle>Управление заявками</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Дата</TableHead>
                                    <TableHead>Имя</TableHead>
                                    <TableHead>Телефон</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Услуга</TableHead>
                                    <TableHead>Источник / Запрос</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leads?.length ? (
                                    leads.map((lead) => (
                                        <TableRow key={lead.id}>
                                            <TableCell>
                                                {format(new Date(lead.createdAt), "dd.MM.yyyy HH:mm", {
                                                    locale: ru,
                                                })}
                                            </TableCell>
                                            <TableCell className="font-medium">{lead.name}</TableCell>
                                            <TableCell>{lead.phone}</TableCell>
                                            <TableCell>{lead.email}</TableCell>
                                            <TableCell>{lead.serviceType}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {lead.source}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            Нет заявок
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
