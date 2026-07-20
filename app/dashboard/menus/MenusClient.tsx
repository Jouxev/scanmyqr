"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpenCheck,
  UtensilsCrossed,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  MoreVertical,
  MapPin,
  Phone,
  Mail,
  Eye,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { Restaurant } from "@/types/models";

interface RestaurantWithCounts extends Restaurant {
  categories: number;
  items: number;
}

interface MenusClientProps {
  initialRestaurants: RestaurantWithCounts[];
}

export default function MenusClient({ initialRestaurants }: MenusClientProps) {
  const { toast } = useToast();
  const [restaurants, setRestaurants] = useState<RestaurantWithCounts[]>(initialRestaurants);
  const [searchQuery, setSearchQuery] = useState("");
  const publishedCount = restaurants.filter((restaurant) => restaurant.status === "PUBLISHED").length;
  const totalItems = restaurants.reduce((sum, restaurant) => sum + (restaurant.items ?? 0), 0);

  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description?.toLowerCase() ?? "").includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = async (slug: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/menu/${slug}`);
    toast({ title: "Copied!", description: "Menu link copied to clipboard" });
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/menus/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Deleted", description: "Restaurant menu deleted successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to delete menu", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.16),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(239,68,68,0.18),_transparent_24%),linear-gradient(135deg,_rgba(15,23,42,0.68),_rgba(2,6,23,0.94))]" />
        <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-orange-200">
              <Sparkles className="h-3.5 w-3.5" />
              Restaurant menu hub
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Launch richer menu experiences with a more premium operations view.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Manage public menu destinations, organize dining content, and keep each
                restaurant presentation polished from one unified dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/menus/create">
                <Button className="h-12 rounded-2xl bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 px-5 text-white shadow-xl shadow-rose-950/30 hover:-translate-y-0.5">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Menu
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl border-white/10 bg-white/5 px-5 text-slate-100 hover:bg-white/10 hover:text-white"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View traffic
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <UtensilsCrossed className="h-4 w-4 text-orange-300" />
                Total menus
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{restaurants.length}</p>
              <p className="mt-1 text-sm text-slate-400">Restaurant experiences in your workspace</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <BookOpenCheck className="h-4 w-4 text-emerald-300" />
                Published
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{publishedCount}</p>
              <p className="mt-1 text-sm text-slate-400">Menus currently visible to customers</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Eye className="h-4 w-4 text-violet-300" />
                Menu items
              </div>
              <p className="mt-3 text-3xl font-semibold text-white">{totalItems}</p>
              <p className="mt-1 text-sm text-slate-400">Dish entries managed across all menus</p>
            </div>
          </div>
        </div>
      </section>

      <Card className="border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/20">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search restaurants..."
              className="h-12 rounded-2xl border-white/10 bg-slate-950/40 pl-11 text-slate-100 placeholder:text-slate-400 focus-visible:ring-orange-400/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((restaurant) => (
          <Card
            key={restaurant.id}
            className="group overflow-hidden border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20 transition-all duration-300 hover:-translate-y-1 hover:border-orange-300/15 hover:bg-white/[0.06]"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 text-lg font-bold text-white shadow-lg shadow-slate-950/20 ring-1 ring-white/10">
                    {restaurant.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base text-white">{restaurant.name}</CardTitle>
                      <Badge
                        className={
                          restaurant.status === "PUBLISHED"
                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/10"
                            : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/5"
                        }
                      >
                        {restaurant.status}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-400">
                      {restaurant.description}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 rounded-2xl border-white/10 bg-slate-900/95 text-slate-100 backdrop-blur-xl"
                  >
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/menus/${restaurant.id}`}>
                        <span className="flex items-center">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/menu/${restaurant.slug}`} target="_blank">
                        <span className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Preview
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopyLink(restaurant.slug)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(restaurant.id)}
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
                {restaurant.address && (
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2 text-sm text-slate-300">
                    <MapPin className="h-4 w-4 text-orange-300" />
                    <span className="truncate">{restaurant.address}</span>
                  </div>
                )}
                {restaurant.phone && (
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2 text-sm text-slate-300">
                    <Phone className="h-4 w-4 text-emerald-300" />
                    <span>{restaurant.phone}</span>
                  </div>
                )}
                {restaurant.email && (
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-2 text-sm text-slate-300">
                    <Mail className="h-4 w-4 text-violet-300" />
                    <span className="truncate">{restaurant.email}</span>
                  </div>
                )}
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Catalog</span>
                  <span className="text-xs text-slate-400">
                    {restaurant.categories} categories &bull; {restaurant.items} items
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Customer-facing menu
                  </span>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white"
                      asChild
                    >
                    <Link href={`/menu/${restaurant.slug}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                    <Link href={`/dashboard/menus/${restaurant.id}`}>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="border-white/10 bg-white/[0.04] shadow-xl shadow-slate-950/20">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400/20 to-rose-500/20 text-orange-200">
                <UtensilsCrossed className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">No restaurant menus found</h3>
              <p className="mb-6 text-slate-400">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Get started by creating your first restaurant menu"}
              </p>
              {!searchQuery && (
                <Link href="/dashboard/menus/create">
                  <Button className="rounded-2xl bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Menu
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
