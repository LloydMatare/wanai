"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

const MAX_ATTEMPTS = 3;

/**
 * Compares a claimant's submitted document number / DOB against the stored
 * verificationSecrets for the LOST side of a match. Returns only a boolean
 * result — the real values never leave the server. Locks the match after
 * MAX_ATTEMPTS failed tries to block brute-forcing a document number.
 */
export const verifyClaim = action({
  args: {
    matchId: v.id("matches"),
    submittedDocumentNumber: v.string(),
    submittedDateOfBirth: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ success: boolean; locked: boolean }> => {
    const result = await ctx.runMutation(internal.verificationInternal.checkAndRecord, {
      matchId: args.matchId,
      submittedDocumentNumber: args.submittedDocumentNumber,
      submittedDateOfBirth: args.submittedDateOfBirth,
      maxAttempts: MAX_ATTEMPTS,
    });
    return result;
  },
});
