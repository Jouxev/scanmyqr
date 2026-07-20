import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/auth-session";
import { getDashboardStats, getRecentQRCodes } from "@/lib/dashboard-data";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getAppSession();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const userName = session.user.name || "Creator";

  const [stats, recentQRCodes] = await Promise.all([
    getDashboardStats(userId),
    getRecentQRCodes(userId, 5),
  ]);

  return (
    <DashboardClient
      stats={stats}
      recentQRCodes={recentQRCodes}
      userName={userName}
    />
  );
}

