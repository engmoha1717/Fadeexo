
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new category
export const createCategory = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      throw new Error("Only admins and editors can create categories");
    }

    const now = Date.now();
    return await ctx.db.insert("categories", {
      ...args,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      createdBy: user._id,
    });
  },
});

// Get all active categories
export const getActiveCategories = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Get all categories (admin only)
export const getAllCategories = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      throw new Error("Only admins and editors can view all categories");
    }

    return await ctx.db.query("categories").collect();
  },
});

// Get category by slug
export const getCategoryBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Update category
export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
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
      throw new Error("Only admins can update categories");
    }

    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Delete category
export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "admin") {
      throw new Error("Only admins can delete categories");
    }

    // Check if category has posts
    const postsWithCategory = await ctx.db
      .query("posts")
      .withIndex("by_category", (q) => q.eq("categoryId", args.id))
      .first();

    if (postsWithCategory) {
      throw new Error("Cannot delete category with existing posts");
    }

    await ctx.db.delete(args.id);
  },
});











// import { query } from "./_generated/server";

// export const getActiveCategories = query({
//     handler: async (ctx) => {
//       return await ctx.db
//         .query("categories")
//         .withIndex("by_active", (q) => q.eq("isActive", true))
//         .collect();
//     },
//   });