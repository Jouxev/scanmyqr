import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const qrCodeId = searchParams.get("qrCodeId");

    if (!qrCodeId) {
      return NextResponse.json(
        { message: "QR code ID is required" },
        { status: 400 }
      );
    }

    const qrCode = await prisma.qRCode.findFirst({
      where: {
        id: qrCodeId,
        userId: session.user.id,
      },
    });

    if (!qrCode) {
      return NextResponse.json(
        { message: "QR code not found" },
        { status: 404 }
      );
    }

    const [scans, analytics] = await Promise.all([
      prisma.qRCodeScan.findMany({
        where: { qrCodeId },
        orderBy: { scannedAt: "desc" },
        take: 100,
      }),
      prisma.qRCodeAnalytics.findMany({
        where: { qrCodeId },
        orderBy: { date: "desc" },
        take: 30,
      }),
    ]);

    return NextResponse.json({ scans, analytics });
  } catch (error) {
    console.error("Error fetching QR code analytics:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
