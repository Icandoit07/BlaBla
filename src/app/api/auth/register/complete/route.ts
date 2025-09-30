import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { contact, type, username, password, name } = await request.json();

    if (!contact || !type || !username || !password || !name) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Validate username
    if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ error: "Invalid username format" }, { status: 400 });
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        name,
        passwordHash,
        email: type === "EMAIL" ? contact : null,
        phone: type === "PHONE" ? contact : null,
        emailVerified: type === "EMAIL" ? new Date() : null,
        phoneVerified: type === "PHONE" ? new Date() : null,
        onboardingComplete: true,
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error("Complete registration error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
