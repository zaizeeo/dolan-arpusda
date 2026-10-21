import z from "zod";

export const updateProfileSchema = z.object({
    name: z.string("Nama harus diisi").trim().min(3, "Nama minimal 3 karakter").max(128, "Nama maksimal 128 karakter"),
    email: z
        .string("Email harus diisi")
        .trim()
        .min(1, "Email harus diisi")
        .refine((value) => z.email().safeParse(value).success, "Email tidak valid"),
    avatar: z.instanceof(File).nullable().optional(),
});

export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;

export const updatePasswordSchema = z
    .object({
        current_password: z.string("Password saat ini harus diisi").min(1, "Password saat ini harus diisi").max(32, "Password maksimal 32 karakter"),
        password: z.string("Password baru harus diisi").min(8, "Password minimal 8 karakter").max(32, "Password maksimal 32 karakter"),
        password_confirmation: z
            .string("Konfirmasi password harus diisi")
            .min(8, "Konfirmasi password minimal 8 karakter")
            .max(32, "Konfirmasi password maksimal 32 karakter"),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Konfirmasi password tidak sesuai",
        path: ["password_confirmation"],
    });

export type UpdatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;
