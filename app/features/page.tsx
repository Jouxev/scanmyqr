import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  QrCode,
  Scan,
  BarChart3,
  Layers,
  Palette,
  Download,
  Globe,
  Smartphone,
  Lock,
  Shield,
  Clock,
  ArrowRight,
} from "lucide-react";

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

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Powerful Features for Modern Businesses
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to create, manage, and track QR codes at scale.
              From simple URLs to complex campaigns, we&apos;ve got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Enterprise-Grade Security
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Bank-Level Encryption</h3>
                    <p className="text-sm text-muted-foreground">
                      All your data is encrypted with AES-256 encryption
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Password Protection</h3>
                    <p className="text-sm text-muted-foreground">
                      Add passwords to your QR codes for sensitive content
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Expiration Controls</h3>
                    <p className="text-sm text-muted-foreground">
                      Set expiration dates for time-sensitive campaigns
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-3xl p-12">
              <h3 className="text-2xl font-bold mb-4">99.9% Uptime</h3>
              <p className="text-muted-foreground mb-6">
                Our infrastructure is built for reliability. Your QR codes will
                always be available when customers scan them.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">50M+</div>
                  <div className="text-xs text-muted-foreground">Scans</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">1M+</div>
                  <div className="text-xs text-muted-foreground">QR Codes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-xs text-muted-foreground">Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using TiptapCard to create, manage, and
            track their QR codes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
