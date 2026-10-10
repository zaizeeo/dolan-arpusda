import { ReactNode } from "react";
import AppWrapperLayout from "./app-wrapper-layout";

interface Props {
    children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
    return <AppWrapperLayout>{children}</AppWrapperLayout>;
};

export default DashboardLayout;
