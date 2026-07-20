"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Activity,
  ArrowUpRight,
  BrainCircuit,
  Clock3,
  TrendingUp,
  Eye,
  MapPin,
  Monitor,
  Globe,
  Calendar,
  Sparkles,
} from "lucide-react";

const analyticsData = {
  overview: {
    totalScans: 2847,
    change: 23,
    uniqueVisitors: 1234,
    avgScanRate: 4.2,
  },
  scansOverTime: [
    { date: "2024-01", scans: 234 },
    { date: "2024-02", scans: 345 },
    { date: "2024-03", scans: 456 },
    { date: "2024-04", scans: 567 },
    { date: "2024-05", scans: 678 },
    { date: "2024-06", scans: 789 },
  ],
  topCountries: [
    { country: "United States", scans: 1234, percentage: 43 },
    { country: "United Kingdom", scans: 567, percentage: 20 },
    { country: "Germany", scans: 345, percentage: 12 },
    { country: "Canada", scans: 234, percentage: 8 },
    { country: "Australia", scans: 123, percentage: 4 },
  ],
  topDevices: [
    { device: "Mobile", scans: 1567, percentage: 55 },
    { device: "Desktop", scans: 1023, percentage: 36 },
    { device: "Tablet", scans: 257, percentage: 9 },
  ],
  topBrowsers: [
    { browser: "Chrome", scans: 1234, percentage: 43 },
    { browser: "Safari", scans: 890, percentage: 31 },
    { browser: "Firefox", scans: 456, percentage: 16 },
    { browser: "Edge", scans: 267, percentage: 9 },
  ],
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(168,85,247,0.18),_transparent_24%),linear-gradient(135deg,_rgba(15,23,42,0.68),_rgba(2,6,23,0.94))]" />
        <div className="relative grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Performance intelligence
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                See how every scan, visitor, and channel contributes to growth.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                This analytics workspace highlights the momentum behind your QR ecosystem so you can
                spot winning campaigns faster and iterate with more confidence.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="h-12 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-5 text-white shadow-xl shadow-blue-950/30 hover:-translate-y-0.5">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Export report
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-white/10 bg-white/5 px-5 text-slate-100 hover:bg-white/10 hover:text-white"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 days
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Activity className="h-4 w-4 text-cyan-300" />
                Engagement trend
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">+{analyticsData.overview.change}%</p>
              <p className="mt-1 text-sm text-slate-400">Month-over-month scan growth</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <BrainCircuit className="h-4 w-4 text-emerald-300" />
                Unique reach
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">
                {analyticsData.overview.uniqueVisitors.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-slate-400">Visitors interacting with your campaigns</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Clock3 className="h-4 w-4 text-violet-300" />
                Average scan rate
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">{analyticsData.overview.avgScanRate}%</p>
              <p className="mt-1 text-sm text-slate-400">Conversion strength across published assets</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Scans",
            value: analyticsData.overview.totalScans.toLocaleString(),
            note: `+${analyticsData.overview.change}% from last month`,
            icon: Eye,
            tone: "text-cyan-300",
          },
          {
            label: "Unique Visitors",
            value: analyticsData.overview.uniqueVisitors.toLocaleString(),
            note: "+15% from last month",
            icon: Globe,
            tone: "text-emerald-300",
          },
          {
            label: "Avg Scan Rate",
            value: `${analyticsData.overview.avgScanRate}%`,
            note: "+0.8% from last month",
            icon: BarChart3,
            tone: "text-violet-300",
          },
          {
            label: "Active QR Codes",
            value: "127",
            note: "8 created this month",
            icon: Calendar,
            tone: "text-orange-300",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.tone}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="mt-1 flex items-center gap-1 text-xs text-emerald-300">
                <TrendingUp className="h-3 w-3" />
                {stat.note}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
          <CardHeader>
            <CardTitle className="text-white">Scans Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.scansOverTime.map((item) => (
                <div key={item.date} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-slate-400">{item.date}</div>
                  <div className="relative h-9 flex-1 overflow-hidden rounded-full bg-slate-950/45">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 transition-all"
                      style={{ width: `${(item.scans / 789) * 100}%` }}
                    />
                    <div className="absolute inset-0 flex items-center px-4">
                      <span className="text-sm font-medium text-white">{item.scans} scans</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
          <CardHeader>
            <CardTitle className="text-white">Top Countries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.topCountries.map((item) => (
              <div key={item.country} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <MapPin className="h-4 w-4 text-cyan-300" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{item.country}</span>
                    <span className="text-sm text-slate-400">
                      {item.scans} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950/45">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
          <CardHeader>
            <CardTitle className="text-white">Devices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.topDevices.map((item) => (
              <div key={item.device} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Monitor className="h-4 w-4 text-emerald-300" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{item.device}</span>
                    <span className="text-sm text-slate-400">
                      {item.scans} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950/45">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
          <CardHeader>
            <CardTitle className="text-white">Browsers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.topBrowsers.map((item) => (
              <div key={item.browser} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Globe className="h-4 w-4 text-violet-300" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{item.browser}</span>
                    <span className="text-sm text-slate-400">
                      {item.scans} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950/45">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
