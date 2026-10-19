import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { capitalizeText } from "@/lib";
import { allowedUserRole, type AllowedUserRoleType, editUserSchema, EditUserSchemaType } from "@/lib/validations/user-management";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisitHelperOptions } from "@inertiajs/core";
import { router } from "@inertiajs/react";
import { Eye, Pencil } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    user: User;
}

const EditUserForm = ({ user }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({ password: false, password_confirmation: false });
    const form = useForm({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            password: "",
            role: user.role as AllowedUserRoleType[number],
        },
    });

    function onSubmit(data: EditUserSchemaType) {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: "Data pengguna telah diedit!",
                });
                form.reset();
                setIsOpen(false);
            },
            onError: (error) => {
                console.log({ error });

                const errMessage = error?.server || "Coba lagi beberapa saat";
                setFormErrorMessage(errMessage);
                toast.error("Terjadi Kesalahan!", {
                    description: errMessage,
                });
            },
        } satisfies VisitHelperOptions;

        router.patch(`/_api/dashboard/management/users/${user.id}`, data, requestOptions);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Pencil /> Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Buat Pengguna</DialogTitle>
                    <DialogDescription>Buat Pengguna Baru</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-80 overflow-y-auto pr-3 pb-3">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="m-2">
                        {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="nama@email.com"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
                                        <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="John" autoComplete="off" />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="role"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                        <Select
                                            defaultValue={field.value}
                                            value={field.value}
                                            onValueChange={(v) => {
                                                field.onChange(v as AllowedUserRoleType[number]);
                                            }}
                                        >
                                            <SelectTrigger className="w-full max-w-48">
                                                <SelectValue placeholder="Pilih Role" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectGroup>
                                                    <SelectLabel>Role</SelectLabel>
                                                    {allowedUserRole.map((role) => (
                                                        <SelectItem value={role}>{capitalizeText(role)}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>{" "}
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                {...field}
                                                id={field.name}
                                                aria-invalid={fieldState.invalid}
                                                placeholder="********"
                                                autoComplete="off"
                                                type={showPassword.password ? "text" : "password"}
                                            />
                                            <InputGroupAddon
                                                className="cursor-pointer"
                                                onClick={() => setShowPassword((prev) => ({ ...prev, password: !prev.password }))}
                                                align={"inline-end"}
                                            >
                                                <Eye />
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Button disabled={isLoading}>{isLoading ? <Spinner /> : "Edit Pengguna"}</Button>
                        </FieldGroup>
                    </form>
                </ScrollArea>

                <DialogFooter>Formulir Edit Pengguna</DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditUserForm;
