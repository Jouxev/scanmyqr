"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TiptapLogo } from "@/components/brand/tiptap-logo";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to send reset email.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Check your email",
        description: "We sent you a password reset link.",
      });
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
            <h1 className="text-3xl font-bold mb-2">Reset your password</h1>
            <p className="text-slate-500">We’ll email you a reset link</p>
          </div>

          <Card className="border-slate-200/80 bg-white/90 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.18)] backdrop-blur-xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="text-sm font-medium mb-2 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 text-white"
                  loading={isLoading}
                >
                  Send reset link
                </Button>
              </form>
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

