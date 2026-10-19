import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { createUserSchema, allowedUserRole, type AllowedUserRoleType, CreateUserSchemaType } from "@/lib/validations/user-management";
import { useState } from "react";
import { capitalizeText } from "@/lib";
import { router } from "@inertiajs/react";
import { VisitHelperOptions } from "@inertiajs/core";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

const CreateUserForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({ password: false, password_confirmation: false });
    const form = useForm({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            role: "staff" as AllowedUserRoleType[number],
        },
    });

    function onSubmit(data: CreateUserSchemaType) {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: "Pengguna baru berhasil dibuat!",
                });
                form.reset();
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

        router.post("/_api/dashboard/management/users", data, requestOptions);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>+ Buat Pengguna Baru</Button>
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
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="********"
                                            autoComplete="off"
                                            type={showPassword.password ? "text" : "password"}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password_confirmation"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Konfirmasi Password</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="********"
                                            autoComplete="off"
                                            type={showPassword.password ? "text" : "password"}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Button disabled={isLoading}>{isLoading ? <Spinner /> : <>Buat Pengguna</>}</Button>
                        </FieldGroup>
                    </form>
                </ScrollArea>

                <DialogFooter>Formulir Membuat Pengguna Baru</DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateUserForm;
