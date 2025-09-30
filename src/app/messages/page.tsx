"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { MessageIcon, LoaderIcon, VerifiedBadgeIcon, EditIcon } from "@/components/icons";

interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
    verified: boolean;
  };
  lastMessage: {
    id: string;
    content: string;
    read: boolean;
    createdAt: string;
    senderId: string;
  } | null;
  unreadCount: number;
  updatedAt: string;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    fetchConversations();
  }, [session, router]);

  async function fetchConversations() {
    try {
      const res = await fetch("/api/messages/conversations");
      const data = await res.json();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <MessageIcon size={32} className="text-gray-900" />
              <h1 className="text-4xl font-bold text-gray-900">Messages</h1>
            </div>
            <Link
              href="/messages/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              <EditIcon size={18} />
              New Message
            </Link>
          </div>
          <p className="text-gray-600 text-lg">
            Your conversations and messages
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <LoaderIcon size={48} className="text-green-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 font-medium">Loading messages...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && conversations.length === 0 && (
          <Card>
            <div className="text-center py-16">
              <MessageIcon size={64} className="text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No messages yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start a conversation by sending a message to someone
              </p>
              <Link
                href="/messages/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <EditIcon size={20} />
                Send your first message
              </Link>
            </div>
          </Card>
        )}

        {/* Conversations List */}
        {!loading && conversations.length > 0 && (
          <div className="space-y-2 animate-fadeIn">
            {conversations.map((conv, index) => (
              <Link
                key={conv.id}
                href={`/messages/${conv.otherUser.username}`}
                className="block"
                style={{
                  animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`,
                }}
              >
                <Card hover className="transition-all duration-300 hover:shadow-lg hover:border-green-200">
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <Avatar
                        src={conv.otherUser.image}
                        alt={conv.otherUser.name || conv.otherUser.username}
                        size="lg"
                      />
                      {conv.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
                          {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate text-base">
                            {conv.otherUser.name || "BlaBla User"}
                          </h3>
                          {conv.otherUser.verified && (
                            <VerifiedBadgeIcon className="text-blue-500 flex-shrink-0" size={18} />
                          )}
                        </div>
                        {conv.lastMessage && (
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-3 font-medium">
                            {formatTime(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm truncate mb-2">
                        @{conv.otherUser.username}
                      </p>
                      {conv.lastMessage ? (
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm truncate flex-1 ${
                              conv.unreadCount > 0 && conv.lastMessage.senderId !== session?.user?.id
                                ? "text-gray-900 font-bold"
                                : "text-gray-600"
                            }`}
                          >
                            {conv.lastMessage.senderId === session?.user?.id && (
                              <span className="text-gray-500 font-normal">You: </span>
                            )}
                            {conv.lastMessage.content}
                          </p>
                          {conv.unreadCount > 0 && conv.lastMessage.senderId !== session?.user?.id && (
                            <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm italic">No messages yet</p>
                      )}
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
