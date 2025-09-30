import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/session";
import { z } from "zod";

const schema = z.object({ optionIdx: z.number().int().min(0).max(3) });

export async function POST(request: Request, { params }: { params: { id: string } }) {
  let userId: string;
  try { userId = await requireUserId(); } catch { return NextResponse.json({ error: "unauthorized" }, { status: 401 }); }
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const poll = await prisma.poll.findUnique({ where: { id: params.id }, include: { options: true } });
  if (!poll) return NextResponse.json({ error: "not-found" }, { status: 404 });
  const option = poll.options.find(o => o.idx === parsed.data.optionIdx);
  if (!option) return NextResponse.json({ error: "bad-option" }, { status: 400 });
  await prisma.vote.upsert({ where: { userId_pollOptionId: { userId, pollOptionId: option.id } }, create: { userId, pollOptionId: option.id }, update: {} });
  return NextResponse.json({ ok: true });
}


