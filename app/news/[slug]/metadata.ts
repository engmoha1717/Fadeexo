import { Metadata } from "next";
import { use } from "react";

interface MetadataProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const resolvedParams = use(params);

  // In a real app, you would fetch the post data here using the slug
  // For now, we'll return basic metadata
  return {
    title: `News Article - Daily News`,
    description: "Read the latest news article on Daily News",
  };
}