import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/auth-session";
import { createFolder } from "@/lib/dashboard-data";

export async function POST(request: Request) {
  try {
    const session = await getAppSession(request);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ message: "Folder name is required" }, { status: 400 });
    }
    const folder = await createFolder(userId, name);
    return NextResponse.json({ folder }, { status: 201 });
  } catch (error: any) {
    console.error("Create folder error:", error);
    return NextResponse.json({ message: error.message || "Failed to create" }, { status: 500 });
  }
}

