/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps, @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  ChevronRight,
  Copy,
  Download,
  FileText,
  Filter,
  Globe,
  Link2,
  Mail,
  MapPin,
  MessageSquare,
  Palette,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  Wifi,
  Wand2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const qrTypes = [
  { value: "url", label: "Website URL", icon: Link2 },
  { value: "text", label: "Plain Text", icon: FileText },
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone Number", icon: Phone },
  { value: "sms", label: "SMS", icon: MessageSquare },
  { value: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { value: "location", label: "Location", icon: MapPin },
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "vcard", label: "vCard", icon: User },
  { value: "social", label: "Social Media", icon: Globe },
];

export default function CreateQRCodePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [qrType, setQrType] = useState("url");
  const [qrData, setQrData] = useState({
    url: "",
    text: "",
    email: "",
    subject: "",
    body: "",
    phone: "",
    message: "",
    latitude: "",
    longitude: "",
    wifiName: "",
    wifiPassword: "",
    wifiType: "WPA",
    name: "",
    title: "",
    company: "",
    website: "",
    bio: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    github: "",
    youtube: "",
  });
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [qrImage, setQrImage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const inputClass =
    "h-12 rounded-2xl border-white/10 bg-slate-950/40 text-slate-100 placeholder:text-slate-400 focus-visible:ring-cyan-400/60";

  useEffect(() => {
    generateQRCode();
  }, [qrType, qrData, foregroundColor, backgroundColor]);

  const generateContent = () => {
    switch (qrType) {
      case "url":
        return qrData.url;
      case "text":
        return qrData.text;
      case "email":
        return `mailto:${qrData.email}?subject=${encodeURIComponent(qrData.subject)}&body=${encodeURIComponent(qrData.body)}`;
      case "phone":
        return `tel:${qrData.phone}`;
      case "sms":
        return `sms:${qrData.phone}?body=${encodeURIComponent(qrData.message)}`;
      case "whatsapp":
        return `https://wa.me/${qrData.phone.replace(/\D/g, "")}?text=${encodeURIComponent(qrData.message)}`;
      case "location":
        return `geo:${qrData.latitude},${qrData.longitude}`;
      case "wifi":
        return `WIFI:T:${qrData.wifiType};S:${qrData.wifiName};P:${qrData.wifiPassword};;`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nN:${qrData.name}\nTITLE:${qrData.title}\nORG:${qrData.company}\nURL:${qrData.website}\nEND:VCARD`;
      case "social":
        const socials = [];
        if (qrData.facebook) socials.push(`FB:${qrData.facebook}`);
        if (qrData.twitter) socials.push(`TW:${qrData.twitter}`);
        if (qrData.instagram) socials.push(`IG:${qrData.instagram}`);
        if (qrData.linkedin) socials.push(`LI:${qrData.linkedin}`);
        if (qrData.github) socials.push(`GH:${qrData.github}`);
        if (qrData.youtube) socials.push(`YT:${qrData.youtube}`);
        return socials.join("\n");
      default:
        return qrData.url;
    }
  };

  const generateQRCode = async () => {
    const content = generateContent();
    if (!content) return;

    setIsGenerating(true);
    try {
      const canvas = document.createElement("canvas");
      await QRCode.toCanvas(canvas, content, {
        width: 400,
        margin: 2,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
      });
      setQrImage(canvas.toDataURL("image/png"));
    } catch (_error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (format: "png" | "svg" | "pdf") => {
    if (!qrImage) return;

    if (format === "png") {
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = qrImage;
      link.click();
    } else if (format === "svg") {
      const content = generateContent();
      QRCode.toString(content, { type: "svg" }).then((svg) => {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "qrcode.svg";
        link.href = url;
        link.click();
      });
    }
  };

  const handleCopyToClipboard = () => {
    if (qrImage) {
      fetch(qrImage)
        .then((res) => res.blob())
        .then((blob) => {
          navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          toast({
            title: "Copied!",
            description: "QR code copied to clipboard",
          });
        });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/qr-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: qrType.toUpperCase(),
          content: generateContent(),
          name: qrData.name || "Untitled QR Code",
          foregroundColor,
          backgroundColor,
        }),
      });

      if (!response.ok) throw new Error("Failed to save QR code");

      toast({
        title: "Success!",
        description: "QR code saved successfully",
      });
      router.push("/dashboard/qr-codes");
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to save QR code",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderFormFields = () => {
    switch (qrType) {
      case "url":
        return (
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={qrData.url}
              onChange={(e) =>
                setQrData({ ...qrData, url: e.target.value })
              }
            />
          </div>
        );
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor="text">Text Content</Label>
            <textarea
              id="text"
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter your text here..."
              value={qrData.text}
              onChange={(e) =>
                setQrData({ ...qrData, text: e.target.value })
              }
            />
          </div>
        );
      case "email":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={qrData.email}
                onChange={(e) =>
                  setQrData({ ...qrData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                value={qrData.subject}
                onChange={(e) =>
                  setQrData({ ...qrData, subject: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <textarea
                id="body"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Email body"
                value={qrData.body}
                onChange={(e) =>
                  setQrData({ ...qrData, body: e.target.value })
                }
              />
            </div>
          </div>
        );
      case "phone":
        return (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={qrData.phone}
              onChange={(e) =>
                setQrData({ ...qrData, phone: e.target.value })
              }
            />
          </div>
        );
      case "sms":
      case "whatsapp":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={qrData.phone}
                onChange={(e) =>
                  setQrData({ ...qrData, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Your message"
                value={qrData.message}
                onChange={(e) =>
                  setQrData({ ...qrData, message: e.target.value })
                }
              />
            </div>
          </div>
        );
      case "location":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  placeholder="40.7128"
                  value={qrData.latitude}
                  onChange={(e) =>
                    setQrData({ ...qrData, latitude: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  placeholder="-74.0060"
                  value={qrData.longitude}
                  onChange={(e) =>
                    setQrData({ ...qrData, longitude: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        );
      case "wifi":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wifiName">Network Name</Label>
              <Input
                id="wifiName"
                placeholder="Network name"
                value={qrData.wifiName}
                onChange={(e) =>
                  setQrData({ ...qrData, wifiName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wifiPassword">Password</Label>
              <Input
                id="wifiPassword"
                type="password"
                placeholder="Network password"
                value={qrData.wifiPassword}
                onChange={(e) =>
                  setQrData({ ...qrData, wifiPassword: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Security Type</Label>
              <Select
                value={qrData.wifiType}
                onValueChange={(value) =>
                  setQrData({ ...qrData, wifiType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA/WPA2</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case "vcard":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={qrData.name}
                onChange={(e) =>
                  setQrData({ ...qrData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="CEO"
                  value={qrData.title}
                  onChange={(e) =>
                    setQrData({ ...qrData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Acme Inc"
                  value={qrData.company}
                  onChange={(e) =>
                    setQrData({ ...qrData, company: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://example.com"
                value={qrData.website}
                onChange={(e) =>
                  setQrData({ ...qrData, website: e.target.value })
                }
              />
            </div>
          </div>
        );
      case "social":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  placeholder="username"
                  value={qrData.facebook}
                  onChange={(e) =>
                    setQrData({ ...qrData, facebook: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  placeholder="username"
                  value={qrData.twitter}
                  onChange={(e) =>
                    setQrData({ ...qrData, twitter: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  placeholder="username"
                  value={qrData.instagram}
                  onChange={(e) =>
                    setQrData({ ...qrData, instagram: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  placeholder="username"
                  value={qrData.linkedin}
                  onChange={(e) =>
                    setQrData({ ...qrData, linkedin: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  placeholder="username"
                  value={qrData.github}
                  onChange={(e) =>
                    setQrData({ ...qrData, github: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  placeholder="channel"
                  value={qrData.youtube}
                  onChange={(e) =>
                    setQrData({ ...qrData, youtube: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
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
              QR creation studio
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Create QR Code
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Build a polished QR experience with faster type selection, live preview, and
                premium styling controls in one workflow.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-white/10 bg-white/5 px-5 text-slate-100 hover:bg-white/10 hover:text-white"
                onClick={() => setQrType("url")}
              >
                <Filter className="mr-2 h-4 w-4" />
                Start with type
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-white/10 bg-white/5 px-5 text-slate-100 hover:bg-white/10 hover:text-white"
                onClick={generateQRCode}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Refresh preview
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Link2 className="h-4 w-4 text-cyan-300" />
                Selected type
              </div>
              <p className="mt-3 text-2xl font-semibold capitalize text-white">{qrType}</p>
              <p className="mt-1 text-sm text-slate-400">Switch between link, contact, social, and more</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Palette className="h-4 w-4 text-emerald-300" />
                Color mode
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">Custom</p>
              <p className="mt-1 text-sm text-slate-400">Foreground and background are fully editable</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <ShieldCheck className="h-4 w-4 text-violet-300" />
                Preview state
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">{qrImage ? "Ready" : "Draft"}</p>
              <p className="mt-1 text-sm text-slate-400">Live output updates as your content changes</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* QR Type Selection */}
          <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
            <CardHeader>
              <CardTitle className="text-white">QR Code Type</CardTitle>
              <CardDescription>
                Select the type of content for your QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {qrTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setQrType(type.value)}
                    className={`rounded-[1.5rem] border p-4 text-left transition-all duration-300 ${
                      qrType === type.value
                        ? "border-cyan-300/20 bg-gradient-to-br from-cyan-400/12 via-blue-500/10 to-violet-500/12 shadow-lg shadow-slate-950/20"
                        : "border-white/10 bg-slate-950/35 hover:border-cyan-300/15 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200">
                      <type.icon className="h-5 w-5" />
                    </div>
                    <div className="text-xs font-medium text-white">{type.label}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Form */}
          <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
            <CardHeader>
              <CardTitle className="text-white">Content</CardTitle>
              <CardDescription>
                Enter the content for your QR code
              </CardDescription>
            </CardHeader>
            <CardContent>{renderFormFields()}</CardContent>
          </Card>

          {/* Customization */}
          <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
            <CardHeader>
              <CardTitle className="text-white">Customization</CardTitle>
              <CardDescription>
                Customize the appearance of your QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Foreground Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={foregroundColor}
                      onChange={(e) =>
                        setForegroundColor(e.target.value)
                      }
                      className="h-12 w-20 rounded-2xl border border-white/10 bg-slate-950/40 cursor-pointer"
                    />
                    <Input
                      value={foregroundColor}
                      onChange={(e) =>
                        setForegroundColor(e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-200">Background Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) =>
                        setBackgroundColor(e.target.value)
                      }
                      className="h-12 w-20 rounded-2xl border border-white/10 bg-slate-950/40 cursor-pointer"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) =>
                        setBackgroundColor(e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview & Actions */}
        <div className="space-y-6">
          {/* QR Preview */}
          <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
            <CardHeader>
              <CardTitle className="text-white">Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {qrImage ? (
                <div className="relative group">
                  <img
                    src={qrImage}
                    alt="QR Code"
                    className="rounded-[1.5rem] shadow-2xl shadow-slate-950/30"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCopyToClipboard}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex h-64 w-64 items-center justify-center rounded-[1.5rem] border border-white/10 bg-slate-950/40">
                  <p className="text-slate-400">
                    {isGenerating ? "Generating..." : "Enter content to generate"}
                  </p>
                </div>
              )}

              <div className="mt-6 w-full space-y-2">
                <Button
                  variant="outline"
                  className="w-full rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
                  onClick={() => handleDownload("png")}
                  disabled={!qrImage}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PNG
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
                  onClick={() => handleDownload("svg")}
                  disabled={!qrImage}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download SVG
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Actions */}
          <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-200">QR Code Name</Label>
                  <Input
                    id="name"
                    placeholder="My QR Code"
                    value={qrData.name}
                    onChange={(e) =>
                      setQrData({ ...qrData, name: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <Button
                  className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 text-white"
                  onClick={handleSave}
                  loading={isSaving}
                  disabled={!qrImage}
                >
                  Save QR Code
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
