"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/components/Logo";
import { Button } from "@/components/Button";

export default function OnboardingPage() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = sessionStorage.getItem("authUserId");
    if (!userId) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      setUsernameAvailable(data.available);
      setCheckingUsername(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  async function completeOnboarding(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const userId = sessionStorage.getItem("authUserId");

    if (!userId) {
      setError("Session expired");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, username, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to complete setup");
        setLoading(false);
        return;
      }

      sessionStorage.removeItem("authUserId");
      sessionStorage.removeItem("authContact");
      sessionStorage.removeItem("authType");

      router.push("/feed");
      router.refresh();
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <LogoIcon size={64} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-2">
            Almost There!
          </h1>
          <p className="text-gray-600">
            Choose your unique username to get started
          </p>
        </div>

        {/* Onboarding Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={completeOnboarding} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                minLength={1}
                maxLength={80}
              />
            </div>

            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-4 top-3.5 text-gray-500 font-medium">@</div>
                <input
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                  placeholder="yourname"
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase())}
                  required
                  pattern="[a-zA-Z0-9_]{3,32}"
                  minLength={3}
                  maxLength={32}
                />
              </div>
              
              {/* Username Status */}
              <div className="mt-2 min-h-[24px]">
                {checkingUsername && (
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Checking availability...
                  </p>
                )}
                {usernameAvailable === true && (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    ✅ Username available
                  </p>
                )}
                {usernameAvailable === false && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    ❌ Username already taken
                  </p>
                )}
                {!checkingUsername && username.length > 0 && username.length < 3 && (
                  <p className="text-sm text-gray-500">
                    Username must be at least 3 characters
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading || !usernameAvailable || username.length < 3 || name.length < 1}
              className="w-full"
            >
              {loading ? "Setting up..." : "Complete Setup →"}
            </Button>

            <p className="text-sm text-gray-500 text-center">
              You can change these details later in settings
            </p>
          </form>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-300"></div>
        </div>
      </div>
    </div>
  );
}