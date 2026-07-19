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

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          categories: {
            include: {
              items: true,
            },
          },
        },
      }),
      prisma.restaurant.count({ where }),
    ]);

    return NextResponse.json({
      restaurants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
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
      description,
      logo,
      coverImage,
      address,
      phone,
      email,
      website,
      status,
      categories,
    } = body;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);

    const restaurant = await prisma.restaurant.create({
      data: {
        userId: session.user.id,
        name,
        slug,
        description,
        logo,
        coverImage,
        address,
        phone,
        email,
        website,
        status: status || "DRAFT",
        categories: categories
          ? {
              create: categories.map(
                (cat: { name: string; description?: string; items?: any[] }, index: number) => ({
                  name: cat.name,
                  description: cat.description,
                  sortOrder: index,
                  items: cat.items
                    ? {
                        create: cat.items.map(
                          (
                            item: { name: string; price: number; description?: string; image?: string },
                            itemIndex: number
                          ) => ({
                            name: item.name,
                            price: item.price,
                            description: item.description,
                            image: item.image,
                            sortOrder: itemIndex,
                          })
                        ),
                      }
                    : undefined,
                })
              ),
            }
          : undefined,
      },
      include: {
        categories: {
          include: {
            items: true,
          },
        },
      },
    });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
