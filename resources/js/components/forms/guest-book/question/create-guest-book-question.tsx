import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { createGuestBookQuestionSchema, CreateGuestBookQuestionSchemaType } from "@/lib/validations/guest-book/question";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";

interface Props {
    children: ReactNode;
    closeButton?: ReactNode;
}

const CreateGuestBookQuestion = ({ children, closeButton = null }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    const form = useForm({
        resolver: zodResolver(createGuestBookQuestionSchema),
        defaultValues: {
            label: "",
            description: "",
            options: null,
        },
    });

    const onSubmit = (data: CreateGuestBookQuestionSchemaType) => {};

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Buat Pertanyaan</SheetTitle>
                    <SheetDescription>Buat Pertanyaan buku tamu</SheetDescription>
                </SheetHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6 p-4"}>
                    {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}
                    <FieldGroup>
                        <Controller
                            name="label"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Label</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="text"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Isikan Label"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Deskripsi</FieldLabel>
                                    <Textarea
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Isikan Label"
                                        autoComplete="off"
                                    ></Textarea>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
                <SheetFooter>
                    <Button type="submit">Save changes</Button>
                    <SheetClose asChild>{closeButton ?? <Button variant="outline">Close</Button>}</SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default CreateGuestBookQuestion;
