"use client"

import { useAtomValue } from "jotai";
import { AlertTriangleIcon } from "lucide-react";

import { errorMessageAtom } from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";



export const WidgetErrorScreen = () => {

    const errorMessage = useAtomValue(errorMessageAtom);

    
    return (
        <>
           
           {/* Header */}
           <WidgetHeader>
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
                    <p className="text-3xl font-semibold">Hi there! 👋</p>
                    <p className="text-lg opacity-90 font-semibold">
                        Error////////
                    </p>
                </div>
            </WidgetHeader>
            <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
                <AlertTriangleIcon size={64}/>
                <p className="text-sm">
                    {errorMessage || "Invalid configuration"}

                </p>
            </div>
           
        </>
    );
};

