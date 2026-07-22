import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/auth-session";
import { duplicateQRCode } from "@/lib/dashboard-data";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAppSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = await params;
    const qrCode = await duplicateQRCode(id, userId);
    return NextResponse.json({ qrCode });
  } catch (error: any) {
    console.error("Duplicate QR code error:", error);
    return NextResponse.json({ message: error.message || "Failed to duplicate" }, { status: 500 });
  }
}

