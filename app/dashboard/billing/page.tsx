"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  Check,
  CreditCard,
  Download,
  Receipt,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "10 QR codes per month",
      "Basic customization",
      "PNG & SVG downloads",
      "7-day scan history",
      "Email support",
    ],
    notIncluded: [
      "Dynamic QR codes",
      "Analytics",
      "Business cards",
      "Custom domain",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    period: "month",
    description: "For professionals and businesses",
    features: [
      "Unlimited QR codes",
      "Advanced customization",
      "All download formats",
      "Dynamic QR codes",
      "Analytics & tracking",
      "Business cards",
      "Restaurant menus",
      "Custom domain",
      "Priority support",
      "API access",
    ],
    notIncluded: [],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Team workspaces",
      "Advanced permissions",
      "Custom branding",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
      "White-label options",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    popular: false,
  },
];

const invoices = [
  { id: "inv_1", date: "2024-01-15", amount: 19.00, status: "paid" },
  { id: "inv_2", date: "2023-12-15", amount: 19.00, status: "paid" },
  { id: "inv_3", date: "2023-11-15", amount: 19.00, status: "paid" },
];

export default function BillingPage() {
  const { toast } = useToast();

  const handleUpgrade = (planId: string) => {
    toast({
      title: "Redirecting to checkout...",
      description: "Please wait while we redirect you to Stripe",
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(168,85,247,0.18),_transparent_24%),linear-gradient(135deg,_rgba(15,23,42,0.68),_rgba(2,6,23,0.94))]" />
        <div className="relative grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Revenue workspace
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Manage your subscription, invoices, and upgrade path with more clarity.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Billing now follows the same premium dashboard system so plan decisions, payment
                details, and invoice history all feel like part of one polished SaaS experience.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="h-12 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-5 text-white shadow-xl shadow-blue-950/30 hover:-translate-y-0.5">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Manage Subscription
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-white/10 bg-white/5 px-5 text-slate-100 hover:bg-white/10 hover:text-white"
              >
                <Receipt className="mr-2 h-4 w-4" />
                View invoices
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CreditCard className="h-4 w-4 text-cyan-300" />
                Current plan
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">Pro</p>
              <p className="mt-1 text-sm text-slate-400">$19/month with active renewal</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Billing health
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">Healthy</p>
              <p className="mt-1 text-sm text-slate-400">Payment method and invoices are up to date</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-5 shadow-lg shadow-slate-950/20">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Receipt className="h-4 w-4 text-violet-300" />
                Invoice count
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">{invoices.length}</p>
              <p className="mt-1 text-sm text-slate-400">Recent downloadable invoice records</p>
            </div>
          </div>
        </div>
      </section>

      <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Current Plan</CardTitle>
              <CardDescription>
                You&apos;re currently on the Pro plan
              </CardDescription>
            </div>
            <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/10">
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold text-white">$19</span>
            <span className="text-slate-400">/month</span>
          </div>
          <p className="mb-4 text-sm text-slate-400">
            Your next billing date is February 15, 2024
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
            >
              Manage Subscription
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
            >
              View Invoices
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-2xl font-bold text-white">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular
                  ? "border-cyan-300/20 bg-gradient-to-b from-cyan-400/8 via-blue-500/6 to-violet-500/8 shadow-xl shadow-slate-950/25"
                  : "border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-1 text-sm font-medium text-white shadow-lg shadow-slate-950/20">
                    <Zap className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-white">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-slate-400">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-slate-200">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-slate-500"
                    >
                      <Check className="h-4 w-4 opacity-50" />
                      <span className="text-sm line-through">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={
                    plan.popular
                      ? "w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 text-white"
                      : "w-full rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
                  }
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
        <CardHeader>
          <CardTitle className="text-white">Payment Method</CardTitle>
          <CardDescription>
            Manage your payment method and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-medium text-white">Visa ending in 4242</div>
                <div className="text-sm text-slate-400">
                  Expires 12/2025
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
            >
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.045] shadow-xl shadow-slate-950/20">
        <CardHeader>
          <CardTitle className="text-white">Billing History</CardTitle>
          <CardDescription>
            View your past invoices and receipts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4"
              >
                <div>
                  <div className="font-medium text-white">Invoice #{invoice.id}</div>
                  <div className="text-sm text-slate-400">
                    {invoice.date}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-white">${invoice.amount.toFixed(2)}</span>
                  <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/10">
                    {invoice.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-slate-300 hover:bg-white/5 hover:text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
