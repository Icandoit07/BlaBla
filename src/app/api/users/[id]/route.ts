import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        location: true,
        website: true,
        verified: true,
        image: true,
        coverImage: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            following: true,
            followers: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId(request);
  const { id } = await params;

  // Users can only edit their own profile
  if (userId !== id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, bio, location, website } = body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        bio,
        location,
        website,
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        location: true,
        website: true,
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
