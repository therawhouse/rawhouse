"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductDetail } from "@/components/product/ProductDetail";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistDrawer } from "@/components/cart/WishlistDrawer";
import { AuthModal } from "@/components/auth/AuthModal";
import { Product, CartItem } from "@/types";
import { toast } from "sonner";

/**
 * ============================================================================
 * THE RAW HOUSE - Individual Product Detail Page (PDP) Dynamic Route
 * ============================================================================
 */

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Raw Silk Embroidered Bomber Jacket",
    slug: "raw-silk-embroidered-bomber-jacket",
    description: "Crafted from 100% pure raw mulberry silk, featuring hand-stitched golden thread embroidery along the back, ribbed knit collar, and custom antique bronze hardware.",
    details: "Materials: 100% Raw Silk. Lining: 100% Cupro. Dry clean only. Made in Atelier.",
    price: 84500,
    salePrice: 79000,
    gender: "Unisex",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isPublished: true,
    categoryId: "cat1",
    images: [
      { id: "img1", url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000", isPrimary: true, sortOrder: 0 },
      { id: "img2", url: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000", isPrimary: false, sortOrder: 1 },
    ],
    colors: [
      { id: "c1", colorName: "Espresso Brown", hexCode: "#16100e" },
      { id: "c2", colorName: "Raw Gold", hexCode: "#c69255" },
    ],
    sizes: [
      { id: "s1", sizeName: "S" },
      { id: "s2", sizeName: "M" },
      { id: "s3", sizeName: "L" },
      { id: "s4", sizeName: "XL" },
    ],
  },
  {
    id: "p2",
    title: "Double-Breasted Raw Wool Blazer",
    slug: "double-breasted-raw-wool-blazer",
    description: "Impeccably tailored double-breasted blazer cut from heavy English raw wool. Styled with peak lapels, horn buttons, and a structured padded silhouette.",
    details: "Materials: 100% Virgin Wool. Full canvassed construction.",
    price: 112000,
    gender: "Men",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isPublished: true,
    categoryId: "cat2",
    images: [
      { id: "img3", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000", isPrimary: true, sortOrder: 0 },
    ],
    colors: [{ id: "c3", colorName: "Midnight Espresso", hexCode: "#140e0c" }],
    sizes: [{ id: "s5", sizeName: "48 EU" }],
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const product = SAMPLE_PRODUCTS.find((p) => p.slug === slug) || SAMPLE_PRODUCTS[0];

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleAddToCart = (p: Product, size?: string, color?: string) => {
    setCartItems((prev) => [
      ...prev,
      {
        id: `cart-${Date.now()}`,
        productId: p.id,
        product: p,
        size: size || "M",
        color: color || "Espresso",
        quantity: 1,
      },
    ]);
    setIsCartOpen(true);
  };

  const handleRazorpayCheckout = (p: Product, size?: string, color?: string) => {
    handleAddToCart(p, size, color);
  };

  return (
    <div className="min-h-screen flex flex-col bg-raw-bg text-raw-ivory">
      <Header
        cartItemCount={cartItems.length}
        wishlistItemCount={wishlistItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className="flex-1">
        <ProductDetail
          product={product}
          onAddToCart={handleAddToCart}
          onRazorpayCheckout={handleRazorpayCheckout}
          onAddToWishlist={(p) => setWishlistItems([...wishlistItems, p])}
        />
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={() => {}}
        onRemoveItem={(id) => setCartItems(cartItems.filter((i) => i.id !== id))}
        onProceedToRazorpay={() => toast.success("Razorpay Order Initiated")}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistItems}
        onRemoveFromWishlist={(id) => setWishlistItems(wishlistItems.filter((p) => p.id !== id))}
        onAddToCart={handleAddToCart}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
