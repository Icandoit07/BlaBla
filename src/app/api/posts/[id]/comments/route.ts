import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/session";
import { z } from "zod";

const schema = z.object({ content: z.string().min(1).max(280) });

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const postId = params.id;
  const comments = await prisma.comment.findMany({ where: { postId }, orderBy: { createdAt: "asc" }, include: { author: true } });
  return NextResponse.json(comments);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  let userId: string;
  try { userId = await requireUserId(); } catch { return NextResponse.json({ error: "unauthorized" }, { status: 401 }); }
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const created = await prisma.comment.create({ data: { postId: params.id, authorId: userId, content: parsed.data.content } });
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (post && post.authorId !== userId) {
    await prisma.notification.create({ data: { userId: post.authorId, fromUserId: userId, postId: post.id, type: "REPLY" } });
  }
  return NextResponse.json(created);
}


