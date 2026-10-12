import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Library } from "lucide-react";
import { ReactNode } from "react";

interface Props {
    icon: ReactNode;
    code?: string;
    title: string;
    description: string;
    actions?: ReactNode;
}

const ErrorPageLayout = ({ icon, code, title, description, actions }: Props) => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="items-center text-center">
                    <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
                    {code && <div className="font-heading text-4xl font-bold tracking-tight">{code}</div>}
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-balance">{description}</CardDescription>
                </CardHeader>
                {actions && <CardFooter className="justify-center gap-2">{actions}</CardFooter>}
            </Card>

            <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Library className="size-4" />
                </div>
                <div className="grid leading-tight">
                    <span className="text-sm font-semibold text-foreground">Dolan Arpusda</span>
                    <span className="text-xs">Buku Tamu Digital</span>
                </div>
            </div>
        </div>
    );
};

export default ErrorPageLayout;
