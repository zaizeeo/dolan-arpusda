import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { resolveInertiaErrorMessage, resolveInertiaFieldError } from "@/lib/inertia-errors";
import { updatePasswordSchema, type UpdatePasswordSchemaType } from "@/lib/validations/profile";
import Password from "@/routes/profile/password";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisitHelperOptions } from "@inertiajs/core";
import { router } from "@inertiajs/react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const formFields = ["current_password", "password", "password_confirmation"] as const;

const UpdatePasswordForm = () => {
    const [formErrorMessage, setFormErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({
        current_password: false,
        password: false,
        password_confirmation: false,
    });

    const form = useForm<UpdatePasswordSchemaType>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            current_password: "",
            password: "",
            password_confirmation: "",
        },
    });

    function onSubmit(data: UpdatePasswordSchemaType) {
        setFormErrorMessage("");

        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: "Password berhasil diperbarui.",
                });
                form.reset();
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

        router.patch(Password.update().url, data, requestOptions);
    }

    const renderPasswordField = (
        name: (typeof formFields)[number],
        label: string,
        placeholder: string,
        autoComplete: string,
        description?: string,
    ) => (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder={placeholder}
                            autoComplete={autoComplete}
                            type={showPassword[name] ? "text" : "password"}
                        />
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton
                                type="button"
                                size="icon-sm"
                                onClick={() => setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }))}
                                aria-label={showPassword[name] ? `Sembunyikan ${label.toLowerCase()}` : `Tampilkan ${label.toLowerCase()}`}
                            >
                                {showPassword[name] ? <EyeOff /> : <Eye />}
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                    {description && <FieldDescription>{description}</FieldDescription>}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    );

    return (
        <form id="form-update-password" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}
            <FieldGroup>
                {renderPasswordField(
                    "current_password",
                    "Password Saat Ini",
                    "Masukkan password saat ini",
                    "current-password",
                    "Diperlukan untuk memastikan perubahan dilakukan oleh pemilik akun.",
                )}
                {renderPasswordField("password", "Password Baru", "Minimal 8 karakter", "new-password")}
                {renderPasswordField("password_confirmation", "Konfirmasi Password Baru", "Ulangi password baru", "new-password")}

                <Field orientation="horizontal" className="w-full justify-end gap-2 pt-2">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner /> : <KeyRound />}
                        Simpan Password
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
};

export default UpdatePasswordForm;
