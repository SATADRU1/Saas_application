import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { ConvexError } from "convex/values";

export const getOne = query({
    args: {
        contactSessionId: v.id("contactSessions"),
        conversationId: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const session = await ctx.db.get(args.contactSessionId);
        if(!session || session.expireAt < Date.now()){
            throw new ConvexError({
                code: "SESSION_EXPIRED",
                message: "Session not found or expired",
            });
        }
        const conversation = await ctx.db.get(args.conversationId);
            
        if(!conversation){
            return null;
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
        if(!session || session.expireAt < Date.now()){
            throw new ConvexError({
                code: "SESSION_EXPIRED",
                message: "Session not found or expired",
            });
        }


        const threadId = "123";
        const conversationId = await ctx.db.insert("conversations",{
            contactSessionId: session._id,
            organizationId: args.organizationId,
            status: "unresolved",
            threadId,
        });
        return conversationId;
    }
})