import { Button } from "@/components/ui/button";
import { guestBookStatisticsIndex, homePage, login } from "@/routes";
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
    badge,
    badgeIcon: BadgeIcon,
    description,
    footerDescription = "Sistem Informasi Buku Tamu Digital Jeta Arsip.",
}: PublicFormLayoutProps) => {
    const { auth } = usePage<PageProps>().props;

    return (
        <div className="min-h-screen bg-muted/20 pb-16 lg:flex lg:h-dvh lg:flex-col lg:overflow-hidden lg:pb-0">
            <header className="sticky top-0 z-10 shrink-0 border-b border-border bg-background/95 backdrop-blur-sm">
                <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:py-1">
                    <div className="flex items-center gap-2">
                        <img src="/images/logo-banyumas.png" alt="Logo Kabupaten Banyumas" className="size-9 object-contain lg:size-8" />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-tight text-foreground">Jeta Arsip</span>
                            <span className="text-xs text-muted-foreground">Kabupaten Banyumas</span>
                        </div>
                    </div>

                    {/* <div className="flex flex-wrap items-center gap-2">
                        <PublicFormSwitcher activeForm={activeForm} />

                        <Button variant="outline" size="sm" asChild>
                            {auth.user !== null ? (
                                <Link href={guestBookStatisticsIndex.url()}>
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
                    </div> */}
                </div>
            </header>

            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-8 pb-16 sm:px-6 lg:min-h-0 lg:pt-2 lg:pb-0">
                <div className="mb-6 shrink-0 text-center lg:mb-1">
                    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground lg:hidden">
                        {BadgeIcon ? <BadgeIcon className="size-3.5 text-primary" /> : null}
                        {badge}
                    </span>
                    {/* <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-base">{title}</h1> */}
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base lg:hidden">{description}</p>
                </div>

                <div className="min-w-0 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">{children}</div>

                <footer className="mt-12 text-center text-xs text-muted-foreground lg:mt-auto lg:flex lg:items-center lg:justify-center lg:gap-1.5 lg:pt-1">
                    <p>© {new Date().getFullYear()} Dinas Arsip dan Perpustakaan Daerah Kabupaten Banyumas.</p>
                    <p className="mt-1 lg:mt-0">{footerDescription}</p>
                </footer>
            </main>
        </div>
    );
};

export default PublicFormLayout;
