import DashboardLayout from "@/components/layouts/dashboard-layout";
import UserRoleBadge from "@/components/user-role-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib";
import { settings } from "@/routes";
import Profile from "@/routes/profile";
import { User } from "@/types";
import { PageProps } from "@/types/page-props";
import { Link } from "@inertiajs/react";
import { CalendarDays, KeyRound, Mail, ShieldCheck, UserPen, UserRound } from "lucide-react";
import { ReactNode } from "react";

interface Props extends PageProps {}

const formatDate = (value?: Date | string | null): string => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(date);
};

const ProfileDetailRow = ({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) => (
    <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
        <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <div className="text-sm font-medium text-foreground">{children}</div>
        </div>
    </div>
);

const ProfileIndexPage = ({ auth }: Props) => {
    const user = auth.user as User;

    return (
        <DashboardLayout title="Profil Saya">
            <div className="flex flex-col gap-6 pb-10">
                <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="gap-1 font-medium">
                                <UserRound className="size-3.5 text-primary" />
                                Profil Saya
                            </Badge>
                            <span className="text-xs text-muted-foreground">Jeta Arsip</span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Informasi Akun</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Lihat detail informasi akun Anda dan kelola keamanan akun dari halaman ini.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={settings().url}>
                                <KeyRound className="size-4" />
                                Ganti Password
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={Profile.edit().url}>
                                <UserPen className="size-4" />
                                Update Profil
                            </Link>
                        </Button>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-1">
                        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
                            <Avatar className="size-24">
                                <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-1">
                                <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <UserRoleBadge role={user.role} />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Detail Akun</CardTitle>
                            <CardDescription>Informasi yang tersimpan pada akun Anda.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <ProfileDetailRow icon={<UserRound className="size-4" />} label="Nama Lengkap">
                                {user.name}
                            </ProfileDetailRow>
                            <Separator />
                            <ProfileDetailRow icon={<Mail className="size-4" />} label="Email">
                                {user.email}
                            </ProfileDetailRow>
                            <Separator />
                            <ProfileDetailRow icon={<ShieldCheck className="size-4" />} label="Role">
                                <UserRoleBadge role={user.role} />
                            </ProfileDetailRow>
                            <Separator />
                            <ProfileDetailRow icon={<CalendarDays className="size-4" />} label="Bergabung Sejak">
                                {formatDate(user.created_at)}
                            </ProfileDetailRow>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfileIndexPage;
