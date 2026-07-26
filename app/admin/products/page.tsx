"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit3, Image as ImageIcon, CheckCircle, Search } from "lucide-react";
import { toast } from "sonner";

/**
 * ============================================================================
 * THE RAW HOUSE - Admin Product Management & Variant Creator
 * ============================================================================
 */

export default function AdminProductsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("outerwear");
  const [gender, setGender] = useState("Unisex");

  const [productsList, setProductsList] = useState([
    { id: "1", title: "Raw Silk Embroidered Bomber Jacket", price: 84500, category: "outerwear", gender: "Unisex", isFeatured: true, stock: 25 },
    { id: "2", title: "Double-Breasted Raw Wool Blazer", price: 112000, category: "tailored-suits", gender: "Men", isFeatured: true, stock: 12 },
    { id: "3", title: "Monogram Raw Leather Weekender Tote", price: 135000, category: "leather-goods", gender: "Unisex", isFeatured: true, stock: 18 },
    { id: "4", title: "Hand-Burnished Leather Horsebit Loafers", price: 68000, category: "footwear", gender: "Men", isFeatured: false, stock: 8 },
  ]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;
    const newProduct = {
      id: Date.now().toString(),
      title,
      price: Number(price),
      category,
      gender,
      isFeatured: true,
      stock: 15,
    };
    setProductsList([newProduct, ...productsList]);
    toast.success("Product Created Successfully", {
      description: `${title} has been added to atelier database.`,
    });
    setIsAddModalOpen(false);
    setTitle("");
    setPrice("");
  };

  const handleDelete = (id: string) => {
    setProductsList(productsList.filter((p) => p.id !== id));
    toast.success("Product Removed");
  };

  return (
    <div className="space-y-8 text-raw-ivory">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-raw-border pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-raw-gold font-bold">
            CATALOG CONTROL
          </span>
          <h1 className="text-2xl md:text-3xl font-serif-luxury text-raw-ivory tracking-[0.1em] uppercase">
            Atelier Product Catalog
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-raw-gold hover:bg-raw-goldHover text-raw-bg px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] flex items-center space-x-2 transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW PRODUCT</span>
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-raw-card border border-raw-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs tracking-wider">
            <thead>
              <tr className="bg-raw-bg border-b border-raw-border text-raw-muted uppercase text-[10px]">
                <th className="p-4">Product Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Price (INR)</th>
                <th className="p-4">Inventory</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-raw-border/40">
              {productsList.map((p) => (
                <tr key={p.id} className="hover:bg-raw-charcoal/40 transition-colors">
                  <td className="p-4 font-serif-luxury text-sm font-semibold text-raw-ivory">
                    {p.title}
                  </td>
                  <td className="p-4 capitalize text-raw-gold">{p.category.replace("-", " ")}</td>
                  <td className="p-4 text-raw-muted">{p.gender}</td>
                  <td className="p-4 font-bold text-raw-ivory">₹{p.price.toLocaleString("en-IN")}</td>
                  <td className="p-4 font-mono font-bold text-raw-gold">{p.stock} units</td>
                  <td className="p-4">
                    <span className="bg-raw-gold/20 border border-raw-gold/40 text-raw-gold text-[9px] px-2 py-0.5 uppercase tracking-widest font-bold">
                      Published
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button className="text-raw-muted hover:text-raw-gold">
                      <Edit3 className="w-4 h-4 inline" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-raw-muted hover:text-red-400">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-raw-bg/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-raw-card border border-raw-border w-full max-w-lg p-8 space-y-6 shadow-2xl z-10">
            <h3 className="text-lg font-serif-luxury uppercase tracking-[0.2em] text-raw-gold border-b border-raw-border pb-3">
              Add Atelier Product
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-raw-muted uppercase tracking-wider mb-1">Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. Raw Velvet Trench Coat"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-raw-bg border border-raw-border text-raw-ivory px-4 py-2.5 outline-none focus:border-raw-gold"
                />
              </div>

              <div>
                <label className="block text-raw-muted uppercase tracking-wider mb-1">Price in INR (₹)</label>
                <input
                  type="number"
                  placeholder="95000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full bg-raw-bg border border-raw-border text-raw-ivory px-4 py-2.5 outline-none focus:border-raw-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-raw-muted uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-raw-bg border border-raw-border text-raw-ivory px-4 py-2.5 outline-none focus:border-raw-gold capitalize"
                  >
                    <option value="outerwear">Outerwear</option>
                    <option value="tailored-suits">Tailored Suits</option>
                    <option value="leather-goods">Leather Goods</option>
                    <option value="footwear">Footwear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-raw-muted uppercase tracking-wider mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-raw-bg border border-raw-border text-raw-ivory px-4 py-2.5 outline-none focus:border-raw-gold"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 border border-raw-border text-raw-muted py-3 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-raw-gold text-raw-bg font-bold py-3 uppercase tracking-wider"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
