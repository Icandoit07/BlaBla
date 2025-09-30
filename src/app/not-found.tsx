import Link from "next/link";
import { Button } from "@/components/Button";
import { HomeIcon, SearchIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-fadeIn">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-black bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
            404
          </div>
          <div className="mt-4 text-gray-400">
            <svg className="w-32 h-32 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/feed">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <HomeIcon size={20} className="mr-2" />
              Go to Home
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <SearchIcon size={20} className="mr-2" />
              Search
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
