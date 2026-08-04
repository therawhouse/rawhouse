"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-raw-bg text-raw-ivory flex flex-col">
      <Header cartItemCount={0} wishlistItemCount={0} onOpenCart={() => {}} onOpenWishlist={() => {}} onOpenAuth={() => {}} />
      <main className="flex-1 max-w-4xl mx-auto py-32 px-6">
        <h1 className="text-3xl font-serif-luxury text-raw-gold uppercase tracking-widest mb-12 border-b border-raw-border pb-6">
          Terms & Conditions
        </h1>
        <div className="space-y-8 text-sm leading-relaxed text-raw-muted">
          <p>
            Welcome to The Raw House. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions of use.
          </p>

          <div>
            <h2 className="text-lg font-bold text-raw-ivory tracking-widest uppercase mb-4">1. Use of the Site</h2>
            <p>You agree to use our website for lawful purposes only. You must not use the site in any way that causes, or is likely to cause, the site or access to it to be interrupted, damaged, or impaired.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-raw-ivory tracking-widest uppercase mb-4">2. Intellectual Property</h2>
            <p>All content included on this site, such as text, graphics, logos, images, and software, is the property of The Raw House or its content suppliers and is protected by international copyright laws.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-raw-ivory tracking-widest uppercase mb-4">3. Product Descriptions</h2>
            <p>We attempt to be as accurate as possible in our product descriptions. However, we do not warrant that product descriptions or other content of this site are perfectly accurate, complete, reliable, current, or error-free.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-raw-ivory tracking-widest uppercase mb-4">4. Pricing & Availability</h2>
            <p>All prices are subject to change without notice. We reserve the right to modify or discontinue products at any time. We shall not be liable to you or any third party for any modification, price change, or discontinuance.</p>
          </div>
          
          <div>
            <h2 className="text-lg font-bold text-raw-ivory tracking-widest uppercase mb-4">5. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
