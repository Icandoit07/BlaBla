"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserIcon, VerifiedBadgeIcon } from "./icons";
import { LoadingSpinner } from "./LoadingStates";

type SuggestedUser = {
  id: string;
  name: string | null;
  username: string | null;
  verified: boolean;
  bio: string | null;
  _count: {
    followers: number;
  };
};

export function WhoToFollow() {
  const [users, setUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSuggestions() {
      try {
        const res = await fetch("/api/users/suggestions");
        if (res.ok) {
          const data = await res.json();
          setUsers(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to load suggestions");
      } finally {
        setLoading(false);
      }
    }
    loadSuggestions();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Who to follow</h2>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Who to follow</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/u/${user.username}`}
            className="block p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-lg">
                  {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="font-semibold text-gray-900 truncate">
                    {user.name || 'Anonymous'}
                  </span>
                  {user.verified && (
                    <VerifiedBadgeIcon className="text-blue-500 flex-shrink-0" size={16} />
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">@{user.username}</p>
                {user.bio && (
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">{user.bio}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {user._count.followers.toLocaleString()} followers
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/explore/people"
        className="block p-4 text-green-600 hover:bg-green-50 font-medium text-sm transition-colors"
      >
        Show more
      </Link>
    </div>
  );
}
