import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const checkAndRecord = internalMutation({
  args: {
    matchId: v.id("matches"),
    submittedDocumentNumber: v.string(),
    submittedDateOfBirth: v.optional(v.string()),
    maxAttempts: v.number(),
  },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) throw new Error("Match not found");
    if (match.verificationAttempts >= args.maxAttempts) {
      return { success: false, locked: true };
    }

    const secret = await ctx.db
      .query("verificationSecrets")
      .withIndex("by_item", (q) => q.eq("itemId", match.lostItemId))
      .unique();

    // No secret on file (owner didn't supply one at report time) — fall back
    // to admin manual review rather than auto-approving.
    if (!secret) {
      return { success: false, locked: false };
    }

    const numberMatches =
      secret.fullDocumentNumber.trim().toLowerCase() ===
      args.submittedDocumentNumber.trim().toLowerCase();
    const dobMatches =
      !secret.dob || secret.dob === args.submittedDateOfBirth;

    const success = numberMatches && dobMatches;

    if (success) {
      await ctx.db.patch(args.matchId, { status: "verified" });
      await ctx.db.patch(match.lostItemId, { status: "claimed" });
      await ctx.db.patch(match.foundItemId, { status: "claimed" });
      return { success: true, locked: false };
    }

    const attempts = match.verificationAttempts + 1;
    const locked = attempts >= args.maxAttempts;
    await ctx.db.patch(args.matchId, { verificationAttempts: attempts });
    await ctx.db.patch(secret._id, {
      failedAttempts: secret.failedAttempts + 1,
      lockedAt: locked ? Date.now() : secret.lockedAt,
    });

    return { success: false, locked };
  },
});
