import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { BusinessCardTemplatePreview } from "@/components/business-card-template";
import type { BusinessCardTemplateData } from "@/components/business-card-template";
import type { Database } from "@/types/database";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function incrementBusinessCardVisit(card: {
  id: string;
  user_id: string;
  qr_code_url: string | null;
}) {
  if (!card.qr_code_url) {
    return 0;
  }

  const qrCodesTable = supabaseAdmin.from("qr_codes") as any;
  const { data: qrCode } = (await qrCodesTable
    .select("id, scans")
    .eq("user_id", card.user_id)
    .eq("type", "BUSINESS_CARD")
    .eq("content", card.qr_code_url)
    .single()) as { data: { id: string; scans: number | null } | null };

  if (!qrCode) {
    return 0;
  }

  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent") || "";
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  const forwardedFor = headerStore.get("x-forwarded-for") || "unknown";
  const ip = forwardedFor.split(",")[0].trim();
  let geo: { country?: string | null; city?: string | null } | null = null;

  try {
    const geoip = await import("geoip-lite");
    geo = geoip.default.lookup(ip);
  } catch {
    // Geolocation is optional for public-card visits.
  }

  const qrCodeScansTable = supabaseAdmin.from("qr_code_scans") as any;
  const scanInsert: Database["public"]["Tables"]["qr_code_scans"]["Insert"] = {
    qr_code_id: qrCode.id,
    ip_address: ip,
    user_agent: userAgent,
    device: result.device.type || "desktop",
    browser: result.browser.name || "Unknown",
    os: result.os.name ? `${result.os.name} ${result.os.version || ""}`.trim() : "Unknown",
    country: geo?.country || null,
    city: geo?.city || null,
    referrer: headerStore.get("referer"),
  };
  await qrCodeScansTable.insert([scanInsert]);

  const visits = (qrCode.scans ?? 0) + 1;
  const qrCodeUpdate: Database["public"]["Tables"]["qr_codes"]["Update"] = { scans: visits };
  await qrCodesTable
    .update(qrCodeUpdate)
    .eq("id", qrCode.id);

  return visits;
}

export default async function BusinessCardPublicPage({ params }: PageProps) {
  const { slug } = await params;

  const businessCardsTable = supabaseAdmin.from("business_cards") as any;
  const { data: card } = (await businessCardsTable
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .single()) as { data: Database["public"]["Tables"]["business_cards"]["Row"] | null };

  if (!card || card.status !== "PUBLISHED") {
    notFound();
  }

  await incrementBusinessCardVisit(card);
  const cardData: BusinessCardTemplateData = {
    ...card,
    custom_links:
      card.custom_links && typeof card.custom_links === "object" && !Array.isArray(card.custom_links)
        ? card.custom_links
        : null,
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_35%),linear-gradient(180deg,_#020617,_#0f172a)] px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-7xl">
        <BusinessCardTemplatePreview templateId={card.theme} data={cardData} clickable />
      </div>
    </main>
  );
}
