import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { saveMessage } from "@convex-dev/agent";
import { ConvexError } from "convex/values";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { components } from "../_generated/api";

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