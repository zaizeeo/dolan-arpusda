import CreateGuestBookForm, { GuestBookQuestionItem } from "@/components/forms/guest-book/create-guest-book-form";
import PublicFormLayout from "@/components/layouts/public-form-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import surveyRoutes from "@/routes/survey";
import { PageProps } from "@/types/page-props";
import { PublicSurvey } from "@/types/survey";
import { Head, Link } from "@inertiajs/react";
import { BookOpen, ClipboardList, HelpCircle, Sparkles, Timer } from "lucide-react";
import { useEffect, useState } from "react";

const SURVEY_OFFER_DURATION_SECONDS = 30;

interface Props extends PageProps {
    activeQuestions: Array<GuestBookQuestionItem>;
    survey: PublicSurvey | null;
}

const HomePage = ({ activeQuestions = [], survey = null }: Props) => {
    const [isSurveyDialogOpen, setIsSurveyDialogOpen] = useState(false);
    const [countdown, setCountdown] = useState(SURVEY_OFFER_DURATION_SECONDS);

    const hasActiveSurvey = Boolean(survey && survey.questions.length > 0);

    useEffect(() => {
        if (!isSurveyDialogOpen) {
            return;
        }

        if (countdown <= 0) {
            setIsSurveyDialogOpen(false);

            return;
        }

        const timer = window.setTimeout(() => setCountdown((current) => current - 1), 1000);

        return () => window.clearTimeout(timer);
    }, [countdown, isSurveyDialogOpen]);

    const closeSurveyDialog = () => {
        setIsSurveyDialogOpen(false);
        setCountdown(SURVEY_OFFER_DURATION_SECONDS);
    };

    const openSurveyDialog = () => {
        if (!hasActiveSurvey) {
            return;
        }

        setCountdown(SURVEY_OFFER_DURATION_SECONDS);
        setIsSurveyDialogOpen(true);
    };

    return (
        <PublicFormLayout
            activeForm="guestbook"
            badge="Buku Tamu Digital"
            badgeIcon={Sparkles}
            title=""
            description="Selamat datang di Dinas Arsip dan Perpustakaan Daerah Kabupaten Banyumas. Silakan lengkapi formulir di bawah ini untuk mencatat kunjungan Anda."
        >
            <Head title="Buku Tamu" />

            {activeQuestions.length === 0 ? (
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
                <Card className="border-border bg-card shadow-sm lg:my-auto lg:flex lg:flex-col lg:gap-1 lg:py-1.5">
                    <CardHeader className="border-b border-border pb-4 lg:pb-1.5">
                        <div className="flex items-center gap-2 text-primary">
                            <BookOpen className="size-5 shrink-0" />
                            <CardTitle className="text-lg font-semibold text-card-foreground lg:text-base">Formulir Kunjungan</CardTitle>
                        </div>
                        <CardDescription className="lg:text-xs">
                            Mohon lengkapi semua pertanyaan bertanda bintang (<span className="text-destructive">*</span>) dengan benar.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 lg:pt-1">
                        <CreateGuestBookForm questions={activeQuestions} onSuccessSubmit={openSurveyDialog} />
                    </CardContent>
                </Card>
            )}

            <Dialog
                open={isSurveyDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        closeSurveyDialog();
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-2 text-primary">
                            <Sparkles className="size-5" />
                            <DialogTitle className="text-lg">Bantu Kami dengan Survei Singkat</DialogTitle>
                        </div>
                        <DialogDescription>
                            Terima kasih, data kunjungan Anda berhasil disimpan. Bantu kami meningkatkan kualitas layanan dengan mengisi survei
                            singkat berikut pada halaman survei.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                                <Timer className="size-3.5" />
                                Penawaran berakhir dalam
                            </span>
                            <span className="font-semibold text-foreground">{countdown} detik</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
                                style={{ width: `${(countdown / SURVEY_OFFER_DURATION_SECONDS) * 100}%` }}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={closeSurveyDialog}>
                            Nanti Saja
                        </Button>
                        <Button asChild>
                            <Link href={surveyRoutes.show.url()} onClick={closeSurveyDialog}>
                                <ClipboardList className="size-4" />
                                Isi Survei Sekarang
                            </Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PublicFormLayout>
    );
};

export default HomePage;
