import { ArrowUp, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { router } from "@inertiajs/react";
import { VisitHelperOptions } from "@inertiajs/core";
import { Spinner } from "@/components/ui/spinner";
import { FieldError } from "@/components/ui/field";

interface Props {
    user: User;
}

const PromoteToSuperadminForm = ({ user }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    function handleDeleteUser() {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: `Berhasil Mempromosikan ${user.name} ke Superadmin!`,
                });
                setIsOpen(false);
            },
            onError: (error) => {
                const errMessage = error?.server || "Coba lagi beberapa saat";
                setFormErrorMessage(errMessage);
                toast.error("Terjadi Kesalahan!", {
                    description: errMessage,
                });
            },
        } satisfies VisitHelperOptions;

        router.post(`/_api/dashboard/management/users/${user.id}/promote-to-superadmin`, undefined, requestOptions);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <ArrowUp /> Promosikan ke Superadmin
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Apakah anda yakin?</DialogTitle>
                    <DialogDescription className="text-destructive">Anda tidak akan mendapatkan otoritas Superadmin lagi</DialogDescription>
                    {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button>Batal</Button>
                    </DialogClose>
                    <Button onClick={handleDeleteUser}>{isLoading ? <Spinner /> : "Promosikan Pengguna"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PromoteToSuperadminForm;
