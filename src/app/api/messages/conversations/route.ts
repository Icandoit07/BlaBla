import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/session";

export async function GET() {
  try {
    const userId = await requireUserId();

    // Get all conversations where user is either user1 or user2
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            verified: true,
          },
        },
        user2: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            verified: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            content: true,
            read: true,
            createdAt: true,
            senderId: true,
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                receiverId: userId,
                read: false,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Transform conversations to include the other user and last message
    const transformedConversations = conversations.map((conv) => {
      const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;
      const lastMessage = conv.messages[0] || null;
      const unreadCount = conv._count.messages;

      return {
        id: conv.id,
        otherUser,
        lastMessage,
        unreadCount,
        updatedAt: conv.updatedAt,
      };
    });

    return NextResponse.json(transformedConversations);
  } catch (error: any) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
