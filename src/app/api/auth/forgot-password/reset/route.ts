import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import { verifyOTP } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const { contact, type, otp, newPassword } = await request.json();

    if (!contact || !type || !otp || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Verify OTP again for security
    const isValid = await verifyOTP(contact, otp, type);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: type === "EMAIL" ? { email: contact } : { phone: contact },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash new password
    const passwordHash = await hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
