import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { resolveInertiaErrorMessage } from "@/lib/inertia-errors";
import { deleteSurveyQuestionOption } from "@/routes";
import type { SurveyQuestionOption } from "@/types/survey";
import { router, type VisitHelperOptions } from "@inertiajs/core";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    option: SurveyQuestionOption | null;
    questionLabel?: string;
    onClose: () => void;
}

export function DeleteSurveyQuestionOption({ option, questionLabel, onClose }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = () => {
        if (!option) {
            return;
        }

        setIsLoading(true);

        const requestOptions = {
            preserveScroll: true,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", { description: "Pilihan jawaban berhasil dihapus." });
                onClose();
            },
            onError: (error) => {
                toast.error("Terjadi Kesalahan!", {
                    description: resolveInertiaErrorMessage(error as Record<string, unknown>),
                });
            },
        } satisfies VisitHelperOptions;

        router.delete(deleteSurveyQuestionOption.url(option.id), requestOptions);
    };

    return (
        <Dialog open={option !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Hapus Pilihan Jawaban</DialogTitle>
                    <DialogDescription>
                        Pilihan <span className="font-medium text-foreground">{option?.label}</span>
                        {questionLabel ? ` pada pertanyaan "${questionLabel}"` : ""} akan dihapus. Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                        Batal
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading} className="gap-2">
                        {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                        Hapus Pilihan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteSurveyQuestionOption;
