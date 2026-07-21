export type SupabaseKeyInfo = {
  ref?: string;
  role?: string;
  iss?: string;
};

function base64UrlDecode(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = base64 + "=".repeat(padLength);
  return Buffer.from(padded, "base64").toString("utf8");
}

export function getSupabaseKeyInfo(key: string | undefined | null): SupabaseKeyInfo {
  if (!key) return {};

  const parts = key.split(".");
  if (parts.length < 2) return {};

  try {
    const payloadJson = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadJson) as Record<string, unknown>;
    return {
      ref: typeof payload.ref === "string" ? payload.ref : undefined,
      role: typeof payload.role === "string" ? payload.role : undefined,
      iss: typeof payload.iss === "string" ? payload.iss : undefined,
    };
  } catch {
    return {};
  }
}
