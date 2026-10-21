import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { resolveInertiaErrorMessage } from "@/lib/inertia-errors";
import { surveyQuestionOptionSchema } from "@/lib/validations/survey/question";
import { createSurveyQuestion, updateSurveyQuestion } from "@/routes";
import type { SurveyQuestion } from "@/types/survey";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, type VisitHelperOptions } from "@inertiajs/core";
import { ListPlus, Loader2, Plus, Save, Trash2, Type } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const surveyQuestionFormSchema = z.object({
    label: z.string("Harus text").min(2, "Minimal 2 karakter"),
    description: z.string("Harus text"),
    options: z.array(surveyQuestionOptionSchema).optional(),
});

type SurveyQuestionFormSchema = z.infer<typeof surveyQuestionFormSchema>;

interface Props {
    question?: SurveyQuestion | null;
    onCancel: () => void;
}

export function SurveyQuestionForm({ question = null, onCancel }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    const isEditing = question !== null;

    const form = useForm<SurveyQuestionFormSchema>({
        resolver: zodResolver(surveyQuestionFormSchema),
        defaultValues: {
            label: question?.label ?? "",
            description: question?.description ?? "",
            options: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "options",
    });

    const handleAddOption = () => {
        append({
            label: "",
            description: null,
            is_allow_custom_text: false,
        });
    };

    const onSubmit = (data: SurveyQuestionFormSchema) => {
        setIsLoading(true);
        setFormErrorMessage("");

        const payload = isEditing
            ? {
                  label: data.label,
                  description: data.description.trim() !== "" ? data.description : null,
              }
            : {
                  label: data.label,
                  description: data.description.trim() !== "" ? data.description : null,
                  options:
                      data.options && data.options.length > 0
                          ? data.options.map((option) => ({
                                label: option.label,
                                description: option.description?.trim() ? option.description : null,
                                is_allow_custom_text: Boolean(option.is_allow_custom_text),
                            }))
                          : null,
              };

        const requestOptions = {
            preserveScroll: true,
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: isEditing ? "Pertanyaan survei berhasil diperbarui." : "Pertanyaan survei berhasil ditambahkan.",
                });
                onCancel();
            },
            onError: (error) => {
                const message = resolveInertiaErrorMessage(error as Record<string, unknown>);
                setFormErrorMessage(message);
                toast.error("Terjadi Kesalahan!", { description: message });
            },
        } satisfies VisitHelperOptions;

        if (isEditing && question) {
            router.patch(updateSurveyQuestion.url(question.id), payload, requestOptions);

            return;
        }

        router.post(createSurveyQuestion.url(), payload, requestOptions);
    };

    return (
        <form id="form-survey-question" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}

            <FieldGroup className="space-y-4">
                <Controller
                    name="label"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={Boolean(fieldState.invalid)}>
                            <FieldLabel htmlFor="survey-question-label">Label Pertanyaan</FieldLabel>
                            <Input
                                id="survey-question-label"
                                placeholder="Contoh: Seberapa puas Anda dengan pelayanan petugas?"
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
                            <FieldLabel htmlFor="survey-question-description">Deskripsi</FieldLabel>
                            <Textarea
                                id="survey-question-description"
                                placeholder="Petunjuk tambahan untuk responden (opsional)"
                                rows={2}
                                aria-invalid={Boolean(fieldState.invalid)}
                                {...field}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                {!isEditing && (
                    <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-2">
                                    <FieldLabel className="text-sm font-semibold">Pilihan Jawaban</FieldLabel>
                                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                                        {fields.length > 0 ? `${fields.length} Opsi` : "Teks Bebas"}
                                    </span>
                                </div>
                                <FieldDescription className="mt-1">
                                    {fields.length > 0
                                        ? "Responden akan memilih salah satu dari opsi berikut."
                                        : "Tanpa opsi, responden akan mengisi jawaban berupa teks bebas."}
                                </FieldDescription>
                            </div>

                            <Button type="button" variant="outline" size="sm" onClick={handleAddOption} className="gap-1.5">
                                <Plus className="size-3.5" />
                                Tambah Opsi
                            </Button>
                        </div>

                        {fields.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card p-5 text-center">
                                <Type className="size-5 text-muted-foreground" />
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-foreground">Format Isian Teks Bebas</p>
                                    <p className="text-xs text-muted-foreground">
                                        Belum ada pilihan jawaban. Formulir ini akan menerima isian teks langsung.
                                    </p>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={handleAddOption} className="gap-1">
                                    <ListPlus className="size-3.5" />
                                    Ubah Jadi Pilihan Ganda
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {fields.map((fieldItem, index) => (
                                    <div key={fieldItem.id} className="space-y-3 rounded-lg border border-border bg-card p-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-semibold text-muted-foreground">Opsi {index + 1}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => remove(index)}
                                                aria-label={`Hapus opsi ${index + 1}`}
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </div>

                                        <Controller
                                            name={`options.${index}.label`}
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={Boolean(fieldState.invalid)}>
                                                    <FieldLabel htmlFor={`survey-option-label-${index}`}>Label Opsi</FieldLabel>
                                                    <Input
                                                        id={`survey-option-label-${index}`}
                                                        placeholder="Contoh: Sangat Puas"
                                                        aria-invalid={Boolean(fieldState.invalid)}
                                                        {...field}
                                                    />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />

                                        <Controller
                                            name={`options.${index}.description`}
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={Boolean(fieldState.invalid)}>
                                                    <FieldLabel htmlFor={`survey-option-description-${index}`}>Deskripsi Opsi</FieldLabel>
                                                    <Input
                                                        id={`survey-option-description-${index}`}
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
                                            name={`options.${index}.is_allow_custom_text`}
                                            control={form.control}
                                            render={({ field }) => (
                                                <Field orientation="horizontal" className="items-center gap-2">
                                                    <Checkbox
                                                        id={`survey-option-custom-text-${index}`}
                                                        checked={Boolean(field.value)}
                                                        onCheckedChange={(checked) => field.onChange(checked === true)}
                                                    />
                                                    <FieldLabel htmlFor={`survey-option-custom-text-${index}`} className="text-sm font-normal">
                                                        Izinkan keterangan tambahan
                                                    </FieldLabel>
                                                </Field>
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </FieldGroup>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Batal
                </Button>
                <Button type="submit" disabled={isLoading} className="gap-2">
                    {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    {isEditing ? "Simpan Perubahan" : "Tambah Pertanyaan"}
                </Button>
            </div>
        </form>
    );
}

export default SurveyQuestionForm;
