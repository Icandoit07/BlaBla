import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/session";
import { z } from "zod";

const createSchema = z.object({ content: z.string().min(1).max(280), options: z.array(z.string().min(1).max(40)).min(2).max(4), endsAt: z.string() });

export async function POST(request: Request) {
  let userId: string;
  try { userId = await requireUserId(); } catch { return NextResponse.json({ error: "unauthorized" }, { status: 401 }); }
  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { content, options, endsAt } = parsed.data;
  const post = await prisma.post.create({ data: { authorId: userId, content } });
  const poll = await prisma.poll.create({ data: { postId: post.id, endsAt: new Date(endsAt) } });
  await prisma.pollOption.createMany({ data: options.map((text, idx) => ({ pollId: poll.id, text, idx })) });
  return NextResponse.json({ postId: post.id, pollId: poll.id });
}


