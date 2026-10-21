import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { resolveInertiaErrorMessage, resolveInertiaFieldError } from "@/lib/inertia-errors";
import { userControllerCreate } from "@/routes";
import {
    allowedUserRole,
    createUserSchema,
    getUserRoleLabel,
    type AllowedUserRoleType,
    type CreateUserSchemaType,
} from "@/lib/validations/user-management";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisitHelperOptions } from "@inertiajs/core";
import { router } from "@inertiajs/react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    onSuccess?: () => void;
    onCancel?: () => void;
}

const fieldNames = ["name", "email", "role", "password", "password_confirmation"] as const;

const CreateUserForm = ({ onSuccess, onCancel }: Props) => {
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
            role: "staff" as AllowedUserRoleType,
        },
    });

    function onSubmit(data: CreateUserSchemaType) {
        setFormErrorMessage("");

        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: "Pengguna baru berhasil dibuat.",
                });
                form.reset();
                onSuccess?.();
            },
            onError: (errors) => {
                fieldNames.forEach((fieldName) => {
                    const message = resolveInertiaFieldError(errors[fieldName as keyof typeof errors]);

                    if (message) {
                        form.setError(fieldName, { type: "server", message });
                    }
                });

                const errMessage = resolveInertiaErrorMessage(errors as Record<string, unknown>);
                setFormErrorMessage(errMessage);
                toast.error("Terjadi Kesalahan!", {
                    description: errMessage,
                });
            },
        } satisfies VisitHelperOptions;

        router.post(userControllerCreate.url(), data, requestOptions);
    }

    return (
        <form id="form-create-user" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}
            <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Nama Lengkap</FieldLabel>
                                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Nama pengguna" autoComplete="off" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
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
                </div>

                <Controller
                    name="role"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger id={field.name} className="w-full" aria-invalid={fieldState.invalid}>
                                    <SelectValue placeholder="Pilih role pengguna" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectGroup>
                                        <SelectLabel>Role Pengguna</SelectLabel>
                                        {allowedUserRole.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {getUserRoleLabel(role)}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FieldDescription>Menentukan hak akses pengguna di dalam dashboard.</FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
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
                                        placeholder="Minimal 8 karakter"
                                        autoComplete="new-password"
                                        type={showPassword.password ? "text" : "password"}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            size="icon-sm"
                                            onClick={() => setShowPassword((prev) => ({ ...prev, password: !prev.password }))}
                                            aria-label={showPassword.password ? "Sembunyikan password" : "Tampilkan password"}
                                        >
                                            {showPassword.password ? <EyeOff /> : <Eye />}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
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
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ulangi password"
                                        autoComplete="new-password"
                                        type={showPassword.password_confirmation ? "text" : "password"}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            size="icon-sm"
                                            onClick={() =>
                                                setShowPassword((prev) => ({
                                                    ...prev,
                                                    password_confirmation: !prev.password_confirmation,
                                                }))
                                            }
                                            aria-label={
                                                showPassword.password_confirmation
                                                    ? "Sembunyikan konfirmasi password"
                                                    : "Tampilkan konfirmasi password"
                                            }
                                        >
                                            {showPassword.password_confirmation ? <EyeOff /> : <Eye />}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>

                <Field orientation="horizontal" className="w-full justify-end gap-2 pt-2">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                            Batal
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner /> : <UserPlus />}
                        Buat Pengguna
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
};

export default CreateUserForm;
