import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { resolveInertiaErrorMessage } from "@/lib/inertia-errors";
import { deleteSurveyResponse, surveyQuestionIndex } from "@/routes";
import survey from "@/routes/survey";
import type { SurveyResponseItem } from "@/types/survey";
import { router, type VisitHelperOptions } from "@inertiajs/core";
import { Link } from "@inertiajs/react";
import { Calendar, ClipboardList, Clock, ExternalLink, HelpCircle, Loader2, MessagesSquare, Settings2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
    responses?: Array<SurveyResponseItem>;
    stats?: Stats;
}

export default function SurveyResponseManagement({
    survey: activeSurvey,
    responses = [],
    stats = { total_responses: 0, today_responses: 0, month_responses: 0 },
}: Props) {
    const [deletingResponse, setDeletingResponse] = useState<SurveyResponseItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!deletingResponse) {
            return;
        }

        setIsDeleting(true);

        const requestOptions = {
            preserveScroll: true,
            onStart: () => setIsDeleting(true),
            onFinish: () => setIsDeleting(false),
            onSuccess: () => {
                toast.success("Berhasil", { description: "Respon survei berhasil dihapus." });
                setDeletingResponse(null);
            },
            onError: (error) => {
                toast.error("Terjadi Kesalahan!", {
                    description: resolveInertiaErrorMessage(error as Record<string, unknown>),
                });
            },
        } satisfies VisitHelperOptions;

        router.delete(deleteSurveyResponse.url(deletingResponse.id), requestOptions);
    };

    return (
        <DashboardLayout title="Respon Survei">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Respon Survei</h1>
                        <p className="text-sm text-muted-foreground">Lihat dan kelola jawaban survei yang dikirim oleh pengunjung.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" asChild className="gap-2">
                            <Link href={survey.show.url()}>
                                <ExternalLink className="size-4" />
                                Lihat Survei
                            </Link>
                        </Button>
                        <Button asChild className="gap-2">
                            <Link href={surveyQuestionIndex.url()}>
                                <Settings2 className="size-4" />
                                Kelola Pertanyaan
                            </Link>
                        </Button>
                    </div>
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
                            <CardDescription>Respon akan muncul setelah ada survei aktif yang diisi oleh pengunjung.</CardDescription>
                        </CardHeader>
                    </Card>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                        <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                            <Clock className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Respon Bulan Ini</p>
                            <p className="text-lg font-bold text-foreground">{stats.month_responses}</p>
                        </div>
                    </div>
                </div>

                {responses.length === 0 ? (
                    <Card className="border-dashed py-12">
                        <Empty>
                            <EmptyMedia variant="icon">
                                <HelpCircle className="size-6 text-muted-foreground" />
                            </EmptyMedia>
                            <EmptyHeader>
                                <EmptyTitle>Belum Ada Respon</EmptyTitle>
                                <EmptyDescription>
                                    Belum ada pengunjung yang mengirimkan jawaban survei. Respon akan tampil di sini setelah formulir survei diisi.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-4">
                        {responses.map((response, index) => (
                            <Card key={response.id} className="border-border bg-card shadow-xs">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <MessagesSquare className="size-4" />
                                            </span>
                                            <div>
                                                <CardTitle className="text-sm font-semibold">Respon #{responses.length - index}</CardTitle>
                                                <CardDescription className="text-xs">
                                                    {response.created_at_human ?? "Baru saja"}
                                                    {response.created_at ? (
                                                        <span className="text-muted-foreground/70">
                                                            {" "}
                                                            ·{" "}
                                                            {new Date(response.created_at).toLocaleString("id-ID", {
                                                                day: "numeric",
                                                                month: "long",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </span>
                                                    ) : null}
                                                </CardDescription>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-1.5 self-end text-destructive hover:bg-destructive/10 hover:text-destructive sm:self-auto"
                                            onClick={() => setDeletingResponse(response)}
                                        >
                                            <Trash2 className="size-4" />
                                            Hapus
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {response.answers.map((answer) => (
                                            <div key={answer.id} className="rounded-lg border border-border bg-muted/20 p-3">
                                                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                    {answer.question?.label ?? "Pertanyaan dihapus"}
                                                </p>
                                                <p className="mt-1 text-sm font-medium text-foreground">
                                                    {answer.option?.label ?? answer.custom_text ?? "-"}
                                                </p>
                                                {answer.option && answer.custom_text && (
                                                    <p className="mt-1 text-xs text-muted-foreground">Keterangan: {answer.custom_text}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={deletingResponse !== null} onOpenChange={(open) => !open && setDeletingResponse(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Hapus Respon Survei</DialogTitle>
                        <DialogDescription>
                            Respon yang dipilih beserta seluruh jawabannya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeletingResponse(null)} disabled={isDeleting}>
                            Batal
                        </Button>
                        <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting} className="gap-2">
                            {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                            Hapus Respon
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
