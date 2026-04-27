
import { action, mutation, query } from "../_generated/server";
import { generateText } from "ai";
import { ConvexError, v } from "convex/values";
import { internal } from "../_generated/api";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { groq } from "@ai-sdk/groq";

const APP_TIMEZONE = "Asia/Kolkata";

function isDateTimeQuestion(prompt: string) {
    const normalized = prompt.trim().toLowerCase();
    return (
        normalized.includes("today") ||
        normalized.includes("date") ||
        normalized.includes("time") ||
        normalized.includes("day")
    );
}

function getDateTimeAnswer() {
    const now = new Date();
    const dateText = new Intl.DateTimeFormat("en-IN", {
        timeZone: APP_TIMEZONE,
        dateStyle: "full",
    }).format(now);
    const timeText = new Intl.DateTimeFormat("en-IN", {
        timeZone: APP_TIMEZONE,
        timeStyle: "long",
    }).format(now);
    return `Today's date is ${dateText}. Current time is ${timeText} (${APP_TIMEZONE}).`;
}


export const enhanceResponse = action({
    args: {
        prompt: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "identity not found",
            });
        }
        
        const orgId = identity.orgId as string;
        
        if (!orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization ID not found",
            });
        }
        
        const response = await generateText({
            model: groq("llama-3.3-70b-versatile"),
            messages: [
                {
                    role: "system",
                    content: "Emhance the operator's response to be more helpful and detailed.",
                },
                {
                    role: "user",
                    content: args.prompt,
                },
            ],
        })
        return response.text;
    }
})

export const create = mutation({
    args: {
        prompt: v.string(),
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
                message: "Conversation not found"
            })
        }

        if (conversation.organizationId !== orgId) {
            throw new ConvexError({
                code: "FORBIDDEN",
                message: "You don't have access to this conversation. Please contact the conversation owner or admin for access."
            });
        }

        if (conversation.status === "resolved") {
            throw new ConvexError({
                code: "BAD_REQUEST",
                message: "Conversation is resolved. You cannot send messages to a resolved conversation."
            })
        }

    

        if (isDateTimeQuestion(args.prompt)) {
            const agentName =
                typeof identity.familyName === "string"
                    ? identity.familyName
                    : typeof identity.name === "string"
                      ? identity.name
                      : undefined;

            await saveMessage(ctx, components.agent, {
                threadId: conversation.threadId,
                message: {
                    role: "user",
                    content: [{ type: "text", text: args.prompt }],
                },
            });

            await saveMessage(ctx, components.agent, {
                threadId: conversation.threadId,
                agentName,
                message: {
                    role: "assistant",
                    content: args.prompt,
                },
            });
            return;
        }
        await saveMessage(ctx, components.agent, {
            threadId: conversation.threadId,
            message: {
                role: "assistant",
                content: [{ type: "text", text: args.prompt }],
            },
        });

    }

})

export const getMany = query ({
    args: {
        threadId: v.string(),
        paginationOpts: paginationOptsValidator,
        contactSessionId: v.id("contactSessions")
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

        const { conversation } = await ctx.runQuery(
            internal.system.conversations.getByThreadId,
            { threadId: args.threadId }
        );
        if (!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found",
            });
        }

        if (conversation.organizationId !== orgId) {
            throw new ConvexError({
                code: "FORBIDDEN",
                message: "You don't have access to this conversation. Please contact the conversation owner or admin for access.",
            });
        }

        if (conversation.contactSessionId !== args.contactSessionId) {
            throw new ConvexError({
                code: "BAD_REQUEST",
                message: "Conversation and contact session mismatch",
            });
        }

        const paginated = await supportAgent.listMessages(
            ctx,
            { 
                threadId: args.threadId,
                paginationOpts: args.paginationOpts
            }
        )

        return paginated;
    }
})