import UserRoleBadge from "@/components/user-role-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { getInitials } from "@/lib";
import { resolveInertiaErrorMessage } from "@/lib/inertia-errors";
import { User } from "@/types";
import { VisitHelperOptions } from "@inertiajs/core";
import { router } from "@inertiajs/react";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
    user: User | null;
    onClose: () => void;
}

const DeleteUserForm = ({ user, onClose }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    useEffect(() => {
        setFormErrorMessage("");
    }, [user?.id]);

    function handleDeleteUser() {
        if (!user) {
            return;
        }

        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: `Pengguna ${user.name} berhasil dihapus.`,
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

        router.delete(`/_api/dashboard/management/users/${user.id}`, requestOptions);
    }

    return (
        <Dialog
            open={user !== null}
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
                    <DialogTitle>Hapus Pengguna</DialogTitle>
                    <DialogDescription>Tindakan ini permanen dan tidak dapat dibatalkan.</DialogDescription>
                </DialogHeader>

                {user && (
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
                        <Avatar>
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-medium text-foreground">{user.name}</span>
                            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                        </div>
                        <UserRoleBadge role={user.role} className="ml-auto" />
                    </div>
                )}

                {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isLoading}>
                            Batal
                        </Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDeleteUser} disabled={isLoading}>
                        {isLoading ? <Spinner /> : <Trash2 />}
                        Hapus Pengguna
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteUserForm;
