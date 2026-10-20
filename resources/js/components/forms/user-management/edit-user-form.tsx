import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { resolveInertiaErrorMessage, resolveInertiaFieldError } from "@/lib/inertia-errors";
import {
    editUserSchema,
    editableUserRole,
    getUserRoleLabel,
    type EditableUserRoleType,
    type EditUserSchemaType,
} from "@/lib/validations/user-management";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisitHelperOptions } from "@inertiajs/core";
import { router } from "@inertiajs/react";
import { Eye, EyeOff, Save } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    user: User;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const formFields = ["name", "email", "role", "password"] as const;

const EditUserForm = ({ user, onSuccess, onCancel }: Props) => {
    const [formErrorMessage, setFormErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            role: user.role as EditableUserRoleType,
            password: "",
        },
    });

    function onSubmit(data: EditUserSchemaType) {
        setFormErrorMessage("");

        const payload: Record<string, string> = {};

        if (data.name !== user.name) {
            payload.name = data.name;
        }

        if (data.email !== user.email) {
            payload.email = data.email;
        }

        if (data.role !== user.role) {
            payload.role = data.role;
        }

        if (data.password) {
            payload.password = data.password;
        }

        if (Object.keys(payload).length === 0) {
            toast.info("Tidak ada perubahan", {
                description: "Ubah data terlebih dahulu sebelum menyimpan.",
            });

            return;
        }

        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: `Data ${user.name} berhasil diperbarui.`,
                });
                onSuccess?.();
            },
            onError: (errors) => {
                formFields.forEach((fieldName) => {
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

        router.patch(`/_api/dashboard/management/users/${user.id}`, payload, requestOptions);
    }

    return (
        <form id="form-edit-user" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                        {editableUserRole.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {getUserRoleLabel(role)}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FieldDescription>Role Superadmin hanya dapat diberikan melalui aksi promosi.</FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Password Baru</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Kosongkan jika tidak diubah"
                                    autoComplete="new-password"
                                    type={showPassword ? "text" : "password"}
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton
                                        size="icon-sm"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldDescription>Isi hanya jika ingin mengganti password pengguna.</FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Field orientation="horizontal" className="w-full justify-end gap-2 pt-2">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                            Batal
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner /> : <Save />}
                        Simpan Perubahan
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
};

export default EditUserForm;
