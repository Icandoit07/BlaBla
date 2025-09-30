import Link from "next/link";
import { LogoIcon } from "@/components/Logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(229 231 235) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center animate-fadeIn">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="animate-scaleIn">
                <LogoIcon size={96} />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-7xl font-bold mb-6 text-gray-900 tracking-tight">
              Conversations that
              <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                matter
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto font-light">
              Join millions sharing ideas, news, and moments that shape our world.
            </p>
            <p className="text-base text-gray-500 mb-12">
              Professional social networking built for India
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-slideInRight">
              <Link
                href="/register"
                className="w-full sm:w-auto group relative px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Create account
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/feed"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-200 text-lg"
              >
                Explore feed
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24">
              <div className="group">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 h-full">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Real-time Updates</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Stay connected with instant notifications and live feed updates
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 h-full">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Secure & Private</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Advanced security with encrypted authentication and data protection
                  </p>
                </div>
              </div>

              <div className="group">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 h-full">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Rich Conversations</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Share photos, videos, and engage in meaningful discussions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fadeIn">
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                1M+
              </div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: "100ms" }}>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                10M+
              </div>
              <div className="text-gray-400">Posts Shared</div>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: "200ms" }}>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                100+
              </div>
              <div className="text-gray-400">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
          Ready to join?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Create your account in seconds
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
        >
          Get started
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}