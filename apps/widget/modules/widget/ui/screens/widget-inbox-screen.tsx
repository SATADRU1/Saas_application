"use client"

import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon } from "lucide-react";
import {formatDistanceToNow} from "date-fns";
import { Button } from "@workspace/ui/components/button";
import { conversationIdAtom, organizationIdAtom, contactSessionIdAtomFamily, screenAtom } from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";


export const WidgetInboxScreen = () => {

   const setScreen = useSetAtom(screenAtom);
   const setConversationId = useSetAtom(conversationIdAtom);

   const organizationId = useAtomValue(organizationIdAtom);
   const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));
   const conversations = usePaginatedQuery(
    api.public.converSession.getMany,
    contactSessionId ? {
        contactSessionId,
    } : "skip",
    { initialNumItems: 10 }
   );
   const {topElementRef, handleLoadMore, canLoadMore, isLoadingMore} = useInfiniteScroll({
           status : conversations.status,
           LoadMore : conversations.loadMore, 
           LoadSize : 10,  
       })

    
    return (
        <>
           
           {/* Header */}
           <WidgetHeader>
                <div className="flex items-center gap-x-2">
                    <Button
                        variant="transparent"
                        size="icon"
                        onClick={() => setScreen("selection")}
                    >
                        <ArrowLeftIcon />
                    </Button>
                    <p>Inbox</p>
                </div>
            </WidgetHeader>
            <div className="flex flex-1 flex-col gap-y-2 overflow-y-auto">
                {conversations?.results && conversations.results.length > 0 &&
                    conversations.results.map((conversation) => (
                        <Button
                            className="h-20 w-full justify-between"
                            key={conversation._id}
                            onClick={() => {
                                setConversationId(conversation._id);
                                setScreen("chat");
                            }}
                            variant="outline"
                        >
                            <div className="flex w-full flex-col gap-2 overflow-hidden text-start">
                                <div className="flex w-full items-center justify-between gap-x-4">
                                    <p className="text-muted-foreground text-xs">Chat</p>
                                    <p className="text-muted-foreground text-xs">
                                        {formatDistanceToNow(new Date(conversation._creationTime),{
                                        })}
                                    </p>
                                </div>
                                <div className="flex w-full items-center justify-between gap-x-2">
                                    <p className="truncate text-sm">
                                        {conversation.lastMessage?.text || conversation.lastMessage?.text || "..."}
                                    </p>
                                    <ConversationStatusIcon status={conversation.status} className="shrink-0" />
                                </div>
                            </div>

                        </Button>
                    ))
                
                }
                <InfiniteScrollTrigger 
                    canLoadMore={canLoadMore} 
                    isLoadingMore={isLoadingMore} 
                    onLoadMore={handleLoadMore} 
                    ref={topElementRef}
                />
            </div>
           
        </>
    );
};

