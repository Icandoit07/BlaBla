import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { MessageIcon } from "@/components/icons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function RepliesPage({
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
      comments: {
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
            <MessageIcon size={32} className="text-gray-900" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Replies by {user.name || `@${user.username}`}</h1>
              <p className="text-gray-600">All replies and comments</p>
            </div>
          </div>
        </div>

        {/* Replies List */}
        <div className="space-y-4">
          {user.comments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <MessageIcon size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-2">No replies yet</p>
              <p className="text-gray-500 text-sm">
                When {user.name || `@${user.username}`} replies to posts, they'll show up here.
              </p>
            </div>
          ) : (
            user.comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-sm text-gray-600">
                    Replying to <Link href={`/u/${comment.post.author.username}`} className="text-green-600 hover:underline">@{comment.post.author.username}</Link>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-gray-900">{comment.content}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-600 text-sm mb-2">Original post:</p>
                  <PostCard 
                    post={{
                      ...comment.post,
                      isLiked: comment.post.likes && comment.post.likes.length > 0,
                      isBookmarked: comment.post.bookmarks && comment.post.bookmarks.length > 0,
                      isReposted: comment.post.reposts && comment.post.reposts.length > 0,
                    }}
                    currentUserId={session?.user?.id}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
