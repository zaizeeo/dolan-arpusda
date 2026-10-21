import ErrorPageLayout from "@/components/layouts/error-page-layout";
import { buttonVariants } from "@/components/ui/button";
import { homePage } from "@/routes";
import { Link } from "@inertiajs/react";
import { SearchX } from "lucide-react";

const NotFoundPage = () => {
    return (
        <ErrorPageLayout
            icon={<SearchX className="size-6" />}
            code="404"
            title="Halaman Tidak Ditemukan"
            description="Halaman yang kamu tuju tidak ditemukan atau mungkin sudah dipindahkan. Silakan kembali ke halaman utama."
            actions={
                <Link href={homePage.url()} className={buttonVariants()}>
                    Kembali ke Beranda
                </Link>
            }
        />
    );
};

export default NotFoundPage;
