import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeStamps } from "@/types";
import { PageProps } from "@/types/page-props";

// {"id":"01a14305-bbf1-736b-b4df-4f071e855c91","label":"Jenis Kelamin","description":"Isi Jenis Kelamin","is_active":true,"deleted_at":null,"created_at":"2026-10-16T04:43:31.000000Z","updated_at":"2026-10-16T04:43:31.000000Z","options":[{"id":"a2fe2e3d-6bea-4ea0-88bb-6ab7483e81dc","guest_book_question_id":"01a14305-bbf1-736b-b4df-4f071e855c91","label":"Laki-Laki","description":null,"is_active":true,"is_allow_custom_text":0,"deleted_at":null,"created_at":null,"updated_at":null},{"id":"a2fe2e3d-6d6a-4ca7-b831-eb9719a93460","guest_book_question_id":"01a14305-bbf1-736b-b4df-4f071e855c91","label":"Perempuan","description":null,"is_active":true,"is_allow_custom_text":0,"deleted_at":null,"created_at":null,"updated_at":null}]}

interface Option extends TimeStamps {
    id: string;
    label: string;
    description: string;
    guest_book_question_id: string;
    is_allow_custom_text: boolean;
    is_active: boolean;
}

interface Question extends TimeStamps {
    id: string;
    label: string;
    description: string;
    is_active: boolean;
    options: Array<Option>;
}

interface Props extends PageProps {
    questions: Array<Question>;
}

const GuestBookQuestionManagement = (props: Props) => {
    return (
        <DashboardLayout>
            <section className="flex flex-col gap-3">
                <h1>Daftar Pertanyaan</h1>
                {props.questions.map((question) => (
                    <Card key={question.id}>
                        <CardHeader>
                            <CardTitle>{question.label}</CardTitle>
                            <CardDescription>{question.label}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {question.options.length > 0 && (
                                <div>
                                    <h1>Pilihan yang aktif</h1>
                                    {question.options.map((option) => (
                                        <ul className="flex flex-col gap-2">
                                            <li className="list-disc">
                                                {option.label}{" "}
                                                <Badge variant={option.is_active ? "default" : "destructive"}>
                                                    {option.is_active ? "Aktif" : "Tidak Aktif"}
                                                </Badge>
                                            </li>
                                        </ul>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </section>
        </DashboardLayout>
    );
};

export default GuestBookQuestionManagement;
