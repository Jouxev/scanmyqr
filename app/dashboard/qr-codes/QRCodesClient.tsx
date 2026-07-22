"use client";

import { useState } from "react";
import Link from "next/link";
import QRCodeLib from "qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Clock,
  Eye,
  Filter,
  Layers3,
  QrCode,
  Copy,
  Download,
  Edit,
  MoreVertical,
  Plus,
  Search,
  Share2,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { QRCode } from "@/types/models";

interface QRCodesClientProps {
  initialQRCodes: QRCode[];
}

export default function QRCodesClient({ initialQRCodes }: QRCodesClientProps) {
  const { toast } = useToast();
  const [qrcodes, setQrcodes] = useState<QRCode[]>(initialQRCodes);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const totalScans = qrcodes.reduce((sum, qr) => sum + (qr.scans ?? 0), 0);
  const activeCount = qrcodes.filter((qr) => qr.status === "ACTIVE").length;
  const dynamicCount = qrcodes.filter((qr) => qr.dynamic).length;

  const filteredQRCodes = qrcodes.filter((qr) => {
    const matchesSearch = qr.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || qr.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTrackedUrl = (shortCode: string) => `${window.location.origin}/r/${shortCode}`;

  const handleCopyLink = async (shortCode: string) => {
    const url = `${window.location.origin}/r/${shortCode}`;
    await navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: "QR code link copied to clipboard" });
  };

  const handleShare = async (qr: QRCode) => {
    const url = getTrackedUrl(qr.short_code);

    try {
      if (navigator.share) {
        await navigator.share({
          title: qr.name,
          text: `Open ${qr.name}`,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      toast({ title: "Copied!", description: "Share link copied to clipboard" });
    } catch {
      toast({
        title: "Error",
        description: "Unable to share this QR code right now",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (qr: QRCode, format: "png" | "svg" = "png") => {
    try {
      const trackedUrl = getTrackedUrl(qr.short_code);
      const safeName = qr.name.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase() || "qr-code";

      if (format === "svg") {
        const svg = await QRCodeLib.toString(trackedUrl, {
          type: "svg",
          width: 800,
          margin: 2,
          color: {
            dark: qr.foreground_color || "#000000",
            light: qr.background_color || "#ffffff",
          },
        });

        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${safeName}.svg`;
        link.click();
        URL.revokeObjectURL(url);
        return;
      }

      const dataUrl = await QRCodeLib.toDataURL(trackedUrl, {
        width: 1200,
        margin: 2,
        color: {
          dark: qr.foreground_color || "#000000",
          light: qr.background_color || "#ffffff",
        },
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${safeName}.png`;
      link.click();
    } catch {
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/qr-codes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setQrcodes((prev) => prev.filter((qr) => qr.id !== id));
      toast({ title: "Deleted", description: "QR code deleted successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to delete QR code", variant: "destructive" });
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/qr-codes/${id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to duplicate");
      const data = await res.json();
      setQrcodes((prev) => [data.qrCode, ...prev]);
      toast({ title: "Duplicated", description: "QR code duplicated successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to duplicate QR code", variant: "destructive" });
    }
  };

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

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(168,85,247,0.18),_transparent_24%),linear-gradient(135deg,_rgba(15,23,42,0.68),_rgba(2,6,23,0.94))]" />
        <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Campaign command center
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Manage QR campaigns with a cleaner, faster control surface.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Organize assets, track scan momentum, and launch new QR experiences from a
                richer workspace designed for speed and clarity.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/qr-codes/create">
                <Button className="h-12 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-5 text-white shadow-xl shadow-blue-950/30 hover:-translate-y-0.5">
                  <Plus className="mr-2 h-4 w-4" />
                  Create QR Code
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl border-white/10 bg-white/5 px-5 text-slate-100 hover:bg-white/10 hover:text-white"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Open analytics
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <QrCode className="h-4 w-4 text-cyan-300" />
                Total codes
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{qrcodes.length}</p>
              <p className="mt-1 text-sm text-slate-400">Trackable assets across your workspace</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Zap className="h-4 w-4 text-emerald-300" />
                Active campaigns
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{activeCount}</p>
              <p className="mt-1 text-sm text-slate-400">Currently serving live traffic</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Eye className="h-4 w-4 text-violet-300" />
                Total scans
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{totalScans.toLocaleString()}</p>
              <p className="mt-1 text-sm text-slate-400">Engagement captured across all codes</p>
            </div>
          </div>
        </div>
      </section>

      <Card className="border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/20">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 xl:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search QR codes..."
                className="h-12 rounded-2xl border-white/10 bg-slate-950/40 pl-11 text-slate-100 placeholder:text-slate-400 focus-visible:ring-cyan-400/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-12 w-full rounded-2xl border-white/10 bg-slate-950/40 text-slate-100 xl:w-[220px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-slate-900/95 text-slate-100">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="URL">URL</SelectItem>
                <SelectItem value="TEXT">Text</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="VCARD">vCard</SelectItem>
                <SelectItem value="WIFI">WiFi</SelectItem>
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-3 xl:ml-auto xl:w-[320px]">
              <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Dynamic</p>
                <p className="mt-2 text-lg font-semibold text-white">{dynamicCount}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Filtered</p>
                <p className="mt-2 text-lg font-semibold text-white">{filteredQRCodes.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredQRCodes.map((qr) => (
          <Card
            key={qr.id}
            className="group overflow-hidden border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/15 hover:bg-white/[0.06]"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/18 via-blue-500/18 to-violet-500/18 text-cyan-200 shadow-lg shadow-slate-950/20 ring-1 ring-white/10">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-2 text-base text-white">
                      <span className="truncate">{qr.name}</span>
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="border-white/10 bg-white/5 text-xs text-slate-200 hover:bg-white/5">
                        {qr.type}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="h-3 w-3 text-cyan-300" />
                        {formatRelativeTime(qr.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <DropdownMenu >
                  <DropdownMenuTrigger className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white">
                   
                      <MoreVertical className="h-4 w-4" />
                   
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 rounded-2xl border-white/10 bg-slate-900/95 text-slate-100 backdrop-blur-xl"
                  >
                {/**     <DropdownMenuItem >
                      <Link href={`/dashboard/qr-codes/${qr.id}`}>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    */}
                    <DropdownMenuItem >
                      <Link href={`/dashboard/qr-codes/${qr.id}/edit`}>
                        <span className="flex items-center">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(qr.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopyLink(qr.short_code)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare(qr)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(qr, "png")}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PNG
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(qr.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Status</span>
                  <Badge
                    className={
                      qr.status === "ACTIVE"
                        ? "border-emerald-400/20 bg-emerald-400/10 text-xs text-emerald-300 hover:bg-emerald-400/10"
                        : "border-white/10 bg-white/5 text-xs text-slate-300 hover:bg-white/5"
                    }
                  >
                    {qr.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Eye className="h-4 w-4 text-cyan-300" />
                    <span>{qr.scans.toLocaleString()} scans</span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-slate-400">
                    <Layers3 className="h-4 w-4 text-violet-300" />
                    {qr.dynamic ? "Dynamic" : "Static"}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                  <Star className="h-3.5 w-3.5 text-amber-300" />
                  {qr.dynamic ? "Optimized for iteration" : "Fast one-time share"}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white"
                    
                  >
                    <Link href={`/r/${qr.short_code}`} target="_blank">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white"
                    onClick={() => handleDownload(qr, "png")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white"
                    onClick={() => handleShare(qr)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Link href={`/dashboard/qr-codes/${qr.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-300"
                    onClick={() => handleDelete(qr.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQRCodes.length === 0 && (
        <Card className="border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/20">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-200">
                <QrCode className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">No QR codes found</h3>
              <p className="mb-6 text-slate-400">
                {searchQuery || typeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first QR code"}
              </p>
              {!searchQuery && typeFilter === "all" && (
                <Link href="/dashboard/qr-codes/create">
                  <Button className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Create QR Code
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
