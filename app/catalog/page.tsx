"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistDrawer } from "@/components/cart/WishlistDrawer";
import { AuthModal } from "@/components/auth/AuthModal";
import { Product, CartItem } from "@/types";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/CartContext";

/**
 * ============================================================================
 * THE RAW HOUSE - Product Catalog Route (PLP)
 * ============================================================================
 */

// Products will be fetched from the database via /api/products

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialQuery = searchParams.get("query") || "";

  const { cartItems, addToCart, updateQuantity, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

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

  const handleAddToWishlist = (product: Product) => {
    setWishlistItems((prev) => [...prev, product]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-raw-bg text-raw-ivory">
      <Header
        cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistItemCount={wishlistItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className="flex-1">
        <ProductCatalog
          products={products}
          initialCategory={initialCategory}
          initialQuery={initialQuery}
          onAddToCart={addToCart}
          onAddToWishlist={handleAddToWishlist}
          onQuickView={() => {}}
        />
      </main>

      <Footer />

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
        onRemoveFromWishlist={(id) => setWishlistItems(wishlistItems.filter((p) => p.id !== id))}
        onAddToCart={addToCart}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-raw-bg flex items-center justify-center text-raw-gold tracking-[0.2em]">LOADING CATALOG...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
