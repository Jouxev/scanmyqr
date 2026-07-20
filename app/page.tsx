import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CreditCard,
  Globe,
  LayoutTemplate,
  ScanLine,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { TiptapLogo } from "@/components/brand/tiptap-logo";

const metrics = [
  { value: "10K+", label: "Active teams" },
  { value: "1M+", label: "QRs launched" },
  { value: "50M+", label: "Scans tracked" },
  { value: "99.9%", label: "Uptime" },
];

const products = [
  {
    icon: CreditCard,
    title: "Digital Business Cards",
    description:
      "Create a branded profile with contact actions, social links, maps, and a premium QR-ready public page.",
  },
  {
    icon: UtensilsCrossed,
    title: "Smart Restaurant Menus",
    description:
      "Launch clean menu experiences customers can open instantly from table cards, packaging, or window displays.",
  },
  {
    icon: BarChart3,
    title: "Trackable QR Campaigns",
    description:
      "Generate scan-ready codes for products, flyers, and offline campaigns with analytics that stay easy to understand.",
  },
];

const features = [
  {
    icon: Wand2,
    title: "Brand-first design",
    description: "Use polished layouts, gradients, and templates that already feel ready for production.",
  },
  {
    icon: LayoutTemplate,
    title: "Template workflows",
    description: "Move from idea to live card or menu faster with guided flows and reusable visual presets.",
  },
  {
    icon: ScanLine,
    title: "Frictionless scanning",
    description: "Make every physical touchpoint feel instant, from posters and tables to business cards and product boxes.",
  },
  {
    icon: Globe,
    title: "Public-ready pages",
    description: "Publish clean mobile-friendly destinations designed to convert a scan into a useful action.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable publishing",
    description: "Control visibility, update live content, and keep business pages clean and easy to maintain.",
  },
  {
    icon: Sparkles,
    title: "Premium presentation",
    description: "Give your brand a sharper first impression with a stronger visual identity across every QR experience.",
  },
];

const testimonials = [
  {
    quote:
      "TiptapCard helped us unify our QR campaigns, business cards, and menus into one system that finally looks premium.",
    name: "Sarah Chen",
    role: "Marketing Director, TechCorp",
  },
  {
    quote:
      "The menu and card flows are incredibly fast to launch, and the public pages feel much more polished than generic QR tools.",
    name: "Marcus Johnson",
    role: "Founder, Bella Italia",
  },
];

function QRPreview() {
  const cells = Array.from({ length: 25 });

  return (
    <div className="grid grid-cols-5 gap-1 rounded-2xl bg-white p-3 shadow-inner">
      {cells.map((_, index) => {
        const active = [0, 1, 3, 4, 5, 7, 9, 10, 12, 14, 15, 17, 18, 20, 21, 23, 24].includes(index);
        return (
          <div
            key={index}
            className={`h-3.5 w-3.5 rounded-[4px] ${active ? "bg-slate-900" : "bg-slate-200"}`}
          />
        );
      })}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_78%_12%,rgba(217,70,239,0.16),transparent_22%),linear-gradient(180deg,#ffffff_0%,#f8fbff_54%,#ffffff_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-8">
              <TiptapLogo size="lg" priority />
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              <Sparkles className="h-4 w-4 text-fuchsia-500" />
              Built for modern QR-powered business experiences
            </div>

            <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Create &amp; Manage QR Codes
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
              The all-in-one QR platform for modern businesses. Launch digital business cards,
              menus, and trackable campaigns with premium branding, clean public pages, and
              conversion-ready design.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="xl"
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 text-white shadow-xl shadow-blue-500/20 sm:w-auto"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full rounded-2xl border-slate-200 bg-white/90 text-slate-900 shadow-sm hover:bg-slate-50 sm:w-auto"
                >
                  View Pricing
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              {[
                "No credit card required",
                "Free plan available",
                "Launch cards, menus, and campaigns",
              ].map((item) => (
                <div key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto h-[520px] w-full max-w-[620px]">
            <div className="absolute left-10 top-6 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="absolute bottom-12 right-6 h-44 w-44 rounded-full bg-fuchsia-500/15 blur-3xl" />

            <div className="absolute inset-0 rounded-[2.25rem] border border-slate-200 bg-white/75 shadow-[0_40px_120px_-30px_rgba(15,23,42,0.22)] backdrop-blur-xl" />

            <div className="absolute left-2 top-24 w-[180px] rotate-[-11deg] rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-300/30 sm:left-8">
              <div className="text-sm font-semibold text-slate-900">Scan to Visit</div>
              <div className="mt-4 rounded-[1.5rem] bg-gradient-to-br from-sky-100 via-white to-violet-100 p-4">
                <div className="mx-auto w-fit rounded-[1.25rem] border border-slate-200 bg-white p-2 shadow-sm">
                  <QRPreview />
                </div>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                <Globe className="h-3.5 w-3.5" />
                Web destination
              </div>
            </div>

            <div className="absolute left-1/2 top-7 z-10 w-[230px] -translate-x-1/2 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_30px_80px_-24px_rgba(76,29,149,0.38)]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Create Your Card</div>
                <div className="flex gap-1.5 text-slate-400">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                </div>
              </div>
              <div className="mt-4 rounded-[1.7rem] bg-gradient-to-br from-blue-500 via-violet-500 to-fuchsia-500 p-3">
                <div className="rounded-[1.25rem] bg-white/90 p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-[linear-gradient(135deg,#2563eb,#d946ef)]" />
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Asmia Smith</div>
                      <div className="text-xs text-slate-500">Brand strategist</div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-2 rounded-full bg-slate-200" />
                    <div className="h-2 w-4/5 rounded-full bg-slate-200" />
                    <div className="h-2 w-2/3 rounded-full bg-slate-200" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="h-8 w-8 rounded-full bg-sky-100" />
                    <div className="h-8 w-8 rounded-full bg-violet-100" />
                    <div className="h-8 w-8 rounded-full bg-fuchsia-100" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute right-2 top-20 w-[180px] rotate-[10deg] rounded-[2rem] border border-slate-200 bg-slate-50 p-4 shadow-2xl shadow-slate-300/30 sm:right-10">
              <div className="text-sm font-semibold text-slate-900">View Menu</div>
              <div className="mt-4 rounded-[1.5rem] bg-white p-3 shadow-sm">
                <div className="h-20 rounded-[1rem] bg-[linear-gradient(135deg,#fde68a,#fb7185)]" />
                <div className="mt-3 space-y-2">
                  <div className="rounded-xl border border-slate-200 p-2.5">
                    <div className="text-xs font-medium text-slate-900">Grilled Salmon</div>
                    <div className="mt-1 text-[11px] text-slate-500">$18.50</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-2.5">
                    <div className="text-xs font-medium text-slate-900">Signature Pasta</div>
                    <div className="mt-1 text-[11px] text-slate-500">$14.20</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute left-[31%] top-[48%] z-20 hidden rounded-full border border-slate-200 bg-white p-3 shadow-lg md:block">
              <ArrowRight className="h-5 w-5 text-slate-500" />
            </div>
            <div className="absolute right-[28%] top-[44%] z-20 hidden rounded-full border border-slate-200 bg-white p-3 shadow-lg md:block">
              <ArrowRight className="h-5 w-5 text-slate-500" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50/80">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <div className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {metric.value}
              </div>
              <div className="mt-2 text-sm text-slate-500">{metric.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
            Built for the new tap-and-scan journey
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            One branded platform for every QR-powered experience
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            TiptapCard is designed for businesses that want their QR touchpoints to look
            premium, stay easy to update, and feel consistent across cards, menus, and
            campaigns.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.title}
              className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.18)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2563eb,#d946ef)] text-white shadow-lg shadow-blue-500/20">
                <product.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-slate-950">{product.title}</h3>
              <p className="mt-4 text-base leading-7 text-slate-600">{product.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
              Why teams choose TiptapCard
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Everything you need after the scan
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.16)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-950">{feature.title}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.16)]"
            >
              <div className="text-lg leading-8 text-slate-700">&ldquo;{testimonial.quote}&rdquo;</div>
              <div className="mt-6">
                <div className="font-semibold text-slate-950">{testimonial.name}</div>
                <div className="text-sm text-slate-500">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_32%,#6d28d9_68%,#db2777_100%)] p-8 text-white shadow-[0_40px_120px_-30px_rgba(109,40,217,0.5)] sm:p-14">
          <div className="max-w-3xl">
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-white/65">
              Ready to launch
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              Turn every scan into a branded experience.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
              Start with your business card, menu, or next campaign and give your QR touchpoints
              a sharper visual identity from day one.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="xl"
                  className="w-full rounded-2xl bg-white text-slate-950 shadow-lg shadow-black/10 hover:bg-white/90 sm:w-auto"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full rounded-2xl border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
