import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/session";
import { getPresignedUploadUrl } from "@/lib/s3";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["image", "video", "gif", "avatar"]),
  mimeType: z.string(),
});

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { type, mimeType } = parsed.data;

    // Validate MIME type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/quicktime"];
    if (!validTypes.includes(mimeType)) {
      return NextResponse.json({ error: "Invalid MIME type" }, { status: 400 });
    }

    const result = await getPresignedUploadUrl(userId, type, mimeType);

    return NextResponse.json({
      uploadUrl: result.url,
      key: result.key,
      publicUrl: `${process.env.AWS_S3_PUBLIC_URL}/${result.key}`,
    });
  } catch (error) {
    console.error("Presigned URL error:", error);
    if (error instanceof Error && error.message === "unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}
