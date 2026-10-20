import z from "zod";

export const guestBookQuestionOptionSchema = z.object({
    label: z.string("Harus text").min(2, "Minimal 2 karakter"),
    description: z.string("Harus text").nullable(),
    is_allow_custom_text: z.boolean(),
});

export const createGuestBookQuestionSchema = z.object({
    label: z.string("Harus text").min(2, "Minimal 2 karakter"),
    description: z.string("Harus text"),
    options: z.array(guestBookQuestionOptionSchema).nullable(),
});

export type CreateGuestBookQuestionSchemaType = z.infer<typeof createGuestBookQuestionSchema>;

export const editGuestBookQuestionSchema = z.object({
    label: z.string("Harus text").min(2, "Minimal 2 karakter"),
    description: z.string("Harus text"),
    is_active: z.boolean(),
});

export type EditGuestBookQuestionSchemaType = z.infer<typeof editGuestBookQuestionSchema>;

export const guestBookQuestionOptionFormSchema = z.object({
    label: z.string("Harus text").min(2, "Minimal 2 karakter"),
    description: z.string("Harus text").nullable(),
    is_allow_custom_text: z.boolean(),
});

export type GuestBookQuestionOptionFormSchemaType = z.infer<typeof guestBookQuestionOptionFormSchema>;
