import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import AppWrapperLayout from "./app-wrapper-layout";

interface Props {
    children: ReactNode;
    title?: string;
}

const DashboardLayout = ({ children, title = "Dashboard" }: Props) => {
    return (
        <AppWrapperLayout>
            <SidebarProvider defaultOpen={true}>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                            <span className="text-sm font-medium text-foreground">{title}</span>
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </AppWrapperLayout>
    );
};

export default DashboardLayout;
