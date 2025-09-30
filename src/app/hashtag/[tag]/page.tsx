import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { TrendingIcon, ArrowLeftIcon } from "@/components/icons";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function HashtagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const session = await getServerSession(authOptions);
  const decodedTag = decodeURIComponent(tag);

  // Get hashtag with posts
  const hashtag = await prisma.hashtag.findUnique({
    where: { tag: `#${decodedTag}` },
    include: {
      posts: {
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
        orderBy: {
          post: {
            createdAt: "desc",
          },
        },
        take: 50,
      },
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  if (!hashtag) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <Link
            href="/trending"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-6"
          >
            <ArrowLeftIcon size={20} />
            Back to Trending
          </Link>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <TrendingIcon size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {hashtag.tag}
                </h1>
                <p className="text-gray-600 text-lg">
                  {hashtag._count.posts.toLocaleString()}{" "}
                  {hashtag._count.posts === 1 ? "post" : "posts"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {hashtag.posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No posts yet
              </h2>
              <p className="text-gray-600">
                Be the first to post about {hashtag.tag}!
              </p>
              <Link
                href="/compose"
                className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Create Post
              </Link>
            </div>
          ) : (
            <div className="animate-fadeIn animation-delay-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Posts about {hashtag.tag}
              </h2>
              {hashtag.posts.map(({ post }) => (
                <PostCard
                  key={post.id}
                  post={{
                    ...post,
                    isLiked: post.likes && post.likes.length > 0,
                    isBookmarked: post.bookmarks && post.bookmarks.length > 0,
                    isReposted: post.reposts && post.reposts.length > 0,
                  }}
                  currentUserId={session?.user?.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
