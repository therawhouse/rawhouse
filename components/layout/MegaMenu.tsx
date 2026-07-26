"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * ============================================================================
 * THE RAW HOUSE - Gucci-Inspired Mega Menu Component
 * ============================================================================
 * Notes:
 * Provides multi-column editorial browsing experience with featured campaign previews,
 * category links, and collection highlights.
 */

interface MegaMenuProps {
  activeMenu: string | null;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ activeMenu, onClose }) => {
  if (!activeMenu) return null;

  return (
    <div
      className="absolute top-full left-0 w-full glass-header border-b border-raw-border shadow-2xl py-10 px-8 z-40 transition-all duration-300 animate-slide-up"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 text-raw-ivory">
        {/* Column 1: Featured Runway Highlights */}
        <div className="col-span-3 border-r border-raw-border/50 pr-6">
          <p className="text-xs uppercase tracking-[0.2em] text-raw-gold font-semibold mb-4">
            Atelier Highlights
          </p>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href="/collections/autumn-winter-2026"
                onClick={onClose}
                className="hover:text-raw-gold transition-colors tracking-wide block"
              >
                Autumn / Winter 2026 Runway
              </Link>
            </li>
            <li>
              <Link
                href="/collections/raw-silk-capsule"
                onClick={onClose}
                className="hover:text-raw-gold transition-colors tracking-wide block"
              >
                Raw Silk & Velvet Capsule
              </Link>
            </li>
            <li>
              <Link
                href="/collections/bespoke-tailoring"
                onClick={onClose}
                className="hover:text-raw-gold transition-colors tracking-wide block"
              >
                Bespoke Tailoring Service
              </Link>
            </li>
            <li>
              <Link
                href="/collections/monogram-edition"
                onClick={onClose}
                className="hover:text-raw-gold transition-colors tracking-wide block font-medium text-raw-gold"
              >
                The Monogram Edition ✨
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Department Categories */}
        <div className="col-span-3 border-r border-raw-border/50 pr-6">
          <p className="text-xs uppercase tracking-[0.2em] text-raw-gold font-semibold mb-4">
            Shop Category
          </p>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href="/catalog?category=outerwear"
                onClick={onClose}
                className="hover:text-raw-gold transition-colors block"
              >
                Outerwear & Trench Coats
              </Link>
            </li>
            <li>
              <Link
                href="/catalog?category=tailored-suits"
                onClick={onClose}
                className="hover:text-raw-gold transition-colors block"
              >
                Double-Breasted Blazers
              </Link>
            </li>
            <li>
              <Link
                href="/catalog?category=leather-goods"
                onClick={onClose}
                className="hover:text-raw-gold transition-colors block"
              >
                Full-Grain Leather Totes
              </Link>
            </li>
            <li>
              <Link
                href="/catalog?category=footwear"
                onClick={onClose}
                className="hover:text-raw-gold transition-colors block"
              >
                Hand-Burnished Loafers
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 & 4: Editorial Visual Previews */}
        <div className="col-span-3">
          <div className="relative h-52 w-full rounded-sm overflow-hidden img-zoom-container group cursor-pointer">
            <Image
              src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600"
              alt="Editorial Campaign"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-raw-bg/90 via-transparent to-transparent flex flex-col justify-end p-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-raw-gold font-bold">
                Editorial Lookbook
              </span>
              <h4 className="text-base font-serif-luxury tracking-wide text-raw-ivory">
                The Raw Silk Experience
              </h4>
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <div className="relative h-52 w-full rounded-sm overflow-hidden img-zoom-container group cursor-pointer">
            <Image
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600"
              alt="Bespoke Tailoring"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-raw-bg/90 via-transparent to-transparent flex flex-col justify-end p-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-raw-gold font-bold">
                Atelier Craftsmanship
              </span>
              <h4 className="text-base font-serif-luxury tracking-wide text-raw-ivory">
                Tailored Suit Editions
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
