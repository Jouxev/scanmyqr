import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/auth-session";
import { deleteFolder } from "@/lib/dashboard-data";

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
    await deleteFolder(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete folder error:", error);
    return NextResponse.json({ message: error.message || "Failed to delete" }, { status: 500 });
  }
}

