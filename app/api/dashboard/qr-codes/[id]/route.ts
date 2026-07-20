import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/auth-session";
import { deleteQRCode } from "@/lib/dashboard-data";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAppSession(request);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await deleteQRCode(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete QR code error:", error);
    return NextResponse.json({ message: error.message || "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAppSession(request);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;
    const body = await request.json();

    const updates = {
      name:
        typeof body?.name === "string" && body.name.trim()
          ? body.name.trim()
          : "Untitled QR Code",
      content:
        typeof body?.content === "string" && body.content.trim()
          ? body.content.trim()
          : null,
      type:
        typeof body?.type === "string" && body.type.trim()
          ? body.type.trim().toUpperCase()
          : null,
      foreground_color:
        typeof body?.foregroundColor === "string" && body.foregroundColor.trim()
          ? body.foregroundColor.trim()
          : "#000000",
      background_color:
        typeof body?.backgroundColor === "string" && body.backgroundColor.trim()
          ? body.backgroundColor.trim()
          : "#ffffff",
      status:
        body?.status === "ACTIVE" || body?.status === "INACTIVE" || body?.status === "EXPIRED"
          ? body.status
          : "ACTIVE",
      is_active: body?.isActive !== false,
    };

    if (!updates.content || !updates.type) {
      return NextResponse.json(
        { message: "QR code type and content are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("qr_codes")
      .update(updates)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json(
        { message: error?.message || "Failed to update QR code" },
        { status: 500 }
      );
    }

    return NextResponse.json({ qrCode: data });
  } catch (error: any) {
    console.error("Update QR code error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update QR code" },
      { status: 500 }
    );
  }
}

