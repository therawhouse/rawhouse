"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Heart, User, Menu, X, Plus } from "lucide-react";
import { MenuDrawer } from "./MenuDrawer";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white text-black border-b border-gray-200 transition-colors duration-300">
      <div className="px-6 py-4">
        <div className="max-w-[1400px] mx-auto grid grid-cols-3 items-center">
          
          {/* Left: Contact Us */}
          <div className="flex items-center">
            <Link href="/contact" className="hidden md:flex items-center space-x-2 text-xs font-semibold tracking-wider hover:text-gray-600 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Contact Us</span>
            </Link>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex justify-center items-center">
            <Link href="/" className="relative w-48 h-16 flex items-center justify-center group">
              <Image
                src="/images/logo.png"
                alt="THE RAW HOUSE"
                fill
                className="object-contain transition-transform group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center justify-end space-x-6">
            
            {/* Account / Wishlist / Cart Icons (E-commerce Essentials) */}
            <div className="hidden lg:flex items-center space-x-4 mr-4">
              <button onClick={onOpenAuth} className="hover:text-gray-500 transition-colors" title="Client Account">
                <User className="w-5 h-5" />
              </button>

              <button onClick={onOpenWishlist} className="hover:text-gray-500 transition-colors relative" title="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </button>

              <button onClick={onOpenCart} className="hover:text-gray-500 transition-colors relative" title="Shopping Bag">
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-gray-500 transition-colors"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Menu Trigger */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center space-x-2 text-sm font-semibold tracking-wider hover:text-gray-500 transition-colors"
            >
              <Menu className="w-6 h-6" />
              <span className="hidden sm:inline">MENU</span>
            </button>
          </div>

        </div>
      </div>

      {/* Slide-out Menu Drawer */}
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Full-Screen Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col p-8 animate-fade-in text-black">
          <div className="max-w-4xl mx-auto w-full flex justify-between items-center mb-8">
            <h3 className="text-xs uppercase tracking-[0.3em] font-medium text-gray-500">
              Search
            </h3>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="hover:text-gray-500 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="max-w-4xl mx-auto w-full">
            <div className="relative border-b-2 border-black pb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-2xl md:text-3xl font-serif-luxury placeholder-gray-300 outline-none"
              />
              <Search className="absolute right-0 top-2 w-8 h-8 text-black" />
            </div>

            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-3">
                {["Raw Silk Bomber", "Double-Breasted Blazer", "Leather Weekender", "Horsebit Loafers", "Velvet Trench"].map(
                  (term) => (
                    <Link
                      key={term}
                      href={`/catalog?query=${encodeURIComponent(term)}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="text-xs tracking-wider border border-gray-200 hover:border-black px-4 py-2 transition-all"
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
