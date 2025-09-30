"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LoadingSpinner } from "./LoadingStates";
import { TrendingIcon } from "./icons";

type TrendingTopic = {
  tag: string;
  count: number;
};

export function TrendingSidebar() {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrending() {
      try {
        const res = await fetch("/api/trending");
        if (res.ok) {
          const data = await res.json();
          setTopics(data.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to load trending");
      } finally {
        setLoading(false);
      }
    }
    loadTrending();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Trending</h2>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (topics.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingIcon size={20} className="text-green-600" />
          Trending
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {topics.map((topic, index) => (
          <Link
            key={topic.tag}
            href={`/search?q=${encodeURIComponent(topic.tag)}`}
            className="block p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-500">
                    #{index + 1} Trending
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-0.5 truncate">
                  #{topic.tag}
                </h3>
                <p className="text-sm text-gray-600">
                  {topic.count.toLocaleString()} {topic.count === 1 ? 'post' : 'posts'}
                </p>
              </div>
              {index < 3 && (
                <div className="text-2xl flex-shrink-0 ml-2">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/trending"
        className="block p-4 text-green-600 hover:bg-green-50 font-medium text-sm transition-colors"
      >
        Show more
      </Link>
    </div>
  );
}
