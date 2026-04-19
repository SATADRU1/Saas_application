import { SignIn } from "@clerk/nextjs";

export const SignInView = () => {
    return (
        <div>
            <SignIn routing="hash"/>
        </div>
    );
};

