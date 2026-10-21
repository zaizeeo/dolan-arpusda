import LoginForm from "@/components/forms/auth-forms/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Head } from "@inertiajs/react";

const AuthPage = () => {
    return (
        <div className="flex min-h-screen justify-center pt-10">
            <Head title="Login" />
            <Card className="h-fit w-sm md:w-md">
                <CardHeader>
                    <CardTitle>Login Staff Jeta Arsip</CardTitle>
                    <CardDescription>Masukka kredensial anda</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthPage;
