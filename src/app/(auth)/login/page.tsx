"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogoIcon } from "@/components/Logo";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { UserIcon, LockIcon, CheckCircleIcon } from "@/components/icons";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const reset = searchParams.get("reset");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }

      if (result?.ok) {
        router.push("/feed");
        router.refresh();
      }
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fadeIn">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6 animate-scaleIn">
            <LogoIcon size={72} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600">Login to continue to BlaBla</p>
        </div>

        {/* Success Messages */}
        {registered && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-slideInRight">
            <CheckCircleIcon className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-green-900 font-medium">Account created successfully!</p>
              <p className="text-green-700 text-sm">Please login with your credentials.</p>
            </div>
          </div>
        )}
        {reset && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-slideInRight">
            <CheckCircleIcon className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-green-900 font-medium">Password reset successfully!</p>
              <p className="text-green-700 text-sm">You can now login with your new password.</p>
            </div>
          </div>
        )}

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              icon={<UserIcon size={20} />}
              required
              autoFocus
              autoComplete="username"
            />

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-900">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<LockIcon size={20} />}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading || !username || !password}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : "Login"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-green-600 font-medium hover:text-green-700 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By continuing, you agree to BlaBla's{" "}
          <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}