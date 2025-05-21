import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new region
export const createRegion = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    country: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Only admins can create regions");
    }

    const now = Date.now();
    return await ctx.db.insert("regions", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get all active regions
export const getActiveRegions = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("regions")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Get all regions (admin only)
export const getAllRegions = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity)return;
    // if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Only admins can view all regions");
    }

    return await ctx.db.query("regions").collect();
  },
});

// Get region by slug
export const getRegionBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("regions")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Update region
export const updateRegion = mutation({
  args: {
    id: v.id("regions"),
    name: v.string(),
    slug: v.string(),
    country: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Only admins can update regions");
    }

    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Delete region
export const deleteRegion = mutation({
  args: { id: v.id("regions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Only admins can delete regions");
    }

    await ctx.db.delete(args.id);
  },
});