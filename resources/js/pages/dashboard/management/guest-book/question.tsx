import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TimeStamps } from "@/types";
import { PageProps } from "@/types/page-props";
import {
    AlertCircle,
    CheckCircle2,
    CircleDot,
    FileQuestion,
    HelpCircle,
    Layers,
    ListPlus,
    MoreVertical,
    Pencil,
    Plus,
    Power,
    SlidersHorizontal,
    Trash2,
    Type,
    XCircle,
} from "lucide-react";

interface Option extends Partial<TimeStamps> {
    id: string;
    label: string;
    description: string | null;
    guest_book_question_id: string;
    is_allow_custom_text: boolean | number;
    sequence_number?: number;
    is_active: boolean;
}

interface Question extends Partial<TimeStamps> {
    id: string;
    label: string;
    description: string | null;
    is_active: boolean;
    sequence_number?: number;
    options: Array<Option>;
}

interface Props extends PageProps {
    questions: Array<Question>;
}

export default function GuestBookQuestionManagement({ questions = [] }: Props) {
    console.log({ questions });

    const totalQuestions = questions.length;
    const activeQuestions = questions.filter((q) => q.is_active).length;
    const totalOptions = questions.reduce((acc, q) => acc + (q.options?.length || 0), 0);

    return (
        <DashboardLayout title="Manajemen Pertanyaan">
            <TooltipProvider>
                <div className="flex flex-col gap-6">
                    {/* Header Page & Summary */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Daftar Pertanyaan Buku Tamu</h1>
                            <p className="text-sm text-muted-foreground">
                                Kelola pertanyaan kuisioner dan opsi jawaban untuk formulir buku tamu digital.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button className="gap-2 shadow-sm">
                                <Plus className="size-4" />
                                <span>Tambah Pertanyaan</span>
                            </Button>
                        </div>
                    </div>

                    {/* Stats Summary Cards */}
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
                            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
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

                    {/* Questions List */}
                    {questions.length === 0 ? (
                        <Card className="border-dashed py-12">
                            <Empty>
                                <EmptyMedia variant="icon">
                                    <HelpCircle className="size-6 text-muted-foreground" />
                                </EmptyMedia>
                                <EmptyHeader>
                                    <EmptyTitle>Belum Ada Pertanyaan</EmptyTitle>
                                    <EmptyDescription>
                                        Belum ada pertanyaan yang dikonfigurasi untuk formulir buku tamu. Buat pertanyaan pertama Anda sekarang.
                                    </EmptyDescription>
                                </EmptyHeader>
                                <Button className="mt-4 gap-2">
                                    <Plus className="size-4" />
                                    <span>Tambah Pertanyaan Baru</span>
                                </Button>
                            </Empty>
                        </Card>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {questions.map((question) => {
                                const hasOptions = question.options && question.options.length > 0;
                                const activeOptionsCount = question.options?.filter((o) => o.is_active).length || 0;

                                return (
                                    <Card key={question.id} className="transition-all hover:border-border/80">
                                        <CardHeader className="pb-3">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="flex items-start gap-3">
                                                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                                                        #{question.sequence_number}
                                                    </span>
                                                    <div className="space-y-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <CardTitle className="text-base leading-none font-semibold">{question.label}</CardTitle>
                                                            <Badge variant={question.is_active ? "default" : "secondary"} className="text-[11px]">
                                                                {question.is_active ? "Aktif" : "Tidak Aktif"}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-[11px]">
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

                                                {/* Question Actions */}
                                                <div className="flex items-center gap-1.5 self-end sm:self-start">
                                                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                                                        <ListPlus className="size-3.5" />
                                                        <span>Tambah Opsi</span>
                                                    </Button>

                                                    <Button variant="ghost" size="icon-sm" className="size-8" title="Edit Pertanyaan">
                                                        <Pencil className="size-3.5" />
                                                    </Button>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon-sm" className="size-8" aria-label="Menu Aksi">
                                                                <MoreVertical className="size-3.5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem className="cursor-pointer gap-2">
                                                                <Pencil className="size-4" />
                                                                <span>Edit Pertanyaan</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer gap-2">
                                                                <ListPlus className="size-4" />
                                                                <span>Tambah Pilihan Opsi</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer gap-2">
                                                                <Power className="size-4" />
                                                                <span>{question.is_active ? "Nonaktifkan Pertanyaan" : "Aktifkan Pertanyaan"}</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive">
                                                                <Trash2 className="size-4" />
                                                                <span>Hapus Pertanyaan</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-0 pb-4">
                                            <div className="rounded-lg border border-border/60 bg-muted/30 p-3.5">
                                                <div className="mb-2.5 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                            Pilihan Jawaban
                                                        </span>
                                                        {hasOptions && (
                                                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                                                                {activeOptionsCount} Aktif / {question.options.length} Total
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {hasOptions && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 gap-1 px-2 text-xs text-primary hover:text-primary"
                                                        >
                                                            <Plus className="size-3" />
                                                            <span>Opsi Baru</span>
                                                        </Button>
                                                    )}
                                                </div>

                                                {hasOptions ? (
                                                    <div className="flex flex-col gap-2">
                                                        {question.options.map((option) => (
                                                            <div
                                                                key={option.id}
                                                                className="group flex flex-col gap-2 rounded-md border border-border bg-card p-2.5 transition-colors sm:flex-row sm:items-center sm:justify-between"
                                                            >
                                                                <div className="flex items-center gap-2.5">
                                                                    <CircleDot className="size-3.5 shrink-0 text-muted-foreground" />
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <span className="text-sm font-medium text-foreground">{option.label}</span>
                                                                        <Badge
                                                                            variant={option.is_active ? "default" : "secondary"}
                                                                            className="text-[10px]"
                                                                        >
                                                                            {option.is_active ? "Aktif" : "Nonaktif"}
                                                                        </Badge>
                                                                        {Boolean(option.is_allow_custom_text) && (
                                                                            <Badge
                                                                                variant="outline"
                                                                                className="border-primary/30 bg-primary/5 text-[10px] text-primary"
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

                                                                {/* Option Row Action Buttons */}
                                                                <div className="flex items-center gap-1 self-end sm:self-auto sm:opacity-90 sm:group-hover:opacity-100">
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon-xs"
                                                                                className="size-7"
                                                                                aria-label="Edit Pilihan"
                                                                            >
                                                                                <Pencil className="size-3 text-muted-foreground" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent side="top">Edit Pilihan</TooltipContent>
                                                                    </Tooltip>

                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon-xs"
                                                                                className="size-7"
                                                                                aria-label={option.is_active ? "Nonaktifkan" : "Aktifkan"}
                                                                            >
                                                                                {option.is_active ? (
                                                                                    <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                                                                                ) : (
                                                                                    <XCircle className="size-3 text-muted-foreground" />
                                                                                )}
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent side="top">
                                                                            {option.is_active ? "Nonaktifkan Pilihan" : "Aktifkan Pilihan"}
                                                                        </TooltipContent>
                                                                    </Tooltip>

                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon-xs"
                                                                                className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                                                aria-label="Hapus Pilihan"
                                                                            >
                                                                                <Trash2 className="size-3" />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent side="top">Hapus Pilihan</TooltipContent>
                                                                    </Tooltip>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border py-4 text-center">
                                                        <Type className="size-5 text-muted-foreground" />
                                                        <div className="space-y-0.5">
                                                            <p className="text-xs font-medium text-foreground">Tipe Isian Teks Bebas</p>
                                                            <p className="text-[11px] text-muted-foreground">
                                                                Pertanyaan ini tidak memerlukan pilihan ganda. Pengunjung akan mengetik langsung
                                                                jawaban mereka.
                                                            </p>
                                                        </div>
                                                        <Button variant="outline" size="sm" className="mt-1 h-7 gap-1 text-xs">
                                                            <Plus className="size-3" />
                                                            <span>Ubah Jadi Pilihan Ganda (Tambah Opsi)</span>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>

                                        {question.created_at && (
                                            <CardFooter className="border-t border-border/40 py-2.5 text-[11px] text-muted-foreground">
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
            </TooltipProvider>
        </DashboardLayout>
    );
}
