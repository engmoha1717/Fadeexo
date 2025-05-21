import { Metadata } from "next";
import { use } from "react";

interface MetadataProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const resolvedParams = use(params);
  const categoryName = resolvedParams.slug.charAt(0).toUpperCase() + resolvedParams.slug.slice(1);
  
  return {
    title: `${categoryName} News - Daily News`,
    description: `Latest ${categoryName.toLowerCase()} news and updates from around the world.`,
  };
}