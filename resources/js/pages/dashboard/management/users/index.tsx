import CreateUserForm from "@/components/forms/user-management/create-user-form";
import DeleteUserForm from "@/components/forms/user-management/delete-user-form";
import EditUserForm from "@/components/forms/user-management/edit-user-form";
import PromoteToSuperadminForm from "@/components/forms/user-management/promote-to-superadmin-form";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserRole } from "@/lib/hooks/use-user-role";
import { User } from "@/types";
import { PageProps } from "@/types/page-props";

interface Props extends PageProps {
    users: Array<User>;
}

const UserManagementDashboardIndex = (props: Props) => {
    const currentUser = props.auth as User;
    const { hasAdminsAuthority, hasSuperAdminAuthority } = useUserRole(props.auth as User);

    return (
        <DashboardLayout title="User Management" className="flex flex-col gap-3">
            <section>
                <CreateUserForm />
            </section>
            <section>
                <Table>
                    <TableCaption>Daftar Pengguna</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {props.users.map((user, index) => {
                            const target = useUserRole(user);
                            const isCurrentUser = currentUser.id === user.id;
                            const targetIsSuperadmin = target.hasSuperAdminAuthority;
                            const targetIsAdmin = target.hasAdminsAuthority && !targetIsSuperadmin;

                            return (
                                <TableRow key={user.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {/* Edit button - only for admins */}
                                        {hasAdminsAuthority && user.id !== currentUser.id && <EditUserForm user={user} />}
                                        {/* Delete Button - only for superadmin and not current user */}
                                        {hasSuperAdminAuthority && !isCurrentUser && <DeleteUserForm user={user} />}
                                        {/* Promote to Superadmin Button - only for superadmin and target is admin and not current user */}
                                        {hasSuperAdminAuthority && !isCurrentUser && targetIsAdmin && <PromoteToSuperadminForm user={user} />}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </section>
        </DashboardLayout>
    );
};

export default UserManagementDashboardIndex;
