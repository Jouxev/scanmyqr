"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCodeLib from "qrcode";
import { ArrowLeft, Eye, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { QRCode } from "@/types/models";

type Props = {
  qrCode: QRCode;
};

export default function QRCodeEditor({ qrCode }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState(qrCode.name);
  const [type, setType] = useState(qrCode.type);
  const [content, setContent] = useState(qrCode.content);
  const [foregroundColor, setForegroundColor] = useState(qrCode.foreground_color || "#000000");
  const [backgroundColor, setBackgroundColor] = useState(qrCode.background_color || "#ffffff");
  const [status, setStatus] = useState(qrCode.status);
  const [isActive, setIsActive] = useState(qrCode.is_active);
  const [previewImage, setPreviewImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const trackedUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/r/${qrCode.short_code}`
      : `/r/${qrCode.short_code}`;

  useEffect(() => {
    if (!content.trim()) {
      setPreviewImage("");
      return;
    }

    QRCodeLib.toDataURL(trackedUrl, {
      width: 900,
      margin: 2,
      color: {
        dark: foregroundColor,
        light: backgroundColor,
      },
    })
      .then(setPreviewImage)
      .catch(() => setPreviewImage(""));
  }, [trackedUrl, foregroundColor, backgroundColor, content]);

  const inputClass =
    "h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100 placeholder:text-slate-400 focus-visible:ring-cyan-400/60";

  const handleSave = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "QR code content is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/dashboard/qr-codes/${qrCode.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          content,
          foregroundColor,
          backgroundColor,
          status,
          isActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update QR code");
      }

      toast({
        title: "Saved",
        description: "QR code updated successfully",
      });

      router.push("/dashboard/qr-codes");
      router.refresh();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update QR code",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(168,85,247,0.18),_transparent_24%),linear-gradient(135deg,_rgba(15,23,42,0.68),_rgba(2,6,23,0.94))]" />
        <div className="relative grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              QR editor
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Edit saved QR code
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Update the QR code content, colors, and status while keeping the saved short link
                available for sharing and preview.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-white/10 bg-white/5 px-5 text-slate-100 hover:bg-white/10 hover:text-white"
                onClick={() => router.push("/dashboard/qr-codes")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to QR Codes
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-white/10 bg-white/5 px-5 text-slate-100 hover:bg-white/10 hover:text-white"
                asChild
              >
                <a href={trackedUrl} target="_blank" rel="noreferrer">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="text-sm text-slate-300">Short link</div>
              <p className="mt-3 break-all text-sm font-medium text-white">{trackedUrl}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="text-sm text-slate-300">Type</div>
              <p className="mt-3 text-2xl font-semibold text-white">{type}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="text-sm text-slate-300">Scans</div>
              <p className="mt-3 text-2xl font-semibold text-white">{qrCode.scans.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
          <CardHeader>
            <CardTitle className="text-white">QR Details</CardTitle>
            <CardDescription>Update the saved QR code configuration.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name" className="text-slate-200">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className={inputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-slate-900/95 text-slate-100">
                  <SelectItem value="URL">URL</SelectItem>
                  <SelectItem value="TEXT">Text</SelectItem>
                  <SelectItem value="EMAIL">Email</SelectItem>
                  <SelectItem value="PHONE">Phone</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                  <SelectItem value="LOCATION">Location</SelectItem>
                  <SelectItem value="WIFI">WiFi</SelectItem>
                  <SelectItem value="VCARD">vCard</SelectItem>
                  <SelectItem value="SOCIAL">Social</SelectItem>
                  <SelectItem value="BUSINESS_CARD">Business Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as QRCode["status"])}>
                <SelectTrigger className={inputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-slate-900/95 text-slate-100">
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="content" className="text-slate-200">
                Content
              </Label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex min-h-[180px] w-full rounded-[1.5rem] border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Foreground Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="h-12 w-16 rounded-2xl border border-white/10 bg-slate-950/40"
                />
                <Input value={foregroundColor} onChange={(e) => setForegroundColor(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Background Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-12 w-16 rounded-2xl border border-white/10 bg-slate-950/40"
                />
                <Input value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className={inputClass} />
              </div>
            </div>

            <label className="md:col-span-2 flex items-center gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <div>
                <div className="text-sm font-medium text-white">Active QR code</div>
                <div className="text-xs text-slate-400">Inactive QR codes no longer resolve from the short link.</div>
              </div>
            </label>

            <div className="md:col-span-2 flex justify-end">
              <Button
                className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 text-white"
                onClick={handleSave}
                loading={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
          <CardHeader>
            <CardTitle className="text-white">Live Preview</CardTitle>
            <CardDescription>The downloaded QR code encodes the tracked short link.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-6">
              {previewImage ? (
                <img src={previewImage} alt={name || "QR code preview"} className="h-64 w-64 rounded-2xl" />
              ) : (
                <div className="flex h-64 w-64 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/40 text-sm text-slate-400">
                  Add content to preview
                </div>
              )}
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Tracked Link</div>
              <div className="mt-3 break-all text-sm text-slate-200">{trackedUrl}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
