import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TimeStamps } from "@/types";
import { PageProps } from "@/types/page-props";

interface GuestBookQuestionOptions extends TimeStamps {
    id: string;
    label: string;
    description?: string;
    is_allow_custom_text: boolean;
}

interface GuestBookQuestion extends TimeStamps {
    id: string;
    label: string;
    description?: string;
    sequence_number?: number;
    options: Array<GuestBookQuestionOptions>;
}

interface Props extends PageProps {
    activeQuestions: Array<GuestBookQuestion>;
}

const HomePage = (props: Props) => {
    console.log({ props });

    return (
        <section className="p-3">
            <h1>Buku tamu Arsip Daerah</h1>
            <h2>Kabupaten Banyumas</h2>
            <div className="flex flex-col gap-3 pb-10">
                {props.activeQuestions.map((question) => {
                    const hasOptions = question.options.length > 0;
                    return (
                        <Card className="mx-auto w-sm md:w-md lg:w-lg" key={question.id}>
                            <CardHeader>
                                <CardTitle>{question.label}</CardTitle>
                                <CardDescription>{question.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {hasOptions ? (
                                    <RadioGroup defaultValue="" className="w-fit">
                                        {question.options.map((option) => (
                                            <div key={option.id} className="flex items-center gap-3">
                                                <RadioGroupItem value={option.id} id={option.id} />
                                                <Label htmlFor="r1">{option.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                ) : (
                                    <Input />
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
};

export default HomePage;
