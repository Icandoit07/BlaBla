"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { MessageIcon, LoaderIcon, VerifiedBadgeIcon, ArrowLeftIcon, SearchIcon } from "@/components/icons";

interface User {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
  verified: boolean;
  bio: string | null;
}

export default function NewMessagePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    fetchSuggestions();
  }, [session, router]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers();
    } else {
      setUsers([]);
    }
  }, [searchQuery]);

  async function fetchSuggestions() {
    try {
      const res = await fetch("/api/users/suggestions");
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  }

  async function searchUsers() {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  }

  function startConversation(username: string) {
    router.push(`/messages/${username}`);
  }

  const displayUsers = searchQuery.trim() ? users : suggestions;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-4 mb-3">
            <Link
              href="/messages"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeftIcon size={20} />
            </Link>
            <div className="flex items-center gap-3">
              <MessageIcon size={32} className="text-gray-900" />
              <h1 className="text-4xl font-bold text-gray-900">New Message</h1>
            </div>
          </div>
          <p className="text-gray-600 text-lg ml-14">
            Search for someone to start a conversation
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 animate-slideInTop">
          <div className="relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or username..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 bg-white text-gray-900 placeholder-gray-400 outline-none transition-all font-medium"
              autoFocus
            />
          </div>
        </Card>

        {/* Loading State */}
        {(loading || loadingSuggestions) && (
          <div className="text-center py-16">
            <LoaderIcon size={48} className="text-green-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 font-medium">
              {loading ? "Searching..." : "Loading suggestions..."}
            </p>
          </div>
        )}

        {/* Results Header */}
        {!loading && !loadingSuggestions && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {searchQuery.trim() ? "Search Results" : "Suggested People"}
            </h2>
            <p className="text-sm text-gray-600">
              {searchQuery.trim()
                ? `${displayUsers.length} user${displayUsers.length !== 1 ? "s" : ""} found`
                : "People you might want to message"}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !loadingSuggestions && displayUsers.length === 0 && (
          <Card>
            <div className="text-center py-16">
              <SearchIcon size={64} className="text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {searchQuery.trim() ? "No users found" : "No suggestions available"}
              </h2>
              <p className="text-gray-600">
                {searchQuery.trim()
                  ? "Try searching with a different name or username"
                  : "Check back later for people to message"}
              </p>
            </div>
          </Card>
        )}

        {/* Users List */}
        {!loading && !loadingSuggestions && displayUsers.length > 0 && (
          <div className="space-y-2 animate-fadeIn">
            {displayUsers.map((user, index) => (
              <Card
                key={user.id}
                hover
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-green-200"
                onClick={() => startConversation(user.username)}
                style={{
                  animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`,
                }}
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    src={user.image}
                    alt={user.name || user.username}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="font-bold text-gray-900 truncate text-base">
                        {user.name || "BlaBla User"}
                      </h3>
                      {user.verified && (
                        <VerifiedBadgeIcon className="text-blue-500 flex-shrink-0" size={18} />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm truncate mb-1">
                      @{user.username}
                    </p>
                    {user.bio && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {user.bio}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startConversation(user.username);
                      }}
                      className="px-5 py-2 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                      Message
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
