import { NextResponse } from "next/server";
import { getSupabaseKeyInfo } from "@/lib/supabase-key-info";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const anonInfo = getSupabaseKeyInfo(anonKey);
  const serviceInfo = getSupabaseKeyInfo(serviceKey);

  const urlHost = url ? new URL(url).host : null;

  return NextResponse.json({
    urlHost,
    hasUrl: !!url,
    hasAnonKey: !!anonKey,
    hasServiceKey: !!serviceKey,
    anon: anonInfo,
    service: serviceInfo,
    sameProject: !!anonInfo.ref && anonInfo.ref === serviceInfo.ref,
  });
}

