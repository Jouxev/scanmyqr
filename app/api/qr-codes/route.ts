import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getAppSession } from "@/lib/auth-session";
import { getQRCodes } from "@/lib/dashboard-data";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Database } from "@/types/database";

export async function GET(request: Request) {
  try {
    const session = await getAppSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? undefined;
    const type = searchParams.get("type") ?? undefined;

    const userId = (session.user as any).id;
    const qrcodes = await getQRCodes(userId, { search, type });

    return NextResponse.json({ qrCodes: qrcodes, total: qrcodes.length });
  } catch (error) {
    console.error("Error fetching QR codes:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAppSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name =
      typeof body?.name === "string" && body.name.trim()
        ? body.name.trim()
        : "Untitled QR Code";
    const type =
      typeof body?.type === "string" && body.type.trim()
        ? body.type.trim().toUpperCase()
        : null;
    const content =
      typeof body?.content === "string" && body.content.trim()
        ? body.content.trim()
        : null;

    if (!type || !content) {
      return NextResponse.json(
        { message: "QR code type and content are required" },
        { status: 400 }
      );
    }

    const shortCode = randomUUID().replace(/-/g, "").slice(0, 12);
    const qrCodeInsert: Database["public"]["Tables"]["qr_codes"]["Insert"] = {
      user_id: (session.user as any).id,
      name,
      type,
      content,
      short_code: shortCode,
      dynamic: false,
      is_active: true,
      status: "ACTIVE",
      scans: 0,
      foreground_color:
        typeof body?.foregroundColor === "string" && body.foregroundColor.trim()
          ? body.foregroundColor
          : "#000000",
      background_color:
        typeof body?.backgroundColor === "string" && body.backgroundColor.trim()
          ? body.backgroundColor
          : "#ffffff",
    };
    const qrCodesTable = supabaseAdmin.from("qr_codes") as any;
    const { data: qrCode, error } = await qrCodesTable
      .insert([qrCodeInsert])
      .select()
      .single();

    if (error || !qrCode) {
      return NextResponse.json(
        { message: error?.message || "Failed to create QR code" },
        { status: 500 }
      );
    }

    return NextResponse.json({ qrCode }, { status: 201 });
  } catch (error) {
    console.error("Error creating QR code:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
