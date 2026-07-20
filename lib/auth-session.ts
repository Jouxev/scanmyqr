import { cookies, headers } from "next/headers";
import type { Session } from "next-auth";
import { getToken } from "next-auth/jwt";

type AppSession = Session & {
  user: NonNullable<Session["user"]> & {
    id: string;
  };
};

function toStringOrNull(value: unknown) {
  return typeof value === "string" ? value : null;
}

function parseCookieHeader(cookieHeader: string) {
  const cookiesObject: Record<string, string> = {};

  for (const part of cookieHeader.split(/;\s*/)) {
    if (!part) continue;
    const separatorIndex = part.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = decodeURIComponent(part.slice(0, separatorIndex));
    const value = decodeURIComponent(part.slice(separatorIndex + 1));
    cookiesObject[key] = value;
  }

  return cookiesObject;
}

export async function getAppSession(request?: Request): Promise<AppSession | null> {
  const headerStore = request ? request.headers : await headers();
  const cookieHeader = headerStore.get("cookie") ?? "";
  const cookieStore = request ? parseCookieHeader(cookieHeader) : await cookies();

  const req = {
    headers: headerStore,
    cookies: cookieStore,
  };

  const token = await getToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const id = toStringOrNull(token?.id) ?? toStringOrNull(token?.sub);
  if (!token || !id) {
    return null;
  }

  return {
    user: {
      id,
      name: toStringOrNull(token.name),
      email: toStringOrNull(token.email),
      image: toStringOrNull(token.picture),
    },
    expires: token.exp ? new Date(token.exp * 1000).toISOString() : "",
  };
}
