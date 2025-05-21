import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("editor"), v.literal("user")),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.id("users"),
  })
    .index("by_slug", ["slug"])
    .index("by_active", ["isActive"]),

  regions: defineTable({
    name: v.string(),
    slug: v.string(),
    country: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_country", ["country"]),

  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    content: v.string(),
    imageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    categoryId: v.id("categories"),
    regionId: v.optional(v.id("regions")),
    authorId: v.id("users"),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived")
    ),
    featured: v.boolean(),
    viewCount: v.number(),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["categoryId"])
    .index("by_author", ["authorId"])
    .index("by_status", ["status"])
    .index("by_region", ["regionId"])
    .index("by_featured", ["featured"])
    .index("by_published_at", ["publishedAt"])
    .index("by_created_at", ["createdAt"]),

  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.optional(v.id("users")),
    authorName: v.string(),
    authorEmail: v.string(),
    content: v.string(),
    isApproved: v.boolean(),
    parentId: v.optional(v.id("comments")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorId"])
    .index("by_approved", ["isApproved"])
    .index("by_parent", ["parentId"]),

  settings: defineTable({
    siteName: v.string(),
    siteDescription: v.string(),
    contactEmail: v.string(),
    timezone: v.string(),
    defaultCategory: v.optional(v.id("categories")),
    defaultPostStatus: v.union(v.literal("draft"), v.literal("published")),
    allowComments: v.boolean(),
    requireModeration: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});















// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values";

// export default defineSchema({
//   users: defineTable({
//     clerkId: v.string(),
//     email: v.string(),
//     firstName: v.optional(v.string()),
//     lastName: v.optional(v.string()),
//     imageUrl: v.optional(v.string()),
//     role: v.union(v.literal("admin"), v.literal("editor"), v.literal("user")),
//     isActive: v.boolean(),
//     createdAt: v.number(),
//     updatedAt: v.number(),
//   })
//     .index("by_clerk_id", ["clerkId"])
//     .index("by_email", ["email"])
//     .index("by_role", ["role"]),

//   categories: defineTable({
//     name: v.string(),
//     slug: v.string(),
//     description: v.optional(v.string()),
//     color: v.optional(v.string()),
//     isActive: v.boolean(),
//     createdAt: v.number(),
//     updatedAt: v.number(),
//     createdBy: v.id("users"),
//   })
//     .index("by_slug", ["slug"])
//     .index("by_active", ["isActive"]),

//   regions: defineTable({
//     name: v.string(),
//     slug: v.string(),
//     country: v.string(),
//     isActive: v.boolean(),
//     createdAt: v.number(),
//     updatedAt: v.number(),
//   })
//     .index("by_slug", ["slug"])
//     .index("by_country", ["country"]),

//   posts: defineTable({
//     title: v.string(),
//     slug: v.string(),
//     description: v.string(),
//     content: v.string(),
//     imageId: v.optional(v.id("_storage")),
//     imageUrl: v.optional(v.string()),
//     categoryId: v.id("categories"),
//     regionId: v.optional(v.id("regions")),
//     authorId: v.id("users"),
//     status: v.union(
//       v.literal("draft"),
//       v.literal("published"),
//       v.literal("archived")
//     ),
//     featured: v.boolean(),
//     viewCount: v.number(),
//     publishedAt: v.optional(v.number()),
//     createdAt: v.number(),
//     updatedAt: v.number(),
//   })
//     .index("by_slug", ["slug"])
//     .index("by_category", ["categoryId"])
//     .index("by_author", ["authorId"])
//     .index("by_status", ["status"])
//     .index("by_region", ["regionId"])
//     .index("by_featured", ["featured"])
//     .index("by_published_at", ["publishedAt"])
//     .index("by_created_at", ["createdAt"]),

//   comments: defineTable({
//     postId: v.id("posts"),
//     authorId: v.optional(v.id("users")),
//     authorName: v.string(),
//     authorEmail: v.string(),
//     content: v.string(),
//     isApproved: v.boolean(),
//     parentId: v.optional(v.id("comments")),
//     createdAt: v.number(),
//     updatedAt: v.number(),
//   })
//     .index("by_post", ["postId"])
//     .index("by_author", ["authorId"])
//     .index("by_approved", ["isApproved"])
//     .index("by_parent", ["parentId"]),
// });