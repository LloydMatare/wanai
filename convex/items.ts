import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireUser } from "./users";
import { internal } from "./_generated/api";

// Document types for Zimbabwe
export const DOCUMENT_TYPES = [
  { value: "national_id", label: "National ID" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "passport", label: "Passport" },
  { value: "vehicle_registration", label: "Vehicle Registration" },
  { value: "other", label: "Other" },
] as const;

// Zimbabwe cities
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
    partialIdentifier: v.string(), // Last 4 characters only
    description: v.string(),
    eventDate: v.number(),
    fullDocumentNumber: v.string(), // Stored in verificationSecrets, not here
    dateOfBirth: v.optional(v.string()),
    photo: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    const { fullDocumentNumber, dateOfBirth, photo, ...itemData } = args;

    // Insert the item with public-safe data
    const itemId = await ctx.db.insert("items", {
      reporterId: user._id,
      kind: "lost",
      ...itemData,
      country: "Zimbabwe",
      photoStorageId: photo,
      status: "open",
    });

    // Store verification secrets separately (never exposed to client queries)
    await ctx.db.insert("verificationSecrets", {
      itemId,
      fullDocumentNumber,
      dob: dateOfBirth || "",
    });

    // Trigger matching
    await ctx.scheduler.runAfter(0, internal.matches.findCandidates, { itemId });

    return itemId;
  },
});

export const reportFound = mutation({
  args: {
    documentType: v.string(),
    city: v.string(),
    location: v.string(),
    partialIdentifier: v.string(), // Last 4 characters visible
    description: v.string(),
    eventDate: v.number(),
    photo: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    const itemId = await ctx.db.insert("items", {
      reporterId: user._id,
      kind: "found",
      country: "Zimbabwe",
      photoStorageId: args.photo,
      status: "open",
      ...args,
    });

    // Trigger matching
    await ctx.scheduler.runAfter(0, internal.matches.findCandidates, { itemId });

    return itemId;
  },
});

export const getMyItems = query({
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    return await ctx.db
      .query("items")
      .withIndex("by_reporter", (q) => q.eq("reporterId", user._id))
      .collect();
  },
});

export const deleteItem = mutation({
  args: { itemId: v.id("items") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const item = await ctx.db.get(args.itemId);

    if (!item) throw new Error("Item not found");
    if (item.reporterId !== user._id && user.role !== "admin") {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.itemId);
  },
});
