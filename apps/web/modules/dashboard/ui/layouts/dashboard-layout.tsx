import { AuthGuard } from "@/modules/auth/ui/components/auth-guard"
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@workspace/ui/components/sidebar"
import { cookies } from "next/headers"
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

export const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {

    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

    return (
        <AuthGuard>
           <OrganizationGuard>
                <TooltipProvider>
                    <SidebarProvider defaultOpen={defaultOpen}>
                        <DashboardSidebar />
                        <SidebarInset>
                            <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
                                <SidebarTrigger className="-ml-1" />
                            </header>
                            <main className="flex min-h-0 flex-1 flex-col p-4">
                                {children}
                            </main>
                        </SidebarInset>
                    </SidebarProvider>
                </TooltipProvider>
            </OrganizationGuard>
        </AuthGuard>
    )
    
}
    