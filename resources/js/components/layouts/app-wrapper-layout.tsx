import { ReactNode } from "react";
import { TooltipProvider } from "../ui/tooltip";
import { Toaster } from "../ui/sonner";

interface Props {
    children: ReactNode;
    className?: string;
}

const AppWrapperLayout = ({ children, className }: Props) => {
    return (
        <div className={className}>
            <TooltipProvider>
                {children}
                <Toaster />
            </TooltipProvider>
        </div>
    );
};

export default AppWrapperLayout;
