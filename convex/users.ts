import { internalMutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";

/** Looks up the Convex user row for the currently signed-in Clerk user. */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
}

/** Throws if there's no signed-in user; otherwise returns them. */
export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const user = await getCurrentUser(ctx);
  if (!user) throw new Error("Not signed in");
  return user;
}

export const me = query({
  args: {},
  handler: async (ctx) => getCurrentUser(ctx),
});

/**
 * Called on first sign-in (e.g. from a client effect right after Clerk auth
 * resolves) to create the matching Convex user row. Safe to call repeatedly.
 */
export const ensureUser = internalMutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (existing) return existing._id;
    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      avatarUrl: args.avatarUrl,
      role: "user",
    });
  },
});
