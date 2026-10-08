import { ReactNode } from "react";
import { TooltipProvider } from "../ui/tooltip";
import { Toaster } from "../ui/sonner";

interface Props {
    children: ReactNode;
}

const AppWrapperLayout = ({ children }: Props) => {
    return (
        <div>
            <TooltipProvider>
                {children}
                <Toaster />
            </TooltipProvider>
        </div>
    );
};

export default AppWrapperLayout;
