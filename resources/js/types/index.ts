export interface TimeStamps {
    created_at: Date;
    updated_at: Date;
}

export interface User extends TimeStamps {
    id: string;
    name: string;
    email: string;
    role: string;
}

export enum UserRole {
    INTERNSHIP = "intern",
    STAFF = "staff",
    ADMIN = "admin",
    SUPERADMIN = "superadmin",
}

const convertUserRoleTOEnum = (role: string): UserRole => {
    switch (role) {
        case "superadmin":
            return UserRole.SUPERADMIN;
        case "admin":
            return UserRole.ADMIN;
        case "intern":
            return UserRole.INTERNSHIP;
        default:
            return UserRole.STAFF;
    }
};
