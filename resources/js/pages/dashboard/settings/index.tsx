import UpdatePasswordForm from "@/components/forms/profile/update-password-form";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Profile from "@/routes/profile";
import { Link } from "@inertiajs/react";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";

const SettingsPage = () => {
    return (
        <DashboardLayout title="Ganti Password">
            <div className="flex flex-col gap-6 pb-10">
                <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="gap-1 font-medium">
                                <KeyRound className="size-3.5 text-primary" />
                                Ganti Password
                            </Badge>
                            <span className="text-xs text-muted-foreground">Jeta Arsip</span>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Keamanan Akun</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Perbarui password akun Anda secara berkala untuk menjaga keamanan.</p>
                    </div>

                    <Button variant="outline" asChild>
                        <Link href={Profile.show().url}>
                            <ArrowLeft className="size-4" />
                            Kembali ke Profil
                        </Link>
                    </Button>
                </section>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Formulir Ganti Password</CardTitle>
                            <CardDescription>Masukkan password saat ini, lalu tentukan password baru Anda.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UpdatePasswordForm />
                        </CardContent>
                    </Card>

                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <ShieldCheck className="size-4 text-primary" />
                                Tips Keamanan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <p>Gunakan minimal 8 karakter dengan kombinasi huruf, angka, dan simbol.</p>
                            <p>Hindari menggunakan password yang sama dengan akun lain.</p>
                            <p>Jangan bagikan password Anda kepada siapa pun.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SettingsPage;
