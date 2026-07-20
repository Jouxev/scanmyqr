import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/auth-session";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Database } from "@/types/database";

export async function GET(request: Request) {
  try {
    const session = await getAppSession(request);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const qrCodeId = searchParams.get("qrCodeId");

    if (!qrCodeId) {
      return NextResponse.json({ message: "QR code ID is required" }, { status: 400 });
    }

    const userId = (session.user as any).id;

    const qrCodesTable = supabaseAdmin.from("qr_codes") as any;
    const { data: qrCode } = (await qrCodesTable
      .select("id")
      .eq("id", qrCodeId)
      .eq("user_id", userId)
      .single()) as { data: Pick<Database["public"]["Tables"]["qr_codes"]["Row"], "id"> | null };

    if (!qrCode) {
      return NextResponse.json({ message: "QR code not found" }, { status: 404 });
    }

    const { data: scans } = await supabaseAdmin
      .from("qr_code_scans")
      .select("*")
      .eq("qr_code_id", qrCodeId)
      .order("scanned_at", { ascending: false })
      .limit(100);

    return NextResponse.json({ scans: scans ?? [], analytics: [] });
  } catch (error) {
    console.error("Error fetching QR code analytics:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

