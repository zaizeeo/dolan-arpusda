import LoginForm from "@/components/forms/auth-forms/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AuthPage = () => {
    return (
        <div className="flex min-h-screen justify-center pt-10">
            <Card className="h-fit w-sm md:w-md">
                <CardHeader>
                    <CardTitle>Login Staff Arpusda</CardTitle>
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
