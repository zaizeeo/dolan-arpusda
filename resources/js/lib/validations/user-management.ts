import z from "zod";

export const allowedUserRole = ["intern", "staff", "admin", "superadmin"] as const;
export type AllowedUserRoleType = typeof allowedUserRole;

export const createUserSchema = z.object({
    email: z.email().trim(),
    name: z.string("Nama harus diisi text").min(3, "Nama harus diisi minimal 3 karakter"),
    role: z.enum(allowedUserRole),
    password: z.string("Password minimal 8 karakter").min(8).max(32, "Password maksimal 32 karakter"),
    password_confirmation: z.string("Konfirmasi Password minimal 8 karakter").min(8).max(32, "Konfirmasi Password maksimal 32 karakter"),
});

export type CreateUserSchemaType = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
    email: z
        .string()
        .optional()
        .refine((v) => {
            if (!v) {
                return true;
            }

            return z.email().safeParse(v).success;
        }, "Email tidak valid"),
    name: z.string("Nama harus diisi text").min(3, "Nama harus diisi minimal 3 karakter").nullable(),
    role: z.enum(allowedUserRole).nullable(),
    password: z.string("Password minimal 8 karakter").min(8).max(32, "Password maksimal 32 karakter").nullable(),
});
