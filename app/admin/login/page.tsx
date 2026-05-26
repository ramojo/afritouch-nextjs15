import { SignIn } from "@clerk/nextjs";
import { isClerk } from "@/lib/config";
import LocalLoginForm from "./LocalLoginForm";

export default function LoginPage() {
    if (isClerk()) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <SignIn
                    routing="hash"
                    fallbackRedirectUrl="/admin"
                    signUpUrl={
                        process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ||
                        "/admin/sign-up"
                    }
                />
            </div>
        );
    }
    return <LocalLoginForm />;
}
