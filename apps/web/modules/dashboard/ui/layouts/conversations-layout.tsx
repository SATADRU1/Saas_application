import { ConversationsPanel } from "../components/conversations-panel";

export const ConversationsLayout = ({ children }: { children: React.ReactNode }) => {
    return(
        <div className="flex h-full min-h-0 w-full overflow-hidden rounded-md border">
            <aside className="w-90 min-w-[260px] shrink-0 border-r bg-background p-4">
                <div className="font-medium"><ConversationsPanel />
                </div>
            </aside>
            <section className="min-w-0 flex-1 p-4">
                {children}
            </section>
        </div>
    )
}