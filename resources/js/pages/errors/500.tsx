import ErrorPageLayout from "@/components/layouts/error-page-layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { homePage } from "@/routes";
import { Link } from "@inertiajs/react";
import { ShieldAlert, TriangleAlert } from "lucide-react";

interface Props {
    status?: number;
    message?: string;
}

const ErrorPage = ({ status = 500, message }: Props) => {
    const isAccessDenied = status === 403;

    return (
        <ErrorPageLayout
            icon={isAccessDenied ? <ShieldAlert className="size-6" /> : <TriangleAlert className="size-6" />}
            code={String(status)}
            title={isAccessDenied ? "Akses Ditolak" : "Terjadi Kesalahan"}
            description={
                message ||
                (isAccessDenied
                    ? "Maaf, kamu tidak memiliki akses untuk membuka halaman ini."
                    : "Terjadi kesalahan pada server, silakan coba lagi beberapa saat.")
            }
            actions={
                <>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Muat Ulang
                    </Button>
                    <Link href={homePage.url()} className={buttonVariants()}>
                        Kembali ke Beranda
                    </Link>
                </>
            }
        />
    );
};

export default ErrorPage;
