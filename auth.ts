import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getSupabaseKeyInfo } from "@/lib/supabase-key-info";

// Lazy getter — Supabase client is only created when first accessed at runtime,
// not during module evaluation (which happens during Vercel's build phase).
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[Auth] Missing env vars:", {
      hasUrl: !!supabaseUrl,
      hasAnonKey: !!supabaseAnonKey,
    });
    throw new Error(
      "Missing Supabase environment variables. " +
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set."
    );
  }
  const anonInfo = getSupabaseKeyInfo(supabaseAnonKey);
  if (!anonInfo.ref) {
    console.error("[Auth] Invalid anon key.");
  }
  // Dynamic import to avoid top-level evaluation issues
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createClient } = require("@supabase/supabase-js");
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const supabase = getSupabase();
          // Use Supabase Auth — validates email/password hash internally
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          if (error || !data.user) {
            const anonInfo = getSupabaseKeyInfo(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
            const serviceInfo = getSupabaseKeyInfo(process.env.SUPABASE_SERVICE_ROLE_KEY);
            console.error("[Auth] Supabase key refs:", {
              anonRef: anonInfo.ref,
              anonRole: anonInfo.role,
              serviceRef: serviceInfo.ref,
              serviceRole: serviceInfo.role,
              sameProject: !!anonInfo.ref && anonInfo.ref === serviceInfo.ref,
            });
            console.error("[Auth] signInWithPassword error:", error);
            return null;
          }

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name ?? null,
          };
        } catch (err) {
          console.error("[Auth] authorize error:", err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
