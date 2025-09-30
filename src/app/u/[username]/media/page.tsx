import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { ImageIcon } from "@/components/icons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function MediaPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        where: {
          media: {
            some: {},
          },
        },
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
            ? { where: { userId: session.user.id }, select: { userId: true } }
            : false,
          bookmarks: session?.user?.id
            ? { where: { userId: session.user.id }, select: { userId: true } }
            : false,
          reposts: session?.user?.id
            ? { where: { userId: session.user.id }, select: { userId: true } }
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
            <ImageIcon size={32} className="text-gray-900" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Media by {user.name || `@${user.username}`}</h1>
              <p className="text-gray-600">Posts with photos and videos</p>
            </div>
          </div>
        </div>

        {/* Media Posts */}
        <div className="space-y-4">
          {user.posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <ImageIcon size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-2">No media posts yet</p>
              <p className="text-gray-500 text-sm">
                When {user.name || `@${user.username}`} posts photos or videos, they'll show up here.
              </p>
            </div>
          ) : (
            user.posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                author={{
                  username: post.author?.username,
                  name: post.author?.name
                }}
                content={post.content}
                counts={{
                  likes: post._count?.likes || 0,
                  comments: post._count?.comments || 0
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
