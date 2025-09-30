import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyOTP } from "@/lib/otp";
import { prisma } from "@/lib/db";

const schema = z.object({
  contact: z.string().min(1),
  otp: z.string().length(6),
  type: z.enum(["EMAIL", "PHONE"]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { contact, otp, type } = parsed.data;

    // Verify OTP
    const isValid = await verifyOTP(contact, otp, type);
    
    if (!isValid) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = type === "EMAIL"
      ? await prisma.user.findUnique({ where: { email: contact } })
      : await prisma.user.findUnique({ where: { phone: contact } });

    if (existingUser) {
      // User exists - mark as verified and return user data
      if (type === "EMAIL") {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { emailVerified: new Date() },
        });
      } else {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { phoneVerified: new Date() },
        });
      }

      return NextResponse.json({
        success: true,
        isNewUser: false,
        userId: existingUser.id,
        username: existingUser.username,
        onboardingComplete: existingUser.onboardingComplete,
      });
    }

    // New user - create account
    const newUser = await prisma.user.create({
      data: type === "EMAIL"
        ? { email: contact, emailVerified: new Date() }
        : { phone: contact, phoneVerified: new Date() },
    });

    return NextResponse.json({
      success: true,
      isNewUser: true,
      userId: newUser.id,
      onboardingComplete: false,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
