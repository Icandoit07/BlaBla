import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { HeartIcon, MessageIcon, RepeatIcon, ShareIcon, ArrowLeftIcon, VerifiedBadgeIcon } from "@/components/icons";
import { formatDistanceToNow } from "date-fns";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  const post = await prisma.post.findUnique({ 
    where: { id }, 
    include: { 
      author: true, 
      media: true,
      likes: session?.user?.id ? {
        where: { userId: session.user.id }
      } : false,
      _count: {
        select: {
          likes: true,
          comments: true,
          reposts: true,
        }
      },
      comments: { 
        include: { 
          author: true,
          _count: {
            select: {
              likes: true,
            }
          }
        }, 
        orderBy: { createdAt: "desc" } 
      } 
    } 
  });
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fadeIn p-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
            <MessageIcon size={48} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h1>
          <p className="text-gray-600 mb-6">
            This post may have been deleted or doesn't exist.
          </p>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <ArrowLeftIcon size={20} />
            Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  const isLiked = post.likes && Array.isArray(post.likes) && post.likes.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <Link
              href="/feed"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeftIcon size={20} className="text-gray-700" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Post</h1>
              <p className="text-sm text-gray-500">
                {post._count.comments} {post._count.comments === 1 ? 'comment' : 'comments'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Original Post - Expanded View */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4 animate-fadeIn">
          
          {/* Author Info */}
          <div className="flex items-start gap-3 mb-4">
            <Link href={`/u/${post.author.username}`}>
              <Avatar 
                src={post.author.image} 
                alt={post.author.name || post.author.username} 
                size="lg"
                className="ring-2 ring-gray-100 hover:ring-green-500 transition-all duration-200"
              />
            </Link>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Link 
                  href={`/u/${post.author.username}`}
                  className="font-bold text-gray-900 hover:text-green-600 transition-colors"
                >
                  {post.author.name || post.author.username}
                </Link>
                {post.author.verified && (
                  <VerifiedBadgeIcon size={18} className="text-green-600" />
                )}
                <span className="text-gray-500">@{post.author.username}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {new Date(post.createdAt).toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="text-gray-900 text-lg leading-relaxed mb-4 whitespace-pre-wrap break-words">
            {post.content}
          </div>

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <div className={`
              grid gap-2 mb-4 rounded-2xl overflow-hidden
              ${post.media.length === 1 ? 'grid-cols-1' : 
                post.media.length === 2 ? 'grid-cols-2' : 
                post.media.length === 3 ? 'grid-cols-2' :
                'grid-cols-2'}
            `}>
              {post.media.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`
                    relative bg-gray-100 overflow-hidden rounded-xl
                    ${post.media.length === 3 && index === 0 ? 'col-span-2' : ''}
                    ${post.media.length === 1 ? 'aspect-video max-h-96' : 'aspect-square'}
                  `}
                >
                  {item.type.startsWith('image/') ? (
                    <img
                      src={item.url}
                      alt=""
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : item.type.startsWith('video/') ? (
                    <video
                      src={item.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          )}

          {/* Engagement Stats */}
          <div className="flex items-center gap-6 py-4 border-y border-gray-200 text-sm">
            {post._count.likes > 0 && (
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900">{post._count.likes}</span>
                <span className="text-gray-500">{post._count.likes === 1 ? 'Like' : 'Likes'}</span>
              </div>
            )}
            {post._count.reposts > 0 && (
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900">{post._count.reposts}</span>
                <span className="text-gray-500">{post._count.reposts === 1 ? 'Repost' : 'Reposts'}</span>
              </div>
            )}
            {post._count.comments > 0 && (
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900">{post._count.comments}</span>
                <span className="text-gray-500">{post._count.comments === 1 ? 'Comment' : 'Comments'}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-around pt-4">
            <button 
              className="group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-50 transition-all duration-200"
            >
              <MessageIcon size={20} className="text-gray-500 group-hover:text-green-600 transition-colors" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">
                {post._count.comments > 0 ? post._count.comments : ''}
              </span>
            </button>
            
            <button 
              className="group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-green-50 transition-all duration-200"
            >
              <RepeatIcon size={20} className="text-gray-500 group-hover:text-green-600 transition-colors" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">
                {post._count.reposts > 0 ? post._count.reposts : ''}
              </span>
            </button>
            
            <button 
              className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isLiked ? 'bg-red-50' : 'hover:bg-red-50'
              }`}
            >
              <HeartIcon 
                size={20} 
                filled={isLiked}
                className={isLiked ? 'text-red-600' : 'text-gray-500 group-hover:text-red-600'}
              />
              <span className={`text-sm font-medium ${
                isLiked ? 'text-red-600' : 'text-gray-700 group-hover:text-red-600'
              }`}>
                {post._count.likes > 0 ? post._count.likes : ''}
              </span>
            </button>
            
            <button 
              className="group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
            >
              <ShareIcon size={20} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
            </button>
          </div>
        </div>

        {/* Reply Form */}
        {session && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add a comment</h3>
            <ReplyForm postId={post.id} userId={session.user.id} userImage={session.user.image} />
          </div>
        )}

        {/* Comments Section */}
        <div className="space-y-3">
          {post.comments.length > 0 ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Comments ({post.comments.length})
              </h2>
              {post.comments.map((comment, index) => (
                <div 
                  key={comment.id} 
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200 animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <Link href={`/u/${comment.author.username}`}>
                      <Avatar 
                        src={comment.author.image} 
                        alt={comment.author.name || comment.author.username} 
                        size="md"
                        className="ring-2 ring-gray-100 hover:ring-green-500 transition-all duration-200"
                      />
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Link 
                          href={`/u/${comment.author.username}`}
                          className="font-semibold text-gray-900 hover:text-green-600 transition-colors"
                        >
                          {comment.author.name || comment.author.username}
                        </Link>
                        {comment.author.verified && (
                          <VerifiedBadgeIcon size={16} className="text-green-600" />
                        )}
                        <span className="text-gray-500 text-sm">@{comment.author.username}</span>
                        <span className="text-gray-400 text-sm">·</span>
                        <span className="text-gray-500 text-sm">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <p className="text-gray-900 leading-relaxed whitespace-pre-wrap break-words">
                        {comment.content}
                      </p>
                      
                      {comment._count.likes > 0 && (
                        <div className="flex items-center gap-1 mt-3">
                          <HeartIcon size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-500">{comment._count.likes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <MessageIcon size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h3>
              <p className="text-gray-500">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReplyForm({ postId, userId, userImage }: { postId: string; userId?: string; userImage?: string | null }) {
  async function action(formData: FormData) {
    "use server";
    const content = String(formData.get("content") || "").trim();
    if (!content) return;
    
    await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/posts/${postId}/comments`, { 
      method: "POST", 
      headers: { 
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify({ content }) 
    });
    
    revalidatePath(`/post/${postId}`);
  }
  
  return (
    <form action={action} className="flex items-start gap-3">
      {userImage && (
        <Avatar src={userImage} alt="Your avatar" size="md" className="ring-2 ring-gray-100" />
      )}
      <div className="flex-1 flex gap-2">
        <input 
          name="content" 
          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium" 
          placeholder="Write a comment..." 
          required
          autoComplete="off"
        />
        <button 
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          Comment
        </button>
      </div>
    </form>
  );
}