import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const body = await request.json();
    const { receiverId, content, mediaUrl, mediaType } = body;

    // Either content or media must be provided
    if (!receiverId || (!content?.trim() && !mediaUrl)) {
      return NextResponse.json(
        { error: "Receiver ID and message content or media are required" },
        { status: 400 }
      );
    }

    if (receiverId === userId) {
      return NextResponse.json(
        { error: "Cannot send message to yourself" },
        { status: 400 }
      );
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    // Find or create conversation
    // Ensure user1Id is always the smaller ID to maintain uniqueness
    const [smallerId, largerId] = [userId, receiverId].sort();

    let conversation = await prisma.conversation.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id: smallerId,
          user2Id: largerId,
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user1Id: smallerId,
          user2Id: largerId,
        },
      });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userId,
        receiverId,
        content: content?.trim() || null,
        mediaUrl: mediaUrl || null,
        mediaType: mediaType || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            verified: true,
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message);
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}
