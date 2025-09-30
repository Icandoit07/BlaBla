import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { PostCard } from "@/components/PostCard";
import { Card } from "@/components/Card";
import Link from "next/link";

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  
  const bookmarks = await prisma.bookmark.findMany({ 
    where: userId ? { userId } : undefined, 
    orderBy: { createdAt: "desc" }, 
    include: { 
      post: { 
        include: { 
          author: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            }
          }
        } 
      } 
    } 
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent flex items-center gap-3">
            📌 Saved Posts
          </h1>
          <p className="text-gray-600 mt-2">
            Posts you've bookmarked for later
          </p>
        </div>

        {/* Empty State */}
        {bookmarks.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No saved posts yet
              </h3>
              <p className="text-gray-600 mb-4">
                Bookmark posts to read them later
              </p>
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl transition-all"
              >
                Explore Feed →
              </Link>
            </div>
          </Card>
        )}

        {/* Bookmarks List */}
        {bookmarks.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              {bookmarks.length} saved {bookmarks.length === 1 ? 'post' : 'posts'}
            </div>
            {bookmarks.map(b => (
              <PostCard
                key={`${b.userId}-${b.postId}`}
                id={b.post.id}
                author={{
                  username: b.post.author.username,
                  name: b.post.author.name,
                }}
                content={b.post.content}
                counts={{
                  likes: b.post._count?.likes || 0,
                  comments: b.post._count?.comments || 0,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}