import { Badge } from "@/components/ui/badge";
import { getUserRoleLabel } from "@/lib/validations/user-management";
import { Crown, GraduationCap, ShieldCheck, UserCog } from "lucide-react";

type UserRoleBadgeVariant = "default" | "secondary" | "outline";

interface UserRoleConfig {
    icon: typeof Crown;
    variant: UserRoleBadgeVariant;
}

const userRoleConfig: Record<string, UserRoleConfig> = {
    superadmin: { icon: Crown, variant: "default" },
    admin: { icon: ShieldCheck, variant: "secondary" },
    staff: { icon: UserCog, variant: "outline" },
    intern: { icon: GraduationCap, variant: "outline" },
};

interface Props {
    role: string;
    className?: string;
}

const UserRoleBadge = ({ role, className }: Props) => {
    const config = userRoleConfig[role] ?? { icon: UserCog, variant: "outline" as const };
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className={className}>
            <Icon />
            {getUserRoleLabel(role)}
        </Badge>
    );
};

export default UserRoleBadge;
