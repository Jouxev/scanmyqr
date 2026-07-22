import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/auth-session";
import { getRestaurants } from "@/lib/dashboard-data";

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
    const restaurants = await getRestaurants(userId, { search, status });

    return NextResponse.json({ restaurants, total: restaurants.length });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

