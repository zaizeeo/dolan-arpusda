import { SurveyResponseTrendChart, type SurveyTrendItem } from "@/components/charts/survey-response-trend-chart";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChartNoAxesColumnIncreasing, ClipboardList, Clock, MessagesSquare } from "lucide-react";

interface SurveySummary {
    id: string;
    title: string;
    description: string | null;
}

interface Stats {
    total_responses: number;
    today_responses: number;
    month_responses: number;
}

interface Props {
    survey: SurveySummary | null;
    stats?: Stats;
    trend?: Array<SurveyTrendItem>;
}

export default function SurveyStatisticsPage({ survey, stats = { total_responses: 0, today_responses: 0, month_responses: 0 }, trend = [] }: Props) {
    const weeklyResponses = trend.reduce((total, item) => total + item.count, 0);

    return (
        <DashboardLayout title="Statistik Respon Survei">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Statistik Respon Survei</h1>
                    <p className="text-sm text-muted-foreground">Ringkasan partisipasi dan tren respon survei layanan kearsipan.</p>
                </div>

                {survey ? (
                    <Card className="border-border bg-card shadow-xs">
                        <CardHeader className="pb-3">
                            <div className="flex flex-wrap items-center gap-2 text-primary">
                                <ClipboardList className="size-5" />
                                <CardTitle className="text-base font-semibold">{survey.title}</CardTitle>
                                <Badge variant="secondary" className="text-xs">
                                    Survei Aktif
                                </Badge>
                            </div>
                            <CardDescription>{survey.description ?? "Survei aktif yang ditampilkan pada halaman publik."}</CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    <Card className="border-dashed border-border bg-card">
                        <CardHeader>
                            <CardTitle className="text-base">Belum Ada Survei Aktif</CardTitle>
                            <CardDescription>Statistik akan muncul setelah ada survei aktif yang diisi oleh pengunjung.</CardDescription>
                        </CardHeader>
                    </Card>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-xs">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <MessagesSquare className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Total Respon</p>
                            <p className="text-lg font-bold text-foreground">{stats.total_responses}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-xs">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Calendar className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Respon Hari Ini</p>
                            <p className="text-lg font-bold text-foreground">{stats.today_responses}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-xs">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Clock className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Respon Bulan Ini</p>
                            <p className="text-lg font-bold text-foreground">{stats.month_responses}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-xs">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                            <ChartNoAxesColumnIncreasing className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Respon 7 Hari</p>
                            <p className="text-lg font-bold text-foreground">{weeklyResponses}</p>
                        </div>
                    </div>
                </div>

                <SurveyResponseTrendChart trend={trend} />
            </div>
        </DashboardLayout>
    );
}
