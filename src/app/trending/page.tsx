"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { TrendingIcon, LoaderIcon, EditIcon } from "@/components/icons";
import Link from "next/link";

type T = { tag: string; count: number };

export default function TrendingPage() {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trending")
      .then(r => r.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-3">
            <TrendingIcon size={32} className="text-gray-900" />
            <h1 className="text-4xl font-bold text-gray-900">Trending Now</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Discover what's popular on BlaBla
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <LoaderIcon size={48} className="text-green-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 font-medium">Loading trending topics...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <Card>
            <div className="text-center py-16">
              <TrendingIcon size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No trending topics yet
              </h3>
              <p className="text-gray-600 mb-6">
                Be the first to start a conversation with hashtags!
              </p>
              <Link
                href="/compose"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <EditIcon size={20} />
                Create Post
              </Link>
            </div>
          </Card>
        )}

        {/* Trending Grid */}
        {!loading && items.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
            {items.map((t, i) => (
              <Link
                href={`/hashtag/${t.tag.replace("#", "")}`}
                key={i}
                className="block"
              >
                <Card hover>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-green-600">#</span>
                        <h3 className="text-xl font-bold text-gray-900">
                          {t.tag.replace("#", "")}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {t.count.toLocaleString()} {t.count === 1 ? 'post' : 'posts'}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 flex-shrink-0">
                      {i === 0 && (
                        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      )}
                      {i === 1 && (
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      )}
                      {i === 2 && (
                        <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      )}
                      {i > 2 && (
                        <TrendingIcon size={20} className="text-green-600" />
                      )}
                    </div>
                  </div>
                  
                  {/* Trend Indicator */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span>Trending #{i + 1}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
