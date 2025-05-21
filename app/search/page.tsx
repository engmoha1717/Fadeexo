import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SearchResults } from "@/components/search/search-results";

interface SearchPageProps {
  searchParams: {
    q?: string;
    page?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const page = parseInt(searchParams.page || "1");

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Search Results
            </h1>
            {query && (
              <p className="text-gray-600">
                Showing results for <span className="font-semibold">"{query}"</span>
              </p>
            )}
          </div>
          <SearchResults query={query} page={page} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function generateMetadata({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  
  return {
    title: query ? `Search: ${query} - Daily News` : "Search - Daily News",
    description: query 
      ? `Search results for "${query}" on Daily News` 
      : "Search for news articles on Daily News",
  };
}