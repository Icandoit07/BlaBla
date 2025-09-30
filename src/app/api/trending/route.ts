import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const top = await prisma.postHashtag.groupBy({ by: ["hashtagId"], _count: { hashtagId: true }, orderBy: { _count: { hashtagId: "desc" } }, take: 10 });
  const tags = await prisma.hashtag.findMany({ where: { id: { in: top.map(t => t.hashtagId) } } });
  const map = new Map(tags.map(t => [t.id, t.tag] as const));
  return NextResponse.json(top.map(t => ({ tag: map.get(t.hashtagId), count: t._count.hashtagId })));
}


