"use client"
import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

interface props{
    organizationId:string;
    
}

export const WidgetView = ({organizationId}:props)=>{
    return (
        <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
            <WidgetHeader>
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
                    <p className="text-3xl font-semibold">
                        Hi there!👋
                    </p>
                    <p className="text-lg opacity-90 font-semibold">
                        How can we help you today?
                    </p>
                </div>
            </WidgetHeader>
            <div className="flex flex-1">
                <h1>Widget View: {organizationId}</h1>
            </div>
            <WidgetFooter/>
        </main>
    )
}