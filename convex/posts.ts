import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new post
export const createPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    content: v.string(),
    categoryId: v.id("categories"),
    regionId: v.optional(v.id("regions")),
    imageId: v.optional(v.id("_storage")),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived")
    ),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      throw new Error("Only admins and editors can create posts");
    }

    const now = Date.now();
    let imageUrl: string | undefined = undefined;

    if (args.imageId) {
      imageUrl = await ctx.storage.getUrl(args.imageId) as string;
    }

    return await ctx.db.insert("posts", {
      ...args,
      imageUrl,
      authorId: user._id,
      viewCount: 0,
      publishedAt: args.status === "published" ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get published posts for public view
export const getPublishedPosts = query({
    args: {
      limit: v.optional(v.number()),
      categorySlug: v.optional(v.string()),
      regionSlug: v.optional(v.string()),
      featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
      let query = ctx.db
        .query("posts")
        .withIndex("by_status", (q) => q.eq("status", "published"));
  
      const posts = await query.collect();
      let filteredPosts = posts;
  
      // Filter by category
      if (args.categorySlug) {
        const category = await ctx.db
          .query("categories")
          .withIndex("by_slug", (q) => q.eq("slug", args.categorySlug!))
          .first();
        
        if (category) {
          filteredPosts = filteredPosts.filter(post => post.categoryId === category._id);
        }
      }
  
      // Filter by region
      if (args.regionSlug) {
        const region = await ctx.db
          .query("regions")
          .withIndex("by_slug", (q) => q.eq("slug", args.regionSlug!))
          .first();
        
        if (region) {
          filteredPosts = filteredPosts.filter(post => post.regionId === region._id);
        }
      }
  
      // Filter by featured
      if (args.featured !== undefined) {
        filteredPosts = filteredPosts.filter(post => post.featured === args.featured);
      }
  
      // Sort by publishedAt descending
      filteredPosts.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
  
      // Apply limit
      if (args.limit) {
        filteredPosts = filteredPosts.slice(0, args.limit);
      }
  
      // Enrich with category and region data
      const enrichedPosts = await Promise.all(
        filteredPosts.map(async (post) => {
          const category = await ctx.db.get(post.categoryId);
          const region = post.regionId ? await ctx.db.get(post.regionId) : null;
          const author = await ctx.db.get(post.authorId);
  
          return {
            ...post,
            category,
            region,
            author: author ? {
              firstName: author.firstName,
              lastName: author.lastName,
              imageUrl: author.imageUrl,
            } : null,
          };
        })
      );
  
      return enrichedPosts;
    },
  });

// Get post by slug
export const getPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!post) return null;

    // Only return published posts for public view
    if (post.status !== "published") {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return null;

      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .first();

      if (!user || (user.role !== "admin" && user.role !== "editor" && user._id !== post.authorId)) {
        return null;
      }
    }

    const category = await ctx.db.get(post.categoryId);
    const region = post.regionId ? await ctx.db.get(post.regionId) : null;
    const author = await ctx.db.get(post.authorId);

    return {
      ...post,
      category,
      region,
      author: {
        firstName: author?.firstName,
        lastName: author?.lastName,
        imageUrl: author?.imageUrl,
      },
    };
  },
});

// Get all posts (admin/editor only)
export const getAllPosts = query({
  args: {
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived")
    )),
    authorId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      throw new Error("Only admins and editors can view all posts");
    }

    let posts = await ctx.db.query("posts").collect();

    // Filter by status
    if (args.status) {
      posts = posts.filter(post => post.status === args.status);
    }

    // Filter by author (editors can only see their own posts unless they're admin)
    if (user.role === "editor") {
      posts = posts.filter(post => post.authorId === user._id);
    } else if (args.authorId) {
      posts = posts.filter(post => post.authorId === args.authorId);
    }

    // Sort by created date descending
    posts.sort((a, b) => b.createdAt - a.createdAt);

    // Enrich with category and region data
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const category = await ctx.db.get(post.categoryId);
        const region = post.regionId ? await ctx.db.get(post.regionId) : null;
        const author = await ctx.db.get(post.authorId);

        return {
          ...post, 
          category,
          region,
          author: {
            firstName: author?.firstName,
            lastName: author?.lastName,
            imageUrl: author?.imageUrl,
          },
        };
      })
    );

    return enrichedPosts;
  },
});

// Update post
export const updatePost = mutation({
  args: {
    id: v.id("posts"),
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    content: v.string(),
    categoryId: v.id("categories"),
    regionId: v.optional(v.id("regions")),
    imageId: v.optional(v.id("_storage")),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived")
    ),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      throw new Error("Only admins and editors can update posts");
    }

    const existingPost = await ctx.db.get(args.id);
    if (!existingPost) {
      throw new Error("Post not found");
    }

    // Editors can only edit their own posts
    if (user.role === "editor" && existingPost.authorId !== user._id) {
      throw new Error("You can only edit your own posts");
    }

    const { id, ...updateData } = args;
    let imageUrl: string | undefined = existingPost.imageUrl;

    if (args.imageId && args.imageId !== existingPost.imageId) {
      imageUrl = await ctx.storage.getUrl(args.imageId) || undefined;
    }

    // Set publishedAt when changing to published status
    let publishedAt = existingPost.publishedAt;
    if (args.status === "published" && existingPost.status !== "published") {
      publishedAt = Date.now();
    }

    await ctx.db.patch(id, {
      ...updateData,
      imageUrl,
      publishedAt,
      updatedAt: Date.now(),
    });
  },
});

// Delete post
export const deletePost = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      throw new Error("Only admins and editors can delete posts");
    }

    const existingPost = await ctx.db.get(args.id);
    if (!existingPost) {
      throw new Error("Post not found");
    }

    // Editors can only delete their own posts
    if (user.role === "editor" && existingPost.authorId !== user._id) {
      throw new Error("You can only delete your own posts");
    }

    // Delete associated image from storage
    if (existingPost.imageId) {
      await ctx.storage.delete(existingPost.imageId);
    }

    await ctx.db.delete(args.id);
  },
});

// Increment view count
export const incrementViewCount = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (post) {
      await ctx.db.patch(args.id, {
        viewCount: post.viewCount + 1,
      });
    }
  },
});

// Search posts
export const searchPosts = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const filteredPosts = posts.filter(post => 
      post.title.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(args.searchTerm.toLowerCase())
    );

    // Sort by relevance (prioritize title matches)
    filteredPosts.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(args.searchTerm.toLowerCase());
      const bTitle = b.title.toLowerCase().includes(args.searchTerm.toLowerCase());
      
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      
      return (b.publishedAt || 0) - (a.publishedAt || 0);
    });

    // Enrich with category and region data
    const enrichedPosts = await Promise.all(
      filteredPosts.map(async (post) => {
        const category = await ctx.db.get(post.categoryId);
        const region = post.regionId ? await ctx.db.get(post.regionId) : null;
        const author = await ctx.db.get(post.authorId);

        return {
          ...post,
          category,
          region,
          author: {
            firstName: author?.firstName,
            lastName: author?.lastName,
            imageUrl: author?.imageUrl,
          },
        };
      })
    );

    return enrichedPosts;
  },
});


   

// Get post by ID directly - new helper function to fix the edit form
export const getPostById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    
    if (!post) return null;
    
    // Allow anyone to view the post if they have the ID directly
    
    const category = await ctx.db.get(post.categoryId);
    const region = post.regionId ? await ctx.db.get(post.regionId) : null;
    const author = await ctx.db.get(post.authorId);

    return {
      ...post,
      category,
      region,
      author: {
        firstName: author?.firstName,
        lastName: author?.lastName,
        imageUrl: author?.imageUrl,
      },
    };
  },
});