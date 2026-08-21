"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductDetail } from "@/components/product/ProductDetail";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WishlistDrawer } from "@/components/cart/WishlistDrawer";
import { AuthModal } from "@/components/auth/AuthModal";
import { Product, CartItem } from "@/types";
import { toast } from "sonner";
import { useCart } from "@/lib/CartContext";

/**
 * ============================================================================
 * THE RAW HOUSE - Individual Product Detail Page (PDP) Dynamic Route
 * ============================================================================
 */

// Products are fetched from the database via /api/products

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [delivery, setDelivery] = useState<any>(null);
  const [sizeGuide, setSizeGuide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { cartItems, addToCart, updateQuantity, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleRazorpayCheckout = (p: Product, size?: string, color?: string) => {
    addToCart(p, size, color);
    // User can just checkout from the drawer now that we have a global flow.
  };

  useEffect(() => {
    setIsLoading(true);
    // Fetch product list
    fetch("/api/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          const found = json.data.find((p: Product) => p.slug === slug);
          setProduct(found || null);
          
          if (found) {
            // Fetch rich details
            fetch(`/api/products/${slug}/details`)
              .then(res => res.json())
              .then(detailJson => {
                if (detailJson.success) {
                  setProductDetails(detailJson.data.productDetails);
                  setDelivery(detailJson.data.delivery);
                  setSizeGuide(detailJson.data.sizeGuide);
                }
              })
              .catch(err => console.error("Failed to fetch product details:", err));
          }
        }
      })
      .catch((err) => console.error("Failed to fetch product:", err))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return <div className="min-h-screen bg-raw-bg flex items-center justify-center text-raw-gold tracking-[0.2em]">LOADING...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-raw-bg flex items-center justify-center text-raw-gold tracking-[0.2em]">PRODUCT NOT FOUND</div>;
  }

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
        <ProductDetail
          product={product}
          details={productDetails}
          delivery={delivery}
          sizeGuide={sizeGuide}
          onAddToCart={addToCart}
          onRazorpayCheckout={handleRazorpayCheckout}
          onAddToWishlist={(p) => setWishlistItems([...wishlistItems, p])}
          onOpenAuth={() => setIsAuthOpen(true)}
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
