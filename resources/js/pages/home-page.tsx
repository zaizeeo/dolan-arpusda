import { Button, buttonVariants } from "@/components/ui/button";
import { PageProps } from "@/types/page-props";
import { Link } from "@inertiajs/react";

const HomePage = (props: PageProps) => {
    console.log({ props });

    return (
        <div>
            <Button>Test</Button>
            <Link className={buttonVariants()} href={"/auth"}>
                Login
            </Link>
        </div>
    );
};

export default HomePage;
