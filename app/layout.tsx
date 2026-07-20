import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "TiptapCard - Create & Manage QR Codes",
  applicationName: "TiptapCard",
  description:
    "TiptapCard is the all-in-one QR code platform for modern businesses. Create, manage, and track QR codes with powerful analytics and customization options.",
  keywords: [
    "QR code",
    "QR generator",
    "QR scanner",
    "QR management",
    "dynamic QR",
    "business card",
    "restaurant menu",
  ],
  authors: [{ name: "TiptapCard" }],
  openGraph: {
    title: "TiptapCard - Create & Manage QR Codes",
    description:
      "The all-in-one QR code platform for modern businesses. Create, manage, and track QR codes with powerful analytics.",
    url: "https://tiptapcard.com",
    siteName: "TiptapCard",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TiptapCard - Create & Manage QR Codes",
    description:
      "The all-in-one QR code platform for modern businesses. Create, manage, and track QR codes.",
  },
  icons: {
    icon: [
      { url: "/brand/tiptap-icon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: [{ url: "/brand/tiptap-icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/tiptap-icon.svg", type: "image/svg+xml" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
