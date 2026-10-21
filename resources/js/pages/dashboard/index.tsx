import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageProps } from "@/types/page-props";
import { homePage } from "@/routes";
import guestBook from "@/routes/dashboard/management/guest-book";
import guestBookQuestion from "@/routes/dashboard/management/guest-book-question";
import { Link } from "@inertiajs/react";
import {
    ArrowRight,
    BarChart3,
    BookOpen,
    CalendarDays,
    Clock,
    ExternalLink,
    FileText,
    HelpCircle,
    Minus,
    Settings2,
    Sparkles,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react";

interface DashboardStats {
    total_visits: number;
    today_visits: number;
    yesterday_visits: number;
    today_trend: number;
    week_visits: number;
    month_visits: number;
    active_questions_count: number;
}

interface TrendItem {
    date: string;
    day_name: string;
    short_date: string;
    count: number;
}

interface PopularOption {
    id: string;
    label: string;
    question_label?: string | null;
    count: number;
}

interface RecentVisitAnswer {
    id: string;
    question_label?: string | null;
    option_label?: string | null;
    custom_text?: string | null;
}

interface RecentVisit {
    id: string;
    created_at?: string | null;
    created_at_human?: string | null;
    answers: RecentVisitAnswer[];
}

interface Props extends PageProps {
    stats?: DashboardStats;
    trend?: TrendItem[];
    popularOptions?: PopularOption[];
    recentVisits?: RecentVisit[];
}

const DashboardIndexPage = ({
    stats = {
        total_visits: 0,
        today_visits: 0,
        yesterday_visits: 0,
        today_trend: 0,
        week_visits: 0,
        month_visits: 0,
        active_questions_count: 0,
    },
    trend = [],
    popularOptions = [],
    recentVisits = [],
}: Props) => {
    const maxTrendCount = Math.max(...trend.map((t) => t.count), 1);
    const totalTrendVisits = trend.reduce((sum, item) => sum + item.count, 0);

    return (
        <DashboardLayout title="Statistik Buku Tamu">
            <div className="flex flex-col gap-6">
                {/* Header Welcome Banner */}
                <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="gap-1 font-medium">
                                <Sparkles className="size-3.5 text-primary" />
                                Jeta Arsip
                            </Badge>
                            <span className="text-xs text-muted-foreground">Kabupaten Banyumas</span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Statistik Buku Tamu</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Pantau data arus kunjungan masyarakat dan ringkasan aktivitas buku tamu secara real-time.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                        <Button variant="outline" size="sm" asChild>
                            <a href={homePage.url()} target="_blank" rel="noreferrer">
                                <ExternalLink className="mr-1.5 size-4" />
                                Form Publik
                            </a>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href={guestBook.index.url()}>
                                <Users className="mr-1.5 size-4" />
                                Kelola Tamu
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* 4 Overview Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Hari Ini */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Kunjungan Hari Ini</CardTitle>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Users className="size-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{stats.today_visits}</div>
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                {stats.today_trend > 0 ? (
                                    <span className="flex items-center font-medium text-emerald-600 dark:text-emerald-400">
                                        <TrendingUp className="mr-1 size-3.5" />+{stats.today_trend}%
                                    </span>
                                ) : stats.today_trend < 0 ? (
                                    <span className="flex items-center font-medium text-destructive">
                                        <TrendingDown className="mr-1 size-3.5" />
                                        {stats.today_trend}%
                                    </span>
                                ) : (
                                    <span className="flex items-center font-medium text-muted-foreground">
                                        <Minus className="mr-1 size-3.5" />
                                        0%
                                    </span>
                                )}
                                <span>vs kemarin ({stats.yesterday_visits})</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Minggu Ini */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Kunjungan Minggu Ini</CardTitle>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <CalendarDays className="size-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{stats.week_visits}</div>
                            <p className="mt-1.5 text-xs text-muted-foreground">Sejak awal pekan ini</p>
                        </CardContent>
                    </Card>

                    {/* Bulan Ini */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Kunjungan Bulan Ini</CardTitle>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <BookOpen className="size-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{stats.month_visits}</div>
                            <p className="mt-1.5 text-xs text-muted-foreground">Total kunjungan bulan berjalan</p>
                        </CardContent>
                    </Card>

                    {/* Total Kunjungan */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Semua Tamu</CardTitle>
                            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <BarChart3 className="size-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{stats.total_visits}</div>
                            <p className="mt-1.5 text-xs text-muted-foreground">{stats.active_questions_count} pertanyaan formulir aktif</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Visual Trend & Popular Options */}
                <div className="grid gap-6 lg:grid-cols-7">
                    {/* 7 Days Trend Chart */}
                    <Card className="lg:col-span-4">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-base font-semibold">Tren Kunjungan 7 Hari Terakhir</CardTitle>
                                <CardDescription>Total {totalTrendVisits} kunjungan dalam rentang sepekan terakhir</CardDescription>
                            </div>
                            <Badge variant="outline" className="text-xs">
                                7 Hari
                            </Badge>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {trend.length === 0 ? (
                                <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                                    Belum ada data tren yang tercatat
                                </div>
                            ) : (
                                <div className="flex h-56 items-end justify-between gap-2 pt-6">
                                    {trend.map((item) => {
                                        const heightPercent = Math.max(Math.round((item.count / maxTrendCount) * 100), 8);

                                        return (
                                            <div key={item.date} className="group flex flex-1 flex-col items-center gap-2">
                                                {/* Count label above bar */}
                                                <span className="text-xs font-semibold text-muted-foreground transition-colors group-hover:text-primary">
                                                    {item.count}
                                                </span>

                                                {/* Bar container */}
                                                <div className="flex h-36 w-full max-w-10 items-end justify-center rounded-md bg-muted/50 p-1">
                                                    <div
                                                        style={{ height: `${heightPercent}%` }}
                                                        className="w-full rounded-sm bg-primary transition-all group-hover:opacity-85"
                                                    />
                                                </div>

                                                {/* Day and date label */}
                                                <div className="flex flex-col items-center text-center">
                                                    <span className="text-xs font-medium text-foreground">{item.day_name}</span>
                                                    <span className="text-[10px] text-muted-foreground">{item.short_date}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Popular Categories / Options */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Opsi Pilihan Terbanyak</CardTitle>
                            <CardDescription>Distribusi jawaban opsi pengunjung yang paling sering dipilih</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-1">
                            {popularOptions.length === 0 ? (
                                <div className="flex h-52 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                                    Belum ada opsi jawaban yang tercatat
                                </div>
                            ) : (
                                popularOptions.map((opt) => {
                                    const percent = stats.total_visits > 0 ? Math.min(Math.round((opt.count / stats.total_visits) * 100), 100) : 0;

                                    return (
                                        <div key={opt.id} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground">{opt.label}</span>
                                                    {opt.question_label && (
                                                        <span className="text-[10px] text-muted-foreground">{opt.question_label}</span>
                                                    )}
                                                </div>
                                                <span className="font-semibold text-primary">
                                                    {opt.count} ({percent}%)
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

                {/* Recent Visits Table & Quick Actions */}
                <div className="grid gap-6 lg:grid-cols-7">
                    {/* Recent Visits */}
                    <Card className="lg:col-span-4">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-base font-semibold">Kunjungan Terbaru</CardTitle>
                                <CardDescription>Pengunjung yang baru saja mengisi buku tamu digital</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={guestBook.index.url()} className="gap-1 text-xs text-primary">
                                    Semua
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-2">
                            {recentVisits.length === 0 ? (
                                <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                                    Belum ada data kunjungan terbaru
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {recentVisits.map((visit, index) => {
                                        // Ambil 2 ringkasan jawaban pertama (biasanya Nama & Keperluan)
                                        const firstAnswer = visit.answers[0];
                                        const secondAnswer = visit.answers[1];

                                        const primaryText = firstAnswer?.custom_text || firstAnswer?.option_label || `Tamu #${index + 1}`;
                                        const secondaryText = secondAnswer?.option_label || secondAnswer?.custom_text || firstAnswer?.question_label;

                                        return (
                                            <div
                                                key={visit.id}
                                                className="flex items-center justify-between py-3 transition-colors hover:bg-muted/30"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                        {primaryText.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-foreground">{primaryText}</span>
                                                        {secondaryText && <span className="text-xs text-muted-foreground">{secondaryText}</span>}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Clock className="size-3.5" />
                                                    <span>{visit.created_at_human}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Navigation Cards */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Pintasan Menu</CardTitle>
                            <CardDescription>Akses cepat ke modul operasional Jeta Arsip</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link
                                href={guestBook.index.url()}
                                className="flex items-center justify-between rounded-lg border border-border p-3.5 transition-colors hover:border-primary/50 hover:bg-muted/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <FileText className="size-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-foreground">Manajemen Buku Tamu</span>
                                        <span className="text-xs text-muted-foreground">Lihat detail dan hapus data kunjungan</span>
                                    </div>
                                </div>
                                <ArrowRight className="size-4 text-muted-foreground" />
                            </Link>

                            <Link
                                href={guestBookQuestion.index.url()}
                                className="flex items-center justify-between rounded-lg border border-border p-3.5 transition-colors hover:border-primary/50 hover:bg-muted/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Settings2 className="size-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-foreground">Kelola Pertanyaan</span>
                                        <span className="text-xs text-muted-foreground">Atur pertanyaan dan opsi pilihan formulir</span>
                                    </div>
                                </div>
                                <ArrowRight className="size-4 text-muted-foreground" />
                            </Link>

                            <a
                                href={homePage.url()}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between rounded-lg border border-border p-3.5 transition-colors hover:border-primary/50 hover:bg-muted/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <ExternalLink className="size-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-foreground">Layar Buku Tamu Publik</span>
                                        <span className="text-xs text-muted-foreground">Buka form pengisian untuk pengunjung lobby</span>
                                    </div>
                                </div>
                                <ArrowRight className="size-4 text-muted-foreground" />
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardIndexPage;
