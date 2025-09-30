"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/components/Logo";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { MailIcon, PhoneIcon, UserIcon, LockIcon, CheckCircleIcon, AlertCircleIcon } from "@/components/icons";
import Link from "next/link";

type Step = "contact" | "otp" | "credentials";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("contact");
  const [contactType, setContactType] = useState<"EMAIL" | "PHONE">("EMAIL");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const router = useRouter();

  // Check username availability
  useEffect(() => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        const res = await fetch(`/api/auth/check-username?username=${username}`);
        const data = await res.json();
        setUsernameAvailable(data.available);
      } catch {
        setUsernameAvailable(null);
      }
      setCheckingUsername(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  // Step handlers
  async function sendOTP(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, type: contactType }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send verification code");
        setLoading(false);
        return;
      }

      setStep("otp");
      setLoading(false);
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  async function verifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, otp, type: contactType }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid verification code");
        setLoading(false);
        return;
      }

      setStep("credentials");
      setLoading(false);
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  async function completeRegistration(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!usernameAvailable) {
      setError("Username is not available");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, type: contactType, username, name, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      router.push("/login?registered=true");
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <LogoIcon size={64} />
          <h1 className="text-4xl font-bold text-white mt-8 mb-4">
            Join the conversation
          </h1>
          <p className="text-green-100 text-lg leading-relaxed">
            Connect with people, share your thoughts, and stay updated with what matters to you.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <CheckCircleIcon size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Secure Authentication</h3>
              <p className="text-green-100 text-sm">Email or phone verification with OTP</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <CheckCircleIcon size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Privacy First</h3>
              <p className="text-green-100 text-sm">Your data is encrypted and protected</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <CheckCircleIcon size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Join Millions</h3>
              <p className="text-green-100 text-sm">Be part of a growing community</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <LogoIcon size={56} />
          </div>

          {/* Progress Indicator - Minimal */}
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${step === "contact" ? "bg-green-600" : "bg-gray-200"}`} />
              <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${step === "otp" ? "bg-green-600" : "bg-gray-200"}`} />
              <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${step === "credentials" ? "bg-green-600" : "bg-gray-200"}`} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-medium text-gray-500">
                Step {step === "contact" ? "1" : step === "otp" ? "2" : "3"} of 3
              </span>
              <span className="text-xs font-medium text-gray-900">
                {step === "contact" ? "Verify Contact" : step === "otp" ? "Enter Code" : "Create Profile"}
              </span>
            </div>
          </div>

          {/* Step 1: Contact */}
          {step === "contact" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Get started</h2>
              <p className="text-gray-600 mb-8">Choose how you'd like to sign up</p>

              <form onSubmit={sendOTP} className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setContactType("EMAIL")}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      contactType === "EMAIL"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <MailIcon size={24} className={contactType === "EMAIL" ? "text-green-600 mx-auto mb-2" : "text-gray-400 mx-auto mb-2"} />
                    <span className={`text-sm font-semibold ${contactType === "EMAIL" ? "text-green-600" : "text-gray-700"}`}>
                      Email
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactType("PHONE")}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      contactType === "PHONE"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <PhoneIcon size={24} className={contactType === "PHONE" ? "text-green-600 mx-auto mb-2" : "text-gray-400 mx-auto mb-2"} />
                    <span className={`text-sm font-semibold ${contactType === "PHONE" ? "text-green-600" : "text-gray-700"}`}>
                      Phone
                    </span>
                  </button>
                </div>

                <Input
                  type={contactType === "EMAIL" ? "email" : "tel"}
                  placeholder={contactType === "EMAIL" ? "you@example.com" : "+91 98765 43210"}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  icon={contactType === "EMAIL" ? <MailIcon size={20} /> : <PhoneIcon size={20} />}
                  required
                  autoFocus
                />

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                    <AlertCircleIcon size={20} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
                  {loading ? "Sending..." : "Continue"}
                </Button>
              </form>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your {contactType.toLowerCase()}</h2>
              <p className="text-gray-600 mb-8">
                We sent a code to <span className="font-semibold text-gray-900">{contact}</span>
              </p>

              <form onSubmit={verifyOTP} className="space-y-6">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    className="text-center text-3xl tracking-[0.5em] font-bold"
                    required
                    autoFocus
                  />
                  <p className="text-sm text-gray-500 text-center">Enter the 6-digit code</p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                    <AlertCircleIcon size={20} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg" disabled={loading || otp.length !== 6} className="w-full">
                  {loading ? "Verifying..." : "Verify"}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep("contact")}
                  className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Change contact info
                </button>
              </form>
            </div>
          )}

          {/* Step 3: Credentials */}
          {step === "credentials" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your profile</h2>
              <p className="text-gray-600 mb-8">Choose a username and set a password</p>

              <form onSubmit={completeRegistration} className="space-y-5">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />

                <div className="relative">
                  <Input
                    label="Username"
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    icon={<UserIcon size={20} />}
                    error={username.length >= 3 && usernameAvailable === false ? "Username taken" : undefined}
                    required
                  />
                  {checkingUsername && (
                    <div className="absolute right-4 top-11 text-sm text-gray-500">Checking...</div>
                  )}
                  {username.length >= 3 && !checkingUsername && usernameAvailable !== null && (
                    <div className="absolute right-4 top-11">
                      {usernameAvailable ? (
                        <CheckCircleIcon size={20} className="text-green-600" />
                      ) : (
                        <AlertCircleIcon size={20} className="text-red-600" />
                      )}
                    </div>
                  )}
                </div>

                <Input
                  label="Password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<LockIcon size={20} />}
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<LockIcon size={20} />}
                  error={confirmPassword && password !== confirmPassword ? "Passwords don't match" : undefined}
                  required
                />

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                    <AlertCircleIcon size={20} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading || !name || !username || !password || !confirmPassword || password !== confirmPassword || password.length < 8 || usernameAvailable === false}
                  className="w-full"
                >
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            By signing up, you agree to our{" "}
            <a href="#" className="hover:text-gray-700 transition-colors underline">Terms</a>
            {" "}and{" "}
            <a href="#" className="hover:text-gray-700 transition-colors underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}