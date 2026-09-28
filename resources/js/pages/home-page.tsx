import { Button } from "@/components/ui/button";
import { PageProps } from "@/types/page-props";

const HomePage = (props: PageProps) => {
    console.log({ props });

    return (
        <div>
            <Button>Test</Button>
        </div>
    );
};

export default HomePage;
