import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const DOCUMENT_TYPES = [
  { value: "national_id", label: "National ID" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "passport", label: "Passport" },
  { value: "vehicle_registration", label: "Vehicle Registration" },
  { value: "other", label: "Other" },
] as const;

export const ZIMBABWE_CITIES = [
  "Harare",
  "Bulawayo",
  "Chinhoyi",
  "Mutare",
  "Gweru",
  "Masvingo",
  "Kwekwe",
  "Kadoma",
  "Marondera",
  "Bindura",
  "Other",
] as const;

export const getOpenItems = query({
  args: { kind: v.optional(v.union(v.literal("lost"), v.literal("found"))) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("items").filter((q) => q.eq(q.field("status"), "open"));
    if (args.kind) {
      q = q.filter((q) => q.eq(q.field("kind"), args.kind));
    }
    return await q.collect();
  },
});

export const getItemById = query({
  args: { itemId: v.id("items") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.itemId);
  },
});

export const reportLost = mutation({
  args: {
    documentType: v.string(),
    city: v.string(),
    location: v.string(),
    partialIdentifier: v.string(),
    description: v.string(),
    eventDate: v.number(),
    fullDocumentNumber: v.string(),
    dateOfBirth: v.optional(v.string()),
    phone: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { fullDocumentNumber, dateOfBirth, photoUrl, phone, ...itemData } = args;

    const itemId = await ctx.db.insert("items", {
      kind: "lost",
      ...itemData,
      country: "Zimbabwe",
      phone: phone || undefined,
      photoUrl: photoUrl || undefined,
      status: "open",
    });

    await ctx.db.insert("verificationSecrets", {
      itemId,
      fullDocumentNumber,
      dob: dateOfBirth || "",
      failedAttempts: 0,
    });

    await ctx.scheduler.runAfter(0, internal.matches.findCandidates, { itemId });

    return itemId;
  },
});

export const reportFound = mutation({
  args: {
    documentType: v.string(),
    city: v.string(),
    location: v.string(),
    partialIdentifier: v.string(),
    description: v.string(),
    eventDate: v.number(),
    phone: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { photoUrl, phone, ...rest } = args;
    const itemId = await ctx.db.insert("items", {
      kind: "found",
      country: "Zimbabwe",
      phone: phone || undefined,
      photoUrl: photoUrl || undefined,
      status: "open",
      ...rest,
    });

    await ctx.scheduler.runAfter(0, internal.matches.findCandidates, { itemId });

    return itemId;
  },
});

export const getMyItems = query({
  handler: async (ctx) => {
    return await ctx.db.query("items").collect();
  },
});

export const deleteItem = mutation({
  args: { itemId: v.id("items") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item not found");
    await ctx.db.delete(args.itemId);
  },
});
