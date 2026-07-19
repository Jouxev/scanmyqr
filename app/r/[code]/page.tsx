import { redirect } from "next/navigation";
import prisma from "@/lib/db";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function ScanPage({ params }: PageProps) {
  const { code } = await params;
  
  const qrCode = await prisma.qRCode.findUnique({
    where: { shortCode: code },
  });

  if (!qrCode) {
    redirect("/not-found");
  }

  // For URLs, redirect to the content
  if (qrCode.type === "URL" && qrCode.content.startsWith("http")) {
    redirect(qrCode.content);
  }

  // For other types, redirect to a page that displays the content
  redirect(`/view/${code}`);
}
