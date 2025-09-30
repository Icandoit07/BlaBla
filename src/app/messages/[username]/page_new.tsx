"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { EmojiPicker } from "@/components/EmojiPicker";
import { MessageIcon, LoaderIcon, VerifiedBadgeIcon, ArrowLeftIcon, SendIcon, ImageIcon, SmileIcon, VideoIcon, PaperclipIcon, XIcon } from "@/components/icons";

interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    username: string;
  };
}

interface Message {
  id: string;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  createdAt: string;
  senderId: string;
  sender: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
    verified: boolean;
  };
  reactions: MessageReaction[];
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
  const [uploading, setUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactingToMessageId, setReactingToMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const userRes = await fetch(`/api/users/username/${username}`);
      if (!userRes.ok) {
        router.push("/messages");
        return;
      }
      const userData = await userRes.json();
      setOtherUser(userData);

      const messagesRes = await fetch(`/api/messages/${userData.id}`);
      const messagesData = await messagesRes.json();
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMediaSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      alert("Please select an image or video file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setSelectedMedia(file);
    const preview = URL.createObjectURL(file);
    setMediaPreview(preview);
  }

  function clearMedia() {
    setSelectedMedia(null);
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
      setMediaPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function uploadMedia(file: File): Promise<{ url: string; type: string } | null> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return {
          url: data.url,
          type: file.type.startsWith("image/") ? "image" : "video",
        };
      }
    } catch (error) {
      console.error("Error uploading media:", error);
    }
    return null;
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedMedia) || !otherUser || sending) return;

    setSending(true);
    setUploading(!!selectedMedia);

    try {
      let mediaUrl = null;
      let mediaType = null;

      if (selectedMedia) {
        const uploaded = await uploadMedia(selectedMedia);
        if (!uploaded) {
          alert("Failed to upload media");
          setSending(false);
          setUploading(false);
          return;
        }
        mediaUrl = uploaded.url;
        mediaType = uploaded.type;
        clearMedia();
      }

      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: otherUser.id,
          content: newMessage.trim() || null,
          mediaUrl,
          mediaType,
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
      setUploading(false);
    }
  }

  async function addReaction(messageId: string, emoji: string) {
    try {
      const res = await fetch(`/api/messages/${messageId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });

      if (res.ok) {
        const reaction = await res.json();
        setMessages(messages.map(msg => {
          if (msg.id === messageId) {
            const existingReactionIndex = msg.reactions.findIndex(r => r.userId === session?.user?.id);
            if (existingReactionIndex >= 0) {
              const newReactions = [...msg.reactions];
              newReactions[existingReactionIndex] = reaction;
              return { ...msg, reactions: newReactions };
            } else {
              return { ...msg, reactions: [...msg.reactions, reaction] };
            }
          }
          return msg;
        }));
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
    setReactingToMessageId(null);
  }

  async function removeReaction(messageId: string) {
    try {
      const res = await fetch(`/api/messages/${messageId}/react`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessages(messages.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              reactions: msg.reactions.filter(r => r.userId !== session?.user?.id),
            };
          }
          return msg;
        }));
      }
    } catch (error) {
      console.error("Error removing reaction:", error);
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

  function groupReactions(reactions: MessageReaction[]) {
    const grouped: Record<string, { emoji: string; users: MessageReaction["user"][];count: number }> = {};
    reactions.forEach(reaction => {
      if (!grouped[reaction.emoji]) {
        grouped[reaction.emoji] = { emoji: reaction.emoji, users: [], count: 0 };
      }
      grouped[reaction.emoji].users.push(reaction.user);
      grouped[reaction.emoji].count++;
    });
    return Object.values(grouped);
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
                const groupedReactions = groupReactions(message.reactions);
                const userReaction = message.reactions.find(r => r.userId === session?.user?.id);
                
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
                      } ${isConsecutive ? "mt-1" : "mt-4"} animate-fadeIn group relative`}
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
                        <div className="relative">
                          <div
                            className={`px-4 py-2.5 rounded-2xl transition-all ${
                              isCurrentUser
                                ? "bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow-md hover:shadow-lg"
                                : "bg-white border border-gray-200 text-gray-900 shadow-sm hover:shadow-md"
                            }`}
                          >
                            {message.mediaUrl && (
                              <div className="mb-2">
                                {message.mediaType === "image" ? (
                                  <img
                                    src={message.mediaUrl}
                                    alt="Shared media"
                                    className="max-w-full h-auto rounded-xl"
                                  />
                                ) : message.mediaType === "video" ? (
                                  <video
                                    src={message.mediaUrl}
                                    controls
                                    className="max-w-full h-auto rounded-xl"
                                  />
                                ) : null}
                              </div>
                            )}
                            {message.content && (
                              <p className="text-sm leading-relaxed break-words">{message.content}</p>
                            )}
                          </div>
                          
                          {/* Reactions Display */}
                          {groupedReactions.length > 0 && (
                            <div className={`flex flex-wrap gap-1 mt-1 ${isCurrentUser ? "justify-end" : ""}`}>
                              {groupedReactions.map((group, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    if (group.users.some(u => u.id === session?.user?.id)) {
                                      removeReaction(message.id);
                                    } else {
                                      addReaction(message.id, group.emoji);
                                    }
                                  }}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all hover:scale-110 ${
                                    group.users.some(u => u.id === session?.user?.id)
                                      ? "bg-green-100 border border-green-300"
                                      : "bg-gray-100 border border-gray-200 hover:bg-gray-200"
                                  }`}
                                  title={group.users.map(u => u.username).join(", ")}
                                >
                                  <span>{group.emoji}</span>
                                  {group.count > 1 && <span className="font-semibold">{group.count}</span>}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Add Reaction Button */}
                          <button
                            onClick={() => setReactingToMessageId(reactingToMessageId === message.id ? null : message.id)}
                            className={`absolute ${isCurrentUser ? "left-0" : "right-0"} top-0 -translate-x-10 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 rounded-full`}
                          >
                            <SmileIcon size={16} className="text-gray-500" />
                          </button>

                          {/* Quick Reaction Picker */}
                          {reactingToMessageId === message.id && (
                            <div className={`absolute ${isCurrentUser ? "left-0" : "right-0"} top-0 ${isCurrentUser ? "-translate-x-10" : "translate-x-10"}`}>
                              <EmojiPicker
                                onEmojiSelect={(emoji) => addReaction(message.id, emoji)}
                                onClose={() => setReactingToMessageId(null)}
                                quickReaction
                              />
                            </div>
                          )}
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

      {/* Media Preview */}
      {mediaPreview && (
        <div className="bg-white border-t border-gray-200 py-2 px-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="relative">
              {selectedMedia?.type.startsWith("image/") ? (
                <img src={mediaPreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
              ) : (
                <video src={mediaPreview} className="h-20 w-20 object-cover rounded-lg" />
              )}
              <button
                onClick={clearMedia}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <XIcon size={14} />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{selectedMedia?.name}</p>
              <p className="text-xs text-gray-500">
                {selectedMedia && (selectedMedia.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleMediaSelect}
              accept="image/*,video/*"
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 hover:text-green-600"
              disabled={sending}
            >
              <ImageIcon size={20} />
            </button>

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={uploading ? "Uploading..." : "Type a message..."}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 bg-white text-gray-900 placeholder-gray-400 outline-none transition-all font-medium"
              disabled={sending}
              autoComplete="off"
            />
            
            <button
              type="submit"
              disabled={(!newMessage.trim() && !selectedMedia) || sending}
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
