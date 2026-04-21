import { mutation, query ,MutationCtx, QueryCtx } from "./_generated/server";

export const getMany = query({
    args: {},
    handler: async (ctx: QueryCtx) => {
        return await ctx.db.query("users").collect();
    }
})

export const add = mutation({
    args: {},
    handler: async (ctx: MutationCtx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Unauthorized")
        }

        const orgId = identity.orgId as string;
        if (!orgId) {
            throw new Error("No organization")
        }

        // throw new Error("Something went wrong")

        // const userID = await ctx.db.insert("users", {
        //     name: "Sata",
        // });
        // return userID;

    }
});