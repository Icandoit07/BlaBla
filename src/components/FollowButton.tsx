"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FollowButton({ 
  userId, 
  initialIsFollowing 
}: { 
  userId: string; 
  initialIsFollowing: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleFollow() {
    setLoading(true);
    
    try {
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
      });

      if (res.ok) {
        setIsFollowing(!isFollowing);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`
        px-6 py-2.5 font-semibold rounded-full transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed
        ${isFollowing 
          ? "bg-white border-2 border-gray-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600 text-gray-700" 
          : "bg-gray-900 hover:bg-black text-white"
        }
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {isFollowing ? 'Unfollowing...' : 'Following...'}
        </span>
      ) : (
        <span>{isFollowing ? 'Following' : 'Follow'}</span>
      )}
    </button>
  );
}
