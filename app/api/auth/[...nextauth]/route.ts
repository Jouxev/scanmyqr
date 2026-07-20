import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/auth";

const handler = NextAuth(authOptions);
type NextAuthRouteContext = {
  params: Promise<{ nextauth: string[] }>;
};

export async function GET(request: NextRequest, { params }: NextAuthRouteContext) {
  return handler(request, { params: await params } as any);
}

export async function POST(request: NextRequest, { params }: NextAuthRouteContext) {
  return handler(request, { params: await params } as any);
}
