"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef } from "react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Eye, MapPin, Share2, User } from "lucide-react";
import { formatDistance, format } from "date-fns";

interface NewsDetailContentProps {
  slug: string;
}

export function NewsDetailContent({ slug }: NewsDetailContentProps) {
  const post = useQuery(api.posts.getPostBySlug, { slug });
  const incrementViewCount = useMutation(api.posts.incrementViewCount);
  const hasIncrementedView = useRef(false);

  useEffect(() => {
    if (post && !hasIncrementedView.current) {
      incrementViewCount({ id: post._id });
      hasIncrementedView.current = true;
    }
  }, [post, incrementViewCount]);

  // Reset the flag when the slug changes (navigating to a different post)
  useEffect(() => {
    hasIncrementedView.current = false;
  }, [slug]);

  if (post === undefined) {
    return <NewsDetailSkeleton />;
  }

  if (post === null) {
    notFound();
  }

  const publishDate = new Date(post.publishedAt || post.createdAt);
  const timeAgo = formatDistance(publishDate, new Date(), { addSuffix: true });
  const formattedDate = format(publishDate, "MMMM d, yyyy");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
        <span>/</span>
        {post.category && (
          <>
            <a 
              href={`/categories/${post.category.slug}`}
              className="hover:text-blue-600 transition-colors"
            >
              {post.category.name}
            </a>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 truncate">{post.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {post.category && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-semibold">
              {post.category.name}
            </Badge>
          )}
          {post.region && (
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {post.region.name}
            </Badge>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          {post.description}
        </p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap items-center gap-6">
            {/* Author */}
            {post.author && (
              <div className="flex items-center space-x-3">
                {post.author.imageUrl ? (
                  <img 
                    src={post.author.imageUrl} 
                    alt={`${post.author.firstName} ${post.author.lastName}`}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {post.author.firstName} {post.author.lastName}
                  </p>
                  <p className="text-sm text-gray-500">Author</p>
                </div>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <div>
                <p className="font-medium">{formattedDate}</p>
                <p className="text-sm">{timeAgo}</p>
              </div>
            </div>

            {/* Views */}
            <div className="flex items-center space-x-2 text-gray-600">
              <Eye className="w-5 h-5" />
              <span>{post.viewCount.toLocaleString()} views</span>
            </div>
          </div>

          {/* Share Button */}
          <Button 
            onClick={handleShare}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </header>

      {/* Featured Image */}
      {post.imageUrl && (
        <div className="mb-8">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <div 
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
        />
      </div>

      {/* Article Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Share this article:</span>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
              >
                Twitter
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
              >
                Facebook
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
              >
                LinkedIn
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Last updated: {format(new Date(post.updatedAt), "MMM d, yyyy 'at' HH:mm")}
          </div>
        </div>
      </footer>
    </article>
  );
}

function NewsDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-4 mb-8">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="flex space-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
      <Skeleton className="h-64 w-full rounded-lg mb-8" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}