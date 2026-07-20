import { notFound, redirect } from "next/navigation";
import { getAppSession } from "@/lib/auth-session";
import { getQRCodeById } from "@/lib/dashboard-data";
import QRCodeEditor from "@/app/dashboard/qr-codes/QRCodeEditor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQRCodePage({ params }: PageProps) {
  const session = await getAppSession();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const userId = (session.user as any).id;
  const qrCode = await getQRCodeById(userId, id);

  if (!qrCode) {
    notFound();
  }

  return <QRCodeEditor qrCode={qrCode} />;
}
