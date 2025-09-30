import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  if (!q) {
    return NextResponse.json({ users: [], posts: [], hashtags: [] });
  }

  // Check if searching for hashtag
  const isHashtagSearch = q.startsWith("#");
  const hashtagQuery = isHashtagSearch ? q : `#${q}`;

  const [users, posts, hashtags] = await Promise.all([
    // Search users
    prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        verified: true,
        bio: true,
        followers: currentUserId
          ? {
              where: { followerId: currentUserId },
              select: { id: true },
            }
          : false,
      },
      take: 10,
    }),
    
    // Search posts
    prisma.post.findMany({
      where: {
        content: { contains: q, mode: "insensitive" },
      },
      take: 20,
      orderBy: { createdAt: "desc" },
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
        likes: currentUserId
          ? { where: { userId: currentUserId }, select: { id: true } }
          : false,
        bookmarks: currentUserId
          ? { where: { userId: currentUserId }, select: { id: true } }
          : false,
        reposts: currentUserId
          ? { where: { userId: currentUserId }, select: { id: true } }
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
    }),
    
    // Search hashtags
    prisma.hashtag.findMany({
      where: {
        tag: {
          contains: q.startsWith("#") ? q : `#${q}`,
          mode: "insensitive",
        },
      },
      select: {
        tag: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
      take: 10,
    }),
  ]);

  // Transform hashtags for response
  const hashtagResults = hashtags.map((h) => ({
    tag: h.tag,
    count: h._count.posts,
  }));

  return NextResponse.json({
    users,
    posts,
    hashtags: hashtagResults,
  });
}


