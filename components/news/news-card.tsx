import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, MapPin, User } from "lucide-react";
import { formatDistance } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";

interface Post {
  _id: Id<"posts">;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  publishedAt?: number;
  createdAt: number;
  viewCount: number;
  category?: {
    _id: Id<"categories">;
    name: string;
    slug: string;
    color?: string;
    description?: string;
    isActive: boolean;
    createdAt: number;
    updatedAt: number;
    createdBy: Id<"users">;
    _creationTime: number;
  } | null;
  region?: {
    _id: Id<"regions">;
    name: string;
    slug: string;
    country: string;
    isActive: boolean;
    createdAt: number;
    updatedAt: number;
    _creationTime: number;
  } | null;
  author?: {
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  } | null;
}

interface NewsCardProps {
  post: Post;
  featured?: boolean;
  className?: string;
}

export function NewsCard({ post, featured = false, className = "" }: NewsCardProps) {
  const publishDate = new Date(post.publishedAt || post.createdAt);
  const timeAgo = formatDistance(publishDate, new Date(), { addSuffix: true });

  return (
    <article className={`group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
      <Link href={`/news/${post.slug}`}>
        <div className="relative">
          {post.imageUrl ? (
            <div className={`relative overflow-hidden ${featured ? 'h-64 lg:h-80' : 'h-48'}`}>
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Category Badge */}
              {post.category && (
                <div className="absolute top-4 left-4">
                  <Badge 
                    variant="secondary" 
                    className={`${post.category.color ? `bg-${post.category.color}-100 text-${post.category.color}-800` : 'bg-blue-100 text-blue-800'} font-semibold`}
                  >
                    {post.category.name}
                  </Badge>
                </div>
              )}

              {/* Region Badge */}
              {post.region && (
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-white/90 text-gray-700">
                    <MapPin className="w-3 h-3 mr-1" />
                    {post.region.name}
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className={`bg-gray-200 ${featured ? 'h-64 lg:h-80' : 'h-48'} flex items-center justify-center`}>
              <div className="text-gray-400 text-center">
                <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h16v2H4v-2zm0 4h16v2H4v-2z" />
                </svg>
                <p className="text-sm">No image available</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <h2 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3 ${featured ? 'text-2xl' : 'text-xl'}`}>
            {post.title}
          </h2>

          <p className={`text-gray-600 line-clamp-3 mb-4 ${featured ? 'text-base' : 'text-sm'}`}>
            {post.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {/* Author */}
              {post.author && (
                <div className="flex items-center space-x-2">
                  {post.author.imageUrl ? (
                    <img 
                      src={post.author.imageUrl} 
                      alt={`${post.author.firstName} ${post.author.lastName}`}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span>
                    {post.author.firstName} {post.author.lastName}
                  </span>
                </div>
              )}

              {/* Time */}
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{timeAgo}</span>
              </div>
            </div>

            {/* View Count */}
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Eye className="w-4 h-4" />
              <span>{post.viewCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}


