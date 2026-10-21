import DeleteSurveyQuestion from "@/components/forms/survey/question/delete-survey-question";
import DeleteSurveyQuestionOption from "@/components/forms/survey/question/delete-survey-question-option";
import SurveyQuestionForm from "@/components/forms/survey/question/survey-question-form";
import SurveyQuestionOptionForm from "@/components/forms/survey/question/survey-question-option-form";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { useUserRole } from "@/lib/hooks/use-user-role";
import { resolveInertiaErrorMessage } from "@/lib/inertia-errors";
import { toggleSurveyQuestionActive, toggleSurveyQuestionOptionActive } from "@/routes";
import survey from "@/routes/survey";
import { User } from "@/types";
import { PageProps } from "@/types/page-props";
import type { SurveyQuestion, SurveyQuestionOption } from "@/types/survey";
import { router, type VisitHelperOptions } from "@inertiajs/core";
import { Link } from "@inertiajs/react";
import {
    CheckCircle2,
    CircleDot,
    ClipboardList,
    ExternalLink,
    FileQuestion,
    HelpCircle,
    Layers,
    Pencil,
    Plus,
    Power,
    Trash2,
    Type,
    XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SurveySummary {
    id: string;
    title: string;
    description: string | null;
}

interface Props extends PageProps {
    survey: SurveySummary | null;
    questions?: Array<SurveyQuestion>;
}

interface OptionFormTarget {
    question: SurveyQuestion;
    option: SurveyQuestionOption | null;
}

interface OptionDeleteTarget {
    question: SurveyQuestion;
    option: SurveyQuestionOption;
}

export default function SurveyQuestionManagement({ auth, survey: activeSurvey, questions = [] }: Props) {
    const { hasAdminsAuthority } = useUserRole(auth.user as User);
    const [createOpen, setCreateOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<SurveyQuestion | null>(null);
    const [deletingQuestion, setDeletingQuestion] = useState<SurveyQuestion | null>(null);
    const [optionFormTarget, setOptionFormTarget] = useState<OptionFormTarget | null>(null);
    const [deletingOption, setDeletingOption] = useState<OptionDeleteTarget | null>(null);
    const [pendingToggleKey, setPendingToggleKey] = useState<string | null>(null);

    const totalQuestions = questions.length;
    const activeQuestions = questions.filter((question) => question.is_active).length;
    const totalOptions = questions.reduce((total, question) => total + (question.options?.length ?? 0), 0);

    const toggleQuestionActive = (question: SurveyQuestion) => {
        if (pendingToggleKey !== null) {
            return;
        }

        setPendingToggleKey(`question-${question.id}`);

        const requestOptions = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: question.is_active ? "Pertanyaan berhasil dinonaktifkan." : "Pertanyaan berhasil diaktifkan.",
                });
            },
            onError: (error) => {
                toast.error("Terjadi Kesalahan!", {
                    description: resolveInertiaErrorMessage(error as Record<string, unknown>),
                });
            },
            onFinish: () => setPendingToggleKey(null),
        } satisfies VisitHelperOptions;

        router.patch(toggleSurveyQuestionActive.url(question.id), {}, requestOptions);
    };

    const toggleOptionActive = (option: SurveyQuestionOption) => {
        if (pendingToggleKey !== null) {
            return;
        }

        setPendingToggleKey(`option-${option.id}`);

        const requestOptions = {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: option.is_active ? "Pilihan jawaban berhasil dinonaktifkan." : "Pilihan jawaban berhasil diaktifkan.",
                });
            },
            onError: (error) => {
                toast.error("Terjadi Kesalahan!", {
                    description: resolveInertiaErrorMessage(error as Record<string, unknown>),
                });
            },
            onFinish: () => setPendingToggleKey(null),
        } satisfies VisitHelperOptions;

        router.patch(toggleSurveyQuestionOptionActive.url(option.id), {}, requestOptions);
    };

    return (
        <DashboardLayout title="Manajemen Pertanyaan Survei">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Pertanyaan Survei</h1>
                        <p className="text-sm text-muted-foreground">
                            {hasAdminsAuthority
                                ? "Kelola pertanyaan dan pilihan jawaban untuk survei layanan Jeta Arsip."
                                : "Lihat pertanyaan dan pilihan jawaban untuk survei layanan Jeta Arsip."}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" asChild className="gap-2">
                            <Link href={survey.show.url()}>
                                <ExternalLink className="size-4" />
                                Lihat Survei
                            </Link>
                        </Button>
                        {hasAdminsAuthority && (
                            <Button onClick={() => setCreateOpen(true)} className="gap-2" disabled={!activeSurvey}>
                                <Plus className="size-4" />
                                Tambah Pertanyaan
                            </Button>
                        )}
                    </div>
                </div>

                {activeSurvey ? (
                    <Card className="border-border bg-card shadow-xs">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2 text-primary">
                                <ClipboardList className="size-5" />
                                <CardTitle className="text-base font-semibold">{activeSurvey.title}</CardTitle>
                            </div>
                            <CardDescription>{activeSurvey.description ?? "Survei aktif yang ditampilkan pada halaman publik."}</CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    <Card className="border-dashed border-border bg-card">
                        <CardHeader>
                            <CardTitle className="text-base">Belum Ada Survei Aktif</CardTitle>
                            <CardDescription>Aktifkan survei terlebih dahulu sebelum menambahkan pertanyaan.</CardDescription>
                        </CardHeader>
                    </Card>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-xs">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FileQuestion className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Total Pertanyaan</p>
                            <p className="text-lg font-bold text-foreground">{totalQuestions}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-xs">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <CheckCircle2 className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Pertanyaan Aktif</p>
                            <p className="text-lg font-bold text-foreground">
                                {activeQuestions} <span className="text-xs font-normal text-muted-foreground">/ {totalQuestions}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-xs">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                            <Layers className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Total Pilihan Jawaban</p>
                            <p className="text-lg font-bold text-foreground">{totalOptions}</p>
                        </div>
                    </div>
                </div>

                <Separator />

                {questions.length === 0 ? (
                    <Card className="border-dashed py-12">
                        <Empty>
                            <EmptyMedia variant="icon">
                                <HelpCircle className="size-6 text-muted-foreground" />
                            </EmptyMedia>
                            <EmptyHeader>
                                <EmptyTitle>Belum Ada Pertanyaan</EmptyTitle>
                                <EmptyDescription>
                                    {hasAdminsAuthority
                                        ? "Belum ada pertanyaan yang dikonfigurasi untuk survei ini. Buat pertanyaan pertama Anda sekarang."
                                        : "Belum ada pertanyaan yang dikonfigurasi untuk survei ini."}
                                </EmptyDescription>
                            </EmptyHeader>
                            {hasAdminsAuthority && (
                                <Button onClick={() => setCreateOpen(true)} className="mt-4 gap-2" disabled={!activeSurvey}>
                                    <Plus className="size-4" />
                                    Tambah Pertanyaan Baru
                                </Button>
                            )}
                        </Empty>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-4">
                        {questions.map((question, questionIndex) => {
                            const options = question.options ?? [];
                            const hasOptions = options.length > 0;
                            const activeOptionsCount = options.filter((option) => option.is_active).length;
                            const isTogglingQuestion = pendingToggleKey === `question-${question.id}`;

                            return (
                                <Card key={question.id} className="transition-all hover:border-border/80">
                                    <CardHeader className="pb-3">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex items-start gap-3">
                                                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                                                    #{question.sequence_number ?? questionIndex + 1}
                                                </span>
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <CardTitle className="text-base leading-none font-semibold">{question.label}</CardTitle>
                                                        <Badge variant={question.is_active ? "default" : "secondary"} className="text-xs">
                                                            {question.is_active ? "Aktif" : "Tidak Aktif"}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs">
                                                            {hasOptions ? "Pilihan Ganda" : "Isian Teks Bebas"}
                                                        </Badge>
                                                    </div>
                                                    <CardDescription className="text-sm">
                                                        {question.description || (
                                                            <span className="text-muted-foreground/70 italic">Tidak ada deskripsi tambahan</span>
                                                        )}
                                                    </CardDescription>
                                                </div>
                                            </div>

                                            {hasAdminsAuthority && (
                                                <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-start">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-1.5 text-xs"
                                                        onClick={() => setOptionFormTarget({ question, option: null })}
                                                    >
                                                        <Plus className="size-3.5" />
                                                        Tambah Opsi
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        title="Edit pertanyaan"
                                                        aria-label={`Edit pertanyaan ${question.label}`}
                                                        onClick={() => setEditingQuestion(question)}
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        title={question.is_active ? "Nonaktifkan pertanyaan" : "Aktifkan pertanyaan"}
                                                        aria-label={
                                                            question.is_active
                                                                ? `Nonaktifkan pertanyaan ${question.label}`
                                                                : `Aktifkan pertanyaan ${question.label}`
                                                        }
                                                        disabled={isTogglingQuestion}
                                                        onClick={() => toggleQuestionActive(question)}
                                                    >
                                                        <Power className="size-3.5" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        title="Hapus pertanyaan"
                                                        aria-label={`Hapus pertanyaan ${question.label}`}
                                                        onClick={() => setDeletingQuestion(question)}
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0 pb-4">
                                        <div className="rounded-lg border border-border/60 bg-muted/30 p-3.5">
                                            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        Pilihan Jawaban
                                                    </span>
                                                    {hasOptions && (
                                                        <Badge variant="secondary" className="px-1.5 text-xs">
                                                            {activeOptionsCount} Aktif / {options.length} Total
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {hasOptions ? (
                                                <div className="flex flex-col gap-2">
                                                    {options.map((option) => {
                                                        const isTogglingOption = pendingToggleKey === `option-${option.id}`;

                                                        return (
                                                            <div
                                                                key={option.id}
                                                                className="flex flex-col gap-2 rounded-md border border-border bg-card p-2.5 sm:flex-row sm:items-center sm:justify-between"
                                                            >
                                                                <div className="flex items-center gap-2.5">
                                                                    <CircleDot className="size-3.5 shrink-0 text-muted-foreground" />
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <span className="text-sm font-medium text-foreground">{option.label}</span>
                                                                        <Badge
                                                                            variant={option.is_active ? "default" : "secondary"}
                                                                            className="text-xs"
                                                                        >
                                                                            {option.is_active ? "Aktif" : "Nonaktif"}
                                                                        </Badge>
                                                                        {Boolean(option.is_allow_custom_text) && (
                                                                            <Badge
                                                                                variant="outline"
                                                                                className="border-primary/30 bg-primary/5 text-xs text-primary"
                                                                            >
                                                                                Input Teks Kustom
                                                                            </Badge>
                                                                        )}
                                                                        {option.description && (
                                                                            <span className="text-xs text-muted-foreground">
                                                                                ({option.description})
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {hasAdminsAuthority && (
                                                                    <div className="flex items-center gap-1 self-end sm:self-auto">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon-sm"
                                                                            aria-label={`Edit pilihan ${option.label}`}
                                                                            onClick={() => setOptionFormTarget({ question, option })}
                                                                        >
                                                                            <Pencil className="size-3.5 text-muted-foreground" />
                                                                        </Button>

                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon-sm"
                                                                            aria-label={
                                                                                option.is_active
                                                                                    ? `Nonaktifkan pilihan ${option.label}`
                                                                                    : `Aktifkan pilihan ${option.label}`
                                                                            }
                                                                            disabled={isTogglingOption}
                                                                            onClick={() => toggleOptionActive(option)}
                                                                        >
                                                                            {option.is_active ? (
                                                                                <CheckCircle2 className="size-3.5 text-primary" />
                                                                            ) : (
                                                                                <XCircle className="size-3.5 text-muted-foreground" />
                                                                            )}
                                                                        </Button>

                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon-sm"
                                                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                                            aria-label={`Hapus pilihan ${option.label}`}
                                                                            onClick={() => setDeletingOption({ question, option })}
                                                                        >
                                                                            <Trash2 className="size-3.5" />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border py-4 text-center">
                                                    <Type className="size-5 text-muted-foreground" />
                                                    <div className="space-y-0.5">
                                                        <p className="text-xs font-medium text-foreground">Tipe Isian Teks Bebas</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Pertanyaan ini tidak memerlukan pilihan ganda. Responden akan mengetik langsung jawaban
                                                            mereka.
                                                        </p>
                                                    </div>
                                                    {hasAdminsAuthority && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="mt-1 gap-1 text-xs"
                                                            onClick={() => setOptionFormTarget({ question, option: null })}
                                                        >
                                                            <Plus className="size-3" />
                                                            Ubah Jadi Pilihan Ganda
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>

                                    {question.created_at && (
                                        <CardFooter className="border-t border-border/40 py-2.5 text-xs text-muted-foreground">
                                            <span>
                                                Dibuat pada:{" "}
                                                {new Date(question.created_at).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </CardFooter>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Tambah Pertanyaan Survei</DialogTitle>
                        <DialogDescription>Buat pertanyaan baru untuk survei aktif beserta pilihan jawabannya.</DialogDescription>
                    </DialogHeader>

                    {createOpen && <SurveyQuestionForm onCancel={() => setCreateOpen(false)} />}
                </DialogContent>
            </Dialog>

            <Dialog open={editingQuestion !== null} onOpenChange={(open) => !open && setEditingQuestion(null)}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Ubah Pertanyaan</DialogTitle>
                        <DialogDescription>Perbarui label atau deskripsi pertanyaan survei.</DialogDescription>
                    </DialogHeader>

                    {editingQuestion && (
                        <SurveyQuestionForm key={editingQuestion.id} question={editingQuestion} onCancel={() => setEditingQuestion(null)} />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={optionFormTarget !== null} onOpenChange={(open) => !open && setOptionFormTarget(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{optionFormTarget?.option ? "Ubah Pilihan Jawaban" : "Tambah Pilihan Jawaban"}</DialogTitle>
                        <DialogDescription>
                            {optionFormTarget?.option
                                ? "Perbarui informasi pilihan jawaban pada pertanyaan ini."
                                : "Tambahkan pilihan jawaban baru untuk pertanyaan ini."}
                        </DialogDescription>
                    </DialogHeader>

                    {optionFormTarget && (
                        <SurveyQuestionOptionForm
                            key={`${optionFormTarget.question.id}-${optionFormTarget.option?.id ?? "new"}`}
                            question={optionFormTarget.question}
                            option={optionFormTarget.option}
                            onCancel={() => setOptionFormTarget(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <DeleteSurveyQuestion question={deletingQuestion} onClose={() => setDeletingQuestion(null)} />

            <DeleteSurveyQuestionOption
                option={deletingOption?.option ?? null}
                questionLabel={deletingOption?.question.label}
                onClose={() => setDeletingOption(null)}
            />
        </DashboardLayout>
    );
}
