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
    const status = searchParams.get("status");

    const where: any = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    const [businessCards, total] = await Promise.all([
      prisma.businessCard.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.businessCard.count({ where }),
    ]);

    return NextResponse.json({
      businessCards,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching business cards:", error);
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
      title,
      company,
      bio,
      email,
      phone,
      website,
      address,
      avatarUrl,
      coverUrl,
      linkedin,
      twitter,
      facebook,
      instagram,
      github,
      tiktok,
      youtube,
      whatsapp,
      telegram,
      portfolioUrl,
      customLinks,
      theme,
      fontFamily,
      primaryColor,
      backgroundColor,
      backgroundImage,
      status,
    } = body;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);

    const businessCard = await prisma.businessCard.create({
      data: {
        userId: session.user.id,
        name,
        slug,
        title,
        company,
        bio,
        email,
        phone,
        website,
        address,
        avatarUrl,
        coverUrl,
        linkedin,
        twitter,
        facebook,
        instagram,
        github,
        tiktok,
        youtube,
        whatsapp,
        telegram,
        portfolioUrl,
        customLinks,
        theme,
        fontFamily,
        primaryColor,
        backgroundColor,
        backgroundImage,
        status: status || "DRAFT",
      },
    });

    return NextResponse.json(businessCard, { status: 201 });
  } catch (error) {
    console.error("Error creating business card:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
