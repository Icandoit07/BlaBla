import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/session";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const postId = params.id;
  let userId: string;
  try { userId = await requireUserId(); } catch { return NextResponse.json({ error: "unauthorized" }, { status: 401 }); }
  await prisma.bookmark.upsert({ where: { userId_postId: { userId, postId } }, create: { userId, postId }, update: {} });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const postId = params.id;
  let userId: string;
  try { userId = await requireUserId(); } catch { return NextResponse.json({ error: "unauthorized" }, { status: 401 }); }
  await prisma.bookmark.delete({ where: { userId_postId: { userId, postId } } });
  return NextResponse.json({ ok: true });
}


