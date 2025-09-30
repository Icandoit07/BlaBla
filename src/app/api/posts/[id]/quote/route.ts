import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/session";
import { z } from "zod";

const schema = z.object({ content: z.string().min(1).max(280) });

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const quotePostId = params.id;
  let userId: string;
  try { userId = await requireUserId(); } catch { return NextResponse.json({ error: "unauthorized" }, { status: 401 }); }
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const post = await prisma.post.create({ data: { authorId: userId, content: parsed.data.content, quotePostId } });
  return NextResponse.json(post);
}


