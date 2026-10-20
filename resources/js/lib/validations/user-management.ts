import { capitalizeText } from "@/lib";
import z from "zod";

export const allowedUserRole = ["intern", "staff", "admin", "superadmin"] as const;
export type AllowedUserRoleType = (typeof allowedUserRole)[number];

export const editableUserRole = ["intern", "staff", "admin"] as const;
export type EditableUserRoleType = (typeof editableUserRole)[number];

const userRoleLabels: Record<AllowedUserRoleType, string> = {
    intern: "Magang",
    staff: "Staf",
    admin: "Admin",
    superadmin: "Superadmin",
};

export const getUserRoleLabel = (role: string): string => {
    return userRoleLabels[role as AllowedUserRoleType] ?? capitalizeText(role);
};

export const createUserSchema = z
    .object({
        email: z
            .string("Email harus diisi")
            .trim()
            .min(1, "Email harus diisi")
            .refine((value) => z.email().safeParse(value).success, "Email tidak valid"),
        name: z.string("Nama harus diisi text").trim().min(3, "Nama harus diisi minimal 3 karakter").max(128, "Nama maksimal 128 karakter"),
        role: z.enum(allowedUserRole, "Pilih role yang tersedia"),
        password: z.string("Password minimal 8 karakter").min(8, "Password minimal 8 karakter").max(32, "Password maksimal 32 karakter"),
        password_confirmation: z
            .string("Konfirmasi Password minimal 8 karakter")
            .min(8, "Konfirmasi Password minimal 8 karakter")
            .max(32, "Konfirmasi Password maksimal 32 karakter"),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Konfirmasi password tidak sesuai",
        path: ["password_confirmation"],
    });

export type CreateUserSchemaType = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
    email: z
        .string("Email harus diisi")
        .trim()
        .min(1, "Email harus diisi")
        .refine((value) => z.email().safeParse(value).success, "Email tidak valid"),
    name: z.string("Nama harus diisi text").trim().min(3, "Nama harus diisi minimal 3 karakter").max(128, "Nama maksimal 128 karakter"),
    role: z.enum(editableUserRole, "Pilih role yang tersedia"),
    password: z
        .string()
        .max(32, "Password maksimal 32 karakter")
        .refine((value) => value.length === 0 || value.length >= 8, "Password minimal 8 karakter"),
});

export type EditUserSchemaType = z.infer<typeof editUserSchema>;
