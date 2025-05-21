import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create or update site settings
export const updateSettings = mutation({
  args: {
    siteName: v.string(),
    siteDescription: v.string(),
    contactEmail: v.string(),
    timezone: v.string(),
    defaultCategory: v.optional(v.id("categories")),
    defaultPostStatus: v.union(v.literal("draft"), v.literal("published")),
    allowComments: v.boolean(),
    requireModeration: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Only admins can update settings");
    }

    // Check if settings already exist 
    const existingSettings = await ctx.db
      .query("settings")
      .first();

    const now = Date.now();

    if (existingSettings) {
      // Update existing settings
      await ctx.db.patch(existingSettings._id, {
        ...args,
        updatedAt: now,
      });
      return existingSettings._id;
    } else {
      // Create new settings
      return await ctx.db.insert("settings", {
        ...args,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Get site settings
export const getSettings = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("settings")
      .first();
  },
});