"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { FollowButton } from "@/components/FollowButton";
import Link from "next/link";
import { SearchIcon, UserIcon, MessageIcon, LoaderIcon, VerifiedBadgeIcon } from "@/components/icons";
import { useSession } from "next-auth/react";

interface SearchResults {
  users: any[];
  posts: any[];
  hashtags: { tag: string; count: number }[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "users" | "posts" | "hashtags">("all");
  const { data: session } = useSession();

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  async function performSearch(searchQuery: string) {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    performSearch(query);
  }

  const filteredResults = results
    ? {
        users: filter === "all" || filter === "users" ? results.users : [],
        posts: filter === "all" || filter === "posts" ? results.posts : [],
        hashtags: filter === "all" || filter === "hashtags" ? results.hashtags || [] : [],
      }
    : null;

  const hasResults = filteredResults && (
    filteredResults.users.length > 0 ||
    filteredResults.posts.length > 0 ||
    filteredResults.hashtags.length > 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-3">
            <SearchIcon size={32} className="text-gray-900" />
            <h1 className="text-4xl font-bold text-gray-900">Search</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Find people, posts, and trending topics
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 animate-fadeIn animation-delay-100">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 bg-white outline-none transition-all text-base"
                placeholder="Search for users, posts, or #hashtags..."
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
            >
              {loading ? (
                <LoaderIcon size={20} className="animate-spin" />
              ) : (
                "Search"
              )}
            </button>
          </form>
        </div>

        {/* Filters */}
        {results && (
          <div className="mb-6 animate-fadeIn animation-delay-200">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All", count: results.users.length + results.posts.length + (results.hashtags?.length || 0) },
                { key: "users", label: "People", count: results.users.length },
                { key: "posts", label: "Posts", count: results.posts.length },
                { key: "hashtags", label: "Hashtags", count: results.hashtags?.length || 0 },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key as any)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    filter === f.key
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-green-500 hover:bg-green-50"
                  }`}
                >
                  {f.label} {f.count > 0 && `(${f.count})`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <LoaderIcon size={48} className="text-green-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 font-medium">Searching...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredResults && !hasResults && (
          <Card>
            <div className="text-center py-16">
              <SearchIcon size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-6">
                Try different keywords or check your spelling
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setResults(null);
                  setFilter("all");
                }}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Clear search
              </button>
            </div>
          </Card>
        )}

        {/* Results */}
        {!loading && hasResults && (
          <div className="space-y-8">
            {/* Hashtags */}
            {filteredResults.hashtags.length > 0 && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-green-600">#</span>
                  Hashtags ({filteredResults.hashtags.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredResults.hashtags.map((hashtag) => (
                    <Link
                      key={hashtag.tag}
                      href={`/hashtag/${hashtag.tag.replace("#", "")}`}
                      className="block"
                    >
                      <Card hover>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {hashtag.tag}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {hashtag.count} {hashtag.count === 1 ? "post" : "posts"}
                            </p>
                          </div>
                          <div className="text-2xl">📈</div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Users */}
            {filteredResults.users.length > 0 && (
              <div className="animate-fadeIn animation-delay-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <UserIcon size={28} className="text-green-600" />
                  People ({filteredResults.users.length})
                </h2>
                <div className="space-y-3">
                  {filteredResults.users.map((user: any) => {
                    const isFollowing = user.followers && user.followers.length > 0;
                    const isOwnProfile = session?.user?.id === user.id;
                    
                    return (
                      <Card key={user.id} hover>
                        <div className="flex items-start gap-4">
                          <Link href={`/u/${user.username}`}>
                            <Avatar
                              src={user.image}
                              alt={user.name || user.username}
                              size="lg"
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link href={`/u/${user.username}`} className="block">
                              <div className="flex items-center gap-1 mb-1">
                                <h3 className="font-bold text-gray-900 hover:underline truncate">
                                  {user.name || "BlaBla User"}
                                </h3>
                                {user.verified && (
                                  <VerifiedBadgeIcon className="text-blue-500 flex-shrink-0" size={18} />
                                )}
                              </div>
                              <p className="text-gray-600 text-sm truncate">
                                @{user.username}
                              </p>
                            </Link>
                            {user.bio && (
                              <p className="text-gray-700 mt-2 text-sm line-clamp-2">
                                {user.bio}
                              </p>
                            )}
                          </div>
                          {!isOwnProfile && session?.user && (
                            <FollowButton
                              targetUserId={user.id}
                              isFollowing={isFollowing}
                              variant="small"
                            />
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Posts */}
            {filteredResults.posts.length > 0 && (
              <div className="animate-fadeIn animation-delay-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageIcon size={28} className="text-green-600" />
                  Posts ({filteredResults.posts.length})
                </h2>
                <div className="space-y-4">
                  {filteredResults.posts.map((post: any) => (
                    <PostCard
                      key={post.id}
                      post={{
                        ...post,
                        isLiked: post.likes && post.likes.length > 0,
                        isBookmarked: post.bookmarks && post.bookmarks.length > 0,
                        isReposted: post.reposts && post.reposts.length > 0,
                      }}
                      currentUserId={session?.user?.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!results && !loading && (
          <Card>
            <div className="text-center py-16">
              <SearchIcon size={80} className="text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Start searching
              </h3>
              <p className="text-gray-600 mb-8">
                Enter keywords to discover posts, people, and trending topics
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  #technology
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  @username
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  trending topics
                </span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}