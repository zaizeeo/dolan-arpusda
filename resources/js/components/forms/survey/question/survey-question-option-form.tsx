import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { resolveInertiaErrorMessage } from "@/lib/inertia-errors";
import { surveyQuestionOptionFormSchema, type SurveyQuestionOptionFormSchemaType } from "@/lib/validations/survey/question";
import { createSurveyQuestionOption, updateSurveyQuestionOption } from "@/routes";
import type { SurveyQuestion, SurveyQuestionOption } from "@/types/survey";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, type VisitHelperOptions } from "@inertiajs/core";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    question: SurveyQuestion;
    option?: SurveyQuestionOption | null;
    onCancel: () => void;
}

export function SurveyQuestionOptionForm({ question, option = null, onCancel }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    const isEditing = option !== null;

    const form = useForm<SurveyQuestionOptionFormSchemaType>({
        resolver: zodResolver(surveyQuestionOptionFormSchema),
        defaultValues: {
            label: option?.label ?? "",
            description: option?.description ?? null,
            is_allow_custom_text: Boolean(option?.is_allow_custom_text),
        },
    });

    const onSubmit = (data: SurveyQuestionOptionFormSchemaType) => {
        setIsLoading(true);
        setFormErrorMessage("");

        const payload = {
            label: data.label,
            description: data.description?.trim() ? data.description : null,
            is_allow_custom_text: Boolean(data.is_allow_custom_text),
        };

        const requestOptions = {
            preserveScroll: true,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: isEditing ? "Pilihan jawaban berhasil diperbarui." : "Pilihan jawaban berhasil ditambahkan.",
                });
                onCancel();
            },
            onError: (error) => {
                const message = resolveInertiaErrorMessage(error as Record<string, unknown>);
                setFormErrorMessage(message);
                toast.error("Terjadi Kesalahan!", { description: message });
            },
        } satisfies VisitHelperOptions;

        if (isEditing && option) {
            router.patch(updateSurveyQuestionOption.url(option.id), payload, requestOptions);

            return;
        }

        router.post(createSurveyQuestionOption.url(question.id), payload, requestOptions);
    };

    return (
        <form id="form-survey-question-option" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}

            <FieldGroup className="space-y-4">
                <Controller
                    name="label"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={Boolean(fieldState.invalid)}>
                            <FieldLabel htmlFor="survey-option-form-label">Label Pilihan</FieldLabel>
                            <Input
                                id="survey-option-form-label"
                                placeholder="Contoh: Sangat Puas"
                                aria-invalid={Boolean(fieldState.invalid)}
                                {...field}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={Boolean(fieldState.invalid)}>
                            <FieldLabel htmlFor="survey-option-form-description">Deskripsi</FieldLabel>
                            <Input
                                id="survey-option-form-description"
                                placeholder="Opsional"
                                aria-invalid={Boolean(fieldState.invalid)}
                                value={field.value ?? ""}
                                onChange={(event) => field.onChange(event.target.value === "" ? null : event.target.value)}
                            />
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
                                id="survey-option-form-custom-text"
                                checked={Boolean(field.value)}
                                onCheckedChange={(checked) => field.onChange(checked === true)}
                            />
                            <FieldLabel htmlFor="survey-option-form-custom-text" className="text-sm font-normal">
                                Izinkan keterangan tambahan
                            </FieldLabel>
                        </Field>
                    )}
                />
            </FieldGroup>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Batal
                </Button>
                <Button type="submit" disabled={isLoading} className="gap-2">
                    {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    {isEditing ? "Simpan Perubahan" : "Tambah Pilihan"}
                </Button>
            </div>
        </form>
    );
}

export default SurveyQuestionOptionForm;
