"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  MapPin,
  Monitor,
  Globe,
  Calendar,
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your QR code performance and user engagement
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.overview.totalScans.toLocaleString()}
            </div>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +{analyticsData.overview.change}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Visitors
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.overview.uniqueVisitors.toLocaleString()}
            </div>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Scan Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.overview.avgScanRate}%
            </div>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +0.8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active QR Codes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground mt-1">
              8 created this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scans Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Scans Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="w-full space-y-4">
                {analyticsData.scansOverTime.map((item) => (
                  <div key={item.date} className="flex items-center gap-4">
                    <div className="w-16 text-sm text-muted-foreground">
                      {item.date}
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-8 relative overflow-hidden">
                      <div
                        className="bg-primary rounded-full h-full transition-all"
                        style={{
                          width: `${(item.scans / 789) * 100}%`,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center px-4">
                        <span className="text-sm font-medium">
                          {item.scans} scans
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topCountries.map((item) => (
                <div key={item.country} className="flex items-center gap-4">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.country}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.scans} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Devices */}
        <Card>
          <CardHeader>
            <CardTitle>Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topDevices.map((item) => (
                <div key={item.device} className="flex items-center gap-4">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.device}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.scans} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Browsers */}
        <Card>
          <CardHeader>
            <CardTitle>Browsers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topBrowsers.map((item) => (
                <div key={item.browser} className="flex items-center gap-4">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.browser}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.scans} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
