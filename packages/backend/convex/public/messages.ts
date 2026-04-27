
import { action, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { internal } from "../_generated/api";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { escalateConversation } from "../system/ai/tools/escalateConversation";
import { resolveConversation } from "../system/ai/tools/resolveConversation";

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


export const create = action({
    args: {
        prompt: v.string(),
        threadId: v.string(),
        contactSessionId: v.id("contactSessions"),
    },
    handler: async (ctx, args) => {
        const contactSession = await ctx.runQuery(
            internal.system.contactSessions.getOne,
            {
                contactSessionId: args.contactSessionId
            }
        )

        if (!contactSession || contactSession.expireAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid Session"
            })
        }

        const { conversation } = await ctx.runQuery(
            internal.system.conversations.getByThreadId,
            {
                threadId: args.threadId
            }
        )

        if (!conversation) {
            throw new ConvexError({ 
                code: "NOT_FOUND",
                message: "Conversation not found"
            })
        }

        if (conversation.status === "resolved") {
            throw new ConvexError({
                code: "BAD_REQUEST",
                message: "Conversation is resolved"
            })
        }

        //todo implement subscription check

        if (isDateTimeQuestion(args.prompt)) {
            await saveMessage(ctx, components.agent, {
                threadId: args.threadId,
                message: {
                    role: "user",
                    content: [{ type: "text", text: args.prompt }],
                },
            });

            await saveMessage(ctx, components.agent, {
                threadId: args.threadId,
                message: {
                    role: "assistant",
                    content: [{ type: "text", text: getDateTimeAnswer() }],
                },
            });
            return;
        }


        const shouldTriggerAgent = 
            conversation.status === "unresolved";

        
        
        try {
            await supportAgent.generateText(
                ctx,
                { threadId: args.threadId},
                { prompt: args.prompt,
                    tools: {
                        escalateConversation,
                        resolveConversation
                    }
                 }
            )
            
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            const isMissingGroqKey =
                message.includes("AI_LoadAPIKeyError") ||
                message.includes("GROQ_API_KEY") ||
                message.includes("Groq API key is missing");
            const isModelUnavailable =
                message.includes("AI_APICallError") &&
                (message.includes("decommissioned") ||
                    message.includes("no longer supported"));

            if (!isMissingGroqKey && !isModelUnavailable) {
                throw error;
            }

            // Gracefully keep chat usable when LLM provider is not configured.
            await saveMessage(ctx, components.agent, {
                threadId: args.threadId,
                message: {
                    role: "user",
                    content: [{ type: "text", text: args.prompt }],
                },
            });

            await saveMessage(ctx, components.agent, {
                threadId: args.threadId,
                message: {
                    role: "assistant",
                    content: [
                        {
                            type: "text",
                            text: isModelUnavailable
                                ? "I received your message, but the configured Groq model is no longer supported. Please update the model name in backend configuration."
                                : "I received your message, but the AI reply is unavailable because GROQ_API_KEY is not configured yet. Please ask the admin to add it in backend environment variables.",
                        },
                    ],
                },
            });
        }

    
    
    }
})

export const getMany = query ({
    args: {
        threadId: v.string(),
        paginationOpts: paginationOptsValidator,
        contactSessionId: v.id("contactSessions")
    },
    handler: async (ctx, args) => {
        const contactSession = await ctx.db.get(args.contactSessionId);

        if (!contactSession || contactSession.expireAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid Session"
            })
        }

        const paginated = await supportAgent.listMessages(
            ctx,
            { threadId: args.threadId,
             paginationOpts: args.paginationOpts
        })

        return paginated;
    }
})