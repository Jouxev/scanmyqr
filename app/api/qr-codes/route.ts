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
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const folderId = searchParams.get("folderId");

    const where: any = {
      userId: session.user.id,
      status: "ACTIVE",
    };

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
      ];
    }

    if (folderId) {
      where.folderId = folderId;
    }

    const [qrCodes, total] = await Promise.all([
      prisma.qRCode.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          scans: {
            select: {
              id: true,
            },
          },
        },
      }),
      prisma.qRCode.count({ where }),
    ]);

    return NextResponse.json({
      qrCodes: qrCodes.map((qr) => ({
        ...qr,
        scanCount: qr.scans.length,
        scans: undefined,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching QR codes:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      type,
      content,
      title,
      description,
      foregroundColor,
      backgroundColor,
      gradientColors,
      frameStyle,
      eyeStyle,
      logoUrl,
      logoSize,
      downloadFormat,
      folderId,
      dynamic,
      expiresAt,
    } = body;

    const shortCode = Math.random().toString(36).substring(2, 10);

    const qrCode = await prisma.qRCode.create({
      data: {
        userId: session.user.id,
        name: name || "Untitled QR Code",
        type,
        content,
        shortCode,
        title,
        description,
        foregroundColor: foregroundColor || "#000000",
        backgroundColor: backgroundColor || "#ffffff",
        gradientColors,
        frameStyle,
        eyeStyle,
        logoUrl,
        logoSize,
        downloadFormat: downloadFormat || "png",
        folderId,
        dynamic: dynamic || false,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json(qrCode, { status: 201 });
  } catch (error) {
    console.error("Error creating QR code:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
