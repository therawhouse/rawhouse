"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * ============================================================================
 * THE RAW HOUSE - Featured Products Showcase Component
 * ============================================================================
 */

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}) => {
  const [activeTab, setActiveTab] = useState<"featured" | "new" | "bestseller">("featured");

  const filteredProducts = products.filter((p) => {
    if (activeTab === "new") return p.isNewArrival;
    if (activeTab === "bestseller") return p.isBestSeller;
    return p.isFeatured;
  });

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-raw-border pb-6 gap-6">
        <div>
          <span className="text-xs uppercase tracking-[0.35em] text-raw-gold font-semibold">
            CURATED SELECTION
          </span>
          <h2 className="text-2xl md:text-4xl font-serif-luxury text-raw-ivory tracking-[0.15em] uppercase">
            The Atelier Showcase
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-6 text-xs uppercase tracking-[0.2em] font-medium">
          <button
            onClick={() => setActiveTab("featured")}
            className={`pb-2 relative transition-colors ${
              activeTab === "featured" ? "text-raw-gold font-bold" : "text-raw-muted hover:text-raw-ivory"
            }`}
          >
            Featured
            {activeTab === "featured" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-raw-gold" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("new")}
            className={`pb-2 relative transition-colors ${
              activeTab === "new" ? "text-raw-gold font-bold" : "text-raw-muted hover:text-raw-ivory"
            }`}
          >
            New Arrivals
            {activeTab === "new" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-raw-gold" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("bestseller")}
            className={`pb-2 relative transition-colors ${
              activeTab === "bestseller" ? "text-raw-gold font-bold" : "text-raw-muted hover:text-raw-ivory"
            }`}
          >
            Best Sellers
            {activeTab === "bestseller" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-raw-gold" />
            )}
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.slice(0, 8).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
            onQuickView={onQuickView}
          />
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/catalog"
          className="inline-flex items-center space-x-3 border border-raw-gold text-raw-gold hover:bg-raw-gold hover:text-raw-bg px-10 py-4 text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 shadow-lg"
        >
          <span>VIEW COMPLETE CATALOG</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
