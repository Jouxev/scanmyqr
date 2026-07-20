import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function ScanPage({ params }: PageProps) {
  const { code } = await params;

  const { data: qrCode } = await supabaseAdmin
    .from("qr_codes")
    .select("short_code, type, content")
    .eq("short_code", code)
    .eq("is_active", true)
    .single();

  if (!qrCode) {
    redirect("/not-found");
  }

  if (qrCode.type === "URL" && qrCode.content.startsWith("http")) {
    redirect(qrCode.content);
  }

  redirect(`/view/${code}`);
}
