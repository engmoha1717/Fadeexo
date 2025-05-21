"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, FolderOpen, Users, Settings, BarChart } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Create Post",
      description: "Write a new article",
      icon: Plus,
      href: "/admin/posts/create",
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Manage Posts",
      description: "View all articles",
      icon: FileText,
      href: "/admin/posts",
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Categories",
      description: "Organize content",
      icon: FolderOpen,
      href: "/admin/categories",
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Users",
      description: "Manage users",
      icon: Users,
      href: "/admin/users",
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Analytics",
      description: "View statistics",
      icon: BarChart,
      href: "/admin/analytics",
      color: "bg-cyan-500",
      textColor: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      title: "Settings",
      description: "Site configuration",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500",
      textColor: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-lg ${action.bgColor}`}>
                    <action.icon className={`h-5 w-5 ${action.textColor}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      {action.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h4 className="font-medium text-blue-900">Quick Tip</h4>
          </div>
          <p className="text-sm text-blue-800">
            Use keyboard shortcuts to speed up your workflow. Press Ctrl+N to create a new post quickly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}