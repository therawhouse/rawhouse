"use client";

import React, { useState } from "react";
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

// Initial Sample Gucci-Level Runway Products
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
    details: "Materials: 100% Virgin Wool. Full canvassed construction. Professional dry clean.",
    price: 112000,
    gender: "Men",
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isPublished: true,
    categoryId: "cat2",
    images: [
      { id: "img3", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000", isPrimary: true, sortOrder: 0 },
      { id: "img4", url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000", isPrimary: false, sortOrder: 1 },
    ],
    colors: [
      { id: "c3", colorName: "Midnight Espresso", hexCode: "#140e0c" },
      { id: "c4", colorName: "Warm Charcoal", hexCode: "#241b18" },
    ],
    sizes: [
      { id: "s5", sizeName: "48 EU" },
      { id: "s6", sizeName: "50 EU" },
      { id: "s7", sizeName: "52 EU" },
    ],
  },
  {
    id: "p3",
    title: "Monogram Raw Leather Weekender Tote",
    slug: "monogram-raw-leather-weekender-tote",
    description: "Generously sized travel holdall hand-carved in full-grain Italian leather. Features double handles, detachable shoulder strap, and internal zippered compartments.",
    details: "Dimensions: 50cm x 30cm x 22cm. Handcrafted leather. Suede lining.",
    price: 135000,
    gender: "Unisex",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isPublished: true,
    categoryId: "cat3",
    images: [
      { id: "img5", url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000", isPrimary: true, sortOrder: 0 },
      { id: "img6", url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000", isPrimary: false, sortOrder: 1 },
    ],
    colors: [
      { id: "c5", colorName: "Cognac Gold", hexCode: "#c69255" },
    ],
    sizes: [
      { id: "s8", sizeName: "One Size" },
    ],
  },
  {
    id: "p4",
    title: "Hand-Burnished Leather Horsebit Loafers",
    slug: "hand-burnished-leather-horsebit-loafers",
    description: "Timeless luxury loafers finished with hand-burnished patination and polished custom bronze horsebit hardware. Goodyear welted leather sole.",
    details: "Upper: 100% Calfskin. Sole: Genuine Leather. Made in Italy.",
    price: 68000,
    gender: "Men",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isPublished: true,
    categoryId: "cat4",
    images: [
      { id: "img7", url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000", isPrimary: true, sortOrder: 0 },
    ],
    colors: [
      { id: "c6", colorName: "Antique Bronze", hexCode: "#b07b41" },
    ],
    sizes: [
      { id: "s9", sizeName: "EU 40" },
      { id: "s10", sizeName: "EU 41" },
      { id: "s11", sizeName: "EU 42" },
      { id: "s12", sizeName: "EU 43" },
    ],
  },
];

export default function HomePage() {
  const { cartItems, addToCart, updateQuantity, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

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
        products={SAMPLE_PRODUCTS}
        onAddToCart={handleAddToCart}
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
        onAddToCart={handleAddToCart}
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
                  handleAddToCart(quickViewProduct);
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
