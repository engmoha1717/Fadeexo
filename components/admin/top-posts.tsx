"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export function TopPosts() {
  const posts = useQuery(api.posts.getAllPosts, {});

  const topPosts = posts
    ?.filter(post => post.status === "published")
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Posts by Views</CardTitle>
      </CardHeader>
      <CardContent>
        {topPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No posts available
          </div>
        ) : (
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={post._id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link href={`/news/${post.slug}`}>
                    <h4 className="font-medium text-gray-900 hover:text-blue-600 truncate">
                      {post.title}
                    </h4>
                  </Link>
                  
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{post.viewCount.toLocaleString()} views</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(post.createdAt), "MMM d")}</span>
                    </div>
                  </div>
                  
                  {post.category && (
                    <Badge variant="outline" className="mt-2">
                      {post.category.name}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}