import z from "zod";

export const submitSurveyAnswerSchema = z.object({
    survey_question_id: z.string().min(1, "ID pertanyaan wajib diisi"),
    custom_text: z.string(),
    survey_question_option_id: z.string(),
});

export type SubmitSurveyAnswerSchemaType = z.infer<typeof submitSurveyAnswerSchema>;

export const submitSurveySchema = z.object({
    answers: z.array(submitSurveyAnswerSchema),
});

export type SubmitSurveySchemaType = z.infer<typeof submitSurveySchema>;

export interface SurveyQuestionValidationContext {
    id: string;
    options?:
        | {
              id: string;
              is_allow_custom_text?: boolean;
          }[]
        | null;
}

export const getSubmitSurveySchema = (questions: SurveyQuestionValidationContext[]) => {
    return z.object({
        answers: z.array(submitSurveyAnswerSchema).superRefine((answers, ctx) => {
            answers.forEach((answer, index) => {
                const question = questions.find((item) => item.id === answer.survey_question_id);
                if (!question) {
                    return;
                }

                const hasOptions = Array.isArray(question.options) && question.options.length > 0;

                if (!hasOptions) {
                    if (!answer.custom_text || answer.custom_text.trim() === "") {
                        ctx.addIssue({
                            code: "custom",
                            message: "Pertanyaan ini wajib diisi.",
                            path: [index, "custom_text"],
                        });
                    }

                    return;
                }

                if (!answer.survey_question_option_id || answer.survey_question_option_id.trim() === "") {
                    ctx.addIssue({
                        code: "custom",
                        message: "Silakan pilih salah satu opsi jawaban.",
                        path: [index, "survey_question_option_id"],
                    });

                    return;
                }

                const selectedOption = question.options?.find((option) => option.id === answer.survey_question_option_id);

                if (selectedOption?.is_allow_custom_text && (!answer.custom_text || answer.custom_text.trim() === "")) {
                    ctx.addIssue({
                        code: "custom",
                        message: "Keterangan tambahan wajib diisi untuk pilihan ini.",
                        path: [index, "custom_text"],
                    });
                }
            });
        }),
    });
};
