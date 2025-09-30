import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(6).max(128),
  name: z.string().min(1).max(80),
});

export async function POST(request: Request) {
  const data = await request.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { username, password, name } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) return NextResponse.json({ error: "Username taken" }, { status: 409 });
  const passwordHash = await hash(password, 12);
  const user = await prisma.user.create({ data: { username, passwordHash, name } });
  return NextResponse.json({ id: user.id, username: user.username, name: user.name });
}


