"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NewsCard } from "./news-card";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedNewsProps {
  currentSlug: string;
}

export function RelatedNews({ currentSlug }: RelatedNewsProps) {
  const currentPost = useQuery(api.posts.getPostBySlug, { slug: currentSlug });
  const relatedPosts = useQuery(
    api.posts.getPublishedPosts, 
    currentPost 
      ? { 
          limit: 3, 
          categorySlug: currentPost.category?.slug 
        }
      : "skip"
  );

  if (!relatedPosts || relatedPosts.length === 0) {
    return null;
  }

  // Filter out the current post
  const filteredPosts = relatedPosts.filter(post => post.slug !== currentSlug);

  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Related Articles
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <NewsCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}