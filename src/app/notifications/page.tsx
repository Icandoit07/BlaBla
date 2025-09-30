"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import Link from "next/link";

type N = { 
  id: string; 
  type: string; 
  createdAt: string; 
  fromUser?: { username?: string | null; name?: string | null } | null; 
  post?: { id: string; content: string } | null 
};

export default function NotificationsPage() {
  const [items, setItems] = useState<N[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => r.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  function getNotificationIcon(type: string) {
    switch(type) {
      case "FOLLOW": return "👥";
      case "LIKE": return "❤️";
      case "REPLY": return "💬";
      case "REPOST": return "🔄";
      case "MENTION": return "📢";
      default: return "🔔";
    }
  }

  function getNotificationColor(type: string) {
    switch(type) {
      case "FOLLOW": return "from-blue-100 to-blue-200";
      case "LIKE": return "from-red-100 to-red-200";
      case "REPLY": return "from-green-100 to-green-200";
      case "REPOST": return "from-green-100 to-green-200";
      case "MENTION": return "from-purple-100 to-purple-200";
      default: return "from-gray-100 to-gray-200";
    }
  }

  function formatTime(date: string) {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent flex items-center gap-3">
            🔔 Notifications
          </h1>
          <p className="text-gray-600 mt-2">
            Stay updated with your activity
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔕</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-600 mb-4">
                When people interact with your posts, you'll see it here
              </p>
              <Link
                href="/compose"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl transition-all"
              >
                Create Your First Post →
              </Link>
            </div>
          </Card>
        )}

        {/* Notifications List */}
        {!loading && items.length > 0 && (
          <div className="space-y-3">
            {items.map(n => (
              <Link 
                href={n.post?.id ? `/post/${n.post.id}` : `/u/${n.fromUser?.username}`}
                key={n.id}
              >
                <Card hover>
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${getNotificationColor(n.type)} flex items-center justify-center text-xl`}>
                      {getNotificationIcon(n.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900">
                        <span className="font-semibold">
                          {n.fromUser?.name || `@${n.fromUser?.username}`}
                        </span>
                        {' '}
                        <span className="text-gray-600">
                          {n.type === "FOLLOW" && "started following you"}
                          {n.type === "LIKE" && "liked your post"}
                          {n.type === "REPLY" && "replied to your post"}
                          {n.type === "REPOST" && "reposted your post"}
                          {n.type === "MENTION" && "mentioned you"}
                        </span>
                      </p>
                      
                      {n.post && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          "{n.post.content}"
                        </p>
                      )}

                      <p className="text-xs text-gray-400 mt-2">
                        {formatTime(n.createdAt)}
                      </p>
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


