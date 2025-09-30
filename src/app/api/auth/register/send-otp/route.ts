import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createOTPVerification, sendEmailOTP, sendPhoneOTP } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const { contact, type } = await request.json();

    if (!contact || !type) {
      return NextResponse.json({ error: "Contact and type are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: type === "EMAIL" ? { email: contact } : { phone: contact },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Account already exists with this contact" }, { status: 400 });
    }

    // Create and send OTP
    const otp = await createOTPVerification(contact, type);

    if (type === "EMAIL") {
      await sendEmailOTP(contact, otp);
    } else {
      await sendPhoneOTP(contact, otp);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
