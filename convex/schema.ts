import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  items: defineTable({
    reporterId: v.optional(v.string()),
    kind: v.union(v.literal("lost"), v.literal("found")),
    documentType: v.string(),
    country: v.string(),
    city: v.string(),
    location: v.string(),
    partialIdentifier: v.string(),
    description: v.string(),
    eventDate: v.number(),
    photoStorageId: v.optional(v.id("_storage")),
    status: v.union(
      v.literal("open"),
      v.literal("matched"),
      v.literal("pending_verification"),
      v.literal("claimed"),
      v.literal("closed")
    ),
  })
    .index("by_reporter", ["reporterId"])
    .index("by_document_type", ["documentType", "kind", "status"]),

  verificationSecrets: defineTable({
    itemId: v.id("items"),
    fullDocumentNumber: v.string(),
    dob: v.string(),
    failedAttempts: v.number(),
    lockedAt: v.optional(v.number()),
  }).index("by_item", ["itemId"]),

  matches: defineTable({
    lostItemId: v.id("items"),
    foundItemId: v.id("items"),
    status: v.union(
      v.literal("suggested"),
      v.literal("pending_verification"),
      v.literal("verified"),
      v.literal("confirmed"),
      v.literal("rejected")
    ),
    score: v.number(),
    verificationAttempts: v.number(),
  }).index("by_status", ["status"]),

  notifications: defineTable({
    userId: v.optional(v.string()),
    type: v.string(),
    itemId: v.optional(v.id("items")),
    matchId: v.optional(v.id("matches")),
    body: v.string(),
    read: v.boolean(),
  }).index("by_user_unread", ["userId", "read"]),
});
