import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { VerifiedBadgeIcon, ArrowLeftIcon } from "@/components/icons";
import { FollowButton } from "@/components/FollowButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function FollowersPage({
  params,
}: {
  params: { username: string };
}) {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      followers: {
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              verified: true,
              bio: true,
              followers: currentUserId ? {
                where: { followerId: currentUserId },
                select: { id: true },
              } : false,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white shadow-sm border-x border-gray-200 min-h-screen">
        {/* Header */}
        <div className="sticky top-16 z-10 bg-white/95 backdrop-blur-xl border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href={`/u/${user.username}`}>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeftIcon size={20} />
              </button>
            </Link>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name || user.username}</h2>
              <p className="text-sm text-gray-600">@{user.username}</p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mt-4 -mb-px">
            <Link
              href={`/u/${user.username}/followers`}
              className="flex-1 text-center py-3 font-semibold text-green-600 border-b-2 border-green-600"
            >
              Followers ({user._count.followers})
            </Link>
            <Link
              href={`/u/${user.username}/following`}
              className="flex-1 text-center py-3 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Following ({user._count.following})
            </Link>
          </div>
        </div>

        {/* Followers List */}
        <div className="divide-y divide-gray-200">
          {user.followers.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg font-medium mb-2">No followers yet</p>
              <p className="text-gray-500 text-sm">When someone follows @{user.username}, they'll show up here.</p>
            </div>
          ) : (
            user.followers.map(({ follower }) => {
              const isFollowing = follower.followers && follower.followers.length > 0;
              const isOwnProfile = currentUserId === follower.id;
              
              return (
                <div key={follower.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <Link href={`/u/${follower.username}`}>
                      <Avatar src={follower.image} alt={follower.name || follower.username || "User"} size="lg" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/u/${follower.username}`} className="block">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="font-bold text-gray-900 hover:underline truncate">
                            {follower.name || "BlaBla User"}
                          </span>
                          {follower.verified && (
                            <VerifiedBadgeIcon className="text-blue-500 flex-shrink-0" size={18} />
                          )}
                        </div>
                        <p className="text-gray-600 text-sm truncate">@{follower.username}</p>
                      </Link>
                      {follower.bio && (
                        <p className="text-gray-700 mt-2 text-sm line-clamp-2">{follower.bio}</p>
                      )}
                    </div>
                    {!isOwnProfile && currentUserId && (
                      <FollowButton
                        targetUserId={follower.id}
                        isFollowing={isFollowing}
                        variant="small"
                      />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
