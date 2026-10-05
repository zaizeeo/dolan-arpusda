"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { loginSchema, type LoginSchemaType } from "@/lib/validations/auth"

interface LoginFormProps {
  /**
   * If true, wraps the form inside a shadcn Card container with Header and Footer.
   * Defaults to false, so it can be cleanly composed within an existing page Card.
   */
  withCard?: boolean
  className?: string
  onSubmit?: (data: LoginSchemaType) => void
}

export function LoginForm({
  withCard = false,
  className,
  onSubmit: onSubmitProp,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: LoginSchemaType) {
    if (onSubmitProp) {
      onSubmitProp(data)
      return
    }

    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-muted p-4 text-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius) + 4px)",
      } as React.CSSProperties,
    })
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
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
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
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-3.5" />
                  ) : (
                    <Eye className="size-3.5" />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </FieldGroup>
  )

  if (withCard) {
    return (
      <Card className={cn("w-full sm:max-w-md", className)}>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Masukkan kredensial Anda untuk masuk ke sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
            {formFields}
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal" className="w-full justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" form="form-login">
              Masuk
            </Button>
          </Field>
        </CardFooter>
      </Card>
    )
  }

  return (
    <form
      id="form-login"
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("space-y-6", className)}
    >
      {formFields}

      <Field orientation="horizontal" className="w-full justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
        >
          Reset
        </Button>
        <Button type="submit">
          Masuk
        </Button>
      </Field>
    </form>
  )
}

export default LoginForm
