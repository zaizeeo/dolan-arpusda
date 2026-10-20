import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { resolveInertiaErrorMessage, resolveInertiaFieldError } from "@/lib/inertia-errors";
import { editGuestBookQuestionSchema, type EditGuestBookQuestionSchemaType } from "@/lib/validations/guest-book/question";
import { updateGuestBookQuestion } from "@/routes";
import { GuestBookQuestion } from "@/types/guest-book";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisitHelperOptions } from "@inertiajs/core";
import { router } from "@inertiajs/react";
import { Save } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    question: GuestBookQuestion;
    onCancel: () => void;
}

const EditGuestBookQuestionForm = ({ question, onCancel }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");
    const form = useForm({
        resolver: zodResolver(editGuestBookQuestionSchema),
        defaultValues: {
            label: question.label,
            description: question.description ?? "",
            is_active: question.is_active,
        },
    });

    function onSubmit(data: EditGuestBookQuestionSchemaType) {
        setFormErrorMessage("");

        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: "Pertanyaan berhasil diperbarui.",
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

        router.patch(updateGuestBookQuestion.url(question.id), data, requestOptions);
    }

    return (
        <form id="form-edit-guest-book-question" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}

            <FieldGroup>
                <Controller
                    name="label"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>Label Pertanyaan</FieldLabel>
                            <Input
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Contoh: Pekerjaan / Maksud Kunjungan"
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
                            <FieldLabel htmlFor={field.name}>Deskripsi Pertanyaan</FieldLabel>
                            <Textarea
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Tuliskan petunjuk pengisian bagi pengunjung..."
                                rows={3}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="is_active"
                    control={form.control}
                    render={({ field }) => (
                        <Field orientation="horizontal" className="items-center gap-2">
                            <Checkbox
                                id={field.name}
                                checked={Boolean(field.value)}
                                onCheckedChange={(checked) => field.onChange(checked === true)}
                            />
                            <FieldLabel htmlFor={field.name} className="cursor-pointer text-sm font-normal text-muted-foreground">
                                Tampilkan pertanyaan ini pada formulir buku tamu
                            </FieldLabel>
                        </Field>
                    )}
                />

                <Field orientation="horizontal" className="w-full justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Batal
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

export default EditGuestBookQuestionForm;
