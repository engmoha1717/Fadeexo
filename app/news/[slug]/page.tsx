"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NewsDetailContent } from "@/components/news/news-detail-content";
import { RelatedNews } from "@/components/news/related-news";
import { use } from "react";

interface ParamsType {
  slug: string;
}

interface PageProps {
  params: Promise<ParamsType>;
}

export default function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <NewsDetailContent slug={resolvedParams.slug} />
          <div className="mt-12">
            <RelatedNews currentSlug={resolvedParams.slug} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}