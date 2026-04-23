"use client"


import { Button } from "@workspace/ui/components/button";
import { WidgetHeader } from "../components/widget-header";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { api } from "@workspace/backend/_generated/api";
import { useAtomValue, useSetAtom } from "jotai";
import { conversationIdAtom, screenAtom, contactSessionIdAtomFamily, organizationIdAtom } from "../../atoms/widget-atoms";
import { useQuery } from "convex/react";



export const WidgetChatScreen = () => {

    const conversationId = useAtomValue(conversationIdAtom);
    const organizationId = useAtomValue(organizationIdAtom);
    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));

    const setContactSessionId = useSetAtom(contactSessionIdAtomFamily(organizationId || ""));
    const setScreen = useSetAtom(screenAtom);
    const setConversationId = useSetAtom(conversationIdAtom)

    const conversation = useQuery(
        api.public.converSession.getOne,
        conversationId && contactSessionId
            ? {
                  conversationId,
                  contactSessionId,
              }
            : "skip"
    );

    const onBack = ()=>{
        setScreen("selection");
        setConversationId(null);
    }
    

    return (
        <>
           
           {/* Header */}
           <WidgetHeader className="flex items-center justify-between">
                <div className="flex items-center gap-x-2 px-2">
                    <Button
                        onClick={onBack}
                        size="icon"
                        variant="transparent"
                        
                    >
                        <ArrowLeftIcon />
                    </Button>
                    <p className="text-xl font-semibold">Let&apos;s Start Chatting</p>
                </div>
                <Button
                    size="icon"
                    variant="transparent"
                >
                    <MenuIcon />

                </Button>
            </WidgetHeader>
            <div className="flex flex-1 flex-col  gap-y-4 p-4 ">
                
                {JSON.stringify(conversation)}
            </div>
           
        </>
    );
};

