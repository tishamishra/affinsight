import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import LeftSidebarAds from "@/components/LeftSidebarAds";
import RightSidebarAds from "@/components/RightSidebarAds";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AffinSight - Your Trusted Source for Affiliate Network Information",
  description: "Discover the best affiliate networks, offers, and programs. Compare features, commission rates, and find the perfect partner for your affiliate marketing strategy.",
  keywords: "affiliate networks, affiliate marketing, affiliate programs, affiliate offers, commission rates",
  authors: [{ name: "AffinSight" }],
  creator: "AffinSight",
  publisher: "AffinSight",
  robots: "index, follow",
  openGraph: {
    title: "AffinSight - Your Trusted Source for Affiliate Network Information",
    description: "Discover the best affiliate networks, offers, and programs. Compare features, commission rates, and find the perfect partner for your affiliate marketing strategy.",
    url: "https://www.affinsight.com",
    siteName: "AffinSight",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AffinSight - Your Trusted Source for Affiliate Network Information",
    description: "Discover the best affiliate networks, offers, and programs.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        {/* Top Navigation */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
          <Navigation />
        </div>
        <div className="flex w-full max-w-screen-2xl mx-auto min-h-[calc(100vh-56px)] pt-4 gap-4 px-2 md:px-6">
          {/* Left Sidebar Ads */}
          <aside className="hidden lg:block w-56 shrink-0">
            <LeftSidebarAds />
          </aside>
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
          {/* Right Sidebar Ads */}
          <aside className="hidden xl:block w-56 shrink-0">
            <RightSidebarAds />
          </aside>
        </div>
        <Footer />
      </body>
    </html>
  );
}
