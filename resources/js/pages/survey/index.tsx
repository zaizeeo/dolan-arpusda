import SubmitSurveyForm from "@/components/forms/survey/submit-survey-form";
import PublicFormLayout from "@/components/layouts/public-form-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { homePage } from "@/routes";
import type { PageProps } from "@/types/page-props";
import type { PublicSurvey } from "@/types/survey";
import { Head, Link } from "@inertiajs/react";
import { CheckCircle2, ClipboardList, HelpCircle, ListChecks, PlusCircle } from "lucide-react";
import { useState } from "react";

interface Props extends PageProps {
    survey: PublicSurvey | null;
}

const SurveyPage = ({ survey }: Props) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    return (
        <PublicFormLayout
            activeForm="survey"
            badge="Survei Layanan"
            badgeIcon={ClipboardList}
            title={survey?.title ?? "Survei Layanan"}
            description={survey?.description ?? "Bantu kami meningkatkan kualitas layanan Jeta Arsip dengan mengisi survei singkat berikut."}
            footerDescription="Sistem Informasi Layanan Jeta Arsip."
        >
            <Head title="Survei" />

            {isSubmitted ? (
                <Card className="border-border bg-card shadow-sm">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <CheckCircle2 className="size-10" />
                        </div>
                        <CardTitle className="text-xl font-bold text-foreground sm:text-2xl">Terima Kasih Atas Partisipasi Anda!</CardTitle>
                        <CardDescription className="mx-auto mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
                            Jawaban survei Anda telah berhasil disimpan. Masukan Anda sangat membantu kami dalam meningkatkan kualitas layanan.
                        </CardDescription>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <Button asChild size="lg" className="font-medium">
                                <Link href={homePage.url()}>
                                    <ListChecks className="mr-2 size-4" />
                                    Kembali ke Buku Tamu
                                </Link>
                            </Button>
                            <Button onClick={() => setIsSubmitted(false)} size="lg" variant="outline" className="font-medium">
                                <PlusCircle className="mr-2 size-4" />
                                Isi Survei Lagi
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : !survey || survey.questions.length === 0 ? (
                <Card className="border-dashed border-border bg-card">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <HelpCircle className="size-6" />
                        </div>
                        <CardTitle className="text-lg">Survei Belum Tersedia</CardTitle>
                        <CardDescription>
                            Saat ini belum ada survei aktif yang dapat diisi. Silakan kembali lagi nanti atau hubungi petugas layanan.
                        </CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <Card className="border-border bg-card shadow-sm">
                    <CardHeader className="border-b border-border pb-4">
                        <div className="flex items-center gap-2 text-primary">
                            <ClipboardList className="size-5" />
                            <CardTitle className="text-lg font-semibold text-card-foreground">Formulir Survei</CardTitle>
                        </div>
                        <CardDescription>
                            Mohon lengkapi semua pertanyaan bertanda bintang (<span className="text-destructive">*</span>) sesuai pengalaman Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <SubmitSurveyForm surveyId={survey.id} questions={survey.questions} onSuccessSubmit={() => setIsSubmitted(true)} />
                    </CardContent>
                </Card>
            )}
        </PublicFormLayout>
    );
};

export default SurveyPage;
