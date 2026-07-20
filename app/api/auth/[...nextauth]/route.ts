import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/auth";

const handler = NextAuth(authOptions);
type RouteContext = {
  params: Promise<{ nextauth: string[] }> | { nextauth: string[] };
};

async function getResolvedParams(context: RouteContext) {
  return await context.params;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const params = await getResolvedParams(context);
  return handler(request, { params } as any);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const params = await getResolvedParams(context);
  return handler(request, { params } as any);
}
