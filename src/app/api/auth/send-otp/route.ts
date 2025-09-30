import { NextResponse } from "next/server";
import { z } from "zod";
import { createOTPVerification, sendEmailOTP, sendPhoneOTP } from "@/lib/otp";

const schema = z.object({
  contact: z.string().min(1),
  type: z.enum(["EMAIL", "PHONE"]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { contact, type } = parsed.data;

    // Validate format
    if (type === "EMAIL" && !contact.includes("@")) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (type === "PHONE" && !/^\+?\d{10,15}$/.test(contact)) {
      return NextResponse.json({ error: "Invalid phone format" }, { status: 400 });
    }

    // Create OTP
    const otp = await createOTPVerification(contact, type);

    // Send OTP
    if (type === "EMAIL") {
      await sendEmailOTP(contact, otp);
    } else {
      await sendPhoneOTP(contact, otp);
    }

    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
