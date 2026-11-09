import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getCreateGuestBookSchema } from "@/lib/validations/guest-book";
import { z } from "zod";
import { createGuestBook } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, type VisitHelperOptions } from "@inertiajs/core";
import { Loader2, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "cn";

export interface GuestBookQuestionOptionItem {
    id: string;
    label: string;
    description?: string | null;
    is_allow_custom_text: boolean;
    sequence_number?: number | null;
    is_active?: boolean;
}

export interface GuestBookQuestionItem {
    id: string;
    label: string;
    description?: string | null;
    sequence_number?: number | null;
    is_active?: boolean;
    options: GuestBookQuestionOptionItem[];
}

interface Props {
    questions: GuestBookQuestionItem[];
    onSuccessSubmit?: () => void;
}

export function CreateGuestBookForm({ questions, onSuccessSubmit }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    const validationSchema = useMemo(() => getCreateGuestBookSchema(questions), [questions]);
    type FormSchema = z.infer<typeof validationSchema>;

    const form = useForm<FormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            answers: questions.map((question) => ({
                guest_book_question_id: question.id,
                guest_book_question_option_id: "",
                custom_text: "",
            })),
        },
    });

    const onSubmit = (data: FormSchema) => {
        setIsLoading(true);
        setFormErrorMessage("");

        const payload = {
            answers: data.answers.map((answer) => ({
                guest_book_question_id: answer.guest_book_question_id,
                guest_book_question_option_id: answer.guest_book_question_option_id?.trim() !== "" ? answer.guest_book_question_option_id : null,
                custom_text: answer.custom_text?.trim() !== "" ? answer.custom_text : null,
            })),
        };

        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                form.reset({
                    answers: questions.map((question) => ({
                        guest_book_question_id: question.id,
                        guest_book_question_option_id: "",
                        custom_text: "",
                    })),
                });
                toast.success("Berhasil Terkirim", {
                    description: "Terima kasih, data buku tamu Anda berhasil disimpan!",
                });
                onSuccessSubmit?.();
            },
            onError: (error) => {
                const errMessage = error?.server || "Coba lagi beberapa saat";

                const messageStr = typeof errMessage === "string" ? errMessage : "Terjadi kesalahan saat menyimpan data buku tamu.";

                setFormErrorMessage(messageStr);
                toast.error("Terjadi Kesalahan!", {
                    description: messageStr,
                });
            },
        } satisfies VisitHelperOptions;

        router.post(createGuestBook.url(), payload, requestOptions);
    };

    return (
        <form id="form-create-guest-book" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 lg:gap-2">
            {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}

            <div className="@container">
                <FieldGroup className="block columns-1 gap-3 @lg:columns-2 @3xl:columns-3 @5xl:columns-4">
                    {questions.map((question, index) => {
                        const hasOptions = Array.isArray(question.options) && question.options.length > 0;

                        return (
                            <div
                                key={question.id}
                                className="mb-3 break-inside-avoid rounded-xl border border-border bg-card p-4 shadow-xs transition-shadow hover:shadow-sm lg:p-3"
                            >
                                <div className="mb-3 lg:mb-2">
                                    <div className="flex items-start gap-2.5">
                                        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary lg:size-6">
                                            {index + 1}
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <FieldLabel
                                                htmlFor={hasOptions ? `label-question-${question.id}` : `question-input-${question.id}`}
                                                className="text-base leading-normal font-semibold text-card-foreground lg:text-sm"
                                            >
                                                {question.label}
                                                <span className="ml-1 text-destructive">*</span>
                                            </FieldLabel>
                                            {question.description && (
                                                <FieldDescription className="text-sm text-muted-foreground lg:text-xs">
                                                    {question.description}
                                                </FieldDescription>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pl-9 lg:pl-8">
                                    {hasOptions ? (
                                        <Controller
                                            name={`answers.${index}.guest_book_question_option_id`}
                                            control={form.control}
                                            render={({ field, fieldState }) => {
                                                const selectOption = (value: string) => {
                                                    field.onChange(value);
                                                    const opt = question.options.find((o) => o.id === value);
                                                    if (!opt?.is_allow_custom_text) {
                                                        form.setValue(`answers.${index}.custom_text`, "");
                                                    }
                                                };

                                                return (
                                                    <Field data-invalid={Boolean(fieldState.invalid)}>
                                                        <RadioGroup
                                                            value={field.value}
                                                            onValueChange={selectOption}
                                                            className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                                                            aria-labelledby={`label-question-${question.id}`}
                                                        >
                                                            {question.options.map((option) => {
                                                                const isSelected = field.value === option.id;

                                                                return (
                                                                    <div
                                                                        key={option.id}
                                                                        className={cn(
                                                                            "rounded-lg border transition-colors",
                                                                            isSelected
                                                                                ? "border-primary/50 bg-primary/5 dark:bg-primary/10"
                                                                                : "border-border hover:bg-muted/40",
                                                                        )}
                                                                    >
                                                                        <div
                                                                            className="flex cursor-pointer items-center gap-2 p-3 lg:p-2"
                                                                            onClick={() => selectOption(option.id)}
                                                                        >
                                                                            <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                                                                            <div className="flex flex-1 flex-col">
                                                                                <FieldLabel
                                                                                    htmlFor={`option-${option.id}`}
                                                                                    className="cursor-pointer text-sm font-medium text-card-foreground lg:text-xs"
                                                                                    onClick={() => selectOption(option.id)}
                                                                                >
                                                                                    {option.label}
                                                                                </FieldLabel>
                                                                                {option.description && (
                                                                                    <span className="mt-0.5 text-xs text-muted-foreground">
                                                                                        {option.description}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {option.is_allow_custom_text && isSelected && (
                                                                            <div className="mt-2 px-3 pb-3 pl-7 lg:mt-1.5 lg:px-2 lg:pb-2 lg:pl-6">
                                                                                <Controller
                                                                                    name={`answers.${index}.custom_text`}
                                                                                    control={form.control}
                                                                                    render={({
                                                                                        field: customField,
                                                                                        fieldState: customFieldState,
                                                                                    }) => (
                                                                                        <Field
                                                                                            data-invalid={Boolean(customFieldState.invalid)}
                                                                                            className="gap-1.5"
                                                                                        >
                                                                                            <FieldLabel
                                                                                                htmlFor={`custom-text-${option.id}`}
                                                                                                className="text-xs font-medium text-muted-foreground"
                                                                                            >
                                                                                                Keterangan Tambahan{" "}
                                                                                                <span className="text-destructive">*</span>
                                                                                            </FieldLabel>
                                                                                            <Input
                                                                                                id={`custom-text-${option.id}`}
                                                                                                placeholder="Tuliskan keterangan detail..."
                                                                                                aria-invalid={Boolean(customFieldState.invalid)}
                                                                                                {...customField}
                                                                                            />
                                                                                            {customFieldState.invalid && (
                                                                                                <FieldError errors={[customFieldState.error]} />
                                                                                            )}
                                                                                        </Field>
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </RadioGroup>
                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                    </Field>
                                                );
                                            }}
                                        />
                                    ) : (
                                        <Controller
                                            name={`answers.${index}.custom_text`}
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field data-invalid={Boolean(fieldState.invalid)}>
                                                    <Input
                                                        id={`question-input-${question.id}`}
                                                        placeholder={`Masukkan ${question.label.toLowerCase()}...`}
                                                        aria-invalid={Boolean(fieldState.invalid)}
                                                        {...field}
                                                    />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </FieldGroup>
            </div>

            <div className="flex justify-stretch pt-1 sm:justify-end">
                <Button disabled={isLoading} type="submit" size="lg" className="w-full font-semibold sm:w-auto sm:min-w-48">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Menyimpan Data...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 size-4" />
                            Kirim Buku Tamu
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

export default CreateGuestBookForm;
