"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";
import { useSession } from "next-auth/react";

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initial Load & DB Sync
  useEffect(() => {
    if (status === "loading") return;

    const loadLocal = () => {
      try {
        const stored = localStorage.getItem("rawhouse_wishlist");
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to load local wishlist", e);
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
            const productIds = localItems.map((p: Product) => p.id);
            await fetch("/api/user/wishlist/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productIds }),
            });
            // Clear local storage after sync
            localStorage.removeItem("rawhouse_wishlist");
          }

          // Fetch final merged list from DB
          const res = await fetch("/api/user/wishlist");
          const json = await res.json();
          if (json.success && json.data.items) {
            setWishlistItems(json.data.items.map((item: any) => item.product));
          }
        } catch (e) {
          console.error("Failed to sync wishlist", e);
        } finally {
          setIsInitialized(true);
        }
      };
      syncAndFetch();
    } else {
      // Guest: just load local
      setWishlistItems(loadLocal());
      setIsInitialized(true);
    }
  }, [status]);

  // Save to localStorage ONLY if guest
  useEffect(() => {
    if (isInitialized && status === "unauthenticated") {
      localStorage.setItem("rawhouse_wishlist", JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isInitialized, status]);

  const addToWishlist = async (product: Product) => {
    setWishlistItems((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
    
    if (status === "authenticated") {
      try {
        await fetch("/api/user/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
      } catch (e) {
        console.error("Failed to add to DB wishlist", e);
      }
    }
    setIsWishlistOpen(true);
  };

  const removeFromWishlist = async (productId: string) => {
    setWishlistItems((prev) => prev.filter((p) => p.id !== productId));
    
    if (status === "authenticated") {
      try {
        await fetch(`/api/user/wishlist?productId=${productId}`, {
          method: "DELETE",
        });
      } catch (e) {
        console.error("Failed to remove from DB wishlist", e);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
