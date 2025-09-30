"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { CameraIcon, LoaderIcon } from "@/components/icons";

export default function ProfileSettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
  });

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    // Load current profile data
    async function loadProfile() {
      try {
        const res = await fetch(`/api/users/${session.user.id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || "",
            bio: data.bio || "",
            location: data.location || "",
            website: data.website || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile");
      }
    }

    loadProfile();
  }, [session, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update profile");
        setLoading(false);
        return;
      }

      await update(); // Refresh session
      setSuccess(true);
      setTimeout(() => router.push(`/u/${session?.user?.username}`), 1500);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-gray-600">Update your personal information</p>
        </div>

        {/* Profile Edit Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-48 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600">
            <button className="absolute bottom-4 right-4 p-3 bg-gray-900/80 hover:bg-gray-900 text-white rounded-full transition-all">
              <CameraIcon size={20} />
            </button>
          </div>

          {/* Avatar */}
          <div className="px-6 pb-6">
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center">
                <span className="text-5xl font-bold text-white">
                  {formData.name?.charAt(0).toUpperCase() || session.user.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 p-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full transition-all shadow-md">
                <CameraIcon size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Bio</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400"
                  placeholder="Tell us about yourself"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  maxLength={160}
                />
                <p className="mt-2 text-sm text-gray-500 text-right">{formData.bio.length}/160</p>
              </div>

              <Input
                label="Location"
                type="text"
                placeholder="City, Country"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />

              <Input
                label="Website"
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Profile updated successfully! Redirecting...</span>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <LoaderIcon size={18} />
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
