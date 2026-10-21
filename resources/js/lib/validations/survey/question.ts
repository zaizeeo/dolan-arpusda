import z from "zod";

export const surveyQuestionOptionSchema = z.object({
    label: z.string("Harus text").min(2, "Minimal 2 karakter"),
    description: z.string("Harus text").nullable(),
    is_allow_custom_text: z.boolean(),
});

export const createSurveyQuestionSchema = z.object({
    label: z.string("Harus text").min(2, "Minimal 2 karakter"),
    description: z.string("Harus text"),
    options: z.array(surveyQuestionOptionSchema).nullable(),
});

export type CreateSurveyQuestionSchemaType = z.infer<typeof createSurveyQuestionSchema>;

export const editSurveyQuestionSchema = z.object({
    label: z.string("Harus text").min(2, "Minimal 2 karakter"),
    description: z.string("Harus text"),
    is_active: z.boolean(),
});

export type EditSurveyQuestionSchemaType = z.infer<typeof editSurveyQuestionSchema>;

export const surveyQuestionOptionFormSchema = z.object({
    label: z.string("Harus text").min(2, "Minimal 2 karakter"),
    description: z.string("Harus text").nullable(),
    is_allow_custom_text: z.boolean(),
});

export type SurveyQuestionOptionFormSchemaType = z.infer<typeof surveyQuestionOptionFormSchema>;
