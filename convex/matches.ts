import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireUser } from "./users";
import { internal } from "./_generated/api";

const MATCH_THRESHOLD = 40; // out of 100 — tune once you have real data
const DAY_MS = 24 * 60 * 60 * 1000;

function scoreCandidate(lost: any, found: any): number {
  let score = 0;

  // A found item must appear on/after the lost date to be plausible.
  const dayGap = (found.eventDate - lost.eventDate) / DAY_MS;
  if (dayGap < -1) return 0; // found before lost — not plausible, hard reject
  score += Math.max(0, 30 - Math.abs(dayGap) * 2); // closer dates score higher, up to 30

  if (lost.city && found.city && lost.city.toLowerCase() === found.city.toLowerCase()) {
    score += 30;
  }

  if (
    lost.partialIdentifier &&
    found.partialIdentifier &&
    lost.partialIdentifier.toLowerCase() === found.partialIdentifier.toLowerCase()
  ) {
    score += 40;
  }

  return Math.min(100, Math.round(score));
}

/**
 * Runs whenever a new item is reported. Scores it against every OPEN item
 * of the opposite kind and same document type, and writes a `matches` row
 * for anything above threshold. Fine for early-stage volume; move to a
 * search index if the open-item count grows large.
 */
export const findCandidates = internalMutation({
  args: { itemId: v.id("items") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item) return;

    const oppositeKind = item.kind === "lost" ? "found" : "lost";
    const candidates = await ctx.db
      .query("items")
      .withIndex("by_document_type", (q) =>
        q.eq("documentType", item.documentType).eq("kind", oppositeKind).eq("status", "open"),
      )
      .collect();

    for (const candidate of candidates) {
      const lost = item.kind === "lost" ? item : candidate;
      const found = item.kind === "found" ? item : candidate;
      const score = scoreCandidate(lost, found);
      if (score < MATCH_THRESHOLD) continue;

      const matchId = await ctx.db.insert("matches", {
        lostItemId: lost._id,
        foundItemId: found._id,
        score,
        status: "suggested",
        verificationAttempts: 0,
      });

      for (const notifyItem of [lost, found]) {
        await ctx.db.insert("notifications", {
          userId: notifyItem.reporterId,
          type: "match_suggested",
          itemId: notifyItem._id,
          matchId,
          body: `We found a possible match for your ${item.documentType.replace("_", " ")} report.`,
          read: false,
        });
      }
    }
  },
});

export const suggestedForUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const myItems = await ctx.db
      .query("items")
      .withIndex("by_reporter", (q) => q.eq("reporterId", user._id))
      .collect();
    const myItemIds = new Set(myItems.map((i) => i._id));

    const suggested = await ctx.db
      .query("matches")
      .withIndex("by_status", (q) => q.eq("status", "suggested"))
      .collect();

    return suggested.filter(
      (m) => myItemIds.has(m.lostItemId) || myItemIds.has(m.foundItemId),
    );
  },
});

/** User taps "this looks like mine" — moves the match into verification. */
export const confirmInterest = mutation({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    await ctx.db.patch(args.matchId, { status: "pending_verification" });
    const match = await ctx.db.get(args.matchId);
    if (match) {
      await ctx.db.patch(match.lostItemId, { status: "pending_verification" });
      await ctx.db.patch(match.foundItemId, { status: "pending_verification" });
    }
  },
});

export const reject = mutation({
  args: { matchId: v.id("matches") },
  handler: async (ctx, args) => {
    await requireUser(ctx);
    await ctx.db.patch(args.matchId, { status: "rejected" });
  },
});
