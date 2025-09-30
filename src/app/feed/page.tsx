"use client";
import { useEffect, useState, useRef } from "react";
import { PostCard } from "@/components/PostCard";
import { SkeletonPost, LoadingSpinner } from "@/components/LoadingStates";
import { TrendingSidebar } from "@/components/TrendingSidebar";
import { WhoToFollow } from "@/components/WhoToFollow";
import { EditIcon } from "@/components/icons";
import Link from "next/link";

type Author = { id: string; username: string | null; name: string | null; image: string | null };
type Post = { id: string; content: string; createdAt: string; author: Author; _count: { likes: number; comments: number } };

export default function FeedPage() {
  const [items, setItems] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  async function load(cursor?: string) {
    if (loading) return; // Prevent concurrent loads
    
    setLoading(true);
    try {
      const res = await fetch(`/api/posts${cursor ? `?cursor=${cursor}` : ""}`);
      const data = await res.json();
      
      // Prevent duplicates by filtering out posts that already exist
      setItems(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newPosts = data.items.filter((post: Post) => !existingIds.has(post.id));
        return cursor ? [...prev, ...newPosts] : newPosts;
      });
      
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      load();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Home</h1>
          <p className="text-gray-600">See what's happening</p>
        </div>

        {/* Compose CTA */}
        <Link href="/compose" className="block mb-6 group">
          <div className="p-6 bg-white border-2 border-gray-200 hover:border-green-500 rounded-2xl transition-all duration-200 group-hover:shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                <EditIcon size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-900 mb-1">What's on your mind?</p>
                <p className="text-gray-600 text-sm">Share your thoughts with the community</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Initial Loading */}
        {initialLoading && (
          <div className="space-y-4">
            <SkeletonPost />
            <SkeletonPost />
            <SkeletonPost />
          </div>
        )}

        {/* Empty State */}
        {!initialLoading && items.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <EditIcon size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Be the first to share something! Your post will appear here.
            </p>
            <Link
              href="/compose"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
            >
              <EditIcon size={18} />
              Create your first post
            </Link>
          </div>
        )}

        {/* Posts Feed */}
        {!initialLoading && items.length > 0 && (
          <div className="space-y-4 animate-fadeIn">
            {items.map((post, index) => (
              <div 
                key={`${post.id}-${index}`}
                className="animate-slideInRight"
                style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
              >
                <PostCard 
                  id={post.id} 
                  author={{ username: post.author?.username, name: post.author?.name }} 
                  content={post.content} 
                  counts={{ likes: post._count?.likes || 0, comments: post._count?.comments || 0 }} 
                />
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!initialLoading && nextCursor && (
          <div className="mt-6 text-center">
            <button
              onClick={() => load(nextCursor)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-600 font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Load more posts
                </>
              )}
            </button>
          </div>
        )}

        {/* End of Feed */}
        {!initialLoading && !nextCursor && items.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              You're all caught up!
            </div>
          </div>
        )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-20 space-y-6">
              <TrendingSidebar />
              <WhoToFollow />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}