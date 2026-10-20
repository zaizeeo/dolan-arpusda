import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { resolveInertiaErrorMessage } from "@/lib/inertia-errors";
import { deleteGuestBookQuestionOption } from "@/routes";
import { GuestBookQuestionOption } from "@/types/guest-book";
import { VisitHelperOptions } from "@inertiajs/core";
import { router } from "@inertiajs/react";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
    option: GuestBookQuestionOption | null;
    questionLabel?: string;
    onClose: () => void;
}

const DeleteGuestBookQuestionOption = ({ option, questionLabel, onClose }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    useEffect(() => {
        setFormErrorMessage("");
    }, [option?.id]);

    function handleDeleteOption() {
        if (!option) {
            return;
        }

        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: "Pilihan jawaban berhasil dihapus.",
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

        router.delete(deleteGuestBookQuestionOption.url(option.id), requestOptions);
    }

    return (
        <Dialog
            open={option !== null}
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
                    <DialogTitle>Hapus Pilihan Jawaban</DialogTitle>
                    <DialogDescription>
                        Pilihan jawaban ini akan dihapus dari formulir. Riwayat jawaban tamu yang memilih opsi ini tetap tersimpan.
                    </DialogDescription>
                </DialogHeader>

                {option && (
                    <div className="flex flex-col rounded-lg border border-border bg-muted/40 p-3">
                        <span className="text-sm font-medium text-foreground">{option.label}</span>
                        {questionLabel && <span className="text-xs text-muted-foreground">Pada pertanyaan: {questionLabel}</span>}
                    </div>
                )}

                {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isLoading}>
                            Batal
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDeleteOption} disabled={isLoading}>
                        {isLoading ? <Spinner /> : <Trash2 />}
                        Hapus Pilihan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteGuestBookQuestionOption;
