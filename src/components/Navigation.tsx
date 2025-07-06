"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { href: "/networks", label: "Affiliate Networks" },
  { href: "/programs", label: "Affiliate Programs" },
  { href: "/advertising-networks", label: "Advertising Networks" },
  { href: "/reviews", label: "Reviews" },
  { href: "/offers", label: "Offers" },
  { href: "/resources", label: "Resources" },
  { href: "/blog", label: "Blog" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between w-full max-w-screen-2xl mx-auto px-2 md:px-6 h-14">
      <div className="font-bold text-xl text-blue-700 tracking-tight">Affinsight</div>
      
      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-2 lg:gap-4 xl:gap-6">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-700 ${
                pathname.startsWith(link.href) ? "bg-blue-100 text-blue-700" : "text-gray-700"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 text-gray-700 hover:text-blue-700 transition"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden z-50">
          <ul className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname.startsWith(link.href) 
                      ? "bg-blue-100 text-blue-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
} 