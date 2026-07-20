"use client";

import { useState } from "react";
import Link from "next/link";
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
  QrCode,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Download,
  Eye,
  Star,
  Share2,
  Clock,
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

  const filteredQRCodes = qrcodes.filter((qr) => {
    const matchesSearch = qr.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || qr.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCopyLink = async (qrId: string, shortCode: string) => {
    const url = `${window.location.origin}/r/${shortCode}`;
    await navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: "QR code link copied to clipboard" });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QR Codes</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your QR codes
          </p>
        </div>
        <Link href="/dashboard/qr-codes/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create QR Code
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search QR codes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="URL">URL</SelectItem>
                <SelectItem value="TEXT">Text</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="VCARD">vCard</SelectItem>
                <SelectItem value="WIFI">WiFi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredQRCodes.map((qr) => (
          <Card key={qr.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <QrCode className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="truncate">{qr.name}</span>
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {qr.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(qr.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-md p-1 text-muted-foreground hover:text-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/qr-codes/${qr.id}`}>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
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
                    <DropdownMenuItem onClick={() => handleCopyLink(qr.id, qr.short_code)}>
                      <Download className="h-4 w-4 mr-2" />
                      Copy Link
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{qr.scans.toLocaleString()} scans</span>
                  </div>
                  <Badge
                    variant={qr.status === "ACTIVE" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {qr.status}
                  </Badge>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQRCodes.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <QrCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No QR codes found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || typeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first QR code"}
              </p>
              {!searchQuery && typeFilter === "all" && (
                <Link href="/dashboard/qr-codes/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
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
