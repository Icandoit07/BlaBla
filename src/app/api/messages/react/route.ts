import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("messageId");
    const body = await request.json();
    const { emoji } = body;

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    if (!emoji || typeof emoji !== "string") {
      return NextResponse.json(
        { error: "Emoji is required" },
        { status: 400 }
      );
    }

    // Check if message exists
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: { id: true },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // Check if user already reacted
    const existingReaction = await prisma.messageReaction.findUnique({
      where: {
        messageId_userId: {
          messageId,
          userId,
        },
      },
    });

    if (existingReaction) {
      // Update existing reaction
      const reaction = await prisma.messageReaction.update({
        where: { id: existingReaction.id },
        data: { emoji },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      });
      return NextResponse.json(reaction);
    } else {
      // Create new reaction
      const reaction = await prisma.messageReaction.create({
        data: {
          messageId,
          userId,
          emoji,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      });
      return NextResponse.json(reaction);
    }
  } catch (error: any) {
    console.error("Error adding reaction:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add reaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    await prisma.messageReaction.deleteMany({
      where: {
        messageId,
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error removing reaction:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove reaction" },
      { status: 500 }
    );
  }
}