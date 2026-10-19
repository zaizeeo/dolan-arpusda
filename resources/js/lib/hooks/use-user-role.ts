import { User } from "@/types";

export const useUserRole = (user: User) => {
    const adminRoles = ["admin", "superadmin"];
    const hasAdminsAuthority = adminRoles.includes(user.role);
    const hasSuperAdminAuthority = user.role === "superadmin";
    return { hasAdminsAuthority, hasSuperAdminAuthority, user };
};
