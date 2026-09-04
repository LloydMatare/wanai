import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const myUnread = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("read"), false))
      .order("desc")
      .collect();
  },
});

export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, { read: true });
  },
});
