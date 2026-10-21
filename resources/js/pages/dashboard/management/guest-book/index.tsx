import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserRole } from "@/lib/hooks/use-user-role";
import { deleteGuestBook, homePage } from "@/routes";
import guestBookQuestion from "@/routes/dashboard/management/guest-book-question";
import { User } from "@/types";
import { PageProps } from "@/types/page-props";
import { router, type VisitHelperOptions } from "@inertiajs/core";
import { Link } from "@inertiajs/react";
import {
    BookOpen,
    Calendar,
    Clock,
    ExternalLink,
    Eye,
    FileQuestion,
    HelpCircle,
    Loader2,
    RefreshCw,
    Search,
    Settings2,
    Trash2,
    Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export interface GuestBookOptionItem {
    id: string;
    label: string;
    description?: string | null;
    is_allow_custom_text?: boolean;
}

export interface GuestBookQuestionItem {
    id: string;
    label: string;
    description?: string | null;
    sequence_number?: number | null;
}

export interface GuestBookAnswerItem {
    id: string;
    guest_book_question_id: string;
    guest_book_question_option_id?: string | null;
    custom_text?: string | null;
    question?: GuestBookQuestionItem | null;
    option?: GuestBookOptionItem | null;
}

export interface GuestBookItem {
    id: string;
    created_at?: string | null;
    created_at_human?: string | null;
    answers: GuestBookAnswerItem[];
}

interface StatsItem {
    total_visits: number;
    today_visits: number;
    month_visits: number;
}

interface Props extends PageProps {
    guestBooks?: GuestBookItem[];
    stats?: StatsItem;
}

const formatIndonesianDate = (isoString?: string | null) => {
    if (!isoString) {
        return "-";
    }
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
        return isoString;
    }
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const GuestBookIndex = ({
    auth,
    guestBooks = [],
    stats = {
        total_visits: 0,
        today_visits: 0,
        month_visits: 0,
    },
}: Props) => {
    const { hasAdminsAuthority } = useUserRole(auth.user as User);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGuestBook, setSelectedGuestBook] = useState<GuestBookItem | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<GuestBookItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter guest books based on search query (matches answer texts, option labels, etc.)
    const filteredGuestBooks = useMemo(() => {
        if (!searchQuery.trim()) {
            return guestBooks;
        }

        const query = searchQuery.toLowerCase();
        return guestBooks.filter((item) => {
            const matchesAnswers = item.answers.some((ans) => {
                const textMatch = ans.custom_text?.toLowerCase().includes(query);
                const optionMatch = ans.option?.label.toLowerCase().includes(query);
                const questionMatch = ans.question?.label.toLowerCase().includes(query);
                return textMatch || optionMatch || questionMatch;
            });

            const idMatch = item.id.toLowerCase().includes(query);
            return matchesAnswers || idMatch;
        });
    }, [guestBooks, searchQuery]);

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        const requestOptions = {
            onStart: () => setIsDeleting(true),
            onFinish: () => {
                setIsDeleting(false);
                setDeleteTarget(null);
            },
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: "Data kunjungan tamu berhasil dihapus.",
                });
            },
            onError: (error) => {
                const errMessage = error?.server?.[0] || (typeof error === "object" && Object.values(error)?.[0]) || "Gagal menghapus data tamu.";
                const messageStr = typeof errMessage === "string" ? errMessage : "Gagal menghapus data tamu.";
                toast.error("Terjadi Kesalahan!", {
                    description: messageStr,
                });
            },
        } satisfies VisitHelperOptions;

        router.delete(deleteGuestBook.url(deleteTarget.id), requestOptions);
    };

    return (
        <DashboardLayout title="Manajemen Buku Tamu">
            <div className="flex flex-col gap-6">
                {/* Header Banner */}
                <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="gap-1 font-medium">
                                <Users className="size-3.5 text-primary" />
                                Manajemen Tamu
                            </Badge>
                            <span className="text-xs text-muted-foreground">Jeta Arsip</span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Riwayat Kunjungan Tamu</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {hasAdminsAuthority
                                ? "Kelola data pengunjung, tinjau detail jawaban formulir, dan lakukan pemeliharaan data."
                                : "Lihat data pengunjung dan tinjau detail jawaban formulir."}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <a href={homePage.url()} target="_blank" rel="noreferrer">
                                <ExternalLink className="mr-1.5 size-4" />
                                Form Publik
                            </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={guestBookQuestion.index.url()}>
                                <Settings2 className="mr-1.5 size-4" />
                                {hasAdminsAuthority ? "Kelola Pertanyaan" : "Lihat Pertanyaan"}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Mini Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Total Tamu Terdaftar</CardTitle>
                            <Users className="size-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stats.total_visits}</div>
                            <p className="mt-1 text-xs text-muted-foreground">Keseluruhan riwayat kunjungan</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Tamu Hari Ini</CardTitle>
                            <Calendar className="size-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stats.today_visits}</div>
                            <p className="mt-1 text-xs text-muted-foreground">Kunjungan pada hari ini</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground">Tamu Bulan Ini</CardTitle>
                            <BookOpen className="size-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{stats.month_visits}</div>
                            <p className="mt-1 text-xs text-muted-foreground">Periode bulan aktif saat ini</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Container Card */}
                <Card>
                    <CardHeader className="flex flex-col gap-4 border-b border-border sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold">Data Kunjungan</CardTitle>
                            <CardDescription>
                                Menampilkan {filteredGuestBooks.length} dari {guestBooks.length} total kunjungan
                            </CardDescription>
                        </div>

                        {/* Search & Action Input */}
                        <div className="flex w-full items-center gap-2 sm:w-auto">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama, instansi, atau jawaban..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            {searchQuery && (
                                <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")}>
                                    Reset
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => router.reload({ only: ["guestBooks", "stats"] })}
                                title="Perbarui Data"
                            >
                                <RefreshCw className="size-4" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12 text-center">No</TableHead>
                                    <TableHead className="min-w-40">Waktu Kunjungan</TableHead>
                                    <TableHead className="min-w-56">Identitas / Ringkasan Jawaban</TableHead>
                                    <TableHead className="min-w-44">Kategori / Pilihan Opsi</TableHead>
                                    <TableHead className="w-36 text-center">Jawaban</TableHead>
                                    <TableHead className="w-28 text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredGuestBooks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-44 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <FileQuestion className="size-8 text-muted-foreground/60" />
                                                <p className="font-medium">Tidak ada data kunjungan tamu</p>
                                                {searchQuery && <p className="text-xs">Coba ubah kata kunci pencarian Anda</p>}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredGuestBooks.map((item, index) => {
                                        // Cari jawaban pertama & kedua untuk preview identitas & keperluan
                                        const firstAnswer = item.answers[0];
                                        const secondAnswer = item.answers[1];

                                        const primaryText = firstAnswer?.custom_text || firstAnswer?.option?.label || `Pengunjung #${index + 1}`;

                                        const secondaryText = secondAnswer?.custom_text || secondAnswer?.option?.label || null;

                                        // Kumpulkan opsi yang dipilih
                                        const selectedOptions = item.answers.filter((a) => a.option?.label).map((a) => a.option!.label);

                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell className="text-center font-medium text-muted-foreground">{index + 1}</TableCell>

                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground">{formatIndonesianDate(item.created_at)}</span>
                                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Clock className="size-3" />
                                                            {item.created_at_human}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-foreground">{primaryText}</span>
                                                        {secondaryText && <span className="text-xs text-muted-foreground">{secondaryText}</span>}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {selectedOptions.length > 0 ? (
                                                            selectedOptions.slice(0, 2).map((opt, i) => (
                                                                <Badge key={i} variant="secondary" className="text-xs font-normal">
                                                                    {opt}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">-</span>
                                                        )}
                                                        {selectedOptions.length > 2 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{selectedOptions.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="text-xs">
                                                        {item.answers.length} Terjawab
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="outline"
                                                            size="icon-sm"
                                                            onClick={() => setSelectedGuestBook(item)}
                                                            title="Lihat Detail Jawaban"
                                                        >
                                                            <Eye className="size-3.5" />
                                                        </Button>

                                                        {hasAdminsAuthority && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon-sm"
                                                                className="text-destructive hover:bg-destructive/10"
                                                                onClick={() => setDeleteTarget(item)}
                                                                title="Hapus Data Tamu"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Detail Dialog */}
            <Dialog
                open={selectedGuestBook !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedGuestBook(null);
                    }
                }}
            >
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <div className="flex items-center gap-2 text-primary">
                            <BookOpen className="size-5" />
                            <DialogTitle>Detail Jawaban Buku Tamu</DialogTitle>
                        </div>
                        <DialogDescription>
                            Waktu Kunjungan: {formatIndonesianDate(selectedGuestBook?.created_at)} ({selectedGuestBook?.created_at_human})
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
                        {selectedGuestBook?.answers.map((answer, index) => {
                            const questionLabel = answer.question?.label || `Pertanyaan #${index + 1}`;
                            const optionLabel = answer.option?.label;
                            const customText = answer.custom_text;

                            return (
                                <div key={answer.id || index} className="rounded-lg border border-border bg-muted/20 p-4">
                                    <div className="mb-2 flex items-start gap-2">
                                        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                            {index + 1}
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-foreground">{questionLabel}</span>
                                            {answer.question?.description && (
                                                <span className="text-xs text-muted-foreground">{answer.question.description}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 pl-8">
                                        {optionLabel && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">Pilihan Opsi:</span>
                                                <Badge variant="secondary" className="font-medium">
                                                    {optionLabel}
                                                </Badge>
                                            </div>
                                        )}

                                        {customText ? (
                                            <div className="space-y-1">
                                                {optionLabel && <span className="text-xs text-muted-foreground">Keterangan:</span>}
                                                <div className="rounded-md border border-border/60 bg-background p-2.5 text-sm text-foreground">
                                                    {customText}
                                                </div>
                                            </div>
                                        ) : !optionLabel ? (
                                            <span className="text-xs text-muted-foreground italic">(Tidak ada jawaban)</span>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <DialogFooter
                        className={`flex flex-col-reverse gap-2 sm:flex-row ${hasAdminsAuthority ? "sm:justify-between" : "sm:justify-end"}`}
                    >
                        {hasAdminsAuthority && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    setDeleteTarget(selectedGuestBook);
                                    setSelectedGuestBook(null);
                                }}
                            >
                                <Trash2 className="mr-1.5 size-4" />
                                Hapus Data Ini
                            </Button>
                        )}

                        <DialogClose asChild>
                            <Button variant="outline" size="sm">
                                Tutup
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteTarget !== null}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) {
                        setDeleteTarget(null);
                    }
                }}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-2 text-destructive">
                            <Trash2 className="size-5" />
                            <DialogTitle>Hapus Kunjungan Tamu?</DialogTitle>
                        </div>
                        <DialogDescription>
                            Tindakan ini akan menghapus data kunjungan tamu ini beserta seluruh jawaban yang telah diisikan. Apakah Anda yakin ingin
                            melanjutkan?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" disabled={isDeleting} onClick={() => setDeleteTarget(null)}>
                            Batal
                        </Button>
                        <Button variant="destructive" disabled={isDeleting} onClick={handleDelete}>
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-1.5 size-4 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                "Ya, Hapus Data"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default GuestBookIndex;
