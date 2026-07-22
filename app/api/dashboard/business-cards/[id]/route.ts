import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/auth-session";
import { deleteBusinessCard } from "@/lib/dashboard-data";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Database } from "@/types/database";

function cleanString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAppSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;
    const body = await request.json();
    const name = cleanString(body?.name);

    if (!name) {
      return NextResponse.json({ message: "Business card name is required" }, { status: 400 });
    }

    const existingBusinessCardsTable = supabaseAdmin.from("business_cards") as any;
    const { data: existingCard } = (await existingBusinessCardsTable
      .select("id, qr_code_url")
      .eq("id", id)
      .eq("user_id", userId)
      .single()) as { data: { id: string; qr_code_url: string | null } | null };

    if (!existingCard) {
      return NextResponse.json({ message: "Business card not found" }, { status: 404 });
    }

    const themeSource =
      typeof body?.template === "string" && body.template.trim()
        ? body.template
        : typeof body?.theme === "string" && body.theme.trim()
          ? body.theme
          : "executive";
    const customLinks = {
      ...(cleanString(body?.snapchat) ? { snapchat: cleanString(body?.snapchat) } : {}),
      ...(cleanString(body?.viber) ? { viber: cleanString(body?.viber) } : {}),
      ...(cleanString(body?.googleMaps) ? { googleMaps: cleanString(body?.googleMaps) } : {}),
    };
    const businessCardUpdate: Database["public"]["Tables"]["business_cards"]["Update"] = {
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
      theme: themeSource.trim(),
      font_family: cleanString(body?.fontFamily),
      primary_color: cleanString(body?.primaryColor),
      background_color: cleanString(body?.backgroundColor),
      status:
        body?.status === "DRAFT" ||
        body?.status === "PUBLISHED" ||
        body?.status === "ARCHIVED"
          ? body.status
          : "PUBLISHED",
      is_public: body?.isPublic !== false,
    };

    const businessCardsTable = supabaseAdmin.from("business_cards") as any;
    const { data: businessCard, error } = await businessCardsTable
      .update(businessCardUpdate)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error || !businessCard) {
      return NextResponse.json(
        { message: error?.message || "Failed to update business card" },
        { status: 500 }
      );
    }

    if (existingCard.qr_code_url) {
      const qrCodesTable = supabaseAdmin.from("qr_codes") as any;
      const qrCodeUpdate: Database["public"]["Tables"]["qr_codes"]["Update"] = {
        name: `${name} Business Card`,
        foreground_color: cleanString(body?.primaryColor) ?? undefined,
        background_color: cleanString(body?.backgroundColor) ?? undefined,
      };

      await qrCodesTable
        .update(qrCodeUpdate)
        .eq("user_id", userId)
        .eq("type", "BUSINESS_CARD")
        .eq("content", existingCard.qr_code_url);
    }

    return NextResponse.json({ businessCard });
  } catch (error: any) {
    console.error("Update business card error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update business card" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAppSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await deleteBusinessCard(id, (session.user as any).id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete business card error:", error);
    return NextResponse.json({ message: error.message || "Failed to delete" }, { status: 500 });
  }
}
