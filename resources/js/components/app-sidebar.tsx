import { Link, router, usePage } from "@inertiajs/react";
import {
    BookMarked,
    BookOpenCheck,
    BookUser,
    ChartPie,
    ChevronRight,
    ChevronsUpDown,
    ClipboardList,
    FileQuestionMark,
    Library,
    LogOut,
    MessageCircleQuestionMark,
    MessagesSquare,
    Settings,
    User as UserIcon,
    UserKey,
    UsersRound,
    type LucideIcon,
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
import {
    guestBookStatisticsIndex,
    logout,
    settings,
    surveyQuestionIndex,
    surveyResponseIndex,
    surveyStatisticsIndex,
    userControllerIndex,
} from "@/routes";
import guestBook from "@/routes/dashboard/management/guest-book";
import guestBookQuestion from "@/routes/dashboard/management/guest-book-question";
import Profile from "@/routes/profile";
import { User } from "@/types";
import { PageProps } from "@/types/page-props";

interface NavSubItem {
    title: string;
    url: string;
    isActive: boolean;
    icon?: LucideIcon;
}

interface NavItem {
    title: string;
    icon: LucideIcon;
    isActive: boolean;
    url?: string;
    items?: NavSubItem[];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { isMobile } = useSidebar();
    const { url, props: pageProps } = usePage<PageProps>();

    const { name: userName, role: userRole, email: userEmail, avatar } = pageProps.auth.user as User;
    const userInitials = userName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const handleLogout = () => {
        router.post(logout.url());
    };

    const navMain: NavItem[] = [
        {
            title: "Statistik Buku Tamu",
            url: guestBookStatisticsIndex.url(),
            icon: BookMarked,
            isActive: url === guestBookStatisticsIndex.url(),
        },
        {
            title: "Statistik Respon Survei",
            url: surveyStatisticsIndex.url(),
            icon: ChartPie,
            isActive: url === surveyStatisticsIndex.url(),
        },
    ];

    const navManagement: NavItem[] = [
        {
            title: "Data Pengguna",
            url: userControllerIndex.url(),
            icon: UsersRound,
            isActive: url.startsWith(userControllerIndex.url()),
        },
        {
            title: "Buku Tamu",
            icon: BookUser,
            isActive: url === guestBook.index.url() || url.startsWith(guestBookQuestion.index.url()),
            items: [
                {
                    title: "Daftar Buku Tamu",
                    url: guestBook.index.url(),
                    icon: BookOpenCheck,
                    isActive: url === guestBook.index.url(),
                },
                {
                    title: "Pertanyaan Buku Tamu",
                    url: guestBookQuestion.index.url(),
                    icon: MessageCircleQuestionMark,
                    isActive: url.startsWith(guestBookQuestion.index.url()),
                },
            ],
        },
        {
            title: "Survei",
            icon: ClipboardList,
            isActive: url === surveyResponseIndex.url() || url.startsWith(surveyQuestionIndex.url()),
            items: [
                {
                    title: "Respon Survei",
                    url: surveyResponseIndex.url(),
                    icon: MessagesSquare,
                    isActive: url === surveyResponseIndex.url(),
                },
                {
                    title: "Pertanyaan Survei",
                    url: surveyQuestionIndex.url(),
                    icon: FileQuestionMark,
                    isActive: url.startsWith(surveyQuestionIndex.url()),
                },
            ],
        },
    ];

    const renderSidebarItem = (item: NavItem) => {
        if (item.items) {
            return (
                <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
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
                                                {subItem.icon && <subItem.icon className="size-4" />}
                                                <span>{subItem.title}</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            );
        }

        if (!item.url) {
            return null;
        }

        return (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                    <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={guestBookStatisticsIndex.url()}>
                                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Library className="size-4.5" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Jeta Arsip</span>
                                    <span className="truncate text-xs text-muted-foreground">Buku Tamu Digital</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>{navMain.map(renderSidebarItem)}</SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Manajemen</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>{navManagement.map(renderSidebarItem)}</SidebarMenu>
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
                                        <AvatarImage src={avatar} alt={userName} />
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
                                            <AvatarImage src={avatar} alt={userName} />
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
                                        <Link href={Profile.show().url} className="cursor-pointer">
                                            <UserIcon className="size-4" />
                                            Profil Saya
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={Profile.edit().url} className="cursor-pointer">
                                            <Settings className="size-4" />
                                            Update Profil
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={settings.url()} className="cursor-pointer">
                                            <UserKey className="size-4" />
                                            Ganti Password
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
