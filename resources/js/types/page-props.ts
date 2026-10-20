import { usePage } from "@inertiajs/react";
import { User } from ".";

export type PageProps = ReturnType<typeof usePage>["props"] & {
    auth: { user: User | null };
    name: string;
    sidebar_state?: "true" | "false";
};
