"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingBag, CreditCard, Shield, Truck, RotateCcw, ChevronDown, Check } from "lucide-react";
import { Product } from "@/types";
import { toast } from "sonner";
import { SizeGuideModal } from "./SizeGuideModal";
import { ProductReviews } from "./ProductReviews";

/**
 * ============================================================================
 * THE RAW HOUSE - Gucci-Inspired Product Detail Page (PDP)
 * ============================================================================
 */

interface ProductDetailProps {
  product: Product;
  details?: any;
  delivery?: any;
  sizeGuide?: any;
  onAddToCart: (product: Product, selectedSize?: string, selectedColor?: string) => void;
  onRazorpayCheckout: (product: Product, selectedSize?: string, selectedColor?: string) => void;
  onAddToWishlist: (product: Product) => void;
  onOpenAuth?: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  details,
  delivery,
  sizeGuide,
  onAddToCart,
  onRazorpayCheckout,
  onAddToWishlist,
  onOpenAuth,
}) => {
  const images = product.images?.length > 0 ? product.images : [
    { id: "1", url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200", isPrimary: true, sortOrder: 0 },
    { id: "2", url: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200", isPrimary: false, sortOrder: 1 },
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]?.url);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0]?.sizeName || "M");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0]?.colorName || "Espresso Brown");
  const [activeAccordion, setActiveAccordion] = useState<string | null>("details");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const handleBagAdd = () => {
    onAddToCart(product, selectedSize, selectedColor);
    toast.success("Added to Shopping Bag", {
      description: `${product.title} (${selectedSize} / ${selectedColor})`,
    });
  };

  const handleDirectBuy = () => {
    onRazorpayCheckout(product, selectedSize, selectedColor);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      {/* Breadcrumb */}
      <div className="text-xs uppercase tracking-[0.2em] text-raw-muted mb-8 space-x-2">
        <span>The Raw House</span>
        <span>/</span>
        <span>{product.gender}</span>
        <span>/</span>
        <span className="text-raw-gold">{product.title}</span>
      </div>

      {/* Main PDP Grid: Left Sticky Media Gallery | Right Scrollable Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Multi-Angle Gallery (7 cols) */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 sticky top-28">
          {/* Vertical Thumbnails */}
          <div className="flex md:flex-col space-x-3 md:space-x-0 md:space-y-3 order-2 md:order-1 overflow-x-auto">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img.url)}
                className={`relative w-20 h-24 flex-shrink-0 border transition-all ${
                  selectedImage === img.url ? "border-raw-gold ring-1 ring-raw-gold" : "border-raw-border/60 hover:border-raw-muted"
                }`}
              >
                <Image src={img.url} alt={product.title} fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* Main Large Display Image */}
          <div className="relative w-full aspect-[3/4] bg-raw-card overflow-hidden border border-raw-border/50 order-1 md:order-2 img-zoom-container">
            <Image
              src={selectedImage || images[0]?.url}
              alt={product.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-raw-bg/80 backdrop-blur-md px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-raw-gold border border-raw-gold/30">
              Gucci Inspired Atelier Piece
            </div>
          </div>
        </div>

        {/* Right Column: Order & Purchase Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Header Title & Pricing */}
          <div className="space-y-3 border-b border-raw-border pb-6">
            <span className="text-xs uppercase tracking-[0.3em] text-raw-gold font-bold">
              {product.gender} Atelier Collection
            </span>
            <h1 className="text-2xl md:text-4xl font-serif-luxury text-raw-ivory tracking-[0.1em]">
              {product.title}
            </h1>

            <div className="flex items-baseline space-x-4 pt-2">
              <span className="text-2xl font-medium text-raw-ivory tracking-widest">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-raw-muted tracking-wide">
                (Inclusive of all luxury taxes & duties)
              </span>
            </div>
          </div>

          {/* Description Story */}
          <p className="text-xs text-raw-muted leading-relaxed tracking-wide">
            {product.description}
          </p>

          {/* Color Swatch Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.2em] text-raw-ivory font-medium block">
                Color: <span className="text-raw-gold">{selectedColor}</span>
              </label>
              <div className="flex space-x-3">
                {product.colors.map((c) => (
                  <button
                    key={c.colorName}
                    onClick={() => setSelectedColor(c.colorName)}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor === c.colorName ? "border-raw-gold scale-110" : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hexCode }}
                    title={c.colorName}
                  >
                    {selectedColor === c.colorName && (
                      <Check className="w-4 h-4 text-raw-ivory drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection Grid */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs uppercase tracking-[0.2em]">
                <span className="text-raw-ivory font-medium">Select Size</span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-raw-gold underline hover:text-raw-goldHover text-[11px]"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.sizeName}
                    onClick={() => setSelectedSize(s.sizeName)}
                    className={`py-3 text-xs tracking-widest border transition-all ${
                      selectedSize === s.sizeName
                        ? "border-raw-gold bg-raw-gold/10 text-raw-gold font-bold"
                        : "border-raw-border text-raw-ivory hover:border-raw-gold/50"
                    }`}
                  >
                    {s.sizeName}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-raw-gold flex items-center space-x-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-raw-gold animate-pulse" />
                <span>Limited Atelier Stock: Only 3 pieces available in size {selectedSize}</span>
              </p>
            </div>
          )}

          {/* Action Buttons: Razorpay Direct Checkout + Shopping Bag */}
          <div className="space-y-3 pt-4">
            <button
              onClick={handleDirectBuy}
              className="w-full bg-raw-gold hover:bg-raw-goldHover text-raw-bg py-4 px-6 text-xs font-bold uppercase tracking-[0.25em] flex items-center justify-center space-x-3 transition-all duration-300 shadow-xl"
            >
              <CreditCard className="w-4 h-4" />
              <span>INSTANT RAZORPAY CHECKOUT</span>
            </button>

            <div className="flex space-x-3">
              <button
                onClick={handleBagAdd}
                className="flex-1 border border-raw-ivory hover:border-raw-gold text-raw-ivory hover:text-raw-gold py-4 px-6 text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO BAG</span>
              </button>

              <button
                onClick={() => onAddToWishlist(product)}
                className="p-4 border border-raw-border hover:border-raw-gold text-raw-ivory hover:text-raw-gold transition-colors"
                title="Save to Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Value Highlights */}
          <div className="border-t border-b border-raw-border/60 py-4 grid grid-cols-2 gap-4 text-[11px] text-raw-muted">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-raw-gold" />
              <span>Complimentary Express Air Shipping</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-raw-gold" />
              <span>14-Day Atelier Returns & Exchanges</span>
            </div>
          </div>

          {/* The new ProductInfoAccordion is rendered below this component in page.tsx */}

        </div>
      </div>

      <ProductReviews productId={product.id} onOpenAuth={onOpenAuth} />

      {sizeGuide && (
        <SizeGuideModal guide={sizeGuide} isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
      )}
    </div>
  );
};
