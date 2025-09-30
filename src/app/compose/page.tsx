"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, LoaderIcon } from "@/components/icons";

export default function ComposePage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Auto-focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be less than 10MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      // Create post
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ? JSON.stringify(data.error) : "Failed to create post");
        setLoading(false);
        return;
      }

      const post = await res.json();

      // Upload image if present
      if (imageFile && post.id) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("type", "image");
        formData.append("postId", post.id);

        setUploadProgress(50);
        const uploadRes = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          console.error("Failed to upload image");
        }
        setUploadProgress(100);
      }

      // Success - redirect
      router.push("/feed");
      router.refresh();
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  const charCount = content.length;
  const maxChars = 280;
  const percentage = (charCount / maxChars) * 100;
  const isNearLimit = percentage > 80;
  const isOverLimit = percentage > 100;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Minimal Header */}
        <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Create post</h1>
            </div>

            {/* Post Button */}
            <button
              onClick={submit}
              disabled={loading || !content.trim() || isOverLimit}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-full transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LoaderIcon size={16} />
                  Posting...
                </span>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </div>

        {/* Compose Area */}
        <div className="p-4">
          <form onSubmit={submit}>
            {/* Author Avatar */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                U
              </div>

              <div className="flex-1 min-w-0">
                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-xl text-gray-900 placeholder:text-gray-400 resize-none outline-none border-none p-0 min-h-[120px]"
                  placeholder="What's happening?"
                  maxLength={maxChars}
                  style={{ overflow: 'hidden' }}
                />

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4 mb-4">
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 group">
                      <img 
                        src={imagePreview} 
                        alt="Upload preview" 
                        className="w-full h-auto max-h-96 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-gray-900/80 hover:bg-gray-900 text-white rounded-full transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-600 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Toolbar */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                  {/* Media Buttons */}
                  <div className="flex items-center gap-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-all"
                      title="Add image"
                    >
                      <ImageIcon size={20} />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-all"
                      title="Add GIF"
                      disabled
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-all"
                      title="Add poll"
                      disabled
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-all"
                      title="Add emoji"
                      disabled
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Character Counter */}
                  <div className="flex items-center gap-3">
                    {charCount > 0 && (
                      <div className="relative w-8 h-8">
                        <svg className="w-8 h-8 transform -rotate-90">
                          {/* Background circle */}
                          <circle
                            cx="16"
                            cy="16"
                            r="12"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            fill="none"
                            className="text-gray-200"
                          />
                          {/* Progress circle */}
                          <circle
                            cx="16"
                            cy="16"
                            r="12"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 12}`}
                            strokeDashoffset={`${2 * Math.PI * 12 * (1 - percentage / 100)}`}
                            className={`transition-all duration-200 ${
                              isOverLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-green-600'
                            }`}
                            strokeLinecap="round"
                          />
                        </svg>
                        {(isNearLimit || isOverLimit) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-[10px] font-bold tabular-nums ${
                              isOverLimit ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {maxChars - charCount}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}