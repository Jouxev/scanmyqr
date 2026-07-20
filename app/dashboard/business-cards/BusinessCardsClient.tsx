"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CreditCard,
  BarChart3,
  Copy,
  Edit,
  ExternalLink,
  Eye,
  Globe,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  Wifi,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { BusinessCard } from "@/types/models";

interface BusinessCardsClientProps {
  initialCards: BusinessCard[];
}

export default function BusinessCardsClient({ initialCards }: BusinessCardsClientProps) {
  const { toast } = useToast();
  const [cards, setCards] = useState<BusinessCard[]>(initialCards);
  const [searchQuery, setSearchQuery] = useState("");

  const publicCards = cards.filter((card) => card.is_public).length;
  const totalVisits = cards.reduce((sum, card) => sum + (card.visits ?? 0), 0);

  const filteredCards = cards.filter(
    (card) =>
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (card.company?.toLowerCase() ?? "").includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = async (slug: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/card/${slug}`);
    toast({ title: "Copied!", description: "Business card link copied to clipboard" });
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/business-cards/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setCards((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Deleted", description: "Business card deleted successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to delete business card", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_28%),radial-gradient(circle_at_80%_15%,_rgba(168,85,247,0.18),_transparent_24%),linear-gradient(135deg,_rgba(15,23,42,0.68),_rgba(2,6,23,0.94))]" />
        <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Premium card workspace
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Manage every digital business card from one polished hub.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Refine contact experiences, keep public profiles current, and monitor visit
                momentum across your branded digital cards.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/business-cards/create">
                <Button className="h-12 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-5 text-white shadow-xl shadow-blue-950/30 hover:-translate-y-0.5">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Business Card
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl border-white/10 bg-white/5 px-5 text-slate-100 hover:bg-white/10 hover:text-white"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View performance
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CreditCard className="h-4 w-4 text-cyan-300" />
                Total cards
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{cards.length}</p>
              <p className="mt-1 text-sm text-slate-400">All business profiles in your workspace</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Wifi className="h-4 w-4 text-emerald-300" />
                Public cards
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{publicCards}</p>
              <p className="mt-1 text-sm text-slate-400">Profiles accessible from their public links</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Eye className="h-4 w-4 text-violet-300" />
                Total visits
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{totalVisits.toLocaleString()}</p>
              <p className="mt-1 text-sm text-slate-400">Recorded visits across published cards</p>
            </div>
          </div>
        </div>
      </section>

      <Card className="border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/20">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search business cards..."
              className="h-12 rounded-2xl border-white/10 bg-slate-950/40 pl-11 text-slate-100 placeholder:text-slate-400 focus-visible:ring-cyan-400/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredCards.map((card) => (
          <Card
            key={card.id}
            className="group overflow-hidden border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/15 hover:bg-white/[0.06]"
          >
            <CardHeader className="relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-cyan-400/12 via-blue-500/10 to-violet-500/12" />
              <div className="flex items-start justify-between">
                <div className="z-10 flex items-start gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-violet-500/20 text-lg font-bold text-white shadow-lg shadow-slate-950/20 ring-1 ring-white/10">
                    {card.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base text-white">{card.name}</CardTitle>
                      <Badge
                        className={
                          card.status === "PUBLISHED"
                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/10"
                            : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/5"
                        }
                      >
                        {card.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {[card.title, card.company].filter(Boolean).join(" at ") || "Digital business identity"}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="z-10 rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 rounded-2xl border-white/10 bg-slate-900/95 text-slate-100 backdrop-blur-xl"
                  >
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/business-cards/${card.id}`}>
                        <span className="flex items-center">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/card/${card.slug}`} target="_blank">
                        <span className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Preview
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopyLink(card.slug)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(card.id)}
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
              <div className="mb-5 grid gap-3">
                {card.email && (
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2 text-sm text-slate-300">
                    <Mail className="h-4 w-4 text-cyan-300" />
                    <span className="truncate">{card.email}</span>
                  </div>
                )}
                {card.phone && (
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2 text-sm text-slate-300">
                    <Phone className="h-4 w-4 text-emerald-300" />
                    <span>{card.phone}</span>
                  </div>
                )}
                {card.website && (
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2 text-sm text-slate-300">
                    <Globe className="h-4 w-4 text-violet-300" />
                    <span className="truncate">{card.website}</span>
                  </div>
                )}
              </div>

              <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Visibility</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                    {card.is_public ? "Public" : "Private"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm text-slate-300">
                    <BarChart3 className="h-4 w-4 text-cyan-300" />
                    {card.visits ?? 0} visits
                  </span>
                  <span className="text-sm text-slate-400">{card.theme || "executive"} theme</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  {card.status === "PUBLISHED" ? "Live profile" : "Needs attention"}
                </span>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white"
                    asChild
                  >
                    <Link href={`/card/${card.slug}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Link href={`/dashboard/business-cards/${card.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <Card className="border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/20">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-200">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">No business cards found</h3>
              <p className="mb-6 text-slate-400">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Get started by creating your first business card"}
              </p>
              {!searchQuery && (
                <Link href="/dashboard/business-cards/create">
                  <Button className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Business Card
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
