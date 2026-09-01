import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireUser } from "./users";

/** Real-time: subscribing clients re-render whenever this changes. */
export const myUnread = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    return await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => q.eq("userId", user._id).eq("read", false))
      .order("desc")
      .collect();
  },
});

export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    await ctx.db.patch(args.notificationId, { read: true });
  },
});
