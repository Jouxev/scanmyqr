"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  CircleDashed,
  Clock,
  Download,
  Eye,
  Globe,
  Layers3,
  Plus,
  QrCode,
  Scan,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { DashboardStats, RecentQRCode } from "@/lib/dashboard-data";

const stats = [
  {
    title: "Total QR Codes",
    value: "0",
    change: "+0%",
    trendLabel: "vs last month",
    icon: QrCode,
    gradient: "from-cyan-400/25 via-blue-500/20 to-violet-500/25",
  },
  {
    title: "Total Scans",
    value: "0",
    change: "+0%",
    trendLabel: "high-intent traffic",
    icon: Eye,
    gradient: "from-emerald-400/25 via-teal-500/15 to-cyan-500/20",
  },
  {
    title: "Active Campaigns",
    value: "0",
    change: "+0",
    trendLabel: "new launches this week",
    icon: TrendingUp,
    gradient: "from-fuchsia-400/20 via-violet-500/20 to-indigo-500/20",
  },
  {
    title: "Avg. Click Rate",
    value: "0%",
    change: "+0%",
    trendLabel: "better than benchmark",
    icon: BarChart3,
    gradient: "from-amber-300/25 via-orange-500/15 to-pink-500/20",
  },
];

interface DashboardClientProps {
  stats: DashboardStats;
  recentQRCodes: RecentQRCode[];
  userName: string;
}

export default function DashboardClient({
  stats: dbStats,
  recentQRCodes,
  userName,
}: DashboardClientProps) {
  // Merge DB stats into the stat cards
  const displayStats = [
    {
      title: "Total QR Codes",
      value: dbStats.totalQRCodes.toLocaleString(),
      change: `+${dbStats.qrcodesGrowth}`,
      trendLabel: "vs last month",
      icon: QrCode,
      gradient: "from-cyan-400/25 via-blue-500/20 to-violet-500/25",
    },
    {
      title: "Total Scans",
      value: dbStats.totalScans.toLocaleString(),
      change: `+${dbStats.scansGrowth}%`,
      trendLabel: "high-intent traffic",
      icon: Eye,
      gradient: "from-emerald-400/25 via-teal-500/15 to-cyan-500/20",
    },
    {
      title: "Active Campaigns",
      value: dbStats.activeCampaigns.toString(),
      change: "+0",
      trendLabel: "new launches this week",
      icon: TrendingUp,
      gradient: "from-fuchsia-400/20 via-violet-500/20 to-indigo-500/20",
    },
    {
      title: "Avg. Click Rate",
      value: `${dbStats.avgClickRate}%`,
      change: "+0%",
      trendLabel: "better than benchmark",
      icon: BarChart3,
      gradient: "from-amber-300/25 via-orange-500/15 to-pink-500/20",
    },
  ];

  const weeklyBars = [52, 68, 61, 84, 76, 93, 88];

  const formatRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const qrCodeItems = recentQRCodes.length > 0 ? recentQRCodes : [
    { id: "empty", name: "No QR codes yet", type: "URL", scans: 0, created_at: new Date().toISOString(), status: "ACTIVE" as const },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.20),_transparent_22%),linear-gradient(135deg,_rgba(15,23,42,0.68),_rgba(2,6,23,0.96))]" />
        <div className="animate-float absolute -left-8 top-10 h-32 w-32 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="animate-pulse-soft absolute right-10 top-8 h-24 w-24 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Premium dashboard experience
            </div>

            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Turn every QR scan into a clearer growth signal.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                Monitor campaign momentum, surface high-performing assets, and ship
                new experiences faster from one polished workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/qr-codes/create">
                <Button className="h-12 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-5 text-white shadow-xl shadow-blue-950/30 hover:-translate-y-0.5">
                  <Plus className="h-4 w-4" />
                  Create QR Code
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl border-white/10 bg-white/5 px-5 text-slate-100 hover:bg-white/10 hover:text-white"
                >
                  <BarChart3 className="h-4 w-4" />
                  Explore analytics
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Zap className="h-4 w-4 text-amber-300" />
                  Smart launches
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">{dbStats.activeCampaigns}</p>
                <p className="mt-1 text-sm text-slate-400">Active campaigns ready</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Globe className="h-4 w-4 text-emerald-300" />
                  Reach expansion
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">{dbStats.totalScans.toLocaleString()}</p>
                <p className="mt-1 text-sm text-slate-400">Total scans recorded</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  Reliability
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">99.9%</p>
                <p className="mt-1 text-sm text-slate-400">Healthy scan delivery uptime</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <Card className="overflow-hidden border-white/10 bg-slate-950/50 shadow-xl shadow-slate-950/30">
              <CardHeader className="pb-3">
                <CardDescription className="text-slate-400">
                  Weekly scan performance
                </CardDescription>
                <CardTitle className="text-white">Engagement is climbing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-40 items-end gap-3">
                  {weeklyBars.map((value, index) => (
                    <div key={index} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-2xl bg-gradient-to-t from-cyan-400 via-blue-500 to-violet-500 shadow-lg shadow-blue-950/20 transition-all duration-500 hover:scale-[1.03]"
                        style={{ height: `${value}%` }}
                      />
                      <span className="text-xs text-slate-500">
                        {["M", "T", "W", "T", "F", "S", "S"][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/25">
              <CardHeader className="pb-3">
                <CardDescription className="text-slate-400">
                  Conversion pulse
                </CardDescription>
                <CardTitle className="text-white">Funnel health is strong</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Reach", value: `${(dbStats.totalScans * 4).toLocaleString()}`, width: "100%" },
                  { label: "Scans", value: `${(dbStats.totalScans * 2.5).toLocaleString()}`, width: "80%" },
                  { label: "Opens", value: `${(dbStats.totalScans * 1.5).toLocaleString()}`, width: "62%" },
                  { label: "Conversions", value: dbStats.totalScans.toLocaleString(), width: "40%" },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="font-medium text-white">{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {displayStats.map((stat) => (
          <Card
            key={stat.title}
            className="group relative overflow-hidden border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-80`} />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {stat.title}
              </CardTitle>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-2.5 text-white shadow-lg shadow-slate-950/20">
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="text-3xl font-semibold tracking-tight text-white">
                    {stat.value}
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-300">
                    <TrendingUp className="h-3 w-3 text-emerald-300" />
                    <span className="font-medium text-emerald-300">{stat.change}</span>
                    <span>{stat.trendLabel}</span>
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">
                Live metric
              </p>
              <div className="mt-3 flex items-end gap-1">
                {[20, 42, 32, 55, 48, 70, 64].map((bar) => (
                  <div
                    key={bar}
                    className="w-full rounded-full bg-white/10"
                    style={{ height: `${bar}px` }}
                  />
                ))}
                <div
                  className="w-full rounded-full bg-gradient-to-t from-cyan-400 to-violet-500"
                  style={{ height: "82px" }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/25">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardDescription className="text-slate-400">
                Recent launches
              </CardDescription>
              <CardTitle className="text-white">Top-performing QR assets</CardTitle>
            </div>
            <Link href="/dashboard/qr-codes">
              <Button
                variant="ghost"
                className="h-11 rounded-2xl px-4 text-slate-200 hover:bg-white/5 hover:text-white"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qrCodeItems.map((qr, index) => (
                <div
                  key={qr.id}
                  className="group flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/35 p-4 transition-all duration-300 hover:border-cyan-300/20 hover:bg-white/[0.05] md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 via-blue-500/15 to-violet-500/20 text-cyan-200 shadow-lg shadow-slate-950/20">
                      <QrCode className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-white">{qr.name}</p>
                        <span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                          {qr.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-slate-400">
                        {qr.type} campaign &bull; Created {formatRelativeTime(qr.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="hidden items-end gap-1 md:flex">
                      {[28, 35, 22, 44, 31, 52].map((bar, barIndex) => (
                        <div
                          key={barIndex}
                          className={
                            index === 2
                              ? "w-2 rounded-full bg-gradient-to-t from-emerald-400 to-cyan-300"
                              : "w-2 rounded-full bg-white/10"
                          }
                          style={{ height: `${bar}px` }}
                        />
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">{qr.scans.toLocaleString()}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                        scans
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/25">
            <CardHeader>
              <CardDescription className="text-slate-400">
                Quick actions
              </CardDescription>
              <CardTitle className="text-white">Build faster</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {[
                {
                  href: "/dashboard/qr-codes/create",
                  label: "Create Dynamic QR",
                  description: "Launch trackable campaigns with branded destinations.",
                  icon: QrCode,
                },
                {
                  href: "/dashboard/scanner",
                  label: "Scan and Verify",
                  description: "Test printed codes instantly from your device.",
                  icon: Scan,
                },
                {
                  href: "/dashboard/business-cards/create",
                  label: "Share Contact Card",
                  description: "Build premium digital cards for events and teams.",
                  icon: Download,
                },
                {
                  href: "/dashboard/menus/create",
                  label: "Publish Restaurant Menu",
                  description: "Create elegant menus optimized for mobile ordering.",
                  icon: Clock,
                },
              ].map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/35 p-4 transition-all duration-300 hover:border-cyan-300/20 hover:bg-white/[0.05]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/15 to-violet-500/20 text-cyan-200">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{action.label}</p>
                      <p className="mt-1 text-sm text-slate-400">{action.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/25">
            <CardHeader>
              <CardDescription className="text-slate-400">
                Activity feed
              </CardDescription>
              <CardTitle className="text-white">What changed today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: dbStats.totalQRCodes > 0
                    ? `${dbStats.totalQRCodes} QR codes in your workspace`
                    : "Your workspace is ready",
                  time: "Just now",
                  icon: Sparkles,
                },
                {
                  title: "Scan tracking is live for all QR codes",
                  time: "Active now",
                  icon: Layers3,
                },
                {
                  title: "Dashboard analytics available",
                  time: "Ready to explore",
                  icon: Globe,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-3xl border border-white/10 bg-slate-950/35 p-4"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-cyan-200">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="relative overflow-hidden border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/25">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.15),_transparent_24%)]" />
          <CardHeader className="relative">
            <CardDescription className="text-slate-400">
              Optimization checklist
            </CardDescription>
            <CardTitle className="text-white">Next best moves</CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-4">
            {[
              "Add UTM tags to your top destination URLs",
              "Duplicate a winning template to start faster",
              "Enable folders for cleaner asset organization",
              "Review analytics for your top QR codes",
            ].map((task) => (
              <div
                key={task}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                <span className="text-sm text-slate-200">{task}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/25">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardDescription className="text-slate-400">
                Scan intelligence
              </CardDescription>
              <CardTitle className="text-white">Momentum overview</CardTitle>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              <CircleDashed className="h-3.5 w-3.5 text-cyan-300" />
              Updated in real time
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Activity className="h-4 w-4 text-cyan-300" />
                  Peak hour
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">6:00 PM</p>
                <p className="mt-1 text-sm text-slate-400">Most scans arrive after work hours.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Globe className="h-4 w-4 text-emerald-300" />
                  Best market
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">Growing</p>
                <p className="mt-1 text-sm text-slate-400">Your audience is expanding.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Layers3 className="h-4 w-4 text-violet-300" />
                  Best format
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">Menu QR</p>
                <p className="mt-1 text-sm text-slate-400">Highest returning user activity.</p>
              </div>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Scans over time</p>
                  <p className="text-sm text-slate-400">Strong consistency with weekend spikes</p>
                </div>
                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200">
                  +{dbStats.scansGrowth}%
                </span>
              </div>
              <div className="relative h-[240px] overflow-hidden rounded-[1.5rem] border border-white/5 bg-[linear-gradient(to_top,rgba(15,23,42,0.9),rgba(15,23,42,0.35))] p-4">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:36px_36px] opacity-30" />
                <div className="absolute inset-x-4 bottom-10 top-8">
                  <svg
                    viewBox="0 0 600 240"
                    className="h-full w-full"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="scanLine2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(34,211,238,1)" />
                        <stop offset="50%" stopColor="rgba(59,130,246,1)" />
                        <stop offset="100%" stopColor="rgba(168,85,247,1)" />
                      </linearGradient>
                      <linearGradient id="scanFill2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(59,130,246,0.38)" />
                        <stop offset="100%" stopColor="rgba(59,130,246,0.03)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,190 C50,180 80,120 130,124 C180,128 200,170 250,166 C300,162 325,76 380,84 C435,92 450,148 505,138 C550,130 575,84 600,54 L600,240 L0,240 Z"
                      fill="url(#scanFill2)"
                    />
                    <path
                      d="M0,190 C50,180 80,120 130,124 C180,128 200,170 250,166 C300,162 325,76 380,84 C435,92 450,148 505,138 C550,130 575,84 600,54"
                      fill="none"
                      stroke="url(#scanLine2)"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    {[
                      [130, 124],
                      [250, 166],
                      [380, 84],
                      [505, 138],
                      [600, 54],
                    ].map(([x, y]) => (
                      <circle
                        key={`${x}-${y}`}
                        cx={x}
                        cy={y}
                        r="7"
                        fill="rgba(255,255,255,0.9)"
                      />
                    ))}
                  </svg>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs uppercase tracking-[0.2em] text-slate-500">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
