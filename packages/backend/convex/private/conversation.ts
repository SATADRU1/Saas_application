import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { MessageDoc } from "@convex-dev/agent";
import { ConvexError } from "convex/values";
import { supportAgent } from "../system/ai/agents/supportAgent";

import { paginationOptsValidator } from "convex/server";
import { PaginationResult } from "convex/server";
import { Doc } from "../_generated/dataModel";

export const updateStatus = mutation({
    args: {
        conversationId: v.id("conversations"),
        status: v.union(
            v.literal("unresolved"),
            v.literal("resolved"),
            v.literal("escalated")
        ),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "User not authenticated",
            });
        }

        const orgId = identity.orgId as string;

        if (!orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization ID not found",
            });
        }
        
        
        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found",
            });
        }
        
        if (conversation.organizationId !== orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Conversation does not belong to this organization",
            });
        }
        
        await ctx.db.patch(args.conversationId, {
            status: args.status,
        });
        
        return {
            success: true,
            conversationId: args.conversationId,
            status: args.status,
        };
    }
});

export const getOne = query({
    args : {
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "User not authenticated",
            });
        }

        const orgId = identity.orgId as string;

        if (!orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization ID not found",
            });
        }
        
        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found",
            });
        }
        
        if (conversation.organizationId !== orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Conversation does not belong to this organization",
            });
        }
        
        const contactSession = await ctx.db.get(conversation.contactSessionId);
        if (!contactSession) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Contact session not found",
            });
        }
        
        return {
            ...conversation,
            contactSession,
        };
    }
})




export const getMany = query({
    args: {
        contactSessionId: v.optional(v.id("contactSessions")),
        paginationOpts: paginationOptsValidator,
        status: v.optional(
            v.union(
                v.literal("unresolved"),
                v.literal("escalated"),
                v.literal("resolved")
            )
        ),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "User not authenticated",
            });
        }

        const orgId = identity.orgId as string;

        if (!orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization ID not found",
            });
        }

        let conversation: PaginationResult<Doc<"conversations">> ;

       if(args.status){
        conversation = await ctx.db
            .query("conversations")
            .withIndex("by_status_and_organization_id", (q) => q.eq(
                "status", args.status as Doc<"conversations">["status"])
                .eq("organizationId", orgId)
            )
            .order("desc")
            .paginate(args.paginationOpts)
       }else{
        conversation = await ctx.db
            .query("conversations")
            .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
            .order("desc")
            .paginate(args.paginationOpts)
       }
       
       const conversationWithAdditionalData = await Promise.all(
        conversation.page.map(async (conversation) => {
            let lastMessage: MessageDoc | null = null;
            

            const contactSession = await ctx.db.get(conversation.contactSessionId);

            if(!contactSession){
                return null;
            }

            const messages = await supportAgent.listMessages(ctx, {
                threadId: conversation.threadId,
                paginationOpts: {
                    numItems: 1,
                    cursor: null,
                },
            });
            
            if(messages.page.length > 0){
                lastMessage = messages.page[0] ?? null;
            }
            
            return {
                ...conversation,
                lastMessage,
                contactSession,
            };
        })
       );
       
       const validConversations = conversationWithAdditionalData.filter(
        (conv):conv is NonNullable<typeof conv> => conv !== null);
       return {
        ...conversation,
        page: validConversations};
    }
})
