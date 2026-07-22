import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowUpRight, Copy, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Database } from "@/types/database";

interface PageProps {
  params: Promise<{ code: string }>;
}

function getActionHref(type: string, content: string) {
  console.log("type " , type)
  if (type === "EMAIL" || content.startsWith("mailto:")) return content;
  if (type === "PHONE" || content.startsWith("tel:")) return content;
  if (type === "SMS" || content.startsWith("sms:")) return content;
  if (type === "URL" && /^https?:\/\//i.test(content)) return content;
  if (/^https?:\/\//i.test(content)) return content;
  return null;
}


export default async function QRCodeViewPage({ params }: PageProps) {
  const { code } = await params;

  const qrCodesTable = supabaseAdmin.from("qr_codes") as any;
  const { data: qrCode } = (await qrCodesTable
    .select("name, type, content, short_code")
    .eq("short_code", code)
    .eq("is_active", true)
    .single()) as {
    data: Pick<
      Database["public"]["Tables"]["qr_codes"]["Row"],
      "name" | "type" | "content" | "short_code"
    > | null;
  };

  if (!qrCode) {
    notFound();
  }

  const actionHref = getActionHref(qrCode.type, qrCode.content);

  // If type is URL, redirect directly to the content
  if (qrCode.type === "URL" || qrCode.type === "BUSINESS_CARD" || qrCode.type === "RESTAURANT_MENU" && actionHref) {
    redirect(actionHref);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_35%),linear-gradient(180deg,_#020617,_#0f172a)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Card className="border-white/10 bg-white/[0.05] text-white shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <CardHeader>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-200">
              <QrCode className="h-3.5 w-3.5" />
              QR Preview
            </div>
            <CardTitle className="mt-4 text-3xl">{qrCode.name}</CardTitle>
            <CardDescription className="text-slate-300">
              Saved QR content preview for `{qrCode.type}`.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Short Code</div>
              <div className="mt-2 text-sm text-slate-200">{qrCode.short_code}</div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Encoded Content</div>
              <pre className="mt-3 whitespace-pre-wrap break-words text-sm text-slate-100">{qrCode.content}</pre>
            </div>

            <div className="flex flex-wrap gap-3">
              {actionHref ? (
                <Button
                  
                  className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 text-white"
                >
                  <a href={actionHref} target="_blank" rel="noreferrer">
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Open Content
                  </a>
                </Button>
              ) : null}

              <Button
                
                variant="outline"
                className="rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
              >
                <Link href={`/r/${qrCode.short_code}`}>
                  <Copy className="mr-2 h-4 w-4" />
                  Resolve Short Link
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
