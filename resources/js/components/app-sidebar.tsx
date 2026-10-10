import { Link, router, usePage } from "@inertiajs/react";
import {
    Archive,
    BarChart3,
    BookOpen,
    ChevronRight,
    ChevronsUpDown,
    HelpCircle,
    LayoutDashboard,
    Library,
    LogOut,
    Settings,
    User as UserIcon,
    Users,
} from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";

interface PageProps {
    auth?: {
        user?: {
            id?: string;
            name?: string;
            email?: string;
            role?: string;
        };
    };
    [key: string]: unknown;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { isMobile } = useSidebar();
    const { url, props: pageProps } = usePage<PageProps>();

    const user = pageProps.auth?.user;
    const userName = user?.name || "Staff Arpusda";
    const userEmail = user?.email || "staff@arpusda.go.id";
    const userRole = user?.role ? user.role.toUpperCase() : "STAFF";
    const userInitials = userName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const handleLogout = () => {
        router.post("/logout");
    };

    const navMain = [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: url === "/dashboard",
        },
        {
            title: "Buku Tamu",
            icon: BookOpen,
            isActive: url.startsWith("/dashboard/buku-tamu"),
            items: [
                {
                    title: "Daftar Tamu",
                    url: "/dashboard/buku-tamu",
                    isActive: url === "/dashboard/buku-tamu",
                },
                {
                    title: "Pertanyaan Form",
                    url: "/dashboard/buku-tamu/pertanyaan",
                    isActive: url === "/dashboard/buku-tamu/pertanyaan",
                },
                {
                    title: "Statistik Pengunjung",
                    url: "/dashboard/buku-tamu/statistik",
                    isActive: url === "/dashboard/buku-tamu/statistik",
                },
            ],
        },
        {
            title: "Layanan Kearsipan",
            icon: Archive,
            isActive: url.startsWith("/dashboard/arsip"),
            items: [
                {
                    title: "Peminjaman Arsip",
                    url: "/dashboard/arsip/peminjaman",
                    isActive: url === "/dashboard/arsip/peminjaman",
                },
                {
                    title: "Penelusuran Arsip",
                    url: "/dashboard/arsip/penelusuran",
                    isActive: url === "/dashboard/arsip/penelusuran",
                },
                {
                    title: "Wisata Arsip",
                    url: "/dashboard/arsip/wisata",
                    isActive: url === "/dashboard/arsip/wisata",
                },
            ],
        },
    ];

    const navManagement = [
        {
            title: "Data Pengguna",
            url: "/dashboard/users",
            icon: Users,
            isActive: url.startsWith("/dashboard/users"),
        },
        {
            title: "Laporan & Rekap",
            url: "/dashboard/laporan",
            icon: BarChart3,
            isActive: url.startsWith("/dashboard/laporan"),
        },
    ];

    const navSecondary = [
        {
            title: "Pengaturan",
            url: "/dashboard/pengaturan",
            icon: Settings,
            isActive: url.startsWith("/dashboard/pengaturan"),
        },
        {
            title: "Bantuan",
            url: "/dashboard/bantuan",
            icon: HelpCircle,
            isActive: url.startsWith("/dashboard/bantuan"),
        },
    ];

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Library className="size-4.5" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Dolan Arpusda</span>
                                    <span className="truncate text-xs text-muted-foreground">Buku Tamu Digital</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Menu Utama */}
                <SidebarGroup>
                    <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navMain.map((item) =>
                                item.items ? (
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={item.isActive}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                                                    <item.icon className="size-4" />
                                                    <span>{item.title}</span>
                                                    <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                                                                <Link href={subItem.url}>
                                                                    <span>{subItem.title}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ) : (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                                            <Link href={item.url}>
                                                <item.icon className="size-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Manajemen */}
                <SidebarGroup>
                    <SidebarGroupLabel>Manajemen</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navManagement.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Pengaturan & Bantuan */}
                <SidebarGroup className="mt-auto">
                    <SidebarGroupLabel>Sistem</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navSecondary.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="size-8 rounded-lg">
                                        <AvatarImage src="" alt={userName} />
                                        <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                                            {userInitials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{userName}</span>
                                        <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="size-8 rounded-lg">
                                            <AvatarImage src="" alt={userName} />
                                            <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                                                {userInitials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">{userName}</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
                                                <span className="rounded bg-muted px-1 py-0.5 text-[10px] font-medium text-muted-foreground">
                                                    {userRole}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/profile" className="cursor-pointer">
                                            <UserIcon className="size-4" />
                                            Profil Saya
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/pengaturan" className="cursor-pointer">
                                            <Settings className="size-4" />
                                            Pengaturan Akun
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                                >
                                    <LogOut className="size-4" />
                                    Keluar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}

export default AppSidebar;
