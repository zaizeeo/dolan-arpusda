import z from "zod";

export const loginSchema = z.object({
    email: z.email("Mohon masukkan alamat email yang valid"),
    password: z.string().min(8, "Password minimal 8 karakter").max(32, "Password maksimal 32 karakter"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z
    .object({
        email: z.email("Mohon masukkan alamat email yang valid"),
        password: z.string().min(8, "Password minimal 8 karakter").max(32, "Password maksimal 32 karakter"),
        confirm_password: z.string().min(8, "Konfirmasi Password minimal 8 karakter").max(32, "Konfirmasi Password maksimal 32 karakter"),
    })
    .refine((f) => f.password === f.confirm_password, "Password dan Konfirmasi Password tidak sesuai");

export type RegisterSchemaType = z.infer<typeof registerSchema>;
