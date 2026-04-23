"use client"



import { Button } from "@workspace/ui/components/button";
import { api } from "@workspace/backend/_generated/api";
import { useMutation } from "convex/react";
import { MessageSquareTextIcon, ChevronRightIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";
import { useSetAtom, useAtomValue } from "jotai";
import { screenAtom, organizationIdAtom, contactSessionIdAtomFamily, errorMessageAtom, conversationIdAtom } from "../../atoms/widget-atoms";
import { useState } from "react";


export const WidgetSelectionScreen = () => {

    const setScreen = useSetAtom(screenAtom);
    const organizationId = useAtomValue(organizationIdAtom);
    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setConversationId = useSetAtom(conversationIdAtom);
    const createConversation = useMutation(api.public.converSession.create);
    const [isPending, setIsPending] = useState(false);


    const handleCreateConversation = async () => {

        
        if (!contactSessionId) {
            setScreen("auth");
            return;
        }
        if (!organizationId) {
            setScreen("error");
            setErrorMessage("Organization not found");
            return;
        }


        setIsPending(true);

        try {
            const conversationId = await createConversation({
                organizationId,
                contactSessionId,
            });
            
            setConversationId(conversationId);
            setScreen("chat");
        } catch {
            setScreen("auth");
        } finally{
            setIsPending(false);
        }
    };
    
    return (
        <>
           
           {/* Header */}
           <WidgetHeader>
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6">
                    <p className="text-3xl font-semibold">Hi there! 👋</p>
                    <p className="text-lg opacity-90 font-semibold">
                        Let&apos;s get you started
                    </p>
                </div>
            </WidgetHeader>
            <div className="flex flex-1 flex-col gap-y-4 p-4 overflow-y-auto">
                <Button
                    className="h-16 w-full justify-between"
                    variant={"outline"}
                    onClick={handleCreateConversation}
                    disabled={isPending}
                >
                    <div className="flex items-center gap-x-2">
                        <MessageSquareTextIcon className="size-4"/>
                        <span>Start chat</span>
                    </div>
                    <ChevronRightIcon />
                </Button>
                
            </div>
           
        </>
    );
};

