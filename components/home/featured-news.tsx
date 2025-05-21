"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NewsCard } from "@/components/news/news-card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

export function FeaturedNews() {
  const featuredPosts = useQuery(api.posts.getPublishedPosts, { 
    limit: 3, 
    featured: true 
  });

  if (!featuredPosts || featuredPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Featured Stories
            </h2>
            <p className="text-gray-600">
              Hand-picked stories that matter most
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-blue-600">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold">Trending Now</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post, index) => (
            <div key={post._id} className={`${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
              <NewsCard 
                post={post} 
                featured={index === 0}
                className={index === 0 ? 'h-full' : ''}
              />
            </div>
          ))}
        </div>

        {featuredPosts.length > 3 && (
          <div className="text-center mt-12">
            <Link href="/categories/featured">
              <Button variant="outline" size="lg">
                View All Featured Stories
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}