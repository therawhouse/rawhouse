"use client";

import React from "react";
import Image from "next/image";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Product } from "@/types";
import { toast } from "sonner";

/**
 * ============================================================================
 * THE RAW HOUSE - Gucci-Inspired Saved Items Wishlist Drawer
 * ============================================================================
 */

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-raw-bg/80 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-raw-card border-l border-raw-border flex flex-col justify-between shadow-2xl text-raw-ivory">
          
          {/* Header */}
          <div className="p-6 border-b border-raw-border flex justify-between items-center bg-raw-bg">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-raw-gold fill-raw-gold" />
              <h2 className="text-sm font-serif-luxury uppercase tracking-[0.25em] text-raw-ivory">
                Saved Wishlist ({items.length})
              </h2>
            </div>
            <button onClick={onClose} className="text-raw-ivory hover:text-raw-gold">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <Heart className="w-12 h-12 text-raw-muted/40 mx-auto" />
                <p className="text-xs uppercase tracking-[0.2em] text-raw-muted">
                  Your saved items list is empty
                </p>
              </div>
            ) : (
              items.map((product) => (
                <div
                  key={product.id}
                  className="flex space-x-4 border-b border-raw-border/40 pb-6 items-center"
                >
                  <div className="relative w-20 h-24 bg-raw-bg overflow-hidden flex-shrink-0 border border-raw-border">
                    <Image
                      src={product.images[0]?.url || "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <h4 className="text-xs font-serif-luxury tracking-wide text-raw-ivory line-clamp-1">
                      {product.title}
                    </h4>
                    <div className="text-xs text-raw-gold font-semibold tracking-wider">
                      ₹{product.price.toLocaleString("en-IN")}
                    </div>

                    <div className="flex space-x-2 pt-1">
                      <button
                        onClick={() => {
                          onAddToCart(product);
                          toast.success("Moved to Shopping Bag");
                        }}
                        className="bg-raw-gold hover:bg-raw-goldHover text-raw-bg text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 flex items-center space-x-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>

                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="p-1.5 text-raw-muted hover:text-red-400 border border-raw-border"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
