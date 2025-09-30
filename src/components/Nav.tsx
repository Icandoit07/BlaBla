"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { HomeIcon, SearchIcon, TrendingIcon, BellIcon, BookmarkIcon, EditIcon, XIcon } from "./icons";

const navLinks = [
  { href: "/feed", label: "Home", icon: HomeIcon },
  { href: "/search", label: "Explore", icon: SearchIcon },
  { href: "/trending", label: "Trending", icon: TrendingIcon },
  { href: "/notifications", label: "Notifications", icon: BellIcon },
  { href: "/bookmarks", label: "Bookmarks", icon: BookmarkIcon },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <>
      {/* Elite Modern Navbar */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-700 ease-out
        ${scrolled 
          ? 'bg-white shadow-2xl border-b border-gray-100' 
          : 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-50'
        }
      `}>
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between px-6 h-18">
            {/* Logo Section */}
            <Link 
              href="/" 
              className="flex-shrink-0 transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <Logo size="default" />
            </Link>

            {/* Desktop Center Navigation - Clean Minimal Style */}
            <div className="hidden lg:flex items-center flex-1 justify-center max-w-2xl mx-12">
              <div className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`
                        group relative px-5 py-2.5 rounded-xl font-semibold text-sm
                        transition-all duration-300 flex items-center gap-2.5
                        ${isActive 
                          ? "text-white" 
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }
                      `}
                    >
                      {/* Active Background - Gradient */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-xl shadow-lg shadow-green-500/30 animate-fadeIn"></div>
                      )}
                      
                      {/* Icon */}
                      <Icon 
                        size={20} 
                        className={`relative z-10 transition-colors duration-300 ${
                          isActive ? "text-white" : "text-gray-500 group-hover:text-green-600"
                        }`}
                      />
                      
                      {/* Label */}
                      <span className="relative z-10 whitespace-nowrap">{link.label}</span>
                      
                      {/* Hover Indicator */}
                      {!isActive && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-3/4 transition-all duration-300 rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Compose Button - Premium */}
              <Link
                href="/compose"
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden"
              >
                {/* Animated shine */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                
                <EditIcon size={18} className="relative z-10" />
                <span className="relative z-10">Post</span>
              </Link>

              {/* Auth Buttons */}
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-semibold text-sm transition-all duration-300 rounded-xl hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Sign Up
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Slide Down */}
        <div className={`
          lg:hidden overflow-hidden transition-all duration-500 ease-out border-t border-gray-100
          ${mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="bg-white px-6 py-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-4 px-5 py-4 rounded-xl font-semibold text-base transition-all duration-300
                    ${isActive 
                      ? "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white shadow-lg" 
                      : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                    }
                  `}
                >
                  <Icon size={22} className={isActive ? "text-white" : "text-gray-600"} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            {/* Mobile Actions */}
            <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
              <Link
                href="/compose"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-5 py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <EditIcon size={20} />
                Create Post
              </Link>
              
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-5 py-3 text-center text-gray-700 font-bold text-sm rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-5 py-3 text-center bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-black shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-18"></div>
    </>
  );
}