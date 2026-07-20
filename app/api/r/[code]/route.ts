import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { UAParser } from "ua-parser-js";
import type { Database } from "@/types/database";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shortCode = searchParams.get("code");

    if (!shortCode) {
      return NextResponse.json({ message: "Short code is required" }, { status: 400 });
    }

    const qrCodesTable = supabaseAdmin.from("qr_codes") as any;
    const { data: qrCode } = (await qrCodesTable
      .select("id, content, type, name, user_id")
      .eq("short_code", shortCode)
      .eq("is_active", true)
      .single()) as {
      data: { id: string; content: string; type: string; name: string; user_id: string } | null;
    };

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
    };
    const { data: scan } = await qrCodeScansTable
      .insert([scanInsert])
      .select()
      .single();

    // Increment scan count on QR code
    const { data: updated } = (await qrCodesTable
      .select("scans")
      .eq("id", qrCode.id)
      .single()) as { data: { scans: number | null } | null };

    const qrCodeUpdate: Database["public"]["Tables"]["qr_codes"]["Update"] = {
      scans: (updated?.scans ?? 0) + 1,
    };
    await qrCodesTable
      .update(qrCodeUpdate)
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
