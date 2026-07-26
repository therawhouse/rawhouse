"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, User, Menu, X, Globe } from "lucide-react";
import { MegaMenu } from "./MegaMenu";

/**
 * ============================================================================
 * THE RAW HOUSE - Gucci-Inspired Luxury Header & Top Navigation
 * ============================================================================
 * Features:
 * 1. Top Bar: Complimentary express shipping notice & currency selector (INR ₹).
 * 2. Brand Logo: Custom typography & emblem monogram.
 * 3. Mega Menu Hovering: Smooth navigation triggers for Outerwear, Suits, Bags.
 * 4. Interactive Drawer Triggers: Cart Bag count badge, Wishlist count badge, Search Modal.
 */

interface HeaderProps {
  cartItemCount?: number;
  wishlistItemCount?: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount = 0,
  wishlistItemCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full transition-colors duration-300">
      {/* 1. Gucci-Style Top Announcement Bar */}
      <div className="bg-[#0e0a09] border-b border-raw-border/40 py-2 px-4 text-[11px] text-raw-muted tracking-widest flex justify-between items-center">
        <div className="hidden md:flex items-center space-x-2">
          <Globe className="w-3.5 h-3.5 text-raw-gold" />
          <span>INDIA (INR ₹) | EN</span>
        </div>

        <div className="mx-auto md:mx-0 text-center font-medium text-raw-ivory tracking-[0.15em] uppercase">
          Complimentary Worldwide Express Shipping & Bespoke Gift Wrapping
        </div>

        <div className="hidden md:flex items-center space-x-4 text-[11px]">
          <Link href="/boutiques" className="hover:text-raw-gold transition-colors">
            Atelier Boutiques
          </Link>
          <span>|</span>
          <Link href="/contact" className="hover:text-raw-gold transition-colors">
            Client Services
          </Link>
        </div>
      </div>

      {/* 2. Main Luxury Header */}
      <div className="glass-header border-b border-raw-border px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Mobile Menu Toggle & Navigation Triggers */}
          <div className="flex items-center space-x-6 lg:w-1/3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-raw-ivory hover:text-raw-gold transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <nav className="hidden lg:flex items-center space-x-8 text-xs tracking-[0.2em] font-medium text-raw-ivory uppercase">
              <button
                onMouseEnter={() => setActiveMenu("NEW")}
                className="hover:text-raw-gold transition-colors py-2 relative group"
              >
                New Arrivals
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-raw-gold transition-all duration-300 group-hover:w-full" />
              </button>

              <button
                onMouseEnter={() => setActiveMenu("OUTERWEAR")}
                className="hover:text-raw-gold transition-colors py-2 relative group"
              >
                Outerwear
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-raw-gold transition-all duration-300 group-hover:w-full" />
              </button>

              <button
                onMouseEnter={() => setActiveMenu("SUITS")}
                className="hover:text-raw-gold transition-colors py-2 relative group"
              >
                Tailored Suits
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-raw-gold transition-all duration-300 group-hover:w-full" />
              </button>

              <button
                onMouseEnter={() => setActiveMenu("LEATHER")}
                className="hover:text-raw-gold transition-colors py-2 relative group"
              >
                Leather Goods
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-raw-gold transition-all duration-300 group-hover:w-full" />
              </button>
            </nav>
          </div>

          {/* Center Brand Logo */}
          <div className="text-center lg:w-1/3">
            <Link href="/" className="inline-flex flex-col items-center group">
              {/* Emblem Logo Monogram */}
              <div className="text-raw-gold text-2xl font-serif-luxury leading-none tracking-tighter mb-1 transition-transform group-hover:scale-105">
                𝓡
              </div>
              <span className="text-xl md:text-2xl font-serif-luxury tracking-[0.3em] text-raw-ivory uppercase group-hover:text-raw-gold transition-colors">
                THE RAW HOUSE
              </span>
              <span className="text-[8px] tracking-[0.4em] text-raw-gold uppercase">
                LUXURY ATELIER
              </span>
            </Link>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center justify-end space-x-6 lg:w-1/3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-raw-ivory hover:text-raw-gold transition-colors flex items-center space-x-2 text-xs tracking-widest"
              title="Search"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline uppercase text-[11px]">Search</span>
            </button>

            {/* Account Trigger */}
            <button
              onClick={onOpenAuth}
              className="text-raw-ivory hover:text-raw-gold transition-colors hidden sm:block"
              title="Client Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={onOpenWishlist}
              className="text-raw-ivory hover:text-raw-gold transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-raw-gold text-raw-bg text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </button>

            {/* Cart Bag Trigger */}
            <button
              onClick={onOpenCart}
              className="text-raw-ivory hover:text-raw-gold transition-colors relative flex items-center space-x-2"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 text-raw-gold" />
              {cartItemCount > 0 && (
                <span className="bg-raw-gold text-raw-bg text-[10px] font-bold rounded-full px-1.5 py-0.5">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mega Menu Dropdown */}
      <MegaMenu activeMenu={activeMenu} onClose={() => setActiveMenu(null)} />

      {/* Full-Screen Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 glass-header flex flex-col p-8 animate-fade-in">
          <div className="max-w-4xl mx-auto w-full flex justify-between items-center mb-8">
            <h3 className="text-xs uppercase tracking-[0.3em] text-raw-gold">
              Full-Text Product Search
            </h3>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-raw-ivory hover:text-raw-gold p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="max-w-4xl mx-auto w-full">
            <div className="relative border-b-2 border-raw-gold pb-4">
              <input
                type="text"
                placeholder="Search raw silk coats, tailored suits, loafers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-2xl md:text-3xl font-serif-luxury text-raw-ivory placeholder-raw-muted outline-none"
              />
              <Search className="absolute right-0 top-2 w-8 h-8 text-raw-gold" />
            </div>

            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.2em] text-raw-muted mb-4">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-3">
                {["Raw Silk Bomber", "Double-Breasted Blazer", "Leather Weekender", "Horsebit Loafers", "Velvet Trench"].map(
                  (term) => (
                    <Link
                      key={term}
                      href={`/catalog?query=${encodeURIComponent(term)}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="text-xs tracking-wider border border-raw-border hover:border-raw-gold px-4 py-2 text-raw-ivory hover:text-raw-gold transition-all"
                    >
                      {term}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
