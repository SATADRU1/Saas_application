"use client"
import { useAtomValue } from "jotai";
import { WidgetFooter } from "../components/widget-footer";
// import { WidgetHeader } from "../components/widget-header";
import { WidgetAuthScreen } from "../screens/widget-auth-screen";
import { screenAtom } from "../../atoms/widget-atoms";
import { WidgetErrorScreen } from "../screens/widget-error-screen";
import { WidgetLoadingScreen } from "../screens/widget-loading-screen";

interface props{
    organizationId:string | null;
    
}

export const WidgetView = ({organizationId}:props)=>{
    const screen = useAtomValue(screenAtom);
    const screenComponent = {
        error: () => <WidgetErrorScreen/>,
        loading: () => <WidgetLoadingScreen organizationId={organizationId} />,
        selection: () => <div>selection</div>,
        voice: () => <div>voice</div>,
        auth: () => <WidgetAuthScreen/>,
        inbox: () => <div>inbox</div>,
        chat: () => <div>chat</div>,
        contact: () => <div>contact</div>,
    }
    return (
        <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
            {screenComponent[screen]()}
            <WidgetFooter/>
        </main>
    )
}