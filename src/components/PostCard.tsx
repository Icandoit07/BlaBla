"use client";
import { useState } from "react";
import { Card } from "@/components/Card";
import Link from "next/link";
import { HeartIcon, MessageIcon, RepeatIcon, BookmarkIcon } from "./icons";

export function PostCard({ id, author, content, counts }: { id: string; author: { username?: string | null; name?: string | null }; content: string; counts?: { likes?: number; comments?: number } }) {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  async function act(path: string, method: string) {
    await fetch(path, { method });
  }

  return (
    <Card hover>
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-4">
        <Link href={`/u/${author.username}`} className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-lg shadow-md hover:scale-105 transition-transform">
            {(author.name || author.username || "U").charAt(0).toUpperCase()}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/u/${author.username}`} className="font-semibold text-gray-900 hover:text-green-600 transition-colors truncate block">
            {author.name || "User"}
          </Link>
          <p className="text-sm text-gray-500 truncate">@{author.username ?? "user"}</p>
        </div>
      </div>

      {/* Content */}
      <Link href={`/post/${id}`}>
        <p className="text-gray-800 text-[15px] leading-relaxed whitespace-pre-wrap mb-4 hover:text-gray-900 cursor-pointer">
          {content}
        </p>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-8 pt-4 border-t border-gray-100">
        <button 
          onClick={() => { setLiked(v => !v); act(`/api/posts/${id}/like`, liked ? "DELETE" : "POST"); }} 
          className={`group flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:text-red-600 ${
            liked ? "text-red-600" : "text-gray-600"
          }`}
        >
          <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
            <HeartIcon size={18} filled={liked} className="transition-transform group-hover:scale-110" />
          </div>
          <span className="tabular-nums">{counts?.likes ?? 0}</span>
        </button>

        <Link 
          href={`/post/${id}`}
          className="group flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-200"
        >
          <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
            <MessageIcon size={18} className="transition-transform group-hover:scale-110" />
          </div>
          <span className="tabular-nums">{counts?.comments ?? 0}</span>
        </Link>

        <button 
          onClick={() => { setReposted(v => !v); act(`/api/posts/${id}/repost`, reposted ? "DELETE" : "POST"); }} 
          className={`group flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:text-green-600 ${
            reposted ? "text-green-600" : "text-gray-600"
          }`}
        >
          <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
            <RepeatIcon size={18} className="transition-transform group-hover:rotate-180 duration-300" />
          </div>
        </button>

        <button 
          onClick={() => { setBookmarked(v => !v); act(`/api/posts/${id}/bookmark`, bookmarked ? "DELETE" : "POST"); }} 
          className={`group ml-auto flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:text-purple-600 ${
            bookmarked ? "text-purple-600" : "text-gray-600"
          }`}
        >
          <div className="p-2 rounded-full group-hover:bg-purple-50 transition-colors">
            <BookmarkIcon size={18} className="transition-transform group-hover:scale-110" />
          </div>
        </button>
      </div>
    </Card>
  );
}