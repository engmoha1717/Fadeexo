"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsChart() {
  const posts = useQuery(api.posts.getAllPosts, {});

  // Group posts by category
  const categoryData = posts?.reduce((acc, post) => {
    if (post.category) {
      acc[post.category.name] = (acc[post.category.name] || 0) + post.viewCount;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const categories = Object.entries(categoryData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const maxViews = Math.max(...Object.values(categoryData));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Views by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No data available
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map(([category, views]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-sm text-gray-500">
                    {views.toLocaleString()} views
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(views / maxViews) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}