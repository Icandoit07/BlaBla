import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  try {
    // Get users that the current user is NOT following
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: session?.user?.id || "" } }, // Not the current user
          { onboardingComplete: true }, // Only show completed profiles
          session?.user?.id ? {
            followers: {
              none: {
                followerId: session.user.id
              }
            }
          } : {}
        ]
      },
      select: {
        id: true,
        name: true,
        username: true,
        verified: true,
        bio: true,
        _count: {
          select: {
            followers: true,
          }
        }
      },
      orderBy: {
        followers: {
          _count: 'desc'
        }
      },
      take: 5,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch user suggestions:", error);
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}
