"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Instagram, Facebook, Twitter, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

/**
 * ============================================================================
 * THE RAW HOUSE - Gucci-Inspired Editorial Footer
 * ============================================================================
 */

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Welcome to The Raw House Private Journal", {
      description: "You have been registered for private preview notifications.",
    });
    setEmail("");
  };

  return (
    <footer className="bg-[#0b0807] border-t border-raw-border/60 text-raw-ivory pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        
        {/* Col 1 & 2: Private Newsletter Dispatch */}
        <div className="lg:col-span-2 space-y-6 border-r border-raw-border/40 pr-8">
          <span className="text-2xl font-serif-luxury text-raw-gold tracking-[0.2em] block uppercase">
            THE RAW HOUSE
          </span>
          <p className="text-xs text-raw-muted leading-relaxed tracking-wide max-w-md">
            Subscribe to receive private invitations to new runway collection launches, seasonal lookbooks, and bespoke atelier concierge appointments.
          </p>
          <form onSubmit={handleSubscribe} className="relative max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="w-full bg-raw-charcoal/80 border border-raw-border focus:border-raw-gold text-xs text-raw-ivory px-4 py-3 outline-none tracking-widest placeholder-raw-muted"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 text-raw-gold hover:text-raw-goldHover p-1"
              aria-label="Subscribe"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Col 3: Client Services */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-raw-gold">
            Client Services
          </p>
          <ul className="space-y-2.5 text-xs text-raw-muted tracking-wider">
            <li>
              <Link href="/contact" className="hover:text-raw-gold transition-colors">
                Contact Concierge
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-raw-gold transition-colors">
                Shipping & Express Delivery
              </Link>
            </li>
            <li>
              <Link href="/return-policy" className="hover:text-raw-gold transition-colors">
                Complimentary Returns
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-raw-gold transition-colors">
                Frequently Asked Questions
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: The Company */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-raw-gold">
            The House
          </p>
          <ul className="space-y-2.5 text-xs text-raw-muted tracking-wider">
            <li>
              <Link href="/about" className="hover:text-raw-gold transition-colors">
                About The Atelier
              </Link>
            </li>
            <li>
              <Link href="/craftsmanship" className="hover:text-raw-gold transition-colors">
                Sustainable Craftsmanship
              </Link>
            </li>
            <li>
              <Link href="/boutiques" className="hover:text-raw-gold transition-colors">
                Find a Store
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-raw-gold transition-colors">
                Careers
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 5: Security & Payment Trust */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-raw-gold">
            Guaranteed Security
          </p>
          <div className="flex items-center space-x-2 text-xs text-raw-muted">
            <ShieldCheck className="w-5 h-5 text-raw-gold" />
            <span>256-bit SSL Encrypted Payments</span>
          </div>
          <div className="text-[11px] text-raw-muted leading-relaxed">
            Razorpay Verified: UPI, Credit Cards, Net Banking, EMI, Wallets.
          </div>
          <div className="flex space-x-4 pt-2 text-raw-muted">
            <a href="#" className="hover:text-raw-gold transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-raw-gold transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-raw-gold transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

      {/* Copyright & Legal Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-raw-border/30 flex flex-col md:flex-row justify-between items-center text-[11px] text-raw-muted tracking-widest gap-4">
        <div>
          &copy; {new Date().getFullYear()} THE RAW HOUSE. All rights reserved. Registered domain: rawhouse.in
        </div>
        <div className="flex space-x-6">
          <Link href="/privacy-policy" className="hover:text-raw-gold transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-conditions" className="hover:text-raw-gold transition-colors">
            Terms of Sale
          </Link>
          <Link href="/cookies" className="hover:text-raw-gold transition-colors">
            Cookie Settings
          </Link>
        </div>
      </div>
    </footer>
  );
};
