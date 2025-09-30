import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username || username.length < 3) {
    return NextResponse.json({ available: false, error: "Username too short" });
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return NextResponse.json({ available: false, error: "Invalid characters" });
  }

  const existing = await prisma.user.findUnique({ where: { username } });

  return NextResponse.json({ available: !existing });
}
