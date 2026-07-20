import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { UAParser } from "ua-parser-js";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shortCode = searchParams.get("code");

    if (!shortCode) {
      return NextResponse.json({ message: "Short code is required" }, { status: 400 });
    }

    const { data: qrCode } = await supabaseAdmin
      .from("qr_codes")
      .select("id, content, type, name, user_id")
      .eq("short_code", shortCode)
      .eq("is_active", true)
      .single();

    if (!qrCode) {
      return NextResponse.json({ message: "QR code not found" }, { status: 404 });
    }

    // Get client info
    const userAgent = request.headers.get("user-agent") || "";
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    let geo: { country?: string | null; city?: string | null } | null = null;

    try {
      const geoip = await import("geoip-lite");
      geo = geoip.default.lookup(ip);
    } catch {
      // Geolocation is optional for QR scan tracking.
    }

    // Create scan record
    const { data: scan } = await supabaseAdmin
      .from("qr_code_scans")
      .insert({
        qr_code_id: qrCode.id,
        ip_address: ip,
        user_agent: userAgent,
        device: result.device.type || "desktop",
        browser: result.browser.name || "Unknown",
        os: result.os.name ? `${result.os.name} ${result.os.version || ""}`.trim() : "Unknown",
        country: geo?.country || null,
        city: geo?.city || null,
      })
      .select()
      .single();

    // Increment scan count on QR code
    const { data: updated } = await supabaseAdmin
      .from("qr_codes")
      .select("scans")
      .eq("id", qrCode.id)
      .single();

    await supabaseAdmin
      .from("qr_codes")
      .update({ scans: (updated?.scans ?? 0) + 1 })
      .eq("id", qrCode.id);

    return NextResponse.json({
      content: qrCode.content,
      type: qrCode.type,
      name: qrCode.name,
      scanId: scan?.id,
    });
  } catch (error) {
    console.error("Error resolving QR code:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
