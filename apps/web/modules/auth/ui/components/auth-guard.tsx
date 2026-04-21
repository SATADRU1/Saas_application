"use client";

import { useAuth } from "@clerk/nextjs";
import { AuthLayout } from "../layouts/auth-layout";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isLoaded, isSignedIn } = useAuth();

    // While Clerk is still loading the session, show a loading state
    if (!isLoaded) {
        return (
            <AuthLayout>
                <p>Loading...</p>
            </AuthLayout>
        );
    }

    // If the user is not signed in, redirect to sign-in page.
    // The Clerk middleware already handles this server-side,
    // so this is just a client-side safety net.
    if (!isSignedIn) {
        return (
            <AuthLayout>
                <p>Redirecting to sign in...</p>
            </AuthLayout>
        );
    }

    // User is authenticated — render the dashboard
    return <>{children}</>;
}