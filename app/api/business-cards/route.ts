import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getAppSession } from "@/lib/auth-session";
import { getBusinessCards } from "@/lib/dashboard-data";
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
    const status = searchParams.get("status") ?? undefined;

    const userId = (session.user as any).id;
    const cards = await getBusinessCards(userId, { search, status });

    return NextResponse.json({ businessCards: cards, total: cards.length });
  } catch (error) {
    console.error("Error fetching business cards:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function POST(request: Request) {
  try {
    const session = await getAppSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = cleanString(body?.name);

    if (!name) {
      return NextResponse.json(
        { message: "Business card name is required" },
        { status: 400 }
      );
    }

    const slugBase = slugify(name) || "business-card";
    const slug = `${slugBase}-${randomUUID().slice(0, 8)}`;
    const origin = new URL(request.url).origin;
    const publicUrl = `${origin}/card/${slug}`;
    const themeSource =
      typeof body?.template === "string" && body.template.trim()
        ? body.template
        : typeof body?.theme === "string" && body.theme.trim()
          ? body.theme
          : "executive";
    const theme = themeSource.trim();
    const fontFamily =
      typeof body?.fontFamily === "string" && body.fontFamily.trim()
        ? body.fontFamily.trim()
        : "Inter";
    const primaryColor =
      typeof body?.primaryColor === "string" && body.primaryColor.trim()
        ? body.primaryColor
        : "#7c3aed";
    const backgroundColor =
      typeof body?.backgroundColor === "string" && body.backgroundColor.trim()
        ? body.backgroundColor
        : "#0b1120";
    const customLinks = {
      ...(cleanString(body?.snapchat) ? { snapchat: cleanString(body?.snapchat) } : {}),
      ...(cleanString(body?.viber) ? { viber: cleanString(body?.viber) } : {}),
      ...(cleanString(body?.googleMaps) ? { googleMaps: cleanString(body?.googleMaps) } : {}),
    };
    const businessCardInsert: Database["public"]["Tables"]["business_cards"]["Insert"] = {
      user_id: (session.user as any).id,
      slug,
      name,
      title: cleanString(body?.title),
      company: cleanString(body?.company),
      bio: cleanString(body?.bio),
      email: cleanString(body?.email),
      phone: cleanString(body?.phone),
      website: cleanString(body?.website),
      address: cleanString(body?.address),
      avatar_url: cleanString(body?.avatarUrl),
      linkedin: cleanString(body?.linkedin),
      twitter: cleanString(body?.twitter),
      facebook: cleanString(body?.facebook),
      instagram: cleanString(body?.instagram),
      github: cleanString(body?.github),
      tiktok: cleanString(body?.tiktok),
      youtube: cleanString(body?.youtube),
      whatsapp: cleanString(body?.whatsapp),
      telegram: cleanString(body?.telegram),
      custom_links: Object.keys(customLinks).length > 0 ? customLinks : null,
      theme,
      font_family: fontFamily,
      primary_color: primaryColor,
      background_color: backgroundColor,
      status:
        body?.status === "DRAFT" ||
        body?.status === "PUBLISHED" ||
        body?.status === "ARCHIVED"
          ? body.status
          : "PUBLISHED",
      is_public: body?.isPublic !== false,
      qr_code_url: publicUrl,
    };

    const businessCardsTable = supabaseAdmin.from("business_cards") as any;
    const { data: businessCard, error } = await businessCardsTable
      .insert([businessCardInsert])
      .select()
      .single();

    if (error || !businessCard) {
      return NextResponse.json(
        { message: error?.message || "Failed to create business card" },
        { status: 500 }
      );
    }

    const qrShortCode = randomUUID().replace(/-/g, "").slice(0, 12);
    const qrCodeInsert: Database["public"]["Tables"]["qr_codes"]["Insert"] = {
      user_id: (session.user as any).id,
      name: `${name} Business Card`,
      type: "BUSINESS_CARD",
      content: publicUrl,
      short_code: qrShortCode,
      dynamic: false,
      is_active: true,
      scans: 0,
      status: "ACTIVE",
      foreground_color: primaryColor,
      background_color: backgroundColor,
    };
    const qrCodesTable = supabaseAdmin.from("qr_codes") as any;
    const { error: qrError } = await qrCodesTable.insert([qrCodeInsert]);

    if (qrError) {
      return NextResponse.json(
        { message: qrError.message || "Failed to generate QR code for business card" },
        { status: 500 }
      );
    }

    return NextResponse.json({ businessCard }, { status: 201 });
  } catch (error) {
    console.error("Error creating business card:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
