"use client";
import { useState, useRef } from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  type?: "image" | "avatar";
  currentImage?: string | null;
}

export function ImageUpload({ onUpload, type = "image", currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be less than 10MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await res.json();
      onUpload(data.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image");
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className={`${type === "avatar" ? "w-24 h-24 rounded-full" : "max-w-full max-h-64 rounded-lg"} object-cover`}
          />
          {!uploading && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 rounded-full bg-gray-900 px-3 py-1 text-sm text-white hover:bg-black"
            >
              Change
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-white">Uploading...</div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded border-2 border-dashed border-gray-300 px-6 py-4 hover:border-gray-400 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : `Upload ${type === "avatar" ? "Profile Picture" : "Image"}`}
        </button>
      )}
    </div>
  );
}
