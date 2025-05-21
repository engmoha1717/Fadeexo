import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CategoryNewsContent } from "@/components/categories/category-news-content";

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    region?: string;
    page?: string;
  };
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CategoryNewsContent 
          categorySlug={params.slug}
          regionSlug={searchParams.region}
          page={parseInt(searchParams.page || "1")}
        />
      </main>
      <Footer />
    </div>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  
  return {
    title: `${categoryName} News - Daily News`,
    description: `Latest ${categoryName.toLowerCase()} news and updates from around the world.`,
  };
}