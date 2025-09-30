import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { HeartIcon } from "@/components/icons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function LikesPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      verified: true,
      likes: {
        include: {
          post: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  image: true,
                  verified: true,
                },
              },
              media: true,
              likes: session?.user?.id
                ? { where: { userId: session.user.id }, select: { id: true } }
                : false,
              bookmarks: session?.user?.id
                ? { where: { userId: session.user.id }, select: { id: true } }
                : false,
              reposts: session?.user?.id
                ? { where: { userId: session.user.id }, select: { id: true } }
                : false,
              _count: {
                select: {
                  likes: true,
                  comments: true,
                  reposts: true,
                  bookmarks: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href={`/u/${user.username}`} className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-4">
            ← Back to profile
          </Link>
          <div className="flex items-center gap-3">
            <HeartIcon size={32} filled className="text-red-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Liked by {user.name || `@${user.username}`}</h1>
              <p className="text-gray-600">Posts this user has liked</p>
            </div>
          </div>
        </div>

        {/* Liked Posts */}
        <div className="space-y-4">
          {user.likes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <HeartIcon size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-2">No likes yet</p>
              <p className="text-gray-500 text-sm">
                When {user.name || `@${user.username}`} likes posts, they'll show up here.
              </p>
            </div>
          ) : (
            user.likes.map((like) => (
              <PostCard
                key={like.post.id}
                post={{
                  ...like.post,
                  isLiked: like.post.likes && like.post.likes.length > 0,
                  isBookmarked: like.post.bookmarks && like.post.bookmarks.length > 0,
                  isReposted: like.post.reposts && like.post.reposts.length > 0,
                }}
                currentUserId={session?.user?.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
