import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (!q) return NextResponse.json({ users: [], posts: [] });
  const [users, posts] = await Promise.all([
    prisma.user.findMany({ where: { OR: [{ username: { contains: q, mode: "insensitive" } }, { name: { contains: q, mode: "insensitive" } }] }, take: 10 }),
    prisma.post.findMany({ where: { content: { contains: q, mode: "insensitive" } }, take: 20, orderBy: { createdAt: "desc" }, include: { author: true } }),
  ]);
  return NextResponse.json({ users, posts });
}


