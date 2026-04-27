import { createTool, saveMessage } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import { components } from "../../../_generated/api";

export const resolveConversation = createTool({
  description: "Resolve a conversation",
  inputSchema: z.object({}),
  execute: async (ctx) => {
    if (!ctx.threadId) {
      return "Missing thread ID";
    }

    await ctx.runMutation(internal.system.conversations.resolve, {
      threadId: ctx.threadId,
    });

    await saveMessage(ctx, components.agent, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: [{ type: "text", text: "Conversation resolved" }],
      },
    });
    return "Conversation resolved";
  },
});