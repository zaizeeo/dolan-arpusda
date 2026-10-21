import { Button } from "@/components/ui/button";
import { homePage, login } from "@/routes";
import dashboard from "@/routes/dashboard";
import survey from "@/routes/survey";
import type { PageProps } from "@/types/page-props";
import { Link, usePage } from "@inertiajs/react";
import { BookOpen, ClipboardList, LayoutDashboard, LogIn, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type PublicForm = "guestbook" | "survey";

interface PublicFormSwitcherProps {
    activeForm: PublicForm;
}

export function PublicFormSwitcher({ activeForm }: PublicFormSwitcherProps) {
    return (
        <nav aria-label="Pilih formulir" className="flex items-center rounded-lg border border-border bg-muted/60 p-1">
            <Button asChild size="sm" variant={activeForm === "guestbook" ? "secondary" : "ghost"} className="gap-1.5">
                <Link href={homePage.url()} aria-current={activeForm === "guestbook" ? "page" : undefined}>
                    <BookOpen className="size-4" />
                    Buku Tamu
                </Link>
            </Button>

            <Button asChild size="sm" variant={activeForm === "survey" ? "secondary" : "ghost"} className="gap-1.5">
                <Link href={survey.show.url()} aria-current={activeForm === "survey" ? "page" : undefined}>
                    <ClipboardList className="size-4" />
                    Survei
                </Link>
            </Button>
        </nav>
    );
}

interface PublicFormLayoutProps {
    children: ReactNode;
    activeForm: PublicForm;
    badge: string;
    badgeIcon?: LucideIcon;
    title: string;
    description: string;
    footerDescription?: string;
}

const PublicFormLayout = ({
    children,
    activeForm,
    badge,
    badgeIcon: BadgeIcon,
    title,
    description,
    footerDescription = "Sistem Informasi Buku Tamu Digital Jeta Arsip.",
}: PublicFormLayoutProps) => {
    const { auth } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-muted/20 pb-16">
            <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
                <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo-banyumas.png" alt="Logo Kabupaten Banyumas" className="size-9 object-contain" />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-tight text-foreground">Jeta Arsip</span>
                            <span className="text-xs text-muted-foreground">Kabupaten Banyumas</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <PublicFormSwitcher activeForm={activeForm} />

                        <Button variant="outline" size="sm" asChild>
                            {auth.user !== null ? (
                                <Link href={dashboard.index.url()}>
                                    <LayoutDashboard className="mr-1.5 size-4" />
                                    Area Petugas
                                </Link>
                            ) : (
                                <Link href={login.url()}>
                                    <LogIn className="mr-1.5 size-4" />
                                    Area Petugas
                                </Link>
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
                <div className="mb-6 text-center">
                    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                        {BadgeIcon ? <BadgeIcon className="size-3.5 text-primary" /> : null}
                        {badge}
                    </span>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">{description}</p>
                </div>

                {children}

                <footer className="mt-12 text-center text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} Dinas Arsip dan Perpustakaan Daerah Kabupaten Banyumas.</p>
                    <p className="mt-1">{footerDescription}</p>
                </footer>
            </main>
        </div>
    );
};

export default PublicFormLayout;
