import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
// import  NewsDetailContent  from "@/components/news/news-detail-content";
import { RelatedNews } from "@/components/news/related-news";
import { NewsDetailContent } from "@/components/news/news-detail-content";

interface NewsDetailPageProps {
  params: {
    slug: string;
  };
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <NewsDetailContent slug={params.slug} />
          <div className="mt-12">
            <RelatedNews currentSlug={params.slug} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function generateMetadata({ params }: NewsDetailPageProps) {
  // In a real app, you would fetch the post data here
  // For now, we'll return basic metadata
  return {
    title: `News Article - Daily News`,
    description: "Read the latest news article on Daily News",
  };
}