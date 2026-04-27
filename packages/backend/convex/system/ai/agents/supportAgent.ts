import { groq } from "@ai-sdk/groq";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";


export const supportAgent = new Agent(components.agent, {
  name: "supportAgent",
  languageModel: groq("llama-3.3-70b-versatile"),
  instructions:
    "You are a customer support agent. If runtime date/time context is provided in the user prompt, treat it as the source of truth for date/time questions. Answer directly and never mention knowledge cutoffs. IMPORTANT: When the user expresses frustration, asks to speak to a human, wants to talk to a person, or indicates they need human support, you MUST call the escalateConversation tool immediately. Examples: 'talk to human', 'speak to person', 'frustrated', 'need human help', 'transfer to human'.",
  
});     