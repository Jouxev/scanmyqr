import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseKeyInfo } from "@/lib/supabase-key-info";

// Lazy getter — avoids build-time errors when env vars aren't available.
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables.");
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth (handles password hashing internally)
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: name || "User" },
    });

    if (authError) {
      console.error("[Signup] Auth createUser error:", authError);
      return NextResponse.json(
        { message: authError.message || "Failed to create user" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonInfo = getSupabaseKeyInfo(anonKey);
    const serviceInfo = getSupabaseKeyInfo(serviceKey);

    if (anonKey) {
      const anonClient = createClient(supabaseUrl, anonKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { error: signInError } = await anonClient.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        return NextResponse.json(
          {
            message:
              "User created but cannot sign in. Check your Supabase keys (anon/service) match the same project.",
            details: {
              signInError: signInError.message,
              anonRef: anonInfo.ref,
              serviceRef: serviceInfo.ref,
              sameProject: !!anonInfo.ref && anonInfo.ref === serviceInfo.ref,
            },
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "User created successfully", userId: authUser.user?.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Signup] Unexpected error:", error);

    if (error.message?.includes("fetch failed") ||
        error.message?.includes("connect ECONNREFUSED")) {
      return NextResponse.json(
        { message: "Database connection error. Please check your configuration.", error: "DATABASE_NOT_CONFIGURED" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
