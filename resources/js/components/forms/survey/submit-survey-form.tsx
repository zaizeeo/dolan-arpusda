import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getSubmitSurveySchema } from "@/lib/validations/survey";
import { cn } from "cn";
import type { PublicSurveyQuestion } from "@/types/survey";
import { submit as submitSurveyRoute } from "@/routes/survey";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, type VisitHelperOptions } from "@inertiajs/core";
import { Loader2, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
    surveyId: string;
    questions: Array<PublicSurveyQuestion>;
    onSuccessSubmit?: () => void;
    redirectAfterSubmit?: "home";
}

export function SubmitSurveyForm({ surveyId, questions, onSuccessSubmit, redirectAfterSubmit }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    const validationSchema = useMemo(() => getSubmitSurveySchema(questions), [questions]);
    type FormSchema = z.infer<typeof validationSchema>;

    const form = useForm<FormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            answers: questions.map((question) => ({
                survey_question_id: question.id,
                survey_question_option_id: "",
                custom_text: "",
            })),
        },
    });

    const midpoint = Math.ceil(questions.length / 2);
    const questionColumns = [questions.slice(0, midpoint), questions.slice(midpoint)];

    const onSubmit = (data: FormSchema) => {
        setIsLoading(true);
        setFormErrorMessage("");

        const payload = {
            survey_id: surveyId,
            ...(redirectAfterSubmit ? { redirect: redirectAfterSubmit } : {}),
            answers: data.answers.map((answer) => ({
                survey_question_id: answer.survey_question_id,
                survey_question_option_id: answer.survey_question_option_id?.trim() !== "" ? answer.survey_question_option_id : null,
                custom_text: answer.custom_text?.trim() !== "" ? answer.custom_text : null,
            })),
        };

        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                form.reset({
                    answers: questions.map((question) => ({
                        survey_question_id: question.id,
                        survey_question_option_id: "",
                        custom_text: "",
                    })),
                });
                toast.success("Berhasil Terkirim", {
                    description: "Terima kasih, jawaban survei Anda berhasil disimpan!",
                });
                onSuccessSubmit?.();
            },
            onError: (error) => {
                const errMessage = error?.server || "Coba lagi beberapa saat";

                const messageStr = typeof errMessage === "string" ? errMessage : "Terjadi kesalahan saat menyimpan jawaban survei.";

                setFormErrorMessage(messageStr);
                toast.error("Terjadi Kesalahan!", {
                    description: messageStr,
                });
            },
        } satisfies VisitHelperOptions;

        router.post(submitSurveyRoute.url(), payload, requestOptions);
    };

    return (
        <form id="form-submit-survey" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 lg:gap-1.5">
            {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}

            <div className="@container">
                <FieldGroup className="grid grid-cols-1 gap-3 lg:gap-1.5 @4xl:grid-cols-2">
                    {questionColumns.map((columnQuestions, columnIndex) => (
                        <div key={columnIndex} className="flex flex-col gap-3 lg:gap-1.5">
                            {columnQuestions.map((question, columnQuestionIndex) => {
                                const index = columnIndex === 0 ? columnQuestionIndex : midpoint + columnQuestionIndex;
                                const hasOptions = Array.isArray(question.options) && question.options.length > 0;

                                return (
                                    <div
                                        key={question.id}
                                        className="rounded-xl border border-border bg-card p-3 shadow-xs transition-shadow hover:shadow-sm lg:flex lg:items-start lg:gap-2 lg:p-1"
                                    >
                                        <div className="mb-2 lg:mb-0 lg:w-1/2 lg:shrink-0">
                                            <div className="flex items-start gap-2">
                                                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary lg:size-5">
                                                    {index + 1}
                                                </span>
                                                <div className="flex flex-col gap-1">
                                                    <FieldLabel
                                                        htmlFor={
                                                            hasOptions
                                                                ? `label-survey-question-${question.id}`
                                                                : `survey-question-input-${question.id}`
                                                        }
                                                        className="text-base leading-normal font-semibold text-card-foreground lg:text-xs"
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

                                        <div className="pl-6 lg:min-w-0 lg:flex-1 lg:pl-0">
                                            {hasOptions ? (
                                                <Controller
                                                    name={`answers.${index}.survey_question_option_id`}
                                                    control={form.control}
                                                    render={({ field, fieldState }) => (
                                                        <Field data-invalid={Boolean(fieldState.invalid)}>
                                                            <RadioGroup
                                                                value={field.value}
                                                                onValueChange={(value) => {
                                                                    field.onChange(value);
                                                                    const selectedOption = question.options.find((option) => option.id === value);
                                                                    if (!selectedOption?.is_allow_custom_text) {
                                                                        form.setValue(`answers.${index}.custom_text`, "");
                                                                    }
                                                                }}
                                                                className="grid grid-cols-2 gap-1"
                                                                aria-labelledby={`label-survey-question-${question.id}`}
                                                            >
                                                                {question.options.map((option) => {
                                                                    const isSelected = field.value === option.id;

                                                                    return (
                                                                        <div
                                                                            key={option.id}
                                                                            className={cn(
                                                                                "rounded-md px-1 py-0.5 transition-colors",
                                                                                isSelected ? "bg-primary/5" : "hover:bg-muted/60",
                                                                            )}
                                                                        >
                                                                            <div className="flex items-start gap-1.5">
                                                                                <RadioGroupItem
                                                                                    value={option.id}
                                                                                    id={`survey-option-${option.id}`}
                                                                                    className="mt-0.5"
                                                                                />
                                                                                <div className="flex flex-1 flex-col">
                                                                                    <FieldLabel
                                                                                        htmlFor={`survey-option-${option.id}`}
                                                                                        className="cursor-pointer text-sm leading-snug font-medium text-card-foreground lg:text-xs"
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
                                                                                                    htmlFor={`survey-custom-text-${option.id}`}
                                                                                                    className="text-xs font-medium text-muted-foreground"
                                                                                                >
                                                                                                    Keterangan Tambahan{" "}
                                                                                                    <span className="text-destructive">*</span>
                                                                                                </FieldLabel>
                                                                                                <Input
                                                                                                    id={`survey-custom-text-${option.id}`}
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
                                                    )}
                                                />
                                            ) : (
                                                <Controller
                                                    name={`answers.${index}.custom_text`}
                                                    control={form.control}
                                                    render={({ field, fieldState }) => (
                                                        <Field data-invalid={Boolean(fieldState.invalid)}>
                                                            <Input
                                                                id={`survey-question-input-${question.id}`}
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
                        </div>
                    ))}
                </FieldGroup>
            </div>

            <div className="flex justify-stretch pt-1 sm:justify-end">
                <Button disabled={isLoading} type="submit" size="lg" className="w-full font-semibold sm:w-auto sm:min-w-48">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Mengirim Jawaban...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 size-4" />
                            Kirim Survei
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

export default SubmitSurveyForm;
