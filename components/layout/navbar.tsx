"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TiptapLogo } from "@/components/brand/tiptap-logo";

const navItems = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/templates", label: "Templates" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/88 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-[72px] items-center justify-between gap-6 py-4">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center">
              <TiptapLogo size="sm" />
            </Link>

            <div className="hidden md:flex md:items-center md:gap-7">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative py-1 text-sm font-medium transition-colors hover:text-slate-950",
                    pathname === item.href
                      ? "text-slate-950"
                      : "text-slate-500"
                  )}
                >
                  {item.label}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl px-4 text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              >
                Log in
              </Button>
            </Link>
            <Link href="/signup" className="hidden md:block">
              <Button
                size="sm"
                className="rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 px-5 text-white shadow-lg shadow-blue-500/20"
              >
                Get Started
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>

            <button
              className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2 border-t border-slate-200 py-4 md:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-xl px-3 py-2 text-base font-medium transition-colors",
                  pathname === item.href
                    ? "bg-slate-100 text-slate-950"
                    : "text-slate-600 hover:bg-slate-50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Link href="/login" className="block">
                <Button variant="outline" className="w-full rounded-xl border-slate-200">
                  Log in
                </Button>
              </Link>
              <Link href="/signup" className="block">
                <Button className="w-full rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
