import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { loginSchema, type LoginSchemaType } from "@/lib/validations/auth";

import { router, type VisitHelperOptions } from "@inertiajs/core";
import { useState } from "react";
import { toast } from "sonner";

interface LoginFormProps {
    /**
     * If true, wraps the form inside a shadcn Card container with Header and Footer.
     * Defaults to false, so it can be cleanly composed within an existing page Card.
     */
    withCard?: boolean;
    className?: string;
    onSubmit?: (data: LoginSchemaType) => void;
}

export function LoginForm({ withCard = false, className, onSubmit: onSubmitProp }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(data: LoginSchemaType) {
        if (onSubmitProp) {
            onSubmitProp(data);
            return;
        }

        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                toast.success("Berhasil", {
                    description: <span className="text-foreground/50">Anda akan diarahkan ke halaman Dashboard!</span>,
                });
            },
            onError: (error) => {
                const description = error?.server[0] || "Coba lagi beberapa saat";
                toast.error("Terjadi Kesalahan!", { description });
            },
        } satisfies VisitHelperOptions;

        router.post("/api/auth/login", data, requestOptions);
    }

    const formFields = (
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
    );

    if (withCard) {
        return (
            <Card className={cn("w-full sm:max-w-md", className)}>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Masukkan kredensial Anda untuk masuk ke sistem.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
                        {formFields}
                    </form>
                </CardContent>
                <CardFooter>
                    <Field orientation="horizontal" className="w-full justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                            Reset
                        </Button>
                        <Button type="submit" form="form-login">
                            Masuk
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        );
    }

    return (
        <form id="form-login" onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6", className)}>
            {formFields}

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
