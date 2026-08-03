import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { NextAuthProvider } from "@/components/auth/NextAuthProvider";

/**
 * ============================================================================
 * THE RAW HOUSE - Root Next.js 15 Layout & Global SEO Configuration
 * ============================================================================
 */

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rawhouse.in"),
  title: {
    default: "The Raw House | Luxury Apparel & Atelier Collections",
    template: "%s | The Raw House",
  },
  description:
    "Discover handcrafted raw silk outerwear, double-breasted tailored suits, full-grain leather totes, and hand-burnished footwear at The Raw House luxury atelier.",
  keywords: [
    "The Raw House",
    "Luxury Clothing",
    "Raw Silk Jacket",
    "Tailored Suits India",
    "Leather Weekender Tote",
    "Gucci Inspired Fashion",
    "High Fashion E-commerce",
  ],
  authors: [{ name: "The Raw House Atelier" }],
  openGraph: {
    title: "The Raw House | Luxury Apparel & Atelier Collections",
    description: "Handcrafted raw silk garments and bespoke tailored outerwear.",
    url: "https://rawhouse.in",
    siteName: "The Raw House",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "The Raw House Luxury Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Raw House | Luxury Apparel & Atelier Collections",
    description: "Handcrafted raw silk garments and bespoke tailored outerwear.",
    images: ["https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { CartProvider } from "@/lib/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Organization Schema for Google Search Engine Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Raw House",
    url: "https://rawhouse.in",
    logo: "https://rawhouse.in/logo.png",
    sameAs: [
      "https://instagram.com/therawhouse",
      "https://facebook.com/therawhouse",
    ],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Razorpay Checkout SDK Script */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="bg-raw-bg text-raw-ivory antialiased min-h-screen flex flex-col selection:bg-raw-gold selection:text-raw-bg">
        <NextAuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </NextAuthProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1b1210",
              color: "#f9f6f0",
              border: "1px solid #c69255",
            },
          }}
        />
      </body>
    </html>
  );
}
