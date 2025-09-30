import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Nav } from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BlaBla - Share Your Voice",
    template: "%s | BlaBla",
  },
  description: "Connect with friends and share your thoughts on BlaBla - India's modern social platform. Post, like, comment, and discover trending topics.",
  keywords: ["social media", "blabla", "india", "social network", "connect", "share", "posts", "trending"],
  authors: [{ name: "BlaBla Team" }],
  creator: "BlaBla",
  publisher: "BlaBla",
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: "BlaBla - Share Your Voice",
    description: "Connect with friends and share your thoughts on BlaBla - India's modern social platform",
    siteName: "BlaBla",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlaBla - Share Your Voice",
    description: "Connect with friends and share your thoughts on BlaBla - India's modern social platform",
    creator: "@blabla",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 text-gray-900`}>
        <Providers>
          <Nav />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
