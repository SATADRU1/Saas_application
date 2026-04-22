"use client"
import { useAtomValue } from "jotai";
import { WidgetFooter } from "../components/widget-footer";
// import { WidgetHeader } from "../components/widget-header";
import { WidgetAuthScreen } from "../screens/widget-auth-screen";
import { screenAtom } from "../../atoms/widget-atoms";

interface props{
    organizationId:string;
    
}

export const WidgetView = ({organizationId}:props)=>{
    const screen = useAtomValue(screenAtom);
    const screenComponent = {
        error: () => <div>error</div>,
        loading: () => <div>loading...</div>,
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