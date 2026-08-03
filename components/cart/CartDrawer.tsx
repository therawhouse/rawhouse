"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Trash2, Plus, Minus, CreditCard, ShoppingBag, Tag } from "lucide-react";
import { CartItem } from "@/types";
import { toast } from "sonner";

/**
 * ============================================================================
 * THE RAW HOUSE - Gucci-Inspired Shopping Bag Side Drawer
 * ============================================================================
 */

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (acc, item) => acc + (item.product.salePrice || item.product.price) * item.quantity,
    0
  );

  const freeShippingThreshold = 50000;
  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "RAWHOUSE10") {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setAppliedCoupon("RAWHOUSE10 (10% OFF)");
      toast.success("Coupon RAWHOUSE10 applied successfully!", {
        description: `Saved ₹${discount.toLocaleString("en-IN")}`,
      });
    } else {
      toast.error("Invalid Promo Code", { description: "Try code RAWHOUSE10 for 10% off" });
    }
  };

  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Dark Overlay Backdrop */}
      <div
        className="absolute inset-0 bg-raw-bg/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-raw-card border-l border-raw-border flex flex-col justify-between shadow-2xl text-raw-ivory">
          
          {/* Header */}
          <div className="p-6 border-b border-raw-border flex justify-between items-center bg-raw-bg">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-raw-gold" />
              <h2 className="text-sm font-serif-luxury uppercase tracking-[0.25em] text-raw-ivory">
                Shopping Bag ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-raw-ivory hover:text-raw-gold transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-[#100b09] px-6 py-3 border-b border-raw-border/60 text-[11px] text-raw-muted">
            {subtotal >= freeShippingThreshold ? (
              <span className="text-raw-gold font-semibold tracking-wider">
                ✨ You have unlocked Complimentary Express Air Shipping!
              </span>
            ) : (
              <span>
                Add ₹{(freeShippingThreshold - subtotal).toLocaleString("en-IN")} more for Complimentary Shipping
              </span>
            )}
            <div className="w-full h-1 bg-raw-border rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-raw-gold transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-raw-muted/40 mx-auto" />
                <p className="text-xs uppercase tracking-[0.2em] text-raw-muted">
                  Your shopping bag is currently empty
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-4 border-b border-raw-border/40 pb-6 relative group"
                >
                  <div className="relative w-20 h-24 bg-raw-bg overflow-hidden flex-shrink-0 border border-raw-border">
                    <Image
                      src={item.product.images[0]?.url || "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400"}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-serif-luxury tracking-wide text-raw-ivory line-clamp-1 pr-2">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-raw-muted hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[10px] text-raw-gold tracking-widest mt-1 space-x-2">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>• Color: {item.color}</span>}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      {/* Qty Controls */}
                      <div className="flex items-center space-x-2 border border-raw-border px-2 py-1">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="text-raw-muted hover:text-raw-ivory"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-raw-ivory px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="text-raw-muted hover:text-raw-ivory"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-raw-ivory tracking-widest">
                        ₹
                        {(
                          (item.product.salePrice || item.product.price) * item.quantity
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Razorpay Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-raw-border bg-raw-bg space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-2.5 text-raw-muted" />
                  <input
                    type="text"
                    placeholder="PROMO CODE (RAWHOUSE10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-raw-charcoal border border-raw-border focus:border-raw-gold text-xs text-raw-ivory pl-9 pr-3 py-2 outline-none uppercase tracking-wider placeholder-raw-muted"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-raw-border hover:bg-raw-gold hover:text-raw-bg text-raw-ivory text-xs px-4 font-bold uppercase tracking-wider transition-colors"
                >
                  APPLY
                </button>
              </form>

              {appliedCoupon && (
                <div className="text-[11px] text-raw-gold flex justify-between tracking-wide">
                  <span>Applied Promo:</span>
                  <span>{appliedCoupon}</span>
                </div>
              )}

              <div className="space-y-1 text-xs tracking-widest pt-2">
                <div className="flex justify-between text-raw-muted">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-raw-gold">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-raw-ivory pt-2 border-t border-raw-border/50">
                  <span>ESTIMATED TOTAL</span>
                  <span className="text-raw-gold">₹{finalTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  window.location.href = "/checkout";
                }}
                className="w-full bg-raw-gold hover:bg-raw-goldHover text-raw-bg py-4 px-6 text-xs font-bold uppercase tracking-[0.25em] flex items-center justify-center space-x-3 transition-all shadow-xl"
              >
                <span>Check out</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
