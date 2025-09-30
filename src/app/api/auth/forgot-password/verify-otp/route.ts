import { NextResponse } from "next/server";
import { verifyOTP } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const { contact, otp, type } = await request.json();

    if (!contact || !otp || !type) {
      return NextResponse.json({ error: "Contact, OTP, and type are required" }, { status: 400 });
    }

    const isValid = await verifyOTP(contact, otp, type);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
