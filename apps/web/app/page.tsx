"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { useQuery, useMutation, Unauthenticated, Authenticated } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { TooltipProvider } from "@workspace/ui/components/tooltip";

export default function Page() {
  const users = useQuery(api.user.getMany);
  const addUser = useMutation(api.user.add);

  return (
    <TooltipProvider>
      <Authenticated>
        <SidebarProvider defaultOpen>
          <DashboardSidebar />

          <SidebarInset className="min-h-screen">
            {/* Header */}
            <header className="flex h-16 items-center gap-4 border-b px-6">
              <SidebarTrigger />
            </header>

            {/* Main Content */}
            <main className="p-6">
              <div className="max-w-3xl space-y-6">
                <h1 className="text-2xl font-semibold">apps/web</h1>

                <UserButton />

                <Button onClick={() => addUser({})}>
                  Add User
                </Button>

                <div className="w-full rounded-lg border p-4 overflow-auto">
                  {/* <pre className="text-sm">
                    {JSON.stringify(users, null, 2)}
                  </pre> */}
                </div>
              </div>
            </main>

          </SidebarInset>
        </SidebarProvider>
      </Authenticated>

      <Unauthenticated>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <p>Must be signed in!</p>
          <SignInButton>
            Sign in!
          </SignInButton>
        </div>
      </Unauthenticated>
    </TooltipProvider>
  );
}