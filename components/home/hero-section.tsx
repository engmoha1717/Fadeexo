"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const featuredPosts = useQuery(api.posts.getPublishedPosts, { 
    limit: 1, 
    featured: true 
  });

  if (!featuredPosts || featuredPosts.length === 0) {
    return (
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Breaking News & Latest Updates
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Stay informed with real-time news from around the world
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories/politics">
                <Button size="lg" variant="secondary">
                  Latest Politics
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/categories/sports">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                  Sports News
                  <TrendingUp className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const featuredPost = featuredPosts[0];

  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Image */}
      {featuredPost.imageUrl && (
        <div className="absolute inset-0">
          <img
            src={featuredPost.imageUrl}
            alt={featuredPost.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>
      )}

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-full">
              BREAKING
            </span>
            {featuredPost.category && (
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                {featuredPost.category.name}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {featuredPost.title}
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
            {featuredPost.description}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              {featuredPost.author?.imageUrl && (
                <img
                  src={featuredPost.author.imageUrl}
                  alt={`${featuredPost.author.firstName} ${featuredPost.author.lastName}`}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="font-semibold">
                  {featuredPost.author?.firstName} {featuredPost.author?.lastName}
                </p>
                <p className="text-sm text-gray-300">
                  {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {featuredPost.region && (
              <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                📍 {featuredPost.region.name}
              </span>
            )}
          </div>

          <Link href={`/news/${featuredPost.slug}`}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Read Full Story
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}