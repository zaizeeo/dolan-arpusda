import z from "zod";

export const createGuestBookAnswerSchema = z.object({
    guest_book_question_id: z.string().min(1, "ID pertanyaan wajib diisi"),
    custom_text: z.string(),
    guest_book_question_option_id: z.string(),
});

export type CreateGuestBookAnswerSchemaType = z.infer<typeof createGuestBookAnswerSchema>;

export const createGuestBookSchema = z.object({
    answers: z.array(createGuestBookAnswerSchema),
});

export type CreateGuestBookSchemaType = z.infer<typeof createGuestBookSchema>;

export interface QuestionValidationContext {
    id: string;
    options?:
        | {
              id: string;
              is_allow_custom_text?: boolean;
          }[]
        | null;
}

export const getCreateGuestBookSchema = (questions: QuestionValidationContext[]) => {
    return z.object({
        answers: z.array(createGuestBookAnswerSchema).superRefine((answers, ctx) => {
            answers.forEach((ans, index) => {
                const question = questions.find((q) => q.id === ans.guest_book_question_id);
                if (!question) {
                    return;
                }

                const hasOptions = Array.isArray(question.options) && question.options.length > 0;

                if (!hasOptions) {
                    if (!ans.custom_text || ans.custom_text.trim() === "") {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "Pertanyaan ini wajib diisi.",
                            path: [index, "custom_text"],
                        });
                    }
                } else {
                    if (!ans.guest_book_question_option_id || ans.guest_book_question_option_id.trim() === "") {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "Silakan pilih salah satu opsi jawaban.",
                            path: [index, "guest_book_question_option_id"],
                        });
                    } else {
                        const selectedOption = question.options?.find((opt) => opt.id === ans.guest_book_question_option_id);
                        if (selectedOption?.is_allow_custom_text && (!ans.custom_text || ans.custom_text.trim() === "")) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.custom,
                                message: "Keterangan tambahan wajib diisi untuk pilihan ini.",
                                path: [index, "custom_text"],
                            });
                        }
                    }
                }
            });
        }),
    });
};
