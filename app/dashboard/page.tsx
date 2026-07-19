"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  QrCode,
  Scan,
  BarChart3,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Eye,
  Download,
} from "lucide-react";

const stats = [
  {
    title: "Total QR Codes",
    value: "127",
    change: "+12%",
    trend: "up",
    icon: QrCode,
  },
  {
    title: "Total Scans",
    value: "2,847",
    change: "+23%",
    trend: "up",
    icon: Eye,
  },
  {
    title: "Active Campaigns",
    value: "8",
    change: "+2",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Avg. Click Rate",
    value: "4.2%",
    change: "+0.8%",
    trend: "up",
    icon: BarChart3,
  },
];

const recentQRCodes = [
  {
    id: "1",
    name: "Product Landing Page",
    type: "URL",
    scans: 234,
    created: "2 hours ago",
    status: "Active",
  },
  {
    id: "2",
    name: "Event Registration",
    type: "EVENT",
    scans: 189,
    created: "5 hours ago",
    status: "Active",
  },
  {
    id: "3",
    name: "Restaurant Menu",
    type: "MENU",
    scans: 456,
    created: "1 day ago",
    status: "Active",
  },
  {
    id: "4",
    name: "Contact Card",
    type: "VCARD",
    scans: 123,
    created: "2 days ago",
    status: "Active",
  },
  {
    id: "5",
    name: "WiFi Network",
    type: "WIFI",
    scans: 89,
    created: "3 days ago",
    status: "Active",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your QR codes.
          </p>
        </div>
        <Link href="/dashboard/qr-codes/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create QR Code
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">{stat.change}</span>
                <span>from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent QR Codes</CardTitle>
              <Link href="/dashboard/qr-codes">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQRCodes.map((qr) => (
                <div
                  key={qr.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <QrCode className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{qr.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {qr.type} • {qr.created}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{qr.scans} scans</div>
                    <div className="text-xs text-green-500">{qr.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/qr-codes/create">
              <Button variant="outline" className="w-full justify-start h-12">
                <QrCode className="h-5 w-5 mr-3" />
                Create New QR Code
              </Button>
            </Link>
            <Link href="/dashboard/scanner">
              <Button variant="outline" className="w-full justify-start h-12">
                <Scan className="h-5 w-5 mr-3" />
                Scan QR Code
              </Button>
            </Link>
            <Link href="/dashboard/business-cards/create">
              <Button variant="outline" className="w-full justify-start h-12">
                <Download className="h-5 w-5 mr-3" />
                Create Business Card
              </Button>
            </Link>
            <Link href="/dashboard/menus/create">
              <Button variant="outline" className="w-full justify-start h-12">
                <Clock className="h-5 w-5 mr-3" />
                Create Restaurant Menu
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Scans Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary/50" />
              <p>Analytics chart will be displayed here</p>
              <p className="text-sm">Connect to your database to see real data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
