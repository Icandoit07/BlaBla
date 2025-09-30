import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/session";

export async function GET() {
  let userId: string;
  try { userId = await requireUserId(); } catch { return NextResponse.json({ error: "unauthorized" }, { status: 401 }); }
  const items = await prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50, include: { fromUser: true, post: true } });
  return NextResponse.json(items);
}


