import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { loginSchema, type LoginSchemaType } from "@/lib/validations/auth";

import { router, type VisitHelperOptions } from "@inertiajs/core";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(data: LoginSchemaType) {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: <span className="text-foreground/50">Anda akan diarahkan ke halaman Dashboard!</span>,
                });
            },
            onError: (error) => {
                const errMessage = error?.server[0] || "Coba lagi beberapa saat";
                setFormErrorMessage(errMessage);
                toast.error("Terjadi Kesalahan!", { description: formErrorMessage });
            },
        } satisfies VisitHelperOptions;

        router.post("/api/auth/login", data, requestOptions);
    }

    return (
        <form id="form-login" onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
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

                <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="login-password">Password</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupButton
                                        type="button"
                                        size="icon-xs"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                    >
                                        {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </FieldGroup>
            <Field orientation="horizontal" className="w-full justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                </Button>
                <Button disabled={isLoading} type="submit">
                    Masuk
                </Button>
            </Field>
        </form>
    );
}

export default LoginForm;
