/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as private_conversation from "../private/conversation.js";
import type * as private_messages from "../private/messages.js";
import type * as public_contactSessions from "../public/contactSessions.js";
import type * as public_conversation from "../public/conversation.js";
import type * as public_messages from "../public/messages.js";
import type * as public_organization from "../public/organization.js";
import type * as system_ai_agents_supportAgent from "../system/ai/agents/supportAgent.js";
import type * as system_ai_tools_escalateConversation from "../system/ai/tools/escalateConversation.js";
import type * as system_ai_tools_resolveConversation from "../system/ai/tools/resolveConversation.js";
import type * as system_contactSessions from "../system/contactSessions.js";
import type * as system_conversations from "../system/conversations.js";
import type * as user from "../user.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "private/conversation": typeof private_conversation;
  "private/messages": typeof private_messages;
  "public/contactSessions": typeof public_contactSessions;
  "public/conversation": typeof public_conversation;
  "public/messages": typeof public_messages;
  "public/organization": typeof public_organization;
  "system/ai/agents/supportAgent": typeof system_ai_agents_supportAgent;
  "system/ai/tools/escalateConversation": typeof system_ai_tools_escalateConversation;
  "system/ai/tools/resolveConversation": typeof system_ai_tools_resolveConversation;
  "system/contactSessions": typeof system_contactSessions;
  "system/conversations": typeof system_conversations;
  user: typeof user;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  agent: import("@convex-dev/agent/_generated/component.js").ComponentApi<"agent">;
};
