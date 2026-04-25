import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { MessageDoc, saveMessage } from "@convex-dev/agent";
import { ConvexError } from "convex/values";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { components } from "../_generated/api";
import { paginationOptsValidator } from "convex/server";



export const getMany = query({
    args: {
        contactSessionId: v.id("contactSessions"),
        paginationOpts: paginationOptsValidator
    },
    handler: async (ctx, args) => {
        const contactSession = await ctx.db.get(args.contactSessionId);
        if (!contactSession || contactSession.expireAt < Date.now()) {
            throw new ConvexError({
                code: "SESSION_EXPIRED",
                message: "Session not found or expired",
            });
        }
        const conversations = await ctx.db
            .query("conversations")
            .withIndex("by_contact_session_id", (q) => q.eq("contactSessionId", args.contactSessionId))
            .order("desc")
            .paginate(args.paginationOpts)

        const conversationWithLastMessage=  await Promise.all(
            conversations.page.map(async (conversation) => {
            let lastMessage: MessageDoc | null = null;
            
            const messages = await supportAgent.listMessages(ctx,{
                threadId: conversation.threadId,
                paginationOpts:{
                    numItems:1,
                    cursor: null
                }
            })
            if(messages.page.length > 0){
                lastMessage = messages.page[0] ?? null;
            }
            return {
                _id: conversation._id,
                _creationTime: conversation._creationTime,
                status: conversation.status,
                organizationId: conversation.organizationId,
                threadId: conversation.threadId,
                lastMessage,
            }
            })
        )
        return { ...conversations, page: conversationWithLastMessage };
    }
})

export const getOne = query({
    args: {
        contactSessionId: v.id("contactSessions"),
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.contactSessionId);
        if (!session || session.expireAt < Date.now()) {
            throw new ConvexError({
                code: "SESSION_EXPIRED",
                message: "Session not found or expired",
            });
        }
        const conversation = await ctx.db.get(args.conversationId);

        if (!conversation) {
            throw new ConvexError({
                code: "CONVERSATION_NOT_FOUND",
                message: "Conversation not found",
            });
        }
        if (conversation.contactSessionId !== args.contactSessionId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Incorrect Session",
            });
        }
        return {
            _id: conversation._id,
            status: conversation.status,
            threadId: conversation.threadId,
        }
    }
})


export const create = mutation({
    args: {
        contactSessionId: v.id("contactSessions"),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.contactSessionId);
        if (!session || session.expireAt < Date.now()) {
            throw new ConvexError({
                code: "SESSION_EXPIRED",
                message: "Session not found or expired",
            });
        }


        const { threadId } = await supportAgent.createThread(ctx, {
            userId: args.organizationId

        })

        await saveMessage(ctx, components.agent, {
            threadId,
            message: {
                role: "assistant",
                content: [
                    {
                        type: "text",
                        //customisation
                        text: "Hello! How can I help you today?",
                    },
                ],
            }
        })

        const conversationId = await ctx.db.insert("conversations", {
            contactSessionId: session._id,
            organizationId: args.organizationId,
            status: "unresolved",
            threadId,
        });
        return conversationId;
    }
})