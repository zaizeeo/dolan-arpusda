import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { resolveInertiaErrorMessage } from "@/lib/inertia-errors";
import { deleteSurveyQuestion } from "@/routes";
import type { SurveyQuestion } from "@/types/survey";
import { router, type VisitHelperOptions } from "@inertiajs/core";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    question: SurveyQuestion | null;
    onClose: () => void;
}

export function DeleteSurveyQuestion({ question, onClose }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = () => {
        if (!question) {
            return;
        }

        setIsLoading(true);

        const requestOptions = {
            preserveScroll: true,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", { description: "Pertanyaan survei berhasil dihapus." });
                onClose();
            },
            onError: (error) => {
                toast.error("Terjadi Kesalahan!", {
                    description: resolveInertiaErrorMessage(error as Record<string, unknown>),
                });
            },
        } satisfies VisitHelperOptions;

        router.delete(deleteSurveyQuestion.url(question.id), requestOptions);
    };

    return (
        <Dialog open={question !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Hapus Pertanyaan Survei</DialogTitle>
                    <DialogDescription>
                        Pertanyaan <span className="font-medium text-foreground">{question?.label}</span> beserta seluruh pilihan jawabannya akan
                        dihapus. Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                        Batal
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading} className="gap-2">
                        {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                        Hapus Pertanyaan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteSurveyQuestion;
