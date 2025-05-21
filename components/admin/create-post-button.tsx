"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CreatePostButton() {
  return (
    <Link href="/admin/posts/create">
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Create Post
      </Button>
    </Link>
  );
}