import { Metadata } from "next";
import { use } from "react";

interface SearchParamsType {
  q?: string;
  page?: string;
}

interface MetadataProps {
  searchParams: Promise<SearchParamsType>;
}

export async function generateMetadata({ searchParams }: MetadataProps): Promise<Metadata> {
  const resolvedSearchParams = use(searchParams);
  const query = resolvedSearchParams.q || "";
  
  return {
    title: query ? `Search: ${query} - Daily News` : "Search - Daily News",
    description: query 
      ? `Search results for "${query}" on Daily News` 
      : "Search for news articles on Daily News",
  };
}