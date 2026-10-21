import CreateGuestBookForm, { GuestBookQuestionItem } from "@/components/forms/guest-book/create-guest-book-form";
import PublicFormLayout from "@/components/layouts/public-form-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageProps } from "@/types/page-props";
import survey from "@/routes/survey";
import { Head, Link } from "@inertiajs/react";
import { BookOpen, CheckCircle2, ClipboardList, HelpCircle, PlusCircle, Sparkles } from "lucide-react";
import { useState } from "react";

interface Props extends PageProps {
    activeQuestions: Array<GuestBookQuestionItem>;
}

const HomePage = ({ activeQuestions = [] }: Props) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    return (
        <PublicFormLayout
            activeForm="guestbook"
            badge="Buku Tamu Digital"
            badgeIcon={Sparkles}
            title="Buku Tamu Kunjungan"
            description="Selamat datang di Dinas Arsip dan Perpustakaan Daerah Kabupaten Banyumas. Silakan lengkapi formulir di bawah ini untuk mencatat kunjungan Anda."
        >
            <Head title="Buku Tamu" />

            {isSubmitted ? (
                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <CheckCircle2 className="size-10" />
                        </div>
                        <CardTitle className="text-xl font-bold text-foreground sm:text-2xl">Terima Kasih Atas Kunjungan Anda!</CardTitle>
                        <CardDescription className="mx-auto mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
                            Data kunjungan Anda telah berhasil tersimpan di sistem Buku Tamu Jeta Arsip. Bantu kami meningkatkan layanan dengan
                            mengisi survei singkat berikut.
                        </CardDescription>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <Button asChild size="lg" className="font-medium">
                                <Link href={survey.show.url()}>
                                    <ClipboardList className="mr-2 size-4" />
                                    Isi Survei
                                </Link>
                            </Button>

                            <Button onClick={() => setIsSubmitted(false)} size="lg" variant="outline" className="font-medium">
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
        </PublicFormLayout>
    );
};

export default HomePage;
