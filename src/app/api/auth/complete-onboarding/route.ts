import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  userId: z.string(),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/),
  name: z.string().min(1).max(80),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { userId, username, name } = parsed.data;

    // Check if username is available
    const existing = await prisma.user.findUnique({ where: { username } });
    
    if (existing && existing.id !== userId) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        name,
        onboardingComplete: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Complete onboarding error:", error);
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 });
  }
}
