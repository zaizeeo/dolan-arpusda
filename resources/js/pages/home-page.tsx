import CreateGuestBookForm, { GuestBookQuestionItem } from "@/components/forms/guest-book/create-guest-book-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageProps } from "@/types/page-props";
import { Link } from "@inertiajs/react";
import { BookOpen, CheckCircle2, HelpCircle, LayoutDashboard, LogIn, PlusCircle, Sparkles } from "lucide-react";
import { useState } from "react";

interface Props extends PageProps {
    activeQuestions: Array<GuestBookQuestionItem>;
}

const HomePage = ({ activeQuestions = [], auth }: Props) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    return (
        <div className="min-h-screen bg-muted/20 pb-16">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo-banyumas.png" alt="Logo Kabupaten Banyumas" className="size-9 object-contain" />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-tight text-foreground">Dolan Arpusda</span>
                            <span className="text-xs text-muted-foreground">Kabupaten Banyumas</span>
                        </div>
                    </div>

                    <Button variant="outline" size="sm" asChild>
                        {auth.user !== null ? (
                            <Link href="/dashboard">
                                <LayoutDashboard className="mr-1.5 size-4" />
                                Area Petugas
                            </Link>
                        ) : (
                            <Link href="/auth">
                                <LogIn className="mr-1.5 size-4" />
                                Area Petugas
                            </Link>
                        )}
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
                {/* Hero / Header Card */}
                <div className="mb-6 text-center">
                    <Badge variant="secondary" className="mb-3 gap-1.5 px-3 py-1 text-xs font-medium">
                        <Sparkles className="size-3.5 text-primary" />
                        Buku Tamu Digital
                    </Badge>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Buku Tamu Kunjungan</h1>
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                        Selamat datang di Dinas Arsip dan Perpustakaan Daerah Kabupaten Banyumas. Silakan lengkapi formulir di bawah ini untuk
                        mencatat kunjungan Anda.
                    </p>
                </div>

                {/* Form or State Display */}
                {isSubmitted ? (
                    <Card className="border-border bg-card shadow-sm">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <CheckCircle2 className="size-10" />
                            </div>
                            <CardTitle className="text-xl font-bold text-foreground sm:text-2xl">Terima Kasih Atas Kunjungan Anda!</CardTitle>
                            <CardDescription className="mx-auto mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
                                Data kunjungan Anda telah berhasil tersimpan di sistem Buku Tamu Dolan Arpusda. Selamat menikmati layanan kami.
                            </CardDescription>

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                <Button onClick={() => setIsSubmitted(false)} size="lg" className="font-medium">
                                    <PlusCircle className="mr-2 size-4" />
                                    Isi Buku Tamu Baru
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : activeQuestions.length === 0 ? (
                    <Card className="border-dashed border-border bg-card">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                <HelpCircle className="size-6" />
                            </div>
                            <CardTitle className="text-lg">Belum Ada Pertanyaan Aktif</CardTitle>
                            <CardDescription>
                                Saat ini belum ada pertanyaan buku tamu yang aktif di sistem. Silakan hubungi petugas perpustakaan atau arsip daerah.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    <Card className="border-border bg-card shadow-sm">
                        <CardHeader className="border-b border-border pb-4">
                            <div className="flex items-center gap-2 text-primary">
                                <BookOpen className="size-5" />
                                <CardTitle className="text-lg font-semibold text-card-foreground">Formulir Kunjungan</CardTitle>
                            </div>
                            <CardDescription>
                                Mohon lengkapi semua pertanyaan bertanda bintang (<span className="text-destructive">*</span>) dengan benar.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <CreateGuestBookForm questions={activeQuestions} onSuccessSubmit={() => setIsSubmitted(true)} />
                        </CardContent>
                    </Card>
                )}

                {/* Footer */}
                <footer className="mt-12 text-center text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} Dinas Arsip dan Perpustakaan Daerah Kabupaten Banyumas.</p>
                    <p className="mt-1">Sistem Informasi Buku Tamu Digital Dolan Arpusda.</p>
                </footer>
            </main>
        </div>
    );
};

export default HomePage;
