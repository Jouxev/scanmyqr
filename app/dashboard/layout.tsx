"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Activity,
  LayoutDashboard,
  QrCode,
  Scan,
  FolderOpen,
  CreditCard,
  UtensilsCrossed,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
  User,
  Menu,
  X,
  Plus,
  Sparkles,
  ChevronRight,
  Command,
} from "lucide-react";
import { useState } from "react";
import { getInitials } from "@/lib/utils";

const sidebarLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/qr-codes", icon: QrCode, label: "QR Codes" },
  { href: "/dashboard/scanner", icon: Scan, label: "Scanner" },
  { href: "/dashboard/folders", icon: FolderOpen, label: "Folders" },
  { href: "/dashboard/business-cards", icon: CreditCard, label: "Business Cards" },
  { href: "/dashboard/menus", icon: UtensilsCrossed, label: "Restaurant Menus" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
];

const settingsLinks = [
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userName = session?.user?.name || "Creator";
  const userEmail = session?.user?.email || "creator@qrhub.app";

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_24%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.14),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_45%,_#020617_100%)]" />
        <div className="animate-float absolute left-[-10rem] top-20 h-80 w-80 rounded-full bg-cyan-500/18 blur-3xl" />
        <div className="animate-pulse-soft absolute right-[-6rem] top-32 h-72 w-72 rounded-full bg-fuchsia-500/18 blur-3xl" />
        <div className="animate-float absolute bottom-[-10rem] right-20 h-96 w-96 rounded-full bg-blue-500/14 blur-3xl" />
      </div>

      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:120px_120px] opacity-[0.08] animate-grid-pan" />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-72 border-r border-white/10 bg-slate-950/75 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link href="/dashboard" className="group flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-lg shadow-blue-950/60">
              <QrCode className="h-6 w-6 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">QRHub</p>
              <p className="text-xs text-slate-400">Performance command center</p>
            </div>
          </Link>
          <button
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-[calc(100vh-5rem)] flex-col overflow-y-auto p-4">
          <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-300">
                  Workspace
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">Growth Pulse</h2>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                Live
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-3">
                <p className="text-xs text-slate-400">Monthly scans</p>
                <p className="mt-2 text-xl font-semibold text-white">28.4K</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-900/70 p-3">
                <p className="text-xs text-slate-400">Conversion lift</p>
                <p className="mt-2 text-xl font-semibold text-white">+18%</p>
              </div>
            </div>
          </div>

          <Link href="/dashboard/qr-codes/create">
            <Button className="mb-6 h-12 w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 text-white shadow-xl shadow-blue-950/40 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-cyan-950/30">
              <Plus className="h-4 w-4 mr-2" />
              Create QR Code
            </Button>
          </Link>

          <div className="mb-3 flex items-center gap-2 px-3">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
              Platform
            </p>
          </div>
          <nav className="space-y-1.5">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-300",
                  pathname === link.href
                    ? "bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-violet-500/20 text-white shadow-lg shadow-blue-950/20 ring-1 ring-white/10"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border transition-colors",
                    pathname === link.href
                      ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-200"
                      : "border-white/10 bg-white/5 text-slate-300 group-hover:border-white/20 group-hover:text-white"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                </div>
                <span className="flex-1">{link.label}</span>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-all duration-300",
                    pathname === link.href
                      ? "translate-x-0 text-cyan-200"
                      : "translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="mt-8">
            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Settings
            </div>
            <nav className="space-y-1.5">
              {settingsLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-300",
                    pathname === link.href
                      ? "bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-violet-500/20 text-white ring-1 ring-white/10"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors group-hover:border-white/20 group-hover:text-white">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <span className="flex-1">{link.label}</span>
                  <ChevronRight className="h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto pt-6">
            <div className="relative overflow-hidden rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/12 via-blue-500/10 to-violet-500/12 p-4 shadow-xl shadow-slate-950/40">
              <div className="animate-shimmer absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="relative flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Campaign velocity</p>
                  <p className="mt-1 text-sm text-slate-300">
                    Traffic is trending up across your latest QR launches.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="relative lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/45 backdrop-blur-2xl">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>

              <div>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
                  <Command className="h-3.5 w-3.5 text-cyan-300" />
                  Dashboard overview
                </div>
                <p className="mt-1 text-lg font-semibold tracking-tight text-white">
                  Welcome back, {userName.split(" ")[0]}
                </p>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-3">
              <div className="relative hidden w-full max-w-md md:block">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search codes, campaigns, or analytics"
                  className="h-12 rounded-2xl border-white/10 bg-white/5 pl-11 text-slate-100 placeholder:text-slate-400 focus-visible:ring-cyan-400/60"
                />
              </div>

              <Link href="/dashboard/analytics" className="hidden xl:block">
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl border-white/10 bg-white/5 px-4 text-slate-100 hover:bg-white/10 hover:text-white"
                >
                  <BarChart3 className="h-4 w-4" />
                  View insights
                </Button>
              </Link>

              <button className="relative rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-[10px] font-semibold text-white shadow-lg shadow-blue-950/40">
                  3
                </span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-slate-200 transition-colors hover:bg-white/10 hover:text-white">
                    <Avatar className="h-10 w-10 border border-white/10">
                      <AvatarImage
                        src={session?.user?.image || ""}
                        alt={session?.user?.name || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-violet-500 text-white">
                        {session?.user?.name
                          ? getInitials(session.user.name)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left lg:block">
                      <p className="text-sm font-medium text-white">{userName}</p>
                      <p className="text-xs text-slate-400">{userEmail}</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 rounded-2xl border-white/10 bg-slate-900/95 text-slate-100 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session?.user?.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session?.user?.email && (
                        <p className="text-xs text-slate-400">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings/profile">
                      <span className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <span className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-rose-400 focus:text-rose-300"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="relative p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
