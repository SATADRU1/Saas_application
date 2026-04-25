"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { getCountryFlagUrl } from "@/lib/country-utils";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { formatDistanceToNow } from "date-fns";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import {
  ListIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CornerUpLeftIcon,
} from "lucide-react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { getCountryFromTimeZone } from "@/lib/country-utils";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai/react";
import { statusFilterAtom } from "../../atoms";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const ConversationsPanel = () => {
  const pathname = usePathname();
  const statusFilter = useAtomValue(statusFilterAtom);
  const setStatusFilter = useSetAtom(statusFilterAtom);

  const conversations = usePaginatedQuery(
    api.private.conversation.getMany,
    {
      status:
        statusFilter === "all"
          ? undefined
          : statusFilter,
    },
    {
      initialNumItems: 5,
    }
  );

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingMore,
    isLoadingFirstPage,
  } = useInfiniteScroll({
    status: conversations.status,
    LoadMore: conversations.loadMore,
    LoadSize: 5,
  });

  return (
    <div className="flex h-full w-full flex-col bg-background text-sidebar-foreground">
      <div className="flex flex-col gap-3.5 border-b p-2">
        <Select
          defaultValue="all"
          onValueChange={(value) =>
            setStatusFilter(
              value as "unresolved" | "escalated" | "resolved" | "all"
            )
          }
          value={statusFilter}
        >
          <SelectTrigger className="h-8 border-none px-1.5 shadow-none ring-0 hover:bg-accent hover:text-accent-foreground focus-visible:ring-0">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <ListIcon className="size-4" />
                <span>All</span>
              </div>
            </SelectItem>

            <SelectItem value="unresolved">
              <div className="flex items-center gap-2">
                <ArrowRightIcon className="size-4" />
                <span>Unresolved</span>
              </div>
            </SelectItem>

            <SelectItem value="escalated">
              <div className="flex items-center gap-2">
                <ArrowUpIcon className="size-4" />
                <span>Escalated</span>
              </div>
            </SelectItem>

            <SelectItem value="resolved">
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <span>Resolved</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoadingFirstPage ? (
        <SkeletonConversation />
      ) : (
        <ScrollArea className="max-h-[calc(100vh-53px)]">
          <div className="flex flex-col w-full flex-1 text-sm">
            {conversations.results.map((conversation) => {
              const isLastMessageFromOperator =
                conversation.lastMessage?.message?.role !== "user";

              const country = getCountryFromTimeZone(
                conversation.contactSession.metadata?.timezone
              );

              const countryFlagUrl = country?.code
                ? getCountryFlagUrl(country.code)
                : undefined;

              return (
                <Link
                  key={conversation._id}
                  href={`/conversations/${conversation._id}`}
                  className={cn(
                    "relative flex cursor-pointer items-start gap-3 border-b p-4 py-5 text-sm leading-tight hover:bg-accent hover:text-accent-foreground",
                    pathname === `/conversations/${conversation._id}` &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "-translate-y-1/2 absolute top-1/2 left-0 h-[64%] w-1 rounded-r-full bg-neutral-300 opacity-0 transition-opacity",
                      pathname === `/conversations/${conversation._id}` &&
                        "opacity-100"
                    )}
                  />

                  <DicebearAvatar
                    seed={conversation.contactSession._id}
                    badgeImageUrl={countryFlagUrl}
                    size={40}
                    className="shrink-0"
                  />

                  <div className="flex-1">
                    <div className="flex w-full items-center gap-2">
                      <span className="truncate font-bold">
                        {conversation.contactSession.name}
                      </span>
                      <span className="ml-auto shrink-0 text-muted-foreground text-xs">
                        {conversation._creationTime
                          ? formatDistanceToNow(
                              new Date(conversation._creationTime)
                            )
                          : "Unknown"}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 w-0 grow">
                        {isLastMessageFromOperator && (
                          <CornerUpLeftIcon className="size-4 shrink-0 text-muted-foreground" />
                        )}

                        <span
                          className={cn(
                            "line-clamp-1 text-muted-foreground text-xs",
                            !isLastMessageFromOperator &&
                              "font-bold text-black"
                          )}
                        >
                          {conversation.lastMessage?.text}
                        </span>
                      </div>

                      <ConversationStatusIcon
                        status={conversation.status}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}

            <InfiniteScrollTrigger
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              ref={topElementRef}
            />
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export const SkeletonConversation = () => {
  return (
    <div className="flex min-h-0 flex-col flex-1 gap-2 overflow-auto">
      <div className="relative flex w-full min-w-0 flex-col p-2">
        <div className="w-full space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              className="flex items-start gap-3 rounded-lg p-4"
              key={index}
            >
              <Skeleton className="shrink-0 h-10 w-10 rounded-full" />

              <div className="min-w-0 flex-1">
                <div className="flex w-full items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="ml-auto h-4 w-16 shrink-0" />
                </div>

                <div className="mt-2">
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};