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
import { ArrowUpCircle, Crown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
    user: User | null;
    onClose: () => void;
}

const PromoteToSuperadminForm = ({ user, onClose }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    useEffect(() => {
        setFormErrorMessage("");
    }, [user?.id]);

    function handlePromoteUser() {
        if (!user) {
            return;
        }

        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: `${user.name} sekarang menjadi Superadmin.`,
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

        router.post(`/_api/dashboard/management/users/${user.id}/promote-to-superadmin`, undefined, requestOptions);
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
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Crown className="size-5" />
                    </div>
                    <DialogTitle>Jadikan Superadmin</DialogTitle>
                    <DialogDescription>Pengguna ini akan menggantikan Anda sebagai Superadmin.</DialogDescription>
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

                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                    Setelah dipromosikan, role Anda akan diturunkan menjadi Admin dan hak akses Superadmin berpindah ke pengguna ini.
                </div>

                {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isLoading}>
                            Batal
                        </Button>
                    </DialogClose>
                    <Button onClick={handlePromoteUser} disabled={isLoading}>
                        {isLoading ? <Spinner /> : <ArrowUpCircle />}
                        Promosikan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PromoteToSuperadminForm;
