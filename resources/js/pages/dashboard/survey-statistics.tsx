import { SurveyResponseTrendChart, type SurveyTrendItem } from "@/components/charts/survey-response-trend-chart";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { surveyQuestionIndex, surveyResponseIndex } from "@/routes";
import survey from "@/routes/survey";
import type { SurveyResponseItem } from "@/types/survey";
import { Link } from "@inertiajs/react";
import {
    ArrowRight,
    Calendar,
    ChartNoAxesColumnIncreasing,
    ClipboardList,
    Clock,
    ExternalLink,
    FileText,
    MessagesSquare,
    Settings2,
} from "lucide-react";

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

interface PopularOption {
    id: string;
    label: string;
    question_label?: string | null;
    count: number;
}

interface Props {
    survey: SurveySummary | null;
    stats?: Stats;
    trend?: Array<SurveyTrendItem>;
    popularOptions?: PopularOption[];
    recentResponses?: SurveyResponseItem[];
}

export default function SurveyStatisticsPage({
    survey: activeSurvey,
    stats = { total_responses: 0, today_responses: 0, month_responses: 0 },
    trend = [],
    popularOptions = [],
    recentResponses = [],
}: Props) {
    const weeklyResponses = trend.reduce((total, item) => total + item.count, 0);

    return (
        <DashboardLayout title="Statistik Respon Survei">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Statistik Respon Survei</h1>
                    <p className="text-sm text-muted-foreground">Ringkasan partisipasi dan tren respon survei layanan kearsipan.</p>
                </div>

                {activeSurvey ? (
                    <Card className="border-border bg-card shadow-xs">
                        <CardHeader className="pb-3">
                            <div className="flex flex-wrap items-center gap-2 text-primary">
                                <ClipboardList className="size-5" />
                                <CardTitle className="text-base font-semibold">{activeSurvey.title}</CardTitle>
                                <Badge variant="secondary" className="text-xs">
                                    Survei Aktif
                                </Badge>
                            </div>
                            <CardDescription>{activeSurvey.description ?? "Survei aktif yang ditampilkan pada halaman publik."}</CardDescription>
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

                <div className="grid gap-6 lg:grid-cols-7">
                    <SurveyResponseTrendChart trend={trend} className="h-full lg:col-span-4" />

                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Opsi Pilihan Terbanyak</CardTitle>
                            <CardDescription>Distribusi jawaban opsi yang paling sering dipilih responden.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-1">
                            {popularOptions.length === 0 ? (
                                <div className="flex h-52 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                                    Belum ada opsi jawaban yang tercatat
                                </div>
                            ) : (
                                popularOptions.map((option) => {
                                    const percent =
                                        stats.total_responses > 0 ? Math.min(Math.round((option.count / stats.total_responses) * 100), 100) : 0;

                                    return (
                                        <div key={option.id} className="space-y-1.5">
                                            <div className="flex items-center justify-between gap-3 text-xs">
                                                <div className="flex min-w-0 flex-col">
                                                    <span className="truncate font-medium text-foreground">{option.label}</span>
                                                    {option.question_label && (
                                                        <span className="truncate text-xs text-muted-foreground">{option.question_label}</span>
                                                    )}
                                                </div>
                                                <span className="shrink-0 font-semibold text-primary">
                                                    {option.count} ({percent}%)
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                                <div
                                                    style={{ width: `${Math.max(percent, 4)}%` }}
                                                    className="h-full rounded-full bg-primary transition-all"
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-7">
                    <Card className="lg:col-span-4">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-base font-semibold">Respon Terbaru</CardTitle>
                                <CardDescription>6 respon survei terakhir dari responden.</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={surveyResponseIndex.url()} className="gap-1 text-xs text-primary">
                                    Semua
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-2">
                            {recentResponses.length === 0 ? (
                                <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                                    Belum ada respon survei terbaru
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {recentResponses.map((response, index) => {
                                        const nameAnswer = response.answers.find((answer) => answer.question?.label.toLowerCase().includes("nama"));
                                        const primaryAnswer = nameAnswer ?? response.answers[0];
                                        const secondaryAnswer =
                                            response.answers.find(
                                                (answer) => answer.id !== primaryAnswer?.id && (answer.option?.label || answer.custom_text),
                                            ) ?? response.answers[1];

                                        const primaryText = primaryAnswer?.custom_text || primaryAnswer?.option?.label || `Responden #${index + 1}`;
                                        const secondaryText =
                                            secondaryAnswer?.option?.label || secondaryAnswer?.custom_text || secondaryAnswer?.question?.label;

                                        return (
                                            <div
                                                key={response.id}
                                                className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-muted/30"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                        {primaryText.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex min-w-0 flex-col">
                                                        <span className="truncate text-sm font-medium text-foreground">{primaryText}</span>
                                                        {secondaryText && (
                                                            <span className="truncate text-xs text-muted-foreground">{secondaryText}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Clock className="size-3.5" />
                                                    <span>{response.created_at_human ?? "Baru saja"}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Pintasan Menu</CardTitle>
                            <CardDescription>Akses cepat ke modul survei.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link
                                href={surveyResponseIndex.url()}
                                className="flex items-center justify-between rounded-lg border border-border p-3.5 transition-colors hover:border-primary/50 hover:bg-muted/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <FileText className="size-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-foreground">Manajemen Respon Survei</span>
                                        <span className="text-xs text-muted-foreground">Lihat detail dan hapus respon survei</span>
                                    </div>
                                </div>
                                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                            </Link>

                            <Link
                                href={surveyQuestionIndex.url()}
                                className="flex items-center justify-between rounded-lg border border-border p-3.5 transition-colors hover:border-primary/50 hover:bg-muted/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Settings2 className="size-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-foreground">Kelola Pertanyaan Survei</span>
                                        <span className="text-xs text-muted-foreground">Atur pertanyaan dan opsi pilihan survei</span>
                                    </div>
                                </div>
                                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                            </Link>

                            <a
                                href={survey.show.url()}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between rounded-lg border border-border p-3.5 transition-colors hover:border-primary/50 hover:bg-muted/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <ExternalLink className="size-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-foreground">Layar Survei Publik</span>
                                        <span className="text-xs text-muted-foreground">Buka formulir survei untuk pengunjung</span>
                                    </div>
                                </div>
                                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
