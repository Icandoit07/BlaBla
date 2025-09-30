"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/components/Logo";
import { Button } from "@/components/Button";
import Link from "next/link";

type Step = "contact" | "otp" | "reset";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("contact");
  const [contactType, setContactType] = useState<"EMAIL" | "PHONE">("EMAIL");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Step 1: Send OTP
  async function sendOTP(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, type: contactType }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        setLoading(false);
        return;
      }

      setStep("otp");
      setLoading(false);
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  }

  // Step 2: Verify OTP
  async function verifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, otp, type: contactType }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid OTP");
        setLoading(false);
        return;
      }

      setStep("reset");
      setLoading(false);
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  }

  // Step 3: Reset Password
  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          type: contactType,
          otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Password reset failed");
        setLoading(false);
        return;
      }

      // Redirect to login
      router.push("/login?reset=true");
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
            {step === "contact" && "Forgot Password?"}
            {step === "otp" && "Verify OTP"}
            {step === "reset" && "Reset Password"}
          </h1>
          <p className="text-gray-600">
            {step === "contact" && "Enter your contact to receive OTP"}
            {step === "otp" && `Enter the code sent to ${contact}`}
            {step === "reset" && "Choose a new password"}
          </p>
        </div>

        {/* Progress Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-2 h-2 rounded-full ${step === "contact" ? "bg-green-500" : "bg-green-300"}`}></div>
          <div className={`w-2 h-2 rounded-full ${step === "otp" ? "bg-green-500" : step === "reset" ? "bg-green-300" : "bg-gray-300"}`}></div>
          <div className={`w-2 h-2 rounded-full ${step === "reset" ? "bg-green-500" : "bg-gray-300"}`}></div>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* STEP 1: Contact */}
          {step === "contact" && (
            <form onSubmit={sendOTP} className="space-y-5">
              {/* Contact Type Toggle */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setContactType("EMAIL")}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    contactType === "EMAIL"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  📧 Email
                </button>
                <button
                  type="button"
                  onClick={() => setContactType("PHONE")}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    contactType === "PHONE"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  📱 Phone
                </button>
              </div>

              {/* Input Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {contactType === "EMAIL" ? "Email Address" : "Phone Number"}
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                  placeholder={contactType === "EMAIL" ? "you@example.com" : "+91 1234567890"}
                  type={contactType === "EMAIL" ? "email" : "tel"}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send OTP →"}
              </Button>

              <div className="text-center">
                <Link href="/login" className="text-sm text-gray-600 hover:text-green-600">
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === "otp" && (
            <form onSubmit={verifyOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Enter 6-digit code
                </label>
                <input
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-center text-3xl tracking-[0.5em] font-semibold"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                  autoFocus
                />
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
                disabled={loading || otp.length !== 6}
                className="w-full"
              >
                {loading ? "Verifying..." : "Verify OTP →"}
              </Button>

              <div className="flex flex-col gap-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep("contact");
                    setOtp("");
                    setError(null);
                  }}
                  className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                  ← Change contact
                </button>
                <button
                  type="button"
                  onClick={() => sendOTP(new Event("submit") as any)}
                  className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Reset Password */}
          {step === "reset" && (
            <form onSubmit={resetPassword} className="space-y-5">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="mt-1 text-xs text-gray-500">At least 8 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
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
                disabled={loading || newPassword.length < 8 || newPassword !== confirmPassword}
                className="w-full"
              >
                {loading ? "Resetting..." : "Reset Password →"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
