"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { EditorialGrid } from "@/components/home/EditorialGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistDrawer } from "@/components/cart/WishlistDrawer";
import { AuthModal } from "@/components/auth/AuthModal";
import { Product, CartItem } from "@/types";
import { toast } from "sonner";
import Image from "next/image";
import { X, ShoppingBag, CreditCard, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/CartContext";

/**
 * ============================================================================
 * THE RAW HOUSE - Luxury E-Commerce Master Homepage
 * ============================================================================
 */

// Products will be fetched from the database via /api/products

export default function HomePage() {
  const { cartItems, addToCart, updateQuantity, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setProducts(json.data);
        }
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  // Wishlist Operations
  const handleAddToWishlist = (product: Product) => {
    setWishlistItems((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-raw-bg text-raw-ivory">
      {/* Header */}
      <Header
        cartItemCount={totalCartCount}
        wishlistItemCount={wishlistItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Hero Slider */}
      <HeroSection />

      {/* Gucci Asymmetric Editorial Grid */}
      <EditorialGrid />

      {/* Featured Products Showcase */}
      <FeaturedProducts
        products={products.filter(p => p.isFeatured)}
        onAddToCart={addToCart}
        onAddToWishlist={handleAddToWishlist}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* Brand Value Banner */}
      <section className="bg-raw-card border-y border-raw-border py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <span className="text-raw-gold text-2xl font-serif-luxury">𝓡</span>
            <h4 className="text-sm font-serif-luxury uppercase tracking-[0.2em]">
              Handcrafted Atelier Pieces
            </h4>
            <p className="text-xs text-raw-muted tracking-wide max-w-xs mx-auto">
              Every garment is individually cut and finished by master artisans.
            </p>
          </div>

          <div className="space-y-3">
            <CreditCard className="w-6 h-6 text-raw-gold mx-auto" />
            <h4 className="text-sm font-serif-luxury uppercase tracking-[0.2em]">
              Verified Razorpay Payments
            </h4>
            <p className="text-xs text-raw-muted tracking-wide max-w-xs mx-auto">
              Supporting UPI, Net Banking, Credit/Debit Cards, EMI, and Wallets.
            </p>
          </div>

          <div className="space-y-3">
            <ShieldCheck className="w-6 h-6 text-raw-gold mx-auto" />
            <h4 className="text-sm font-serif-luxury uppercase tracking-[0.2em]">
              Bespoke Gift Wrapping
            </h4>
            <p className="text-xs text-raw-muted tracking-wide max-w-xs mx-auto">
              Delivered in signature velvet covers and gold-embossed cases.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistItems}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={addToCart}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-raw-bg/85 backdrop-blur-md"
            onClick={() => setQuickViewProduct(null)}
          />
          <div className="relative bg-raw-card border border-raw-border max-w-3xl w-full p-6 z-10 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-2xl">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-3 right-3 text-raw-ivory hover:text-raw-gold"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative aspect-[3/4] bg-raw-bg overflow-hidden border border-raw-border">
              <Image
                src={quickViewProduct.images[0]?.url || "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600"}
                alt={quickViewProduct.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-between space-y-4 text-xs">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-raw-gold">
                  Quick View
                </span>
                <h3 className="text-xl font-serif-luxury text-raw-ivory">
                  {quickViewProduct.title}
                </h3>
                <div className="text-lg font-bold text-raw-gold">
                  ₹{quickViewProduct.price.toLocaleString("en-IN")}
                </div>
                <p className="text-raw-muted leading-relaxed text-[11px]">
                  {quickViewProduct.description}
                </p>
              </div>

              <button
                onClick={() => {
                  addToCart(quickViewProduct);
                  setQuickViewProduct(null);
                }}
                className="w-full bg-raw-gold hover:bg-raw-goldHover text-raw-bg font-bold py-3 uppercase tracking-[0.2em] flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO BAG</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
