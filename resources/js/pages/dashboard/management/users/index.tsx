import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CreateUserForm from "@/components/user-management/create-user-form";
import DeleteUserForm from "@/components/user-management/delete-user-form";
import { User } from "@/types";
import { PageProps } from "@/types/page-props";
import { router } from "@inertiajs/react";

interface Props extends PageProps {
    users: Array<User>;
}

const UserManagementDashboardIndex = (props: Props) => {
    console.log({ props });

    const currentUser = props.auth as User;

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
                            const isCurrentUser = currentUser.id === user.id;
                            const isSuperadmin = currentUser?.role === "superadmin";
                            const isAdmin = currentUser?.role === "admin" || currentUser?.role === "superadmin";
                            const targetIsSuperadmin = user.role === "superadmin";
                            const targetIsAdmin = user.role === "admin" && !targetIsSuperadmin;

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
                                        {isAdmin && (
                                            <Button onClick={() => {}} className="btn btn-sm btn-outline-primary me-1">
                                                Edit
                                            </Button>
                                        )}
                                        {/* Delete Button - only for superadmin and not current user */}
                                        {isSuperadmin && !isCurrentUser && <DeleteUserForm user={user} />}
                                        {/* Promote to Superadmin Button - only for superadmin and target is admin and not current user */}
                                        {isSuperadmin && !isCurrentUser && targetIsAdmin && (
                                            <Button onClick={() => {}} className="btn btn-sm btn-outline-success">
                                                Promosikan ke Superadmin
                                            </Button>
                                        )}
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
