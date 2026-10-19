import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { User } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { router } from "@inertiajs/react";
import { VisitHelperOptions } from "@inertiajs/core";
import { Spinner } from "../ui/spinner";
import { FieldError } from "../ui/field";

interface Props {
    user: User;
}

const DeleteUserForm = ({ user }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    function handleDeleteUser() {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: "Pengguna baru berhasil dibuat!",
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

        router.delete(`/_api/dashboard/management/users/${user.id}`, requestOptions);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={"destructive"}>
                    <Trash /> Hapus
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Apakah anda yakin?</DialogTitle>
                    <DialogDescription className="text-destructive">Tindakan ini tidak bisa dipulihkan</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-1">
                    <h1 className="font-semibold">Menghapus Pengguna:</h1>
                    {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}

                    <div className="flex flex-col gap-1 pl-1">
                        <span>Nama: {user.name}</span>
                        <span>Email: {user.email}</span>
                        <span>Role: {user.role}</span>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button>Batal</Button>
                    </DialogClose>
                    <Button onClick={handleDeleteUser} variant={"destructive"}>
                        {isLoading ? <Spinner /> : "Hapus Pengguna"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteUserForm;
