import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import UAParser from "ua-parser-js";
import geoip from "geoip-lite";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shortCode = searchParams.get("code");

    if (!shortCode) {
      return NextResponse.json(
        { message: "Short code is required" },
        { status: 400 }
      );
    }

    const qrCode = await prisma.qRCode.findUnique({
      where: { shortCode },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!qrCode) {
      return NextResponse.json(
        { message: "QR code not found" },
        { status: 404 }
      );
    }

    // Get client information
    const userAgent = request.headers.get("user-agent") || "";
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    // Get IP (in production, use proper IP detection)
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const geo = geoip.lookup(ip);

    // Create scan record
    const scan = await prisma.qRCodeScan.create({
      data: {
        qrCodeId: qrCode.id,
        ipAddress: ip,
        userAgent,
        device: result.device.type || "desktop",
        browser: result.browser.name || "Unknown",
        os: result.os.name
          ? `${result.os.name} ${result.os.version || ""}`.trim()
          : "Unknown",
        country: geo?.country || null,
        city: geo?.city || null,
      },
    });

    // Update scan count
    await prisma.qRCode.update({
      where: { id: qrCode.id },
      data: { scans: { increment: 1 } },
    });

    // Return the QR code content
    return NextResponse.json({
      content: qrCode.content,
      type: qrCode.type,
      name: qrCode.name,
      scanId: scan.id,
    });
  } catch (error) {
    console.error("Error resolving QR code:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
