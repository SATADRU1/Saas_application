"use client"

import { Id } from "@workspace/backend/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import {
    AIConversationContent,
    AIConversation,
    AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";

import {
  AIInput,
  AIInputButton,
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
import { Form, FormField } from "@workspace/ui/components/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    message: z.string().min(1, "Message is required"),
});

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

export const ConversationIdView = ({ conversationsId }: { conversationsId: Id<"conversations"> }) => {
    const conversation = useQuery(api.private.conversation.getOne,
         { conversationId: conversationsId })

    const messages = useThreadMessages(
        api.private.messages.getMany,
        conversation?.threadId ? { threadId: conversation.threadId, contactSessionId: conversation.contactSessionId } : "skip",
        { initialNumItems: 10 }
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        },
    })

    const createMessage = useMutation(api.private.messages.create);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await createMessage({
                conversationId: conversationsId,
                prompt: values.message,
            });
            form.reset()
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <div className="flex h-full flex-col bg-muted">
            <header className="flex items-center justify-between border-b bg-background p-2.5">
                <Button
                    size="sm"
                    variant="ghost"
                >

                    <MoreHorizontalIcon />
                </Button>
            </header>
            <AIConversation className="max-h-[calc(100vh-180px)]">
                <AIConversationContent>
                    {toUIMessages(messages.results ?? [])?.map((message) => (
                        <AIMessage key={message.id} from={message.role === "user" ? "assistant" : "user"}>
                            <AIMessageContent>
                                <AIResponse>
                                    {getMessageText(message as unknown as Record<string, unknown>) || "..."}
                                </AIResponse>
                            </AIMessageContent>
                            {message.role === "user" && (
                                <DicebearAvatar seed={conversation?.contactSessionId ?? "user"} size={32} />
                            )}
                        </AIMessage>
                    ))}
                </AIConversationContent>
                <AIConversationScrollButton />
            </AIConversation>
            <div className="p-2">
                <Form {...form}>
                    <AIInput onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField 
                            control={form.control}
                            disabled={conversation?.status === "resolved"}
                            name="message"
                            render={({ field }) => (
                                <AIInputTextarea 
                                    disabled={conversation?.status === "resolved" || 
                                    form.formState.isSubmitting
                                }
                                onChange={field.onChange}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey){
                                        e.preventDefault();
                                        form.handleSubmit(onSubmit)()
                                    }
                                }}

                                placeholder={
                                    conversation?.status === "resolved" 
                                    ? "This conversation is resolved" 
                                    : "Type your message..."
                                }
                                value={field.value}
                                />
                            )}
                        />
                        <AIInputToolbar>
                            <AIInputTools>
                                <AIInputButton>
                                    <Wand2Icon />
                                        Enhance
                                </AIInputButton>
                            </AIInputTools>
                            <AIInputSubmit 
                                disabled={
                                conversation?.status === "resolved" || 
                                form.formState.isValid || 
                                form.formState.isSubmitting}
                                status="ready"
                                type="submit"
                            />
                        </AIInputToolbar>
                    </AIInput>
                </Form>  

            </div>
        </div>
    );
};