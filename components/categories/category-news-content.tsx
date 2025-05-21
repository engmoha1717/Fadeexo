"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NewsCard } from "@/components/news/news-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, Newspaper } from "lucide-react";

interface CategoryNewsContentProps {
  categorySlug: string;
  regionSlug?: string;
  page: number;
}

export function CategoryNewsContent({ categorySlug, regionSlug, page }: CategoryNewsContentProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>(regionSlug || "all");
  const [limit, setLimit] = useState(12);

  // Get category info
  const category = useQuery(api.categories.getCategoryBySlug, { slug: categorySlug });
  
  // Get regions for filter
  const regions = useQuery(api.regions.getActiveRegions);
  
  // Get posts for this category
  const posts = useQuery(api.posts.getPublishedPosts, {
    categorySlug,
    regionSlug: selectedRegion === "all" ? undefined : selectedRegion,
    limit,
  });

  const loadMore = () => {
    setLimit(prev => prev + 12);
  };

  if (category === undefined) {
    return <CategoryContentSkeleton />;
  }

  if (category === null) {
    return (
      <div className="text-center py-16">
        <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h1>
        <p className="text-gray-600">The category you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Badge 
            variant="secondary" 
            className={`${category.color ? `bg-${category.color}-100 text-${category.color}-800` : 'bg-blue-100 text-blue-800'} text-lg px-4 py-2 font-semibold`}
          >
            {category.name}
          </Badge>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          {category.name} News
        </h1>
        
        {category.description && (
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {category.description}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600">
          <Newspaper className="h-5 w-5" />
          <span>
            {posts ? `${posts.length} articles` : 'Loading articles...'}
          </span>
        </div>

        {regions && regions.length > 0 && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region._id} value={region.slug}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Posts Grid */}
      {!posts ? (
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
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No articles found
          </h3>
          <p className="text-gray-500">
            {selectedRegion === "all" 
              ? `No articles in ${category.name} category yet.`
              : `No articles in ${category.name} category for the selected region.`
            }
          </p>
          {selectedRegion !== "all" && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSelectedRegion("all")}
            >
              Show all regions
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <NewsCard key={post._id} post={post} />
            ))}
          </div>

          {posts.length >= limit && (
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
  );
}

function CategoryContentSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-32 mx-auto" />
        <Skeleton className="h-12 w-64 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Posts Grid Skeleton */}
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
    </div>
  );
}