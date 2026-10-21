import { User } from "@/types";

export const useUserRole = (user: User) => {
    const role = user.role.toLowerCase();
    const adminRoles = ["admin", "superadmin"];
    const hasAdminsAuthority = adminRoles.includes(role);
    const hasSuperAdminAuthority = role === "superadmin";
    const hasStaffAuthority = role === "staff";
    const canReadManagement = hasAdminsAuthority || hasStaffAuthority;

    return { hasAdminsAuthority, hasSuperAdminAuthority, hasStaffAuthority, canReadManagement, user };
};
