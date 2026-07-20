import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-lg text-muted-foreground">
              Have a question or need help? We&apos;d love to hear from you. Send us
              a message and we&apos;ll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <input
                    type="email"
                    className="w-full h-10 rounded-md border border-input bg-background px-3"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full h-10 rounded-md border border-input bg-background px-3"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Message
                  </label>
                  <textarea
                    className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-muted-foreground">
                        support@tiptapcard.com
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-muted-foreground">+1 (555) 123-4567</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-muted-foreground">
                        123 Innovation Drive
                        <br />
                        San Francisco, CA 94102
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium">Business Hours</div>
                      <div className="text-muted-foreground">
                        Mon - Fri: 9:00 AM - 6:00 PM PST
                        <br />
                        Sat - Sun: Closed
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <Button variant="outline" size="lg">
                    Twitter
                  </Button>
                  <Button variant="outline" size="lg">
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="lg">
                    GitHub
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">Enterprise Customers</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Need a custom solution for your organization? Our enterprise
                  team is ready to help.
                </p>
                <Link href="/contact/enterprise">
                  <Button variant="outline">Contact Enterprise Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
