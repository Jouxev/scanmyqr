import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/auth-session";
import { getQRCodes } from "@/lib/dashboard-data";
import QRCodesClient from "./QRCodesClient";

export default async function QRCodesPage() {
  const session = await getAppSession();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;
  const qrcodes = await getQRCodes(userId);

  return <QRCodesClient initialQRCodes={qrcodes} />;
}

