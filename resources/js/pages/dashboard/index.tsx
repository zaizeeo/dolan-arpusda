import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, ArrowUpRight, BookOpen, Clock, Users } from "lucide-react";

const stats = [
    {
        title: "Kunjungan Hari Ini",
        value: "28",
        change: "+12% dari kemarin",
        icon: Users,
    },
    {
        title: "Buku Tamu Bulan Ini",
        value: "412",
        change: "+8.4% dari bulan lalu",
        icon: BookOpen,
    },
    {
        title: "Permohonan Arsip",
        value: "19",
        change: "5 sedang diproses",
        icon: Archive,
    },
    {
        title: "Rata-rata Waktu Kunjungan",
        value: "35 Menit",
        change: "Optimal",
        icon: Clock,
    },
];

const DashboardIndexPage = () => {
    return (
        <DashboardLayout title="Dashboard Utama">
            <div className="flex flex-col gap-6">
                {/* Stats Overview */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                                    <ArrowUpRight className="size-3 text-emerald-500" />
                                    <span>{stat.change}</span>
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Content Canvas */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Aktivitas Kunjungan Terbaru</CardTitle>
                            <CardDescription>Daftar tamu yang baru saja mengisi buku tamu digital.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                                Belum ada data kunjungan terbaru hari ini
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Layanan Cepat</CardTitle>
                            <CardDescription>Akses cepat ke menu administrasi buku tamu.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                                Menu pintasan cepat
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardIndexPage;
