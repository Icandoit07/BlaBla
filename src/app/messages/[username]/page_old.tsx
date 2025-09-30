"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/Card";
import { MessageIcon, LoaderIcon, VerifiedBadgeIcon, ArrowLeftIcon, SendIcon } from "@/components/icons";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
    verified: boolean;
  };
}

interface User {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
  verified: boolean;
}

export default function ConversationPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    params.then((p) => setUsername(p.username));
  }, [params]);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (username) {
      fetchUserAndMessages();
    }
  }, [session, router, username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function fetchUserAndMessages() {
    try {
      // Fetch user details
      const userRes = await fetch(`/api/users/username/${username}`);
      if (!userRes.ok) {
        router.push("/messages");
        return;
      }
      const userData = await userRes.json();
      setOtherUser(userData);

      // Fetch messages
      const messagesRes = await fetch(`/api/messages/${userData.id}`);
      const messagesData = await messagesRes.json();
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !otherUser || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: otherUser.id,
          content: newMessage.trim(),
        }),
      });

      if (res.ok) {
        const message = await res.json();
        setMessages([...messages, message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  }

  function shouldShowDateSeparator(currentMsg: Message, prevMsg: Message | null) {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.createdAt).toDateString();
    const prevDate = new Date(prevMsg.createdAt).toDateString();
    return currentDate !== prevDate;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoaderIcon size={48} className="text-green-600 animate-spin" />
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/messages"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeftIcon size={20} />
            </Link>
            <Link
              href={`/u/${otherUser.username}`}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              <Avatar
                src={otherUser.image}
                alt={otherUser.name || otherUser.username}
                size="md"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h2 className="font-bold text-gray-900 truncate">
                    {otherUser.name || "BlaBla User"}
                  </h2>
                  {otherUser.verified && (
                    <VerifiedBadgeIcon className="text-blue-500 flex-shrink-0" size={18} />
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">@{otherUser.username}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <MessageIcon size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">
                Start your conversation with {otherUser.name || `@${otherUser.username}`}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((message, index) => {
                const isCurrentUser = message.senderId === session?.user?.id;
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const showDateSeparator = shouldShowDateSeparator(message, prevMessage);
                const showAvatar = !isCurrentUser && (!prevMessage || prevMessage.senderId !== message.senderId || showDateSeparator);
                const isConsecutive = prevMessage && prevMessage.senderId === message.senderId && !showDateSeparator;
                
                return (
                  <div key={message.id}>
                    {/* Date Separator */}
                    {showDateSeparator && (
                      <div className="flex items-center justify-center my-6">
                        <div className="bg-gray-100 text-gray-600 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
                          {formatDate(message.createdAt)}
                        </div>
                      </div>
                    )}
                    
                    {/* Message */}
                    <div
                      className={`flex gap-3 ${
                        isCurrentUser ? "flex-row-reverse" : ""
                      } ${isConsecutive ? "mt-1" : "mt-4"} animate-fadeIn`}
                    >
                      {showAvatar ? (
                        <Avatar
                          src={message.sender.image}
                          alt={message.sender.name || message.sender.username}
                          size="sm"
                        />
                      ) : (
                        !isCurrentUser && <div className="w-8" />
                      )}
                      <div
                        className={`flex flex-col ${
                          isCurrentUser ? "items-end" : "items-start"
                        } max-w-[70%] sm:max-w-[60%]`}
                      >
                        <div
                          className={`px-4 py-2.5 rounded-2xl transition-all ${
                            isCurrentUser
                              ? "bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow-md hover:shadow-lg"
                              : "bg-white border border-gray-200 text-gray-900 shadow-sm hover:shadow-md"
                          }`}
                        >
                          <p className="text-sm leading-relaxed break-words">{message.content}</p>
                        </div>
                        {(!isConsecutive || index === messages.length - 1) && (
                          <span className="text-xs text-gray-500 mt-1 px-2">
                            {formatTime(message.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 bg-white text-gray-900 placeholder-gray-400 outline-none transition-all font-medium"
              disabled={sending}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 min-w-[90px]"
            >
              {sending ? (
                <LoaderIcon size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Send</span>
                  <SendIcon size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
