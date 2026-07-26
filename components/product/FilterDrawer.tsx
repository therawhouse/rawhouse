"use client";

import React from "react";
import { X, Check } from "lucide-react";

/**
 * ============================================================================
 * THE RAW HOUSE - Gucci Product Catalog Filter Drawer
 * ============================================================================
 */

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedGender: string;
  setSelectedGender: (gen: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  onResetFilters: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  selectedGender,
  setSelectedGender,
  priceRange,
  setPriceRange,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-raw-bg/80 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-md bg-raw-card border-r border-raw-border flex flex-col justify-between shadow-2xl text-raw-ivory p-6">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-6 border-b border-raw-border">
            <h3 className="text-sm font-serif-luxury uppercase tracking-[0.25em] text-raw-gold">
              Refine Collection
            </h3>
            <button onClick={onClose} className="text-raw-ivory hover:text-raw-gold p-1">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filter Options Scrollable Body */}
          <div className="flex-1 overflow-y-auto py-6 space-y-8 text-xs">
            
            {/* Category */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-[0.2em] text-raw-ivory">Category</h4>
              <div className="flex flex-wrap gap-2">
                {["All", "outerwear", "tailored-suits", "leather-goods", "footwear"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 border tracking-wider capitalize transition-all ${
                      selectedCategory === cat
                        ? "border-raw-gold bg-raw-gold/10 text-raw-gold font-bold"
                        : "border-raw-border text-raw-muted hover:border-raw-gold/50"
                    }`}
                  >
                    {cat.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-[0.2em] text-raw-ivory">Gender</h4>
              <div className="flex gap-2">
                {["All", "Men", "Women", "Unisex"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`flex-1 py-2 border tracking-wider transition-all ${
                      selectedGender === g
                        ? "border-raw-gold bg-raw-gold/10 text-raw-gold font-bold"
                        : "border-raw-border text-raw-muted hover:border-raw-gold/50"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <div className="flex justify-between items-center font-bold uppercase tracking-[0.2em]">
                <span>Price Range</span>
                <span className="text-raw-gold">₹{priceRange[1].toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min={20000}
                max={200000}
                step={5000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-raw-gold bg-raw-border h-1 rounded-lg cursor-pointer"
              />
            </div>

            {/* Size */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-[0.2em] text-raw-ivory">Size Variant</h4>
              <div className="grid grid-cols-4 gap-2">
                {["All", "S", "M", "L", "XL", "48 EU", "50 EU", "52 EU"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 border tracking-wider text-center transition-all ${
                      selectedSize === s
                        ? "border-raw-gold bg-raw-gold/10 text-raw-gold font-bold"
                        : "border-raw-border text-raw-muted hover:border-raw-gold/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="space-y-3">
              <h4 className="font-bold uppercase tracking-[0.2em] text-raw-ivory">Color Palette</h4>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: "All", hex: "transparent" },
                  { name: "Espresso Brown", hex: "#16100e" },
                  { name: "Raw Gold", hex: "#c69255" },
                  { name: "Cognac", hex: "#b07b41" },
                  { name: "Charcoal", hex: "#241b18" },
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`px-3 py-1.5 border tracking-wider flex items-center space-x-2 transition-all ${
                      selectedColor === c.name
                        ? "border-raw-gold text-raw-gold font-bold"
                        : "border-raw-border text-raw-muted hover:border-raw-gold/50"
                    }`}
                  >
                    {c.hex !== "transparent" && (
                      <span
                        className="w-3 h-3 rounded-full border border-raw-border"
                        style={{ backgroundColor: c.hex }}
                      />
                    )}
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Reset & Apply */}
          <div className="pt-4 border-t border-raw-border flex space-x-3">
            <button
              onClick={onResetFilters}
              className="flex-1 border border-raw-border text-raw-muted hover:text-raw-ivory py-3 text-xs uppercase tracking-widest"
            >
              Reset All
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-raw-gold hover:bg-raw-goldHover text-raw-bg py-3 text-xs font-bold uppercase tracking-widest"
            >
              Apply Filters
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
