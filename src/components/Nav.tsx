"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { HomeIcon, SearchIcon, TrendingIcon, BellIcon, BookmarkIcon, MessageIcon, EditIcon, XIcon } from "./icons";

const navLinks = [
  { href: "/feed", label: "Home", icon: HomeIcon },
  { href: "/search", label: "Explore", icon: SearchIcon },
  { href: "/trending", label: "Trending", icon: TrendingIcon },
  { href: "/messages", label: "Messages", icon: MessageIcon },
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
      {/* Professional Navbar */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-300 ease-out
        ${scrolled 
          ? 'bg-white shadow-md border-b border-gray-200' 
          : 'bg-white/98 backdrop-blur-sm shadow-sm border-b border-gray-100'
        }
      `}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo - Left Side */}
            <div className="flex-shrink-0">
              <Link 
                href="/" 
                className="flex items-center transition-transform duration-200 hover:scale-105"
              >
                <Logo size="default" />
              </Link>
            </div>

            {/* Desktop Navigation - Right Side */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      group relative px-4 py-2 rounded-lg font-medium text-sm
                      transition-all duration-200 flex items-center gap-2
                      ${isActive 
                        ? "text-green-600 bg-green-50" 
                        : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon 
                      size={20} 
                      className={`transition-colors duration-200 ${
                        isActive ? "text-green-600" : "text-gray-500 group-hover:text-green-600"
                      }`}
                    />
                    <span className="hidden lg:inline">{link.label}</span>
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
              
              {/* Compose Button */}
              <Link
                href="/compose"
                className="ml-2 px-5 py-2 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <EditIcon size={18} />
                <span className="hidden lg:inline">Post</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <XIcon size={24} />
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-base
                      transition-colors duration-200
                      ${isActive 
                        ? "text-green-600 bg-green-50" 
                        : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon size={22} className={isActive ? "text-green-600" : "text-gray-500"} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/compose"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 mt-3 px-4 py-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-semibold rounded-lg shadow-md"
              >
                <EditIcon size={20} />
                <span>Create Post</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}