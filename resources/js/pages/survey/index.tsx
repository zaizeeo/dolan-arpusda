import SubmitSurveyForm from "@/components/forms/survey/submit-survey-form";
import PublicFormLayout from "@/components/layouts/public-form-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PageProps } from "@/types/page-props";
import type { PublicSurvey } from "@/types/survey";
import { Head } from "@inertiajs/react";
import { ClipboardList, HelpCircle } from "lucide-react";

interface Props extends PageProps {
    survey: PublicSurvey | null;
}

const SurveyPage = ({ survey }: Props) => {
    return (
        <PublicFormLayout
            activeForm="survey"
            badge="Survei Layanan"
            badgeIcon={ClipboardList}
            title={survey?.title ?? "Survei Layanan"}
            description={survey?.description ?? "Bantu kami meningkatkan kualitas layanan Jeta Arsip dengan mengisi survei singkat berikut."}
            footerDescription="Sistem Informasi Layanan Jeta Arsip."
        >
            <Head title={survey?.title ?? "Survei"} />

            {!survey || survey.questions.length === 0 ? (
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
                            <CardTitle className="text-lg leading-snug font-semibold text-card-foreground">{survey.title}</CardTitle>
                        </div>
                        <CardDescription>
                            Mohon lengkapi semua pertanyaan bertanda bintang (<span className="text-destructive">*</span>) sesuai pengalaman Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <SubmitSurveyForm surveyId={survey.id} questions={survey.questions} redirectAfterSubmit="home" />
                    </CardContent>
                </Card>
            )}
        </PublicFormLayout>
    );
};

export default SurveyPage;
