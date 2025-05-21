"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Eye, TrendingUp, Users } from "lucide-react";

export function ViewsOverview() {
  const posts = useQuery(api.posts.getAllPosts, {});

  const totalViews = posts?.reduce((sum, post) => sum + post.viewCount, 0) || 0;
  const publishedPosts = posts?.filter(post => post.status === "published").length || 0;
  const avgViews = publishedPosts > 0 ? Math.round(totalViews / publishedPosts) : 0;

  const stats = [
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Published Posts",
      value: publishedPosts.toLocaleString(),
      icon: BarChart,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Average Views",
      value: avgViews.toLocaleString(),
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}