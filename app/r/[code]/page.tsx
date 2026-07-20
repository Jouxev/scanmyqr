import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Database } from "@/types/database";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function ScanPage({ params }: PageProps) {
  const { code } = await params;

  const qrCodesTable = supabaseAdmin.from("qr_codes") as any;
  const { data: qrCode } = (await qrCodesTable
    .select("short_code, type, content")
    .eq("short_code", code)
    .eq("is_active", true)
    .single()) as {
    data: Pick<Database["public"]["Tables"]["qr_codes"]["Row"], "short_code" | "type" | "content"> | null;
  };

  if (!qrCode) {
    redirect("/not-found");
  }

  if (qrCode.type === "URL" && qrCode.content.startsWith("http")) {
    redirect(qrCode.content);
  }

  redirect(`/view/${code}`);
}
