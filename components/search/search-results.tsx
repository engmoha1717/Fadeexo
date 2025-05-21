"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NewsCard } from "@/components/news/news-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, Newspaper } from "lucide-react";

interface SearchResultsProps {
  query: string;
  page: number;
}

export function SearchResults({ query, page }: SearchResultsProps) {
  const [sortBy, setSortBy] = useState<"relevance" | "date" | "views">("relevance");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [limit, setLimit] = useState(12);

  // Get search results
  const searchResults = useQuery(
    api.posts.searchPosts, 
    query ? { searchTerm: query } : "skip"
  );

  // Get categories for filtering
  const categories = useQuery(api.categories.getActiveCategories);

  // Filter and sort results
  const filteredResults = searchResults?.filter(post => {
    if (categoryFilter === "all") return true;
    return post.category?.slug === categoryFilter;
  }) || [];

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return (b.publishedAt || b.createdAt) - (a.publishedAt || a.createdAt);
      case "views":
        return b.viewCount - a.viewCount;
      case "relevance":
      default:
        // Title matches first, then description matches
        const aTitle = a.title.toLowerCase().includes(query.toLowerCase());
        const bTitle = b.title.toLowerCase().includes(query.toLowerCase());
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        return (b.publishedAt || b.createdAt) - (a.publishedAt || a.createdAt);
    }
  });

  const displayedResults = sortedResults.slice(0, limit);

  const loadMore = () => {
    setLimit(prev => prev + 12);
  };

  if (!query) {
    return (
      <div className="text-center py-16">
        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Search News Articles
        </h2>
        <p className="text-gray-600">
          Enter a search term to find relevant news articles
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Search className="h-5 w-5" />
          <span>
            {searchResults === undefined 
              ? "Searching..." 
              : `${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''} for "${query}"`
            }
          </span>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category._id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="date">Latest</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {categoryFilter !== "all" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Filters:</span>
              <Badge 
                variant="secondary" 
                className="cursor-pointer"
                onClick={() => setCategoryFilter("all")}
              >
                {categories?.find(c => c.slug === categoryFilter)?.name}
                <span className="ml-1">×</span>
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchResults === undefined ? (
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
      ) : displayedResults.length === 0 ? (
        <div className="text-center py-16">
          <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No articles found
          </h3>
          <p className="text-gray-500 mb-4">
            {categoryFilter !== "all" 
              ? `No articles matching "${query}" in the selected category.`
              : `No articles matching "${query}". Try different keywords.`
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            {categoryFilter !== "all" && (
              <Button 
                variant="outline"
                onClick={() => setCategoryFilter("all")}
              >
                Search all categories
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Search Suggestions */}
          {displayedResults.length > 0 && displayedResults.length < 3 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Search Suggestions</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Try using different keywords</li>
                <li>• Check for spelling errors</li>
                <li>• Use more general terms</li>
                <li>• Remove filters to see more results</li>
              </ul>
            </div>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedResults.map((post) => (
              <NewsCard key={post._id} post={post} />
            ))}
          </div>

          {/* Load More */}
          {sortedResults.length > displayedResults.length && (
            <div className="text-center mt-12">
              <Button 
                onClick={loadMore}
                variant="outline" 
                size="lg"
                className="px-8"
              >
                Load More Results ({sortedResults.length - displayedResults.length} more)
              </Button>
            </div>
          )}

          {/* Results Summary */}
          <div className="text-center text-sm text-gray-500 mt-8">
            Showing {displayedResults.length} of {sortedResults.length} results
            {categoryFilter !== "all" && (
              <span> in {categories?.find(c => c.slug === categoryFilter)?.name}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}