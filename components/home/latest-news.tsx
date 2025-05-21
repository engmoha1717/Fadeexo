"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NewsCard } from "@/components/news/news-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Newspaper } from "lucide-react";

export function LatestNews() {
  const [limit, setLimit] = useState(6);
  const latestPosts = useQuery(api.posts.getPublishedPosts, { 
    limit,
    featured: false 
  });

  const loadMore = () => {
    setLimit(prev => prev + 6);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Latest News
            </h2>
            <p className="text-gray-600">
              Stay up to date with the most recent stories
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-green-600">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">Just In</span>
          </div>
        </div>

        {!latestPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : latestPosts.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No news available yet
            </h3>
            <p className="text-gray-500">
              Check back later for the latest updates.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <NewsCard key={post._id} post={post} />
              ))}
            </div>

            {latestPosts.length >= limit && (
              <div className="text-center mt-12">
                <Button 
                  onClick={loadMore}
                  variant="outline" 
                  size="lg"
                  className="px-8"
                >
                  Load More Articles
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}