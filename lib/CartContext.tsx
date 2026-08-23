"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "@/types";
import { useSession } from "next-auth/react";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size?: string, color?: string) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initial Load & DB Sync
  useEffect(() => {
    if (status === "loading") return;

    const loadLocal = () => {
      try {
        const stored = localStorage.getItem("rawhouse_cart");
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to load local cart", e);
      }
      return [];
    };

    if (status === "authenticated") {
      // User logged in: fetch from DB, then sync local items if any
      const syncAndFetch = async () => {
        try {
          const localItems = loadLocal();
          
          if (localItems.length > 0) {
            // Push local items to DB
            const items = localItems.map((item: CartItem) => ({
              productId: item.productId,
              size: item.size,
              color: item.color,
              quantity: item.quantity
            }));
            await fetch("/api/user/cart/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items }),
            });
            // Clear local storage after sync
            localStorage.removeItem("rawhouse_cart");
          }

          // Fetch final merged list from DB
          const res = await fetch("/api/user/cart");
          const json = await res.json();
          if (json.success && json.data.items) {
            // Map DB items to match our CartItem interface locally
            const dbItems: CartItem[] = json.data.items.map((dbItem: any) => ({
              id: dbItem.id, // we use DB id now
              productId: dbItem.productId,
              product: dbItem.product,
              size: dbItem.size,
              color: dbItem.color,
              quantity: dbItem.quantity
            }));
            setCartItems(dbItems);
          }
        } catch (e) {
          console.error("Failed to sync cart", e);
        } finally {
          setIsInitialized(true);
        }
      };
      syncAndFetch();
    } else {
      // Guest: just load local
      setCartItems(loadLocal());
      setIsInitialized(true);
    }
  }, [status]);

  // Save to localStorage ONLY if guest
  useEffect(() => {
    if (isInitialized && status === "unauthenticated") {
      localStorage.setItem("rawhouse_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized, status]);

  const addToCart = async (product: Product, size?: string, color?: string) => {
    const defaultSize = size || product.sizes?.[0]?.sizeName || "M";
    const defaultColor = color || product.colors?.[0]?.colorName || "Espresso";
    
    // Optimistic local update for fast UI response
    let temporaryId = `cart-${Date.now()}`;
    
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === defaultSize && item.color === defaultColor
      );
      if (existing) {
        temporaryId = existing.id; // Keep existing id if it's an update
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: temporaryId,
          productId: product.id,
          product,
          size: defaultSize,
          color: defaultColor,
          quantity: 1,
        },
      ];
    });
    
    setIsCartOpen(true);

    if (status === "authenticated") {
      try {
        const res = await fetch("/api/user/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            productId: product.id,
            size: defaultSize,
            color: defaultColor,
            quantity: 1
          }),
        });
        const json = await res.json();
        if (json.success) {
          // Replace temporary id with real DB id, or update the db quantity
          setCartItems((prev) => 
            prev.map(item => item.id === temporaryId ? { ...item, id: json.data.id } : item)
          );
        }
      } catch (e) {
        console.error("Failed to add to DB cart", e);
      }
    }
  };

  const updateQuantity = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );

    if (status === "authenticated" && !itemId.startsWith('cart-')) {
      try {
        await fetch("/api/user/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId, quantity: newQty }),
        });
      } catch (e) {
        console.error("Failed to update DB cart item", e);
      }
    }
  };

  const removeFromCart = async (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    
    if (status === "authenticated" && !itemId.startsWith('cart-')) {
      try {
        await fetch(`/api/user/cart?itemId=${itemId}`, {
          method: "DELETE",
        });
      } catch (e) {
        console.error("Failed to remove from DB cart", e);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (status === "authenticated") {
      try {
        await fetch(`/api/user/cart`, { method: "DELETE" });
      } catch (e) {
        console.error("Failed to clear DB cart", e);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
