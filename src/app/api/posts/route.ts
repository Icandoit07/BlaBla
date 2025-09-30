import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { requireUserId } from "@/lib/session";

const createSchema = z.object({ content: z.string().min(1).max(280), replyToId: z.string().optional(), quotePostId: z.string().optional() });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") ?? undefined;
  const take = Math.min(Number(searchParams.get("take") ?? 20), 50);
  const posts = await prisma.post.findMany({
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
    include: { author: true, _count: { select: { likes: true, comments: true } } },
  });
  const nextCursor = posts.length > take ? posts.pop()!.id : undefined;
  return NextResponse.json({ items: posts, nextCursor });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { content, replyToId, quotePostId } = parsed.data;
  const post = await prisma.post.create({ data: { authorId: userId, content, replyToId, quotePostId } });
  const tags = Array.from(new Set(content.match(/#[\p{Letter}\p{Number}_]+/gu)?.map(t => t.slice(1).toLowerCase()) ?? []));
  if (tags.length) {
    for (const tag of tags) {
      const ht = await prisma.hashtag.upsert({ where: { tag }, update: {}, create: { tag } });
      await prisma.postHashtag.upsert({ where: { postId_hashtagId: { postId: post.id, hashtagId: ht.id } }, update: {}, create: { postId: post.id, hashtagId: ht.id } });
    }
  }
  return NextResponse.json(post);
}


