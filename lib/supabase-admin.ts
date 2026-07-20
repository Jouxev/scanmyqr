import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side Supabase client with service role key (admin operations)
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Create a Supabase client for authenticated users
export const createServerSupabaseClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  );
};

// Auth helper functions
export const authHelpers = {
  // Sign up with email/password
  async signUp(email: string, password: string, name?: string) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (error) throw error;
    return data;
  },

  // Sign in with email/password
  async signIn(email: string, password: string) {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Get user by ID
  async getUser(id: string) {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);
    if (error) throw error;
    return data;
  },

  // List users
  async listUsers() {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;
    return data;
  },

  // Update user
  async updateUser(id: string, attributes: Record<string, any>) {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, attributes);
    if (error) throw error;
    return data;
  },

  // Delete user
  async deleteUser(id: string) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw error;
    return { success: true };
  },
};

export default supabaseAdmin;
