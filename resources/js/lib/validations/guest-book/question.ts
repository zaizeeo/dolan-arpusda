import z from "zod";

export const createGuestBookQuestionSchema = z.object({
    label: z.string("Harus text").min(2, "Minimal 2 karakter"),
    description: z.string("Harus text").nullable(),
});

export type CreateGuestBookQuestionSchemaType = z.infer<typeof createGuestBookQuestionSchema>;
