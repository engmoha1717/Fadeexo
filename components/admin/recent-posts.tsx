"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Calendar, User, ArrowRight } from "lucide-react";
import { format, formatDistance } from "date-fns";

export function RecentPosts() {
  const recentPosts = useQuery(api.posts.getAllPosts, {});

  const latestPosts = recentPosts?.slice(0, 5) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Recent Posts</CardTitle>
        <Link href="/admin/posts">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {!recentPosts ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : latestPosts.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-4">Create your first post to get started.</p>
            <Link href="/admin/posts/create">
              <Button>Create Post</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {latestPosts.map((post) => (
              <div
                key={post._id}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {/* Post Image or Placeholder */}
                <div className="flex-shrink-0">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Post Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate mb-1">
                    {post.title}
                  </h4>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                    {/* Author */}
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{post.author?.firstName} {post.author?.lastName}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDistance(new Date(post.createdAt), new Date(), { addSuffix: true })}</span>
                    </div>

                    {/* Views */}
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{post.viewCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                      {post.category && (
                        <Badge variant="outline">
                          {post.category.name}
                        </Badge>
                      )}
                    </div>

                    <Link href={`/admin/posts/${post._id}/edit`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {recentPosts.length > 5 && (
              <div className="text-center pt-4">
                <Link href="/admin/posts">
                  <Button variant="outline" size="sm">
                    View {recentPosts.length - 5} More Posts
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}