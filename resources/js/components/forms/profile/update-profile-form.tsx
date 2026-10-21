import { AvatarDropzone } from "@/components/avatar-drop-zone";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { resolveInertiaErrorMessage, resolveInertiaFieldError } from "@/lib/inertia-errors";
import { updateProfileSchema, type UpdateProfileSchemaType } from "@/lib/validations/profile";
import Profile from "@/routes/profile";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisitHelperOptions } from "@inertiajs/core";
import { Link, router } from "@inertiajs/react";
import { Save } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    user: User;
}

const formFields = ["name", "email", "avatar"] as const;

const UpdateProfileForm = ({ user }: Props) => {
    const [formErrorMessage, setFormErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<UpdateProfileSchemaType>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            avatar: null,
        },
    });

    function onSubmit(data: UpdateProfileSchemaType) {
        setFormErrorMessage("");

        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: "Profil berhasil diperbarui.",
                });
                form.resetField("avatar", { defaultValue: null });
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

        const payload = new FormData();
        payload.append("name", data.name);
        payload.append("email", data.email);

        if (data.avatar) {
            payload.append("avatar", data.avatar);
        }

        router.post(Profile.update().url, payload, requestOptions);
    }

    return (
        <form id="form-update-profile" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}
            <FieldGroup>
                <Controller
                    name="avatar"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Foto Profil</FieldLabel>
                            <AvatarDropzone
                                name={form.watch("name") || user.name}
                                currentAvatar={user.avatar}
                                value={field.value}
                                onChange={field.onChange}
                            />
                            <FieldDescription>Foto profil akan ditampilkan pada sidebar dan halaman profil Anda.</FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Nama Lengkap</FieldLabel>
                            <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Nama lengkap" autoComplete="name" />
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
                                autoComplete="email"
                            />
                            <FieldDescription>Email digunakan untuk masuk ke dashboard.</FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Field orientation="horizontal" className="w-full justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" asChild>
                        <Link href={Profile.show().url}>Batal</Link>
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner /> : <Save />}
                        Simpan Perubahan
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
};

export default UpdateProfileForm;
