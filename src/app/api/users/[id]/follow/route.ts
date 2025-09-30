import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/session";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const followeeId = params.id;
  let followerId: string;
  try { followerId = await requireUserId(); } catch { return NextResponse.json({ error: "unauthorized" }, { status: 401 }); }
  if (followeeId === followerId) return NextResponse.json({ error: "self" }, { status: 400 });
  await prisma.follow.upsert({
    where: { followerId_followeeId: { followerId, followeeId } },
    create: { followerId, followeeId },
    update: {},
  });
  if (followeeId !== followerId) {
    await prisma.notification.create({ data: { userId: followeeId, fromUserId: followerId, type: "FOLLOW" } });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const followeeId = params.id;
  let followerId: string;
  try { followerId = await requireUserId(); } catch { return NextResponse.json({ error: "unauthorized" }, { status: 401 }); }
  await prisma.follow.delete({ where: { followerId_followeeId: { followerId, followeeId } } });
  return NextResponse.json({ ok: true });
}


