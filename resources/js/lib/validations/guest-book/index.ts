import z from "zod";

export const createGuestBookAnswerSchema = z.object({
    guest_book_question_id: z.string().min(1),
    custom_text: z.string(),
    guest_book_question_option_id: z.string(),
});

export type CreateGuestBookAnswerSchemaType = z.infer<typeof createGuestBookAnswerSchema>;

export const createGuestBookSchema = z.object({
    answers: z.array(createGuestBookAnswerSchema),
});

export type CreateGuestBookSchemaType = z.infer<typeof createGuestBookSchema>;
