import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  QrCode,
  Scan,
  Palette,
  Download,
  Globe,
  Smartphone,
  Layers,
  Lock,
  Clock,
  Users,
  Star,
  Check,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: QrCode,
    title: "QR Code Generator",
    description:
      "Create stunning QR codes for any content type - URLs, text, vCards, WiFi, and more with beautiful customization options.",
  },
  {
    icon: Scan,
    title: "QR Scanner",
    description:
      "Scan QR codes instantly using your device camera or upload images. History tracking included.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Track scans, locations, devices, and user behavior with comprehensive analytics dashboard.",
  },
  {
    icon: Layers,
    title: "Dynamic QR Codes",
    description:
      "Update your QR code content anytime without reprinting. Perfect for changing campaigns.",
  },
  {
    icon: Palette,
    title: "Customization",
    description:
      "Custom colors, logos, frames, and styles to match your brand identity perfectly.",
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description:
      "Download in PNG, SVG, PDF, or high-resolution formats for any use case.",
  },
  {
    icon: Globe,
    title: "Digital Business Cards",
    description:
      "Create stunning digital business cards with QR codes. Share your professional profile instantly.",
  },
  {
    icon: Smartphone,
    title: "Restaurant Menus",
    description:
      "Create beautiful digital menus with QR codes. Update anytime, scan anytime.",
  },
  {
    icon: Lock,
    title: "Password Protection",
    description:
      "Protect your QR codes with passwords and set expiration dates for time-sensitive content.",
  },
];

const stats = [
  { label: "Active Users", value: "10,000+", icon: Users },
  { label: "QR Codes Created", value: "1M+", icon: QrCode },
  { label: "Total Scans", value: "50M+", icon: Scan },
  { label: "Uptime", value: "99.9%", icon: Clock },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Director",
    company: "TechCorp",
    content:
      "QRHub transformed our marketing campaigns. The analytics are incredible and dynamic QR codes save us thousands annually.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Restaurant Owner",
    company: "Bella Italia",
    content:
      "The digital menu feature is a game-changer. Customers love it and we can update our menu in seconds.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Startup Founder",
    company: "Innovate Labs",
    content:
      "Best QR code platform I've used. The business card feature helped us make great connections at conferences.",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              <span>Introducing QRHub 2.0 - Now with AI-powered analytics</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Create & Manage QR Codes
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              The all-in-one QR code platform for modern businesses. Generate,
              customize, track, and manage QR codes with powerful analytics and
              beautiful templates.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button size="xl" className="w-full sm:w-auto shadow-xl shadow-primary/30">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  View Demo
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required • Free plan available • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl sm:text-4xl font-bold mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg">
              Powerful features to create, manage, and track your QR codes
              all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className={cn(
                  "group hover:shadow-xl hover:border-primary/50 transition-all duration-300",
                  index === 0 && "md:col-span-2 lg:col-span-1 lg:row-span-2"
                )}
              >
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Create professional QR codes in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Choose Your Type",
                description:
                  "Select from URL, text, WiFi, vCard, social media, or custom data",
              },
              {
                step: "02",
                title: "Customize Design",
                description:
                  "Add your logo, colors, and styles to match your brand",
              },
              {
                step: "03",
                title: "Download & Track",
                description:
                  "Get high-quality files and monitor performance with analytics",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-bold text-primary/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by Businesses
            </h2>
            <p className="text-muted-foreground text-lg">
              See what our customers have to say about QRHub
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-pink-600 p-8 sm:p-16 text-center">
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                Join thousands of businesses using QRHub to create, manage, and
                track their QR codes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button
                    size="xl"
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="xl"
                    variant="outline"
                    className="w-full sm:w-auto border-white text-white hover:bg-white/10"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-muted-foreground text-lg">
              Start free and upgrade as you grow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Free
                </div>
                <div className="text-4xl font-bold mb-4">$0</div>
                <p className="text-muted-foreground mb-6">
                  Perfect for getting started with basic QR code needs
                </p>
                <Link href="/signup">
                  <Button variant="outline" className="w-full mb-6">
                    Get Started
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {[
                    "10 QR codes per month",
                    "Basic customization",
                    "PNG & SVG downloads",
                    "7-day scan history",
                    "Email support",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative hover:shadow-xl transition-shadow border-primary">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white text-sm font-medium px-4 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <CardContent className="p-8">
                <div className="text-sm font-medium text-primary mb-2">
                  Pro
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  Everything you need for professional QR code management
                </p>
                <Link href="/signup?plan=pro">
                  <Button className="w-full mb-6 shadow-lg shadow-primary/25">
                    Start Pro Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {[
                    "Unlimited QR codes",
                    "Advanced customization",
                    "All download formats",
                    "Dynamic QR codes",
                    "Analytics & tracking",
                    "Business cards",
                    "Restaurant menus",
                    "Priority support",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
