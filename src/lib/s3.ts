import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";
import { randomUUID } from "crypto";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || "us-east-1",
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

const BUCKET = process.env.AWS_S3_BUCKET || "blabla-media";
const PUBLIC_URL = process.env.AWS_S3_PUBLIC_URL || `https://${BUCKET}.s3.amazonaws.com`;

export interface UploadOptions {
  userId: string;
  type: "image" | "video" | "gif" | "avatar";
  buffer: Buffer;
  mimeType: string;
}

export interface UploadResult {
  url: string;
  key: string;
  width?: number;
  height?: number;
}

/**
 * Upload media to S3 with optimization
 */
export async function uploadMedia(options: UploadOptions): Promise<UploadResult> {
  const { userId, type, buffer, mimeType } = options;
  
  let processedBuffer = buffer;
  let width: number | undefined;
  let height: number | undefined;

  // Process images with sharp
  if (type === "image" || type === "avatar") {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    
    width = metadata.width;
    height = metadata.height;

    // Resize images if too large
    const maxWidth = type === "avatar" ? 400 : 2048;
    const maxHeight = type === "avatar" ? 400 : 2048;

    if ((width && width > maxWidth) || (height && height > maxHeight)) {
      processedBuffer = await image
        .resize(maxWidth, maxHeight, {
          fit: type === "avatar" ? "cover" : "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      const newMetadata = await sharp(processedBuffer).metadata();
      width = newMetadata.width;
      height = newMetadata.height;
    }
  }

  // Generate unique key
  const extension = mimeType.split("/")[1] || "jpg";
  const key = `${type}s/${userId}/${randomUUID()}.${extension}`;

  // Upload to S3
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.warn("[S3] AWS credentials not configured, skipping upload");
    // Return a placeholder URL for development
    return {
      url: `/uploads/${key}`,
      key,
      width,
      height,
    };
  }

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: processedBuffer,
      ContentType: mimeType,
      CacheControl: "max-age=31536000", // 1 year
      Metadata: {
        userId,
        uploadedAt: new Date().toISOString(),
      },
    });

    await s3Client.send(command);

    return {
      url: `${PUBLIC_URL}/${key}`,
      key,
      width,
      height,
    };
  } catch (error) {
    console.error("[S3] Upload failed:", error);
    throw new Error("Failed to upload media");
  }
}

/**
 * Delete media from S3
 */
export async function deleteMedia(key: string): Promise<void> {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.warn("[S3] AWS credentials not configured, skipping deletion");
    return;
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    await s3Client.send(command);
    console.log(`[S3] Deleted: ${key}`);
  } catch (error) {
    console.error(`[S3] Failed to delete ${key}:`, error);
    throw new Error("Failed to delete media");
  }
}

/**
 * Generate a presigned URL for direct upload from client
 */
export async function getPresignedUploadUrl(
  userId: string,
  type: "image" | "video" | "gif" | "avatar",
  mimeType: string
): Promise<{ url: string; key: string }> {
  const extension = mimeType.split("/")[1] || "jpg";
  const key = `${type}s/${userId}/${randomUUID()}.${extension}`;

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.warn("[S3] AWS credentials not configured");
    return {
      url: `/uploads/${key}`,
      key,
    };
  }

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: mimeType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour

    return { url, key };
  } catch (error) {
    console.error("[S3] Failed to generate presigned URL:", error);
    throw new Error("Failed to generate upload URL");
  }
}
