"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/types";
import { toast } from "sonner";

/**
 * ============================================================================
 * THE RAW HOUSE - Gucci-Inspired Product Card Component
 * ============================================================================
 */

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const primaryImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800";
  const hoverImage = product.images?.[1]?.url || primaryImage;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    if (onAddToWishlist) onAddToWishlist(product);
    toast.success(isWishlisted ? "Removed from Wishlist" : "Saved to Wishlist");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
    toast.success("Added to Shopping Bag", {
      description: `${product.title} has been added.`,
    });
  };

  return (
    <div
      className="group relative flex flex-col bg-raw-card/40 border border-raw-border/50 hover:border-raw-gold/40 transition-all duration-300 rounded-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-raw-bg cursor-pointer">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={isHovered ? hoverImage : primaryImage}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1 z-10">
          {product.isNewArrival && (
            <span className="bg-raw-bg/90 backdrop-blur-md border border-raw-gold/40 text-raw-gold text-[9px] uppercase tracking-[0.2em] px-2 py-1 font-semibold">
              New Arrival
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-raw-gold text-raw-bg text-[9px] uppercase tracking-[0.2em] px-2 py-1 font-bold">
              Best Seller
            </span>
          )}
        </div>

        {/* Top Right Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-10 p-2 glass-card rounded-full text-raw-ivory hover:text-raw-gold transition-colors"
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-raw-gold text-raw-gold" : ""}`} />
        </button>

        {/* Bottom Quick Action Overlay (Reveals on Hover) */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-raw-bg via-raw-bg/80 to-transparent flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="flex-1 bg-raw-charcoal/90 hover:bg-raw-border text-raw-ivory text-[10px] font-semibold uppercase tracking-[0.2em] py-2.5 flex items-center justify-center space-x-1.5 transition-colors border border-raw-border"
            >
              <Eye className="w-3.5 h-3.5 text-raw-gold" />
              <span>Quick View</span>
            </button>
          )}

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-raw-gold hover:bg-raw-goldHover text-raw-bg text-[10px] font-bold uppercase tracking-[0.2em] py-2.5 flex items-center justify-center space-x-1.5 transition-colors shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-2 text-center">
        {/* Category Label */}
        <span className="text-[10px] uppercase tracking-[0.25em] text-raw-gold font-medium">
          {product.gender} Atelier
        </span>

        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-serif-luxury text-raw-ivory hover:text-raw-gold transition-colors tracking-wide line-clamp-1">
            {product.title}
          </h3>
        </Link>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex justify-center space-x-1.5 pt-1">
            {product.colors.map((color) => (
              <span
                key={color.colorName}
                title={color.colorName}
                style={{ backgroundColor: color.hexCode }}
                className="w-3 h-3 rounded-full border border-raw-border shadow-sm cursor-pointer hover:scale-125 transition-transform"
              />
            ))}
          </div>
        )}

        {/* Price Display */}
        <div className="pt-2 text-xs tracking-widest text-raw-ivory font-medium">
          {product.salePrice ? (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-raw-gold font-semibold">
                ₹{product.salePrice.toLocaleString("en-IN")}
              </span>
              <span className="line-through text-raw-muted text-[11px]">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>
          ) : (
            <span>₹{product.price.toLocaleString("en-IN")}</span>
          )}
        </div>
      </div>
    </div>
  );
};
