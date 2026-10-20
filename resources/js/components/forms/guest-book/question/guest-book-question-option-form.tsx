import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { resolveInertiaErrorMessage, resolveInertiaFieldError } from "@/lib/inertia-errors";
import { guestBookQuestionOptionFormSchema, type GuestBookQuestionOptionFormSchemaType } from "@/lib/validations/guest-book/question";
import { createGuestBookQuestionOption, updateGuestBookQuestionOption } from "@/routes";
import { GuestBookQuestion, GuestBookQuestionOption } from "@/types/guest-book";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisitHelperOptions } from "@inertiajs/core";
import { router } from "@inertiajs/react";
import { ListPlus, Save } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    question: GuestBookQuestion;
    option?: GuestBookQuestionOption | null;
    onCancel: () => void;
}

const GuestBookQuestionOptionForm = ({ question, option = null, onCancel }: Props) => {
    const isEditing = option !== null;
    const [isLoading, setIsLoading] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");
    const form = useForm({
        resolver: zodResolver(guestBookQuestionOptionFormSchema),
        defaultValues: {
            label: option?.label ?? "",
            description: option?.description ?? null,
            is_allow_custom_text: Boolean(option?.is_allow_custom_text),
        },
    });

    function onSubmit(data: GuestBookQuestionOptionFormSchemaType) {
        setFormErrorMessage("");

        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: isEditing ? "Pilihan jawaban berhasil diperbarui." : "Pilihan jawaban berhasil ditambahkan.",
                });
                onCancel();
            },
            onError: (errors) => {
                (["label", "description"] as const).forEach((fieldName) => {
                    const message = resolveInertiaFieldError(errors[fieldName]);

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

        if (isEditing) {
            router.patch(updateGuestBookQuestionOption.url(option.id), data, requestOptions);

            return;
        }

        router.post(createGuestBookQuestionOption.url(question.id), data, requestOptions);
    }

    return (
        <form id="form-guest-book-question-option" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}

            <FieldGroup>
                <Controller
                    name="label"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Label Pilihan</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Contoh: Laki-laki / Sangat Puas"
                                autoComplete="off"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Keterangan Tambahan</FieldLabel>
                            <Input
                                {...field}
                                value={field.value ?? ""}
                                onChange={(event) => field.onChange(event.target.value || null)}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Keterangan singkat jika diperlukan"
                                autoComplete="off"
                            />
                            <FieldDescription>Opsional, ditampilkan sebagai catatan pada pilihan jawaban.</FieldDescription>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="is_allow_custom_text"
                    control={form.control}
                    render={({ field }) => (
                        <Field orientation="horizontal" className="items-center gap-2">
                            <Checkbox
                                id={field.name}
                                checked={Boolean(field.value)}
                                onCheckedChange={(checked) => field.onChange(checked === true)}
                            />
                            <FieldLabel htmlFor={field.name} className="cursor-pointer text-sm font-normal text-muted-foreground">
                                Izinkan pengunjung mengisi teks khusus untuk opsi ini
                            </FieldLabel>
                        </Field>
                    )}
                />

                <Field orientation="horizontal" className="w-full justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner /> : isEditing ? <Save /> : <ListPlus />}
                        {isEditing ? "Simpan Perubahan" : "Tambah Pilihan"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
};

export default GuestBookQuestionOptionForm;
