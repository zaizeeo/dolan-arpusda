import CreateUserForm from "@/components/forms/user-management/create-user-form";
import DeleteUserForm from "@/components/forms/user-management/delete-user-form";
import EditUserForm from "@/components/forms/user-management/edit-user-form";
import PromoteToSuperadminForm from "@/components/forms/user-management/promote-to-superadmin-form";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import UserRoleBadge from "@/components/user-role-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getInitials } from "@/lib";
import { useUserRole } from "@/lib/hooks/use-user-role";
import { allowedUserRole, getUserRoleLabel, type AllowedUserRoleType } from "@/lib/validations/user-management";
import { User } from "@/types";
import { PageProps } from "@/types/page-props";
import { router } from "@inertiajs/react";
import {
    ArrowUpCircle,
    CalendarDays,
    Crown,
    Ellipsis,
    GraduationCap,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    ShieldCheck,
    Trash2,
    UserCog,
    UserPlus,
    Users,
} from "lucide-react";
import { useMemo, useState } from "react";

interface Props extends PageProps {
    users: Array<User>;
}

type RoleFilter = "all" | AllowedUserRoleType;

const roleFilterOptions: Array<{ value: RoleFilter; label: string }> = [
    { value: "all", label: "Semua Role" },
    ...allowedUserRole.map((role) => ({ value: role as RoleFilter, label: getUserRoleLabel(role) })),
];

const formatJoinDate = (value?: Date | string | null): string => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

const UserManagementDashboardIndex = ({ auth, users = [] }: Props) => {
    const currentUser = auth.user as User;

    const { hasAdminsAuthority, hasSuperAdminAuthority } = useUserRole(currentUser);

    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [promotingUser, setPromotingUser] = useState<User | null>(null);

    const roleCounts = useMemo(() => {
        const counts: Record<string, number> = { intern: 0, staff: 0, admin: 0, superadmin: 0 };

        users.forEach((user) => {
            counts[user.role] = (counts[user.role] ?? 0) + 1;
        });

        return counts;
    }, [users]);

    const filteredUsers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return users.filter((user) => {
            const matchesRole = roleFilter === "all" || user.role === roleFilter;
            const matchesQuery = query.length === 0 || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query);

            return matchesRole && matchesQuery;
        });
    }, [users, searchQuery, roleFilter]);

    const isFiltering = searchQuery.trim().length > 0 || roleFilter !== "all";

    const resetFilters = () => {
        setSearchQuery("");
        setRoleFilter("all");
    };

    const stats = [
        {
            label: "Total Pengguna",
            value: users.length,
            description: "Seluruh akun terdaftar",
            icon: Users,
        },
        {
            label: "Admin & Superadmin",
            value: roleCounts.admin + roleCounts.superadmin,
            description: `${roleCounts.superadmin} superadmin, ${roleCounts.admin} admin`,
            icon: ShieldCheck,
        },
        {
            label: "Staf",
            value: roleCounts.staff,
            description: "Akun dengan akses operasional",
            icon: UserCog,
        },
        {
            label: "Magang",
            value: roleCounts.intern,
            description: "Akun dengan akses terbatas",
            icon: GraduationCap,
        },
    ];

    return (
        <DashboardLayout title="Manajemen Pengguna">
            <div className="flex flex-col gap-6 pb-10">
                <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="gap-1 font-medium">
                                <Crown className="size-3.5 text-primary" />
                                Manajemen Pengguna
                            </Badge>
                            <span className="text-xs text-muted-foreground">Dolan Arpusda</span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Daftar Pengguna</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola akun, atur hak akses, dan pantau siapa saja yang dapat mengakses dashboard.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => router.reload()} title="Perbarui data">
                            <RefreshCw className="size-4" />
                        </Button>
                        <Button onClick={() => setIsCreateOpen(true)}>
                            <Plus />
                            Tambah Pengguna
                        </Button>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <Card key={stat.label}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-xs font-medium text-muted-foreground">{stat.label}</CardTitle>
                                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Icon className="size-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                    <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </section>

                <Card>
                    <CardHeader className="flex flex-col gap-4 border-b border-border sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-base font-semibold">Data Pengguna</CardTitle>
                            <CardDescription>
                                Menampilkan {filteredUsers.length} dari {users.length} pengguna
                            </CardDescription>
                        </div>

                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-64">
                                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Cari nama atau email..."
                                    className="pl-9"
                                    aria-label="Cari pengguna"
                                />
                            </div>

                            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as RoleFilter)}>
                                <SelectTrigger className="w-full sm:w-40" aria-label="Filter role">
                                    <SelectValue placeholder="Semua Role" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {roleFilterOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {isFiltering && (
                                <Button variant="ghost" size="sm" onClick={resetFilters}>
                                    Reset
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12 text-center">No</TableHead>
                                    <TableHead className="min-w-64">Pengguna</TableHead>
                                    <TableHead className="min-w-36">Role</TableHead>
                                    <TableHead className="min-w-36">Terdaftar</TableHead>
                                    <TableHead className="w-16 text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="p-0">
                                            <Empty className="border-0">
                                                <EmptyHeader>
                                                    <EmptyMedia variant="icon">
                                                        <UserPlus />
                                                    </EmptyMedia>
                                                    <EmptyTitle>{users.length === 0 ? "Belum ada pengguna" : "Pengguna tidak ditemukan"}</EmptyTitle>
                                                    <EmptyDescription>
                                                        {users.length === 0
                                                            ? "Tambahkan pengguna pertama untuk mulai mengelola akses dashboard."
                                                            : "Coba ubah kata kunci pencarian atau filter role yang dipilih."}
                                                    </EmptyDescription>
                                                </EmptyHeader>
                                                <EmptyContent>
                                                    {isFiltering ? (
                                                        <Button variant="outline" size="sm" onClick={resetFilters}>
                                                            Reset Filter
                                                        </Button>
                                                    ) : (
                                                        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                                                            <Plus />
                                                            Tambah Pengguna
                                                        </Button>
                                                    )}
                                                </EmptyContent>
                                            </Empty>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user, index) => {
                                        const isCurrentUser = currentUser.id === user.id;
                                        const targetIsSuperadmin = user.role === "superadmin";
                                        const targetIsAdmin = user.role === "admin";

                                        const canEdit = hasAdminsAuthority && !isCurrentUser && !(targetIsSuperadmin && !hasSuperAdminAuthority);
                                        const canPromote = hasSuperAdminAuthority && !isCurrentUser && targetIsAdmin;
                                        const canDelete = hasSuperAdminAuthority && !isCurrentUser && !targetIsSuperadmin;
                                        const hasActions = canEdit || canPromote || canDelete;

                                        return (
                                            <TableRow key={user.id}>
                                                <TableCell className="text-center font-medium text-muted-foreground">{index + 1}</TableCell>

                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                                                {getInitials(user.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex min-w-0 flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="truncate font-medium text-foreground">{user.name}</span>
                                                                {isCurrentUser && (
                                                                    <Badge variant="secondary" className="font-normal">
                                                                        Anda
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <UserRoleBadge role={user.role} />
                                                </TableCell>

                                                <TableCell>
                                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <CalendarDays className="size-3.5" />
                                                        {formatJoinDate(user.created_at)}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    {hasActions ? (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon-sm" aria-label={`Aksi untuk ${user.name}`}>
                                                                    <Ellipsis className="size-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-52">
                                                                <DropdownMenuLabel>Aksi Pengguna</DropdownMenuLabel>
                                                                {canEdit && (
                                                                    <DropdownMenuItem onSelect={() => setEditingUser(user)}>
                                                                        <Pencil />
                                                                        Ubah Data
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {canPromote && (
                                                                    <DropdownMenuItem onSelect={() => setPromotingUser(user)}>
                                                                        <ArrowUpCircle />
                                                                        Jadikan Superadmin
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {canDelete && (
                                                                    <>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                            variant="destructive"
                                                                            onSelect={() => setDeletingUser(user)}
                                                                        >
                                                                            <Trash2 />
                                                                            Hapus Pengguna
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>

                    <CardFooter className="justify-between text-xs text-muted-foreground">
                        <span>
                            Menampilkan {filteredUsers.length} dari {users.length} pengguna
                        </span>
                        {isFiltering && (
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={resetFilters}>
                                Hapus filter
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Buat Pengguna Baru</DialogTitle>
                        <DialogDescription>Lengkapi data berikut untuk menambahkan pengguna baru.</DialogDescription>
                    </DialogHeader>
                    <CreateUserForm onSuccess={() => setIsCreateOpen(false)} onCancel={() => setIsCreateOpen(false)} />
                </DialogContent>
            </Dialog>

            <Dialog open={editingUser !== null} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Ubah Data Pengguna</DialogTitle>
                        <DialogDescription>Perbarui informasi akun {editingUser?.email}.</DialogDescription>
                    </DialogHeader>
                    {editingUser && (
                        <EditUserForm
                            key={editingUser.id}
                            user={editingUser}
                            onSuccess={() => setEditingUser(null)}
                            onCancel={() => setEditingUser(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <DeleteUserForm user={deletingUser} onClose={() => setDeletingUser(null)} />
            <PromoteToSuperadminForm user={promotingUser} onClose={() => setPromotingUser(null)} />
        </DashboardLayout>
    );
};

export default UserManagementDashboardIndex;
