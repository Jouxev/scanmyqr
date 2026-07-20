"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  MoreVertical,
  Globe,
  Mail,
  Phone,
  BarChart3,
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Cards</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your digital business cards
          </p>
        </div>
        <Link href="/dashboard/business-cards/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Business Card
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search business cards..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCards.map((card) => (
          <Card key={card.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {card.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{card.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {card.title} at {card.company}
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
              <div className="space-y-2 mb-4">
                {card.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{card.email}</span>
                  </div>
                )}
                {card.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{card.phone}</span>
                  </div>
                )}
                {card.website && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span className="truncate">{card.website}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Badge variant={card.status === "PUBLISHED" ? "default" : "secondary"}>
                    {card.status}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <BarChart3 className="h-3.5 w-3.5" />
                    {card.visits ?? 0} visits
                  </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/card/${card.slug}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <CreditCard className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No business cards found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Get started by creating your first business card"}
              </p>
              {!searchQuery && (
                <Link href="/dashboard/business-cards/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
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
