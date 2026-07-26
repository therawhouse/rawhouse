"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { FilterDrawer } from "./FilterDrawer";
import { SlidersHorizontal, Grid2X2, Grid3X3, ArrowUpDown, X } from "lucide-react";

/**
 * ============================================================================
 * THE RAW HOUSE - Gucci Product Listing Page (PLP)
 * ============================================================================
 */

interface ProductCatalogProps {
  products: Product[];
  initialCategory?: string;
  initialQuery?: string;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  initialCategory = "All",
  initialQuery = "",
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedGender, setSelectedGender] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "bestseller">("newest");
  const [gridColumns, setGridColumns] = useState<2 | 4>(4);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== "All" && p.category?.slug !== selectedCategory) return false;
        if (selectedGender !== "All" && p.gender !== selectedGender) return false;
        if (p.price > priceRange[1]) return false;
        if (selectedSize !== "All" && !p.sizes?.some((s) => s.sizeName === selectedSize)) return false;
        if (selectedColor !== "All" && !p.colors?.some((c) => c.colorName === selectedColor)) return false;
        if (
          initialQuery &&
          !p.title.toLowerCase().includes(initialQuery.toLowerCase()) &&
          !p.description.toLowerCase().includes(initialQuery.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "bestseller") return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      });
  }, [products, selectedCategory, selectedGender, priceRange, selectedSize, selectedColor, sortBy, initialQuery]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedGender("All");
    setPriceRange([0, 200000]);
    setSelectedSize("All");
    setSelectedColor("All");
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      {/* Header Banner */}
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs uppercase tracking-[0.35em] text-raw-gold font-semibold">
          ATELIER COLLECTIONS
        </span>
        <h1 className="text-3xl md:text-5xl font-serif-luxury text-raw-ivory tracking-[0.15em] uppercase">
          {selectedCategory !== "All" ? selectedCategory.replace("-", " ") : "Complete Runway Catalog"}
        </h1>
        <p className="text-xs text-raw-muted tracking-widest max-w-lg mx-auto">
          Explore handcrafted raw silk garments, tailored English wool suits, and hand-burnished leather accessories.
        </p>
      </div>

      {/* Gucci Filter & Controls Bar */}
      <div className="sticky top-20 z-30 glass-header border border-raw-border p-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        
        {/* Left Filter Trigger */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center space-x-2 bg-raw-charcoal hover:bg-raw-border text-raw-ivory border border-raw-border px-5 py-2.5 uppercase tracking-widest font-semibold transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-raw-gold" />
            <span>Refine & Filter</span>
          </button>

          <span className="text-raw-muted tracking-wider hidden sm:inline">
            Showing <strong className="text-raw-ivory">{filteredProducts.length}</strong> items
          </span>
        </div>

        {/* Right Sort & View Controls */}
        <div className="flex items-center space-x-4">
          {/* Sort Selector */}
          <div className="flex items-center space-x-2 border border-raw-border px-3 py-2 bg-raw-bg">
            <ArrowUpDown className="w-3.5 h-3.5 text-raw-gold" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-raw-ivory text-xs uppercase tracking-wider outline-none cursor-pointer"
            >
              <option value="newest" className="bg-raw-bg text-raw-ivory">Sort: Newest Arrivals</option>
              <option value="bestseller" className="bg-raw-bg text-raw-ivory">Sort: Best Sellers</option>
              <option value="price-asc" className="bg-raw-bg text-raw-ivory">Sort: Price Low to High</option>
              <option value="price-desc" className="bg-raw-bg text-raw-ivory">Sort: Price High to Low</option>
            </select>
          </div>

          {/* Grid Switcher */}
          <div className="hidden lg:flex border border-raw-border">
            <button
              onClick={() => setGridColumns(2)}
              className={`p-2 transition-colors ${gridColumns === 2 ? "bg-raw-gold text-raw-bg" : "text-raw-muted hover:text-raw-ivory"}`}
              title="2 Columns"
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridColumns(4)}
              className={`p-2 transition-colors ${gridColumns === 4 ? "bg-raw-gold text-raw-bg" : "text-raw-muted hover:text-raw-ivory"}`}
              title="4 Columns"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Active Filter Badges */}
      {(selectedCategory !== "All" || selectedGender !== "All" || selectedSize !== "All" || selectedColor !== "All") && (
        <div className="flex flex-wrap items-center gap-2 mb-8 text-xs">
          <span className="text-raw-muted uppercase tracking-widest text-[10px]">Active Filters:</span>
          {selectedCategory !== "All" && (
            <span className="bg-raw-gold/20 border border-raw-gold/40 text-raw-gold px-3 py-1 flex items-center space-x-1 uppercase tracking-wider">
              <span>Category: {selectedCategory}</span>
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("All")} />
            </span>
          )}
          {selectedGender !== "All" && (
            <span className="bg-raw-gold/20 border border-raw-gold/40 text-raw-gold px-3 py-1 flex items-center space-x-1 uppercase tracking-wider">
              <span>Gender: {selectedGender}</span>
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedGender("All")} />
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-raw-muted hover:text-raw-gold underline text-[11px] tracking-wider ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 space-y-4 glass-card border border-raw-border">
          <p className="text-sm uppercase tracking-[0.2em] text-raw-muted">
            No atelier items match your selected criteria
          </p>
          <button
            onClick={handleResetFilters}
            className="bg-raw-gold text-raw-bg font-bold text-xs uppercase tracking-[0.2em] px-6 py-3"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-8 ${
            gridColumns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}

      {/* Filter Drawer Component */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};
