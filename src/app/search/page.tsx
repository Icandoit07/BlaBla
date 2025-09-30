"use client";
import { useState } from "react";
import { PostCard } from "@/components/PostCard";
import { Card } from "@/components/Card";
import Link from "next/link";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<{ users: any[]; posts: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    
    setLoading(true);
    const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    setRes(await r.json());
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent flex items-center gap-3">
            🔍 Search
          </h1>
          <p className="text-gray-600 mt-2">
            Find people, posts, and hashtags
          </p>
        </div>

        {/* Search Form */}
        <Card>
          <form onSubmit={search} className="flex gap-3">
            <input 
              value={q} 
              onChange={e => setQ(e.target.value)} 
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all" 
              placeholder="Search for users, posts, or #hashtags" 
            />
            <button 
              type="submit"
              disabled={loading || !q.trim()}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "..." : "Search"}
            </button>
          </form>
        </Card>

        {/* Results */}
        {res && (
          <div className="mt-8">
            {res.posts.length === 0 && res.users.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤷</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600">
                    Try searching for something else
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Posts */}
                {res.posts.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>💬</span>
                      Posts ({res.posts.length})
                    </h2>
                    <div className="space-y-4">
                      {res.posts.map((p: any) => (
                        <PostCard 
                          key={p.id} 
                          id={p.id} 
                          author={{ username: p.author?.username, name: p.author?.name }} 
                          content={p.content} 
                          counts={{ likes: p._count?.likes, comments: p._count?.comments }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Users */}
                {res.users.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>👥</span>
                      People ({res.users.length})
                    </h2>
                    <div className="space-y-3">
                      {res.users.map((u: any) => (
                        <Link href={`/u/${u.username}`} key={u.id}>
                          <Card hover>
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                                {(u.name || u.username || "U").charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                  {u.name || "User"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  @{u.username}
                                </p>
                              </div>
                              <div className="text-green-600">→</div>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!res && (
          <div className="mt-8">
            <Card>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔎</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Start searching
                </h3>
                <p className="text-gray-600">
                  Enter keywords to find posts and people
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}