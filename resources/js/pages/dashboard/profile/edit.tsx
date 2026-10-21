import UpdateProfileForm from "@/components/forms/profile/update-profile-form";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";
import { PageProps } from "@/types/page-props";
import Profile from "@/routes/profile";
import { Link } from "@inertiajs/react";
import { ArrowLeft, UserPen } from "lucide-react";

interface Props extends PageProps {}

const ProfileEditPage = ({ auth }: Props) => {
    const user = auth.user as User;

    return (
        <DashboardLayout title="Update Profil">
            <div className="flex flex-col gap-6 pb-10">
                <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="gap-1 font-medium">
                                <UserPen className="size-3.5 text-primary" />
                                Update Profil
                            </Badge>
                            <span className="text-xs text-muted-foreground">Jeta Arsip</span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Ubah Data Profil</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Perbarui nama, email, dan foto profil yang digunakan pada dashboard.</p>
                    </div>

                    <Button variant="outline" asChild>
                        <Link href={Profile.show().url}>
                            <ArrowLeft className="size-4" />
                            Kembali ke Profil
                        </Link>
                    </Button>
                </section>

                <Card className="max-w-3xl">
                    <CardHeader>
                        <CardTitle>Formulir Profil</CardTitle>
                        <CardDescription>Pastikan data yang Anda masukkan sudah benar sebelum menyimpan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UpdateProfileForm user={user} />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default ProfileEditPage;
