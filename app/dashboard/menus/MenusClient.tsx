"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Restaurant Menus</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your restaurant menus
          </p>
        </div>
        <Link href="/dashboard/menus/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Menu
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search restaurants..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((restaurant) => (
          <Card key={restaurant.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                    {restaurant.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">{restaurant.name}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {restaurant.description}
                    </p>
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
              <div className="space-y-2 mb-4">
                {restaurant.address && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{restaurant.address}</span>
                  </div>
                )}
                {restaurant.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{restaurant.phone}</span>
                  </div>
                )}
                {restaurant.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{restaurant.email}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Badge variant={restaurant.status === "PUBLISHED" ? "default" : "secondary"}>
                    {restaurant.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {restaurant.categories} categories &bull; {restaurant.items} items
                  </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/menu/${restaurant.slug}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <UtensilsCrossed className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No restaurant menus found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Get started by creating your first restaurant menu"}
              </p>
              {!searchQuery && (
                <Link href="/dashboard/menus/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
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
