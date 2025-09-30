"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./Button";

interface FollowButtonProps {
  targetUserId: string;
  isFollowing: boolean;
  variant?: "default" | "small";
}

export function FollowButton({ targetUserId, isFollowing: initialIsFollowing, variant = "default" }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleFollow() {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${targetUserId}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
      });

      if (res.ok) {
        setIsFollowing(!isFollowing);
        router.refresh();
      }
    } catch (error) {
      console.error("Follow error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      variant={isFollowing ? "outline" : "primary"}
      size={variant === "small" ? "sm" : "md"}
      className="rounded-full min-w-[100px]"
    >
      {loading ? "..." : isFollowing ? "Following" : "Follow"}
    </Button>
  );
}