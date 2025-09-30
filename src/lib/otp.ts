import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Initialize AWS SNS client
const snsClient = new SNSClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

// Initialize Nodemailer transporter
let emailTransporter: nodemailer.Transporter | null = null;

function getEmailTransporter() {
  if (!emailTransporter && process.env.SMTP_HOST) {
    emailTransporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return emailTransporter;
}

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create OTP verification record
export async function createOTPVerification(contact: string, type: "EMAIL" | "PHONE"): Promise<string> {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.otpVerification.create({
    data: { contact, otp, type, expiresAt },
  });

  return otp;
}

// Verify OTP
export async function verifyOTP(contact: string, otp: string, type: "EMAIL" | "PHONE"): Promise<boolean> {
  const record = await prisma.otpVerification.findFirst({
    where: {
      contact,
      otp,
      type,
      verified: false,
      expiresAt: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return false;

  await prisma.otpVerification.update({
    where: { id: record.id },
    data: { verified: true },
  });

  return true;
}

// Send OTP via email
export async function sendEmailOTP(email: string, otp: string): Promise<void> {
  console.log(`[OTP] Sending email to ${email}: ${otp}`);
  
  const transporter = getEmailTransporter();
  
  if (!transporter) {
    console.warn("[OTP] Email not configured, OTP logged to console only");
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@blabla.com",
      to: email,
      subject: "Your blabla verification code",
      text: `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your blabla Verification Code</h2>
          <p>Enter this code to continue:</p>
          <h1 style="color: #1a1a1a; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
          <p style="color: #666;">This code will expire in 10 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    });
    console.log(`[OTP] Email sent successfully to ${email}`);
  } catch (error) {
    console.error(`[OTP] Failed to send email to ${email}:`, error);
    throw new Error("Failed to send verification email");
  }
}

// Send OTP via SMS using AWS SNS
export async function sendPhoneOTP(phone: string, otp: string): Promise<void> {
  console.log(`[OTP] Sending SMS to ${phone}: ${otp}`);
  
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.warn("[OTP] AWS SNS not configured, OTP logged to console only");
    return;
  }

  try {
    const command = new PublishCommand({
      PhoneNumber: phone,
      Message: `Your blabla verification code is: ${otp}\n\nThis code will expire in 10 minutes.`,
      MessageAttributes: {
        "AWS.SNS.SMS.SenderID": {
          DataType: "String",
          StringValue: process.env.AWS_SNS_SENDER_ID || "blabla",
        },
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional",
        },
      },
    });

    const response = await snsClient.send(command);
    console.log(`[OTP] SMS sent successfully to ${phone}, MessageId: ${response.MessageId}`);
  } catch (error) {
    console.error(`[OTP] Failed to send SMS to ${phone}:`, error);
    throw new Error("Failed to send verification SMS");
  }
}
