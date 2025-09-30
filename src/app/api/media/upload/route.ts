import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/session";
import { uploadMedia } from "@/lib/s3";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const formData = await request.formData();
    
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "image";
    const postId = formData.get("postId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/quicktime"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (10MB for images, 50MB for videos)
    const maxSize = file.type.startsWith("video/") ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine media type
    let mediaType: "image" | "video" | "gif" | "avatar" = "image";
    if (type === "avatar") {
      mediaType = "avatar";
    } else if (file.type === "image/gif") {
      mediaType = "gif";
    } else if (file.type.startsWith("video/")) {
      mediaType = "video";
    }

    // Upload to S3
    const result = await uploadMedia({
      userId,
      type: mediaType,
      buffer,
      mimeType: file.type,
    });

    // If avatar, update user profile
    if (type === "avatar") {
      await prisma.user.update({
        where: { id: userId },
        data: { image: result.url },
      });
    }

    // If attached to post, create media record
    if (postId) {
      await prisma.media.create({
        data: {
          postId,
          url: result.url,
          type: mediaType === "video" ? "VIDEO" : mediaType === "gif" ? "GIF" : "IMAGE",
          width: result.width,
          height: result.height,
        },
      });
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Media upload error:", error);
    if (error instanceof Error && error.message === "unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
