/**
 * Server-side data fetching for the dashboard.
 * Uses the Supabase admin client to bypass RLS for user-owned data.
 */

import { supabaseAdmin } from "@/lib/supabase-admin";
import type {
  QRCode,
  BusinessCard,
  Restaurant,
  Folder,
} from "@/types/models";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalQRCodes: number;
  totalScans: number;
  activeCampaigns: number;
  avgClickRate: number;
  qrcodesGrowth: number;
  scansGrowth: number;
}

export interface RecentQRCode {
  id: string;
  name: string;
  type: string;
  scans: number;
  created_at: string;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED" | "DELETED";
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  // Total QR codes
  const { count: totalQRCodes } = await supabaseAdmin
    .from("qr_codes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .neq("status", "DELETED");

  // Total scans across all QR codes
  const { data: scansData } = await supabaseAdmin
    .from("qr_codes")
    .select("scans")
    .eq("user_id", userId)
    .neq("status", "DELETED");

  const totalScans = scansData?.reduce((sum, qr) => sum + (qr.scans ?? 0), 0) ?? 0;

  // Active campaigns (QR codes that are active)
  const { count: activeCampaigns } = await supabaseAdmin
    .from("qr_codes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_active", true)
    .neq("status", "DELETED");

  // Average click rate (scans / QR codes — simplified)
  const avgClickRate = totalQRCodes && totalQRCodes > 0
    ? Number((totalScans / totalQRCodes).toFixed(1))
    : 0;

  // Growth: compare scans this month vs last month
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const { data: recentScans } = await supabaseAdmin
    .from("qr_code_scans")
    .select("scanned_at")
    .in(
      "qr_code_id",
      (await supabaseAdmin
        .from("qr_codes")
        .select("id")
        .eq("user_id", userId)
        .neq("status", "DELETED")).data?.map((qr) => qr.id) ?? []
    )
    .gte("scanned_at", sixtyDaysAgo.toISOString());

  const thisMonth = recentScans?.filter(
    (s) => new Date(s.scanned_at) >= thirtyDaysAgo
  ).length ?? 0;
  const lastMonth = recentScans?.filter(
    (s) => new Date(s.scanned_at) < thirtyDaysAgo
  ).length ?? 0;

  const qrcodesGrowth = totalQRCodes ?? 0;
  const scansGrowth = lastMonth > 0
    ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
    : thisMonth > 0 ? 100 : 0;

  return {
    totalQRCodes: totalQRCodes ?? 0,
    totalScans,
    activeCampaigns: activeCampaigns ?? 0,
    avgClickRate,
    qrcodesGrowth,
    scansGrowth,
  };
}

// ─── Recent QR Codes ──────────────────────────────────────────────────────────

export async function getRecentQRCodes(userId: string, limit = 5): Promise<RecentQRCode[]> {
  const { data, error } = await supabaseAdmin
    .from("qr_codes")
    .select("id, name, type, scans, created_at, status")
    .eq("user_id", userId)
    .neq("status", "DELETED")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as RecentQRCode[];
}

// ─── QR Codes ────────────────────────────────────────────────────────────────

export interface QRCodeFilters {
  search?: string;
  type?: string;
  status?: string;
}

export async function getQRCodes(
  userId: string,
  filters: QRCodeFilters = {}
): Promise<QRCode[]> {
  let query = supabaseAdmin
    .from("qr_codes")
    .select("*")
    .eq("user_id", userId)
    .neq("status", "DELETED")
    .order("created_at", { ascending: false });

  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }
  if (filters.type && filters.type !== "all") {
    query = query.eq("type", filters.type);
  }
  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data as QRCode[];
}

export async function getQRCodeById(userId: string, qrId: string): Promise<QRCode | null> {
  const { data, error } = await supabaseAdmin
    .from("qr_codes")
    .select("*")
    .eq("user_id", userId)
    .eq("id", qrId)
    .neq("status", "DELETED")
    .single();

  if (error || !data) return null;
  return data as QRCode;
}

// ─── Business Cards ──────────────────────────────────────────────────────────

export interface BusinessCardFilters {
  search?: string;
  status?: string;
}

export async function getBusinessCards(
  userId: string,
  filters: BusinessCardFilters = {}
): Promise<BusinessCard[]> {
  let query = supabaseAdmin
    .from("business_cards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
  }
  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  const cards = data as BusinessCard[];
  const publicUrls = cards
    .map((card) => card.qr_code_url)
    .filter((url): url is string => Boolean(url));

  if (publicUrls.length === 0) {
    return cards.map((card) => ({ ...card, visits: 0 }));
  }

  const { data: qrRecords } = await supabaseAdmin
    .from("qr_codes")
    .select("content, scans")
    .eq("user_id", userId)
    .eq("type", "BUSINESS_CARD")
    .in("content", publicUrls);

  const scansByUrl = new Map(
    (qrRecords ?? []).map((record) => [record.content, record.scans ?? 0])
  );

  return cards.map((card) => ({
    ...card,
    visits: card.qr_code_url ? scansByUrl.get(card.qr_code_url) ?? 0 : 0,
  }));
}

// ─── Restaurant Menus ────────────────────────────────────────────────────────

export interface RestaurantFilters {
  search?: string;
  status?: string;
}

export async function getRestaurants(
  userId: string,
  filters: RestaurantFilters = {}
): Promise<Restaurant[]> {
  let query = supabaseAdmin
    .from("restaurants")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }
  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  // Fetch category/item counts per restaurant
  const restaurants = data as Restaurant[];
  const enriched = await Promise.all(
    restaurants.map(async (r) => {
      const { count: categories } = await supabaseAdmin
        .from("menu_categories")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", r.id);

      const { count: items } = await supabaseAdmin
        .from("menu_items")
        .select("*", { count: "exact", head: true })
        .eq("category_id",
          (await supabaseAdmin
            .from("menu_categories")
            .select("id")
            .eq("restaurant_id", r.id)).data?.map((c) => c.id) ?? []
        );

      return { ...r, categories: categories ?? 0, items: items ?? 0 };
    })
  );

  return enriched;
}

// ─── Folders ─────────────────────────────────────────────────────────────────

export async function getFolders(userId: string): Promise<Folder[]> {
  const { data, error } = await supabaseAdmin
    .from("folders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  // Count QR codes per folder
  const folders = data as Folder[];
  const enriched = await Promise.all(
    folders.map(async (f) => {
      const { count: qrCount } = await supabaseAdmin
        .from("qr_codes")
        .select("*", { count: "exact", head: true })
        .eq("folder_id", f.id)
        .neq("status", "DELETED");

      return { ...f, qrCount: qrCount ?? 0 };
    })
  );

  return enriched;
}

// ─── Create / Update / Delete ────────────────────────────────────────────────

export async function createFolder(userId: string, name: string, color?: string) {
  const { data, error } = await supabaseAdmin
    .from("folders")
    .insert({ user_id: userId, name, color })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteFolder(folderId: string) {
  // Clear folder_id from QR codes first
  await supabaseAdmin
    .from("qr_codes")
    .update({ folder_id: null })
    .eq("folder_id", folderId);

  const { error } = await supabaseAdmin
    .from("folders")
    .delete()
    .eq("id", folderId);
  if (error) throw error;
  return { success: true };
}

export async function deleteQRCode(qrId: string) {
  const { error } = await supabaseAdmin
    .from("qr_codes")
    .update({ status: "DELETED" })
    .eq("id", qrId);
  if (error) throw error;
  return { success: true };
}

export async function deleteBusinessCard(cardId: string, userId: string) {
  const { error } = await supabaseAdmin
    .from("business_cards")
    .delete()
    .eq("id", cardId)
    .eq("user_id", userId);
  if (error) throw error;
  return { success: true };
}

export async function deleteRestaurant(restaurantId: string) {
  const { error } = await supabaseAdmin
    .from("restaurants")
    .delete()
    .eq("id", restaurantId);
  if (error) throw error;
  return { success: true };
}

export async function duplicateQRCode(qrId: string, userId: string) {
  const { data: original } = await supabaseAdmin
    .from("qr_codes")
    .select("*")
    .eq("id", qrId)
    .single();

  if (!original) throw new Error("QR code not found");

  const { data, error } = await supabaseAdmin
    .from("qr_codes")
    .insert({
      user_id: userId,
      name: `${original.name} (copy)`,
      type: original.type,
      content: original.content,
      dynamic: original.dynamic,
      foreground_color: original.foreground_color,
      background_color: original.background_color,
      gradient_colors: original.gradient_colors,
      frame_style: original.frame_style,
      eye_style: original.eye_style,
      logo_url: original.logo_url,
      download_format: original.download_format,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
