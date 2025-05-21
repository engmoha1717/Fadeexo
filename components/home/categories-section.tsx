"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";

export function CategoriesSection() {
  const categories = useQuery(api.categories.getActiveCategories);

  const categoryColors = [
    "bg-red-500",
    "bg-blue-500", 
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500"
  ];

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore News Categories
          </h2>
          <p className="text-gray-300 text-lg">
            Find the stories that interest you most
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={category._id} href={`/categories/${category.slug}`}>
              <div className="group relative p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                <div className={`w-12 h-12 ${categoryColors[index % categoryColors.length]} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                  {category.name}
                </h3>
                
                {category.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}
                
                <div className="flex items-center text-blue-400 text-sm font-medium">
                  View Articles
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/categories/politics">
            <Button variant="outline" size="lg" className="text-blue-600 border-white hover:bg-white hover:text-gray-900">
              View All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}