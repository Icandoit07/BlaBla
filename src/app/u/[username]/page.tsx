import { prisma } from "@/lib/db";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { UserIcon, EditIcon, VerifiedBadgeIcon, LocationIcon, LinkIcon, CalendarIcon, SettingsIcon, MessageIcon } from "@/components/icons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { FollowButton } from "@/components/FollowButton";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const session = await getServerSession(authOptions);
  
  const user = await prisma.user.findUnique({ 
    where: { username },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      _count: {
        select: {
          posts: true,
          following: true,
          followers: true,
        }
      },
      followers: session?.user?.id ? {
        where: {
          followerId: session.user.id
        },
        select: {
          followerId: true
        }
      } : false,
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <UserIcon size={48} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User not found</h1>
          <p className="text-gray-600 mb-6">
            The profile @{username} doesn't exist
          </p>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all"
          >
            Back to feed
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = session?.user?.id === user.id;
  const isFollowing = user.followers && user.followers.length > 0;
  const joinDate = new Date(user.createdAt);
  const formattedJoinDate = joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="h-48 sm:h-64 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 relative">
        {user.coverImage ? (
          <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-black/10"></div>
        )}
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-b-2xl shadow-sm border border-t-0 border-gray-200 -mt-20 relative">
          <div className="p-6">
            {/* Avatar and Actions */}
            <div className="flex items-end justify-between mb-4">
              <div className="w-32 h-32 -mt-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl border-4 border-white flex items-center justify-center">
                {user.image ? (
                  <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <span className="text-5xl font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {isOwnProfile ? (
                  <>
                    <Link
                      href="/settings/profile"
                      className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-full transition-all"
                    >
                      <EditIcon size={18} />
                      Edit Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="p-2.5 border border-gray-300 hover:border-gray-400 rounded-full transition-all hover:bg-gray-50"
                    >
                      <SettingsIcon size={20} className="text-gray-700" />
                    </Link>
                  </>
                ) : (
                  <>
                    <FollowButton
                      targetUserId={user.id}
                      isFollowing={isFollowing}
                    />
                    <Link
                      href={`/messages/${user.username}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-full transition-all hover:bg-gray-50"
                    >
                      <MessageIcon size={18} />
                      Message
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name || 'Anonymous User'}
                </h1>
                {user.verified && (
                  <VerifiedBadgeIcon className="text-blue-500" size={24} />
                )}
              </div>
              <p className="text-gray-600">@{user.username}</p>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="text-gray-700 leading-relaxed mb-4">
                {user.bio}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              {user.location && (
                <div className="flex items-center gap-1.5">
                  <LocationIcon size={18} className="text-gray-500" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-1.5">
                  <LinkIcon size={18} className="text-gray-500" />
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    {user.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <CalendarIcon size={18} className="text-gray-500" />
                <span>Joined {formattedJoinDate}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
              <div className="group cursor-pointer">
                <span className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {user._count.posts.toLocaleString()}
                </span>
                <span className="text-gray-600 ml-1.5 text-sm">Posts</span>
              </div>
              <Link href={`/u/${user.username}/following`} className="group cursor-pointer">
                <span className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {user._count.following.toLocaleString()}
                </span>
                <span className="text-gray-600 ml-1.5 text-sm hover:underline">Following</span>
              </Link>
              <Link href={`/u/${user.username}/followers`} className="group cursor-pointer">
                <span className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  {user._count.followers.toLocaleString()}
                </span>
                <span className="text-gray-600 ml-1.5 text-sm hover:underline">Followers</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 bg-white rounded-t-2xl border border-b-0 border-gray-200 sticky top-16 z-40 shadow-sm">
          <div className="flex items-center gap-1 p-1">
            <Link href={`/u/${user.username}`} className="flex-1 py-3 px-4 text-sm font-semibold text-center text-green-600 bg-green-50 rounded-xl transition-all">
              Posts
            </Link>
            <Link href={`/u/${user.username}/replies`} className="flex-1 py-3 px-4 text-sm font-semibold text-center text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
              Replies
            </Link>
            <Link href={`/u/${user.username}/media`} className="flex-1 py-3 px-4 text-sm font-semibold text-center text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
              Media
            </Link>
            <Link href={`/u/${user.username}/likes`} className="flex-1 py-3 px-4 text-sm font-semibold text-center text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
              Likes
            </Link>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="bg-white rounded-b-2xl border border-gray-200 shadow-sm mb-8">
          {user.posts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <EditIcon size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-6">
                {isOwnProfile 
                  ? "Share your first thought with the world!"
                  : `When @${user.username} posts, they'll show up here`
                }
              </p>
              {isOwnProfile && (
                <Link
                  href="/compose"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
                >
                  <EditIcon size={18} />
                  Create your first post
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {user.posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <PostCard
                    id={post.id}
                    author={{
                      username: user.username,
                      name: user.name,
                    }}
                    content={post.content}
                    counts={{
                      likes: 0,
                      comments: 0,
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}