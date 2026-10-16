import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface Props {
    children: ReactNode;
    closeButton?: ReactNode;
}

const CreateGuestBookQuestion = ({ children, closeButton = null }: Props) => {
    const [formErrorMessage, setFormErrorMessage] = useState("");

    const form = useForm();

    const onSubmit = () => {};

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Buat Pertanyaan</SheetTitle>
                    <SheetDescription>Buat Pertanyaan buku tamu</SheetDescription>
                </SheetHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
                    {formErrorMessage && <FieldError errors={[{ message: formErrorMessage }]} />}
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="login-email">Email</FieldLabel>
                                    <Input
                                        {...field}
                                        id="login-email"
                                        type="email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="nama@email.com"
                                        autoComplete="email"
                                    />
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
