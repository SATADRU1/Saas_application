"use client"
import { WidgetFooter } from "../components/widget-footer";
// import { WidgetHeader } from "../components/widget-header";
import { WidgetAuthScreen } from "../screens/widget-auth-screen";

interface props{
    organizationId:string;
    
}

export const WidgetView = ({organizationId}:props)=>{
    return (
        <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
            <WidgetAuthScreen/>
            <WidgetFooter/>
        </main>
    )
}