"use client";

import React from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-500 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] max-w-[90vw] bg-white z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } shadow-2xl overflow-y-auto`}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 bg-black text-white rounded-full p-2 hover:scale-110 transition-transform"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

        <nav className="flex flex-col pt-24 px-12 pb-12 space-y-6 text-[#140e0c]">
          <Link href="/catalog?category=new-in" className="text-lg font-medium hover:text-[#c69255] transition-colors" onClick={onClose}>
            New In
          </Link>
          <Link href="/catalog?category=women" className="text-lg font-medium hover:text-[#c69255] transition-colors" onClick={onClose}>
            Women
          </Link>
          <Link href="/catalog?category=men" className="text-lg font-medium hover:text-[#c69255] transition-colors" onClick={onClose}>
            Men
          </Link>
          <Link href="/catalog?category=handbags" className="text-lg font-medium hover:text-[#c69255] transition-colors" onClick={onClose}>
            Handbags
          </Link>
          <Link href="/catalog?category=outerwear" className="text-lg font-medium hover:text-[#c69255] transition-colors" onClick={onClose}>
            Outerwear
          </Link>
          <Link href="/catalog?category=shoes" className="text-lg font-medium hover:text-[#c69255] transition-colors" onClick={onClose}>
            Shoes
          </Link>
          
          <div className="h-px bg-gray-200 my-4" />

          <Link href="/services" className="text-sm hover:text-[#c69255] transition-colors" onClick={onClose}>
            Atelier Services
          </Link>
          <Link href="/about" className="text-sm hover:text-[#c69255] transition-colors" onClick={onClose}>
            World of The Raw House
          </Link>
          <Link href="/boutiques" className="text-sm hover:text-[#c69255] transition-colors" onClick={onClose}>
            Store Locator
          </Link>

          <div className="h-px bg-gray-200 my-4" />

          <Link href="/wishlist" className="text-sm hover:text-[#c69255] transition-colors underline-offset-4 hover:underline" onClick={onClose}>
            Saved Items
          </Link>
          <Link href="/contact" className="text-sm hover:text-[#c69255] transition-colors underline-offset-4 hover:underline" onClick={onClose}>
            Contact Us
          </Link>
        </nav>
      </div>
    </>
  );
};
