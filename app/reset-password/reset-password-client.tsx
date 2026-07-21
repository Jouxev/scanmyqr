"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TiptapLogo } from "@/components/brand/tiptap-logo";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setIsReady(true);
      return;
    }

    let cancelled = false;

    (async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (cancelled) return;

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Invalid or expired reset link.",
          variant: "destructive",
        });
      }

      setIsReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to update password.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Password updated",
        description: "You can now sign in with your new password.",
      });
      router.push("/login");
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(217,70,239,0.12),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-4">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="mb-6 inline-flex items-center">
              <TiptapLogo size="md" />
            </Link>
            <h1 className="text-3xl font-bold mb-2">Choose a new password</h1>
            <p className="text-slate-500">Set a new password for your account</p>
          </div>

          <Card className="border-slate-200/80 bg-white/90 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.18)] backdrop-blur-xl">
            <CardContent className="p-6">
              {isReady ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="password" className="text-sm font-medium mb-2 block">
                      New password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 text-white"
                    loading={isLoading}
                  >
                    Update password
                  </Button>
                </form>
              ) : (
                <div className="text-sm text-slate-500">Preparing reset…</div>
              )}
            </CardContent>
          </Card>

          <Link
            href="/login"
            className="mt-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

