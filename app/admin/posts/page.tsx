"use client";

import { Suspense, use } from "react";
import { PostsTable } from "@/components/admin/posts-table";
import { CreatePostButton } from "@/components/admin/create-post-button";

interface SearchParams {
  status?: string;
  page?: string;
}

export default function PostsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedParams = use(searchParams);
  const status = resolvedParams.status as "draft" | "published" | "archived" | undefined;
  const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
        <CreatePostButton />
      </div>

      <Suspense fallback={<div>Loading posts...</div>}>
        <PostsTable status={status} page={page} />
      </Suspense>
    </div>
  );
}