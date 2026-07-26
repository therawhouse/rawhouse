"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistDrawer } from "@/components/cart/WishlistDrawer";
import { AuthModal } from "@/components/auth/AuthModal";
import { Product, CartItem } from "@/types";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

/**
 * ============================================================================
 * THE RAW HOUSE - Product Catalog Route (PLP)
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
    category: { id: "cat1", name: "Outerwear & Coats", slug: "outerwear" },
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
    category: { id: "cat2", name: "Tailored Suits & Blazers", slug: "tailored-suits" },
    images: [
      { id: "img3", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000", isPrimary: true, sortOrder: 0 },
    ],
    colors: [
      { id: "c3", colorName: "Midnight Espresso", hexCode: "#140e0c" },
    ],
    sizes: [
      { id: "s5", sizeName: "48 EU" },
      { id: "s6", sizeName: "50 EU" },
    ],
  },
  {
    id: "p3",
    title: "Monogram Raw Leather Weekender Tote",
    slug: "monogram-raw-leather-weekender-tote",
    description: "Generously sized travel holdall hand-carved in full-grain Italian leather.",
    details: "Dimensions: 50cm x 30cm x 22cm.",
    price: 135000,
    gender: "Unisex",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isPublished: true,
    categoryId: "cat3",
    category: { id: "cat3", name: "Leather Goods", slug: "leather-goods" },
    images: [
      { id: "img5", url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000", isPrimary: true, sortOrder: 0 },
    ],
    colors: [
      { id: "c5", colorName: "Cognac Gold", hexCode: "#c69255" },
    ],
    sizes: [{ id: "s8", sizeName: "One Size" }],
  },
  {
    id: "p4",
    title: "Hand-Burnished Leather Horsebit Loafers",
    slug: "hand-burnished-leather-horsebit-loafers",
    description: "Timeless luxury loafers finished with hand-burnished patination.",
    details: "Upper: 100% Calfskin. Made in Italy.",
    price: 68000,
    gender: "Men",
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isPublished: true,
    categoryId: "cat4",
    category: { id: "cat4", name: "Luxury Footwear", slug: "footwear" },
    images: [
      { id: "img7", url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000", isPrimary: true, sortOrder: 0 },
    ],
    colors: [{ id: "c6", colorName: "Antique Bronze", hexCode: "#b07b41" }],
    sizes: [{ id: "s9", sizeName: "EU 42" }],
  },
];

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialQuery = searchParams.get("query") || "";

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => [
      ...prev,
      {
        id: `cart-${Date.now()}`,
        productId: product.id,
        product,
        quantity: 1,
      },
    ]);
    setIsCartOpen(true);
  };

  const handleAddToWishlist = (product: Product) => {
    setWishlistItems((prev) => [...prev, product]);
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
        <ProductCatalog
          products={SAMPLE_PRODUCTS}
          initialCategory={initialCategory}
          initialQuery={initialQuery}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onQuickView={() => {}}
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
