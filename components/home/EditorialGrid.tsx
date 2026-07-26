"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * ============================================================================
 * THE RAW HOUSE - Gucci Editorial Campaign Grid Component
 * ============================================================================
 */

export const EditorialGrid: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto py-20 px-6 space-y-16">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.35em] text-raw-gold font-semibold">
          THE HOUSE CAMPAIGNS
        </span>
        <h2 className="text-3xl md:text-5xl font-serif-luxury text-raw-ivory tracking-[0.15em] uppercase">
          Craftsmanship & Heritage
        </h2>
        <div className="w-12 h-[1px] bg-raw-gold mx-auto mt-4" />
      </div>

      {/* 2-Column Asymmetric Campaign Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Card - Outerwear Focus */}
        <div className="md:col-span-7 relative h-[550px] overflow-hidden rounded-sm img-zoom-container group">
          <Image
            src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200"
            alt="Raw Silk Outerwear Campaign"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-raw-bg/95 via-raw-bg/30 to-transparent p-8 md:p-12 flex flex-col justify-end">
            <span className="text-xs uppercase tracking-[0.3em] text-raw-gold font-bold mb-2">
              RUNWAY CAPSULE
            </span>
            <h3 className="text-2xl md:text-4xl font-serif-luxury text-raw-ivory tracking-wide mb-4">
              The Raw Silk & Trench Edition
            </h3>
            <p className="text-xs text-raw-muted max-w-lg mb-6 leading-relaxed">
              Uncompromising raw silk textures, hand-pleated shoulder construction, and signature antiqued gold hardware designed in our master atelier.
            </p>
            <Link
              href="/catalog?category=outerwear"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-raw-gold font-semibold hover:text-raw-ivory transition-colors group-hover:translate-x-1 duration-300"
            >
              <span>Explore Outerwear</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Card - Leather Goods Focus */}
        <div className="md:col-span-5 relative h-[550px] overflow-hidden rounded-sm img-zoom-container group">
          <Image
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000"
            alt="Hand-carved Leather Tote"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-raw-bg/95 via-raw-bg/30 to-transparent p-8 md:p-12 flex flex-col justify-end">
            <span className="text-xs uppercase tracking-[0.3em] text-raw-gold font-bold mb-2">
              ATELIER LEATHER
            </span>
            <h3 className="text-2xl md:text-3xl font-serif-luxury text-raw-ivory tracking-wide mb-4">
              Cognac Monogram Totes
            </h3>
            <p className="text-xs text-raw-muted max-w-sm mb-6 leading-relaxed">
              Full-grain Italian leather hand-carved with bespoke monogram details.
            </p>
            <Link
              href="/catalog?category=leather-goods"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-raw-gold font-semibold hover:text-raw-ivory transition-colors group-hover:translate-x-1 duration-300"
            >
              <span>Discover Bags</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
