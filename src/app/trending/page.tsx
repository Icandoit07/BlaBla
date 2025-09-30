"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent flex items-center gap-3">
            🔥 Trending Now
          </h1>
          <p className="text-gray-600 mt-2">
            Discover what's popular on BlaBla
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading trending topics...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No trending topics yet
              </h3>
              <p className="text-gray-600 mb-4">
                Be the first to start a conversation with hashtags!
              </p>
              <Link
                href="/compose"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl transition-all"
              >
                Create Post →
              </Link>
            </div>
          </Card>
        )}

        {/* Trending Grid */}
        {!loading && items.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((t, i) => (
              <Link href={`/search?q=${encodeURIComponent(t.tag)}`} key={i}>
                <Card hover>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">#</span>
                        <h3 className="text-xl font-bold text-gray-900">
                          {t.tag}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {t.count.toLocaleString()} {t.count === 1 ? 'post' : 'posts'}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200">
                      <span className="text-xl">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🔥'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Trend Indicator */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                      <span>↗</span>
                      <span>Trending</span>
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
