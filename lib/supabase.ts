import { createClient } from "@supabase/supabase-js";

// Lazy client — NEXT_PUBLIC_ vars are inlined at build time, but
// wrapping in a getter avoids any edge-case module-evaluation issues.
function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  return url;
}
function getSupabaseAnonKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  return key;
}

let _supabase: ReturnType<typeof createClient> | undefined;

export const supabase =
  new Proxy({} as ReturnType<typeof createClient>, {
    get(_target, prop) {
      if (!_supabase) {
        _supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());
      }
      return (_supabase as any)[prop];
    },
  });

export const createSupabaseClient = () => {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey());
};
