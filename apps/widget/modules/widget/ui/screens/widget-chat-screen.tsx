"use client"
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react"
import { Button } from "@workspace/ui/components/button";
import { WidgetHeader } from "../components/widget-header";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { api } from "@workspace/backend/_generated/api";
import { useAtomValue, useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import { conversationIdAtom, screenAtom, contactSessionIdAtomFamily, organizationIdAtom } from "../../atoms/widget-atoms";
import { useAction, useQuery } from "convex/react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"; 
import { z } from "zod";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";  
import {InfiniteScrollTrigger} from "@workspace/ui/components/infinite-scroll-trigger";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { Form, FormField } from "@workspace/ui/components/form";
import {
    AIConversation,
    AIConversationContent, 
    AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation"
import {
    AIInput,
    AIInputSubmit,
    AIInputTextarea,
    AIInputToolbar,
    AIInputTools,
} from "@workspace/ui/components/ai/input";
import {
    AIMessage,
    AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { 
    AISuggestion,
    AISuggestions,
} from "@workspace/ui/components/ai/suggestion";

 
const formSchema = z.object({
    message: z.string().min(1, "Message is required"),
});

export const WidgetChatScreen = () => {

    const conversationId = useAtomValue(conversationIdAtom);
    const organizationId = useAtomValue(organizationIdAtom);
    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));

    const setContactSessionId = useSetAtom(contactSessionIdAtomFamily(organizationId || ""));
    const setScreen = useSetAtom(screenAtom);
    const setConversationId = useSetAtom(conversationIdAtom)

    const conversation = useQuery(
        api.public.conversation.getOne,
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
    
    const messages = useThreadMessages(
        api.public.messages.getMany,
        conversation?.threadId && contactSessionId
            ? {
                  threadId: conversation.threadId,
                  contactSessionId,
              }
            : "skip",
        { initialNumItems: 10 }
    );



    const {topElementRef, handleLoadMore, canLoadMore, isLoadingMore} = useInfiniteScroll({
        status : messages.status,
        LoadMore : messages.loadMore, 
        LoadSize : 10,
        observerEnable : true   
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const createMessage = useAction(api.public.messages.create);


    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        if (!conversation || !contactSessionId){
            return;
        }

        try {
            setIsSubmitting(true);
            await createMessage({
                threadId: conversation.threadId,
                contactSessionId: contactSessionId,
                prompt: values.message
            });
            form.reset();
        } catch (error) {
            // Keep textarea value so user can retry if request fails.
            console.error("Failed to send message", error);
        } finally {
            setIsSubmitting(false);
        }

    }



    const uiMessages = toUIMessages(messages.results ?? []);
    const hasMessages = uiMessages.length > 0;
    const getMessageText = (message: Record<string, unknown>) => {
        const directContent = message.content;
        if (typeof directContent === "string") {
            return directContent;
        }
        if (Array.isArray(directContent)) {
            return directContent
                .map((item) => {
                    if (typeof item === "string") return item;
                    if (
                        item &&
                        typeof item === "object" &&
                        "text" in item &&
                        typeof (item as { text?: unknown }).text === "string"
                    ) {
                        return (item as { text: string }).text;
                    }
                    return "";
                })
                .join("\n")
                .trim();
        }

        const parts = message.parts;
        if (Array.isArray(parts)) {
            return parts
                .map((part) => {
                    if (typeof part === "string") return part;
                    if (
                        part &&
                        typeof part === "object" &&
                        "text" in part &&
                        typeof (part as { text?: unknown }).text === "string"
                    ) {
                        return (part as { text: string }).text;
                    }
                    return "";
                })
                .join("\n")
                .trim();
        }
        return "";
    };

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
            <AIConversation>
                <AIConversationContent>
                    <InfiniteScrollTrigger
                        canLoadMore={canLoadMore}
                        isLoadingMore={isLoadingMore}
                        onLoadMore={handleLoadMore}
                        ref={topElementRef}
                    />
                    {!hasMessages && (
                        <AIMessage from="assistant">
                            <AIMessageContent>
                                <AIResponse>
                                    Hi! I am your assistant. How can I help you today?
                                </AIResponse>
                            </AIMessageContent>
                        </AIMessage>
                    )}
                    {uiMessages.map((message) => (
                        <AIMessage key={message.id} from={message.role === "user" ? "user" : "assistant"}>
                            <AIMessageContent>
                                <AIResponse>{getMessageText(message as unknown as Record<string, unknown>) || "..."}</AIResponse>
                            </AIMessageContent>
                            {message.role === "assistant" && (
                                <DicebearAvatar
                                    imageUrl="/logo.svg"
                                    seed="assistant"
                                    size={32}
                                />
                            )}
                            
                        </AIMessage>
                    ))}


                </AIConversationContent>
                
            </AIConversation>
            {/* Todo suggestions */}
            <Form {...form}>
                
                <AIInput 
                    className="rounded-none border-x-0 border-b-0"   
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField 
                        control={form.control}
                        disabled={conversation?.status === "resolved"}
                        name="message"
                        render={({field}) => (
                            <AIInputTextarea
                                disabled={conversation?.status === "resolved"}
                                onChange={field.onChange}
                                onKeyDown={(e)=>{
                                 if(e.key === "Enter" && !e.shiftKey && !isSubmitting){
                                    e.preventDefault();
                                    form.handleSubmit(onSubmit)();
                                 }   
                                }}
                                placeholder={
                                    conversation?.status === "resolved"
                                        ? "This conversation is resolved."
                                        : "Enter your message"
                                }
                                value={field.value}
                            />
                        )}
                    />
                    <AIInputToolbar>
                        <AIInputTools />
                        <AIInputSubmit 
                            disabled={
                                conversation?.status === "resolved" ||
                                !form.formState.isValid ||
                                isSubmitting
                            }
                            size="sm"
                            /> 
                            
                    </AIInputToolbar>
                </AIInput>

            </Form>
           
        </>
    );
};

