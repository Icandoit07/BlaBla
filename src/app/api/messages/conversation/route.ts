import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const currentUserId = await requireUserId();
    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get("userId");

    if (!otherUserId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find conversation between the two users
    const [smallerId, largerId] = [currentUserId, otherUserId].sort();

    const conversation = await prisma.conversation.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id: smallerId,
          user2Id: largerId,
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
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
        },
      },
    });

    if (!conversation) {
      return NextResponse.json([]);
    }

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId: conversation.id,
        receiverId: currentUserId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json(conversation.messages);
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch messages" },
      { status: 500 }
    );
  }
}