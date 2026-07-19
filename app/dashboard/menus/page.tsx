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

const mockRestaurants = [
  {
    id: "1",
    name: "Bella Italia",
    description: "Authentic Italian cuisine",
    address: "123 Main Street, New York",
    phone: "+1 234 567 890",
    email: "info@bellaitalia.com",
    slug: "bella-italia",
    status: "PUBLISHED",
    categories: 4,
    items: 28,
  },
  {
    id: "2",
    name: "Sushi Master",
    description: "Premium Japanese sushi",
    address: "456 Oak Avenue, Los Angeles",
    phone: "+1 234 567 891",
    email: "contact@sushimaster.com",
    slug: "sushi-master",
    status: "PUBLISHED",
    categories: 3,
    items: 45,
  },
  {
    id: "3",
    name: "The Burger Joint",
    description: "Best burgers in town",
    address: "789 Elm Street, Chicago",
    phone: "+1 234 567 892",
    email: "hello@burgerjoint.com",
    slug: "burger-joint",
    status: "DRAFT",
    categories: 2,
    items: 15,
  },
];

export default function RestaurantMenusPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRestaurants = mockRestaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/menu/${slug}`
    );
    toast({
      title: "Copied!",
      description: "Menu link copied to clipboard",
    });
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Deleted",
      description: "Restaurant menu deleted successfully",
    });
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

      {/* Search */}
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

      {/* Restaurants Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRestaurants.map((restaurant) => (
          <Card
            key={restaurant.id}
            className="group hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                    {restaurant.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">
                      {restaurant.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {restaurant.description}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/menus/${restaurant.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/menu/${restaurant.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Preview
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCopyLink(restaurant.slug)}
                    >
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
                  <Badge
                    variant={
                      restaurant.status === "PUBLISHED" ? "success" : "secondary"
                    }
                  >
                    {restaurant.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {restaurant.categories} categories • {restaurant.items} items
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

      {filteredRestaurants.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                No restaurant menus found
              </h3>
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
