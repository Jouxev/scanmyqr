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
  title: "QRHub - Create & Manage QR Codes",
  description:
    "QRHub is the all-in-one QR code platform for modern businesses. Create, manage, and track QR codes with powerful analytics and customization options.",
  keywords: [
    "QR code",
    "QR generator",
    "QR scanner",
    "QR management",
    "dynamic QR",
    "business card",
    "restaurant menu",
  ],
  authors: [{ name: "QRHub" }],
  openGraph: {
    title: "QRHub - Create & Manage QR Codes",
    description:
      "The all-in-one QR code platform for modern businesses. Create, manage, and track QR codes with powerful analytics.",
    url: "https://qrhub.app",
    siteName: "QRHub",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QRHub - Create & Manage QR Codes",
    description:
      "The all-in-one QR code platform for modern businesses. Create, manage, and track QR codes.",
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
