import { createTool, saveMessage } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import { components } from "../../../_generated/api";

export const escalateConversation = createTool({
  description: "Escalate a conversation to a human operator. Use this IMMEDIATELY when the user expresses frustration, asks to speak to a human, wants to talk to a person, or indicates they need human support.",
  inputSchema: z.object({}),
  execute: async (ctx) => {
    console.log("escalateConversation tool called, threadId:", ctx.threadId);
    
    if (!ctx.threadId) {
      console.error("Missing thread ID in escalateConversation");
      return "Missing thread ID";
    }

    try {
      await ctx.runMutation(internal.system.conversations.escalate, {
        threadId: ctx.threadId,
      });
      console.log("Conversation status updated to escalated");

      await saveMessage(ctx, components.agent, {
        threadId: ctx.threadId,
        message: {
          role: "assistant",
          content: [{ type: "text", text: "Conversation escalated to a human operator" }],
        },
      });
      console.log("Escalation message saved");
      return "Conversation escalated";
    } catch (error) {
      console.error("Error in escalateConversation:", error);
      throw error;
    }
  },
});