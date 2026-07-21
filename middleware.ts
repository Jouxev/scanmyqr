import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session;

  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnAuth =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup");
  const isOnApi = req.nextUrl.pathname.startsWith("/api");
  const isOnHome = req.nextUrl.pathname === "/";

  if (isOnApi) return NextResponse.next();
  if (isOnHome) return NextResponse.next();
  if (isOnAuth && isLoggedIn) return NextResponse.redirect(new URL("/dashboard", req.url));
  if (isOnDashboard && !isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
