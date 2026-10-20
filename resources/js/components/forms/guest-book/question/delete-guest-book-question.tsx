import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { resolveInertiaErrorMessage } from "@/lib/inertia-errors";
import { deleteGuestBookQuestion } from "@/routes";
import { GuestBookQuestion } from "@/types/guest-book";
import { VisitHelperOptions } from "@inertiajs/core";
import { router } from "@inertiajs/react";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
    question: GuestBookQuestion | null;
    onClose: () => void;
}

const DeleteGuestBookQuestion = ({ question, onClose }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    useEffect(() => {
        setFormErrorMessage("");
    }, [question?.id]);

    function handleDeleteQuestion() {
        if (!question) {
            return;
        }

        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: "Pertanyaan berhasil dihapus.",
                });
                onClose();
            },
            onError: (error) => {
                const errMessage = resolveInertiaErrorMessage(error as Record<string, unknown>);
                setFormErrorMessage(errMessage);
                toast.error("Terjadi Kesalahan!", {
                    description: errMessage,
                });
            },
        } satisfies VisitHelperOptions;

        router.delete(deleteGuestBookQuestion.url(question.id), requestOptions);
    }

    return (
        <Dialog
            open={question !== null}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <Trash2 className="size-5" />
                    </div>
                    <DialogTitle>Hapus Pertanyaan</DialogTitle>
                    <DialogDescription>
                        Pertanyaan ini beserta seluruh pilihan jawabannya akan dihapus. Riwayat jawaban tamu tetap tersimpan.
                    </DialogDescription>
                </DialogHeader>

                {question && (
                    <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-muted/40 p-3">
                        <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-medium text-foreground">{question.label}</span>
                            {question.description && <span className="truncate text-xs text-muted-foreground">{question.description}</span>}
                        </div>
                        <Badge variant="outline" className="shrink-0">
                            {question.options.length} opsi
                        </Badge>
                    </div>
                )}

                {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isLoading}>
                            Batal
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDeleteQuestion} disabled={isLoading}>
                        {isLoading ? <Spinner /> : <Trash2 />}
                        Hapus Pertanyaan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteGuestBookQuestion;
