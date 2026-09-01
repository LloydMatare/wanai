import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("admin")),
  }).index("by_clerkId", ["clerkId"]),

  items: defineTable({
    reporterId: v.id("users"),
    kind: v.union(v.literal("lost"), v.literal("found")),
    documentType: v.string(), // e.g., "national_id", "drivers_license"
    country: v.string(),
    city: v.string(),
    location: v.string(),
    partialIdentifier: v.string(), // Last 4 chars
    description: v.string(),
    eventDate: v.number(),
    photoStorageId: v.optional(v.id("_storage")),
    status: v.union(
      v.literal("open"),
      v.literal("matched"),
      v.literal("claimed"),
      v.literal("closed")
    ),
  }),

  verificationSecrets: defineTable({
    itemId: v.id("items"),
    fullDocumentNumber: v.string(),
    dob: v.string(),
    failedAttempts: v.number(),
    lockedAt: v.optional(v.number()),
  }).index("by_itemId", ["itemId"]),

  matches: defineTable({
    lostItemId: v.id("items"),
    foundItemId: v.id("items"),
    status: v.union(
      v.literal("suggested"),
      v.literal("pending_verification"),
      v.literal("confirmed"),
      v.literal("rejected")
    ),
    score: v.number(),
    verificationAttempts: v.number(),
  }),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    itemId: v.optional(v.id("items")),
    matchId: v.optional(v.id("matches")),
    body: v.string(),
    read: v.boolean(),
  }).index("by_user", ["userId"]),
});
