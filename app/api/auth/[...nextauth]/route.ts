import { NextRequest, NextResponse } from "next/server";
import { Auth } from "@auth/core";
import { authOptions } from "@/auth";

function copyHeaders(authResponse: Response) {
  const headers = new Headers();

  authResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") {
      headers.set(key, value);
    }
  });

  const getSetCookie = (authResponse.headers as any).getSetCookie;
  if (typeof getSetCookie === "function") {
    const setCookies: string[] = getSetCookie.call(authResponse.headers);
    setCookies.forEach((cookie) => headers.append("set-cookie", cookie));
  } else {
    const setCookie = authResponse.headers.get("set-cookie");
    if (setCookie) headers.append("set-cookie", setCookie);
  }

  return headers;
}

function normalizeSessionBody(pathname: string, bodyText: string, headers: Headers) {
  if (pathname !== "/api/auth/session") return bodyText;

  const trimmed = bodyText.trim();
  if (trimmed === "" || trimmed === "null") {
    headers.set("content-type", "application/json");
    return "{}";
  }

  return bodyText;
}

export async function GET(request: NextRequest) {
  const response = (await Auth(
    new Request(request.url, {
      method: request.method,
      headers: request.headers,
    }),
    {
      ...authOptions,
      basePath: "/api/auth",
      trustHost: true,
    } as any
  )) as Response;

  const headers = copyHeaders(response);
  const body = normalizeSessionBody(new URL(request.url).pathname, await response.text(), headers);

  return new NextResponse(body, {
    status: response.status,
    headers,
  });
}

export async function POST(request: NextRequest) {
  // Support both JSON and form-encoded
  const contentType = request.headers.get("content-type") || "";
  let body: BodyInit | undefined;
  if (contentType.includes("application/json")) {
    body = JSON.stringify(await request.json());
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    body = await request.text();
  }

  const response = (await Auth(
    new Request(request.url, {
      method: "POST",
      headers: request.headers,
      body,
    }),
    {
      ...authOptions,
      basePath: "/api/auth",
      trustHost: true,
    } as any
  )) as Response;

  const headers = copyHeaders(response);
  const responseBody = await response.text();

  return new NextResponse(responseBody, {
    status: response.status,
    headers,
  });
}
