import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { BusinessCardTemplatePreview } from "@/components/business-card-template";

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

  const { data: qrCode } = await supabaseAdmin
    .from("qr_codes")
    .select("id, scans")
    .eq("user_id", card.user_id)
    .eq("type", "BUSINESS_CARD")
    .eq("content", card.qr_code_url)
    .single();

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

  await supabaseAdmin.from("qr_code_scans").insert({
    qr_code_id: qrCode.id,
    ip_address: ip,
    user_agent: userAgent,
    device: result.device.type || "desktop",
    browser: result.browser.name || "Unknown",
    os: result.os.name ? `${result.os.name} ${result.os.version || ""}`.trim() : "Unknown",
    country: geo?.country || null,
    city: geo?.city || null,
    referrer: headerStore.get("referer"),
  });

  const visits = (qrCode.scans ?? 0) + 1;
  await supabaseAdmin
    .from("qr_codes")
    .update({ scans: visits })
    .eq("id", qrCode.id);

  return visits;
}

export default async function BusinessCardPublicPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: card } = await supabaseAdmin
    .from("business_cards")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  if (!card || card.status !== "PUBLISHED") {
    notFound();
  }

  await incrementBusinessCardVisit(card);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_35%),linear-gradient(180deg,_#020617,_#0f172a)] px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-7xl">
        <BusinessCardTemplatePreview templateId={card.theme} data={card} clickable />
      </div>
    </main>
  );
}
