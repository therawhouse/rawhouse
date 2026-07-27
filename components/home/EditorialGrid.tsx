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
          WHO ARE WE
        </span>
        <h2 className="text-3xl md:text-5xl font-serif-luxury text-raw-ivory tracking-[0.15em] uppercase">
          The Raw House
        </h2>
        <div className="w-12 h-[1px] bg-raw-gold mx-auto mt-4" />
        <p className="text-raw-muted max-w-2xl mx-auto text-sm leading-relaxed mt-6">
          The Raw House is a contemporary fashion house that transforms stories from around the world into modern, wearable design. We believe fashion can be more than what people wear. It can carry stories, spark curiosity, and create connections across cultures.
        </p>
      </div>

      {/* 2-Column Asymmetric Campaign Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Card - Vision & Mission */}
        <div className="md:col-span-7 relative h-[550px] overflow-hidden rounded-sm img-zoom-container group">
          <Image
            src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200"
            alt="Vision and Mission"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-raw-bg/95 via-raw-bg/30 to-transparent p-8 md:p-12 flex flex-col justify-end">
            <span className="text-xs uppercase tracking-[0.3em] text-raw-gold font-bold mb-2">
              VISION & MISSION
            </span>
            <h3 className="text-2xl md:text-4xl font-serif-luxury text-raw-ivory tracking-wide mb-4">
              Explore. Reinterpret. Connect.
            </h3>
            <p className="text-xs text-raw-ivory max-w-lg mb-2 font-semibold">
              Vision: To become a globally recognised fashion house where every collection tells a story and every story becomes a timeless design.
            </p>
            <p className="text-xs text-raw-muted max-w-lg mb-6 leading-relaxed">
              Mission: To explore the world through design and transform its stories into contemporary fashion that people love to wear.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-raw-gold font-semibold hover:text-raw-ivory transition-colors group-hover:translate-x-1 duration-300"
            >
              <span>Explore Collections</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Card - Brand Position */}
        <div className="md:col-span-5 relative h-[550px] overflow-hidden rounded-sm img-zoom-container group">
          <Image
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000"
            alt="Brand Position"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-raw-bg/95 via-raw-bg/30 to-transparent p-8 md:p-12 flex flex-col justify-end">
            <span className="text-xs uppercase tracking-[0.3em] text-raw-gold font-bold mb-2">
              POSITIONING
            </span>
            <h3 className="text-2xl md:text-3xl font-serif-luxury text-raw-ivory tracking-wide mb-4">
              Accessible Premium
            </h3>
            <p className="text-xs text-raw-muted max-w-sm mb-6 leading-relaxed">
              Positioned between fast fashion and luxury designer labels, we create thoughtfully designed collections that combine storytelling, culture, and craftsmanship with contemporary aesthetics.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-raw-gold font-semibold hover:text-raw-ivory transition-colors group-hover:translate-x-1 duration-300"
            >
              <span>Discover More</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
