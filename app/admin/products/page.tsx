"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreVertical, Trash2, Edit3, Image as ImageIcon, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categorySlug, setCategorySlug] = useState("outerwear");
  const [gender, setGender] = useState("Unisex");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success) {
        setProductsList(json.data);
      }
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;
    setIsSubmitting(true);

    try {
      let imageUrl = null;

      // 1. Upload Image to Supabase
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", "products");

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        
        if (!uploadData.success) {
          throw new Error(uploadData.error || "Image upload failed");
        }
        imageUrl = uploadData.data.url;
      }

      // 2. Create Product
      const productPayload = {
        title,
        description,
        price: Number(price),
        categorySlug,
        gender,
        images: imageUrl ? [imageUrl] : [],
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || "Failed to create product");
      }

      toast.success("Product Created Successfully");
      setIsAddModalOpen(false);
      
      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setFile(null);
      
      // Refresh list
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      
      toast.success("Product Removed");
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
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
                <th className="p-4">Image</th>
                <th className="p-4">Product Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Price (INR)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-raw-border/40">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-raw-muted">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading catalog...
                  </td>
                </tr>
              ) : productsList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-raw-muted">
                    No products found in the database.
                  </td>
                </tr>
              ) : (
                productsList.map((p) => (
                  <tr key={p.id} className="hover:bg-raw-charcoal/40 transition-colors">
                    <td className="p-4">
                      {p.images && p.images.length > 0 ? (
                        <img src={p.images[0].url} alt={p.title} className="w-10 h-10 object-cover rounded-sm border border-raw-border" />
                      ) : (
                        <div className="w-10 h-10 bg-raw-bg border border-raw-border flex items-center justify-center rounded-sm">
                          <ImageIcon className="w-4 h-4 text-raw-muted" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-serif-luxury text-sm font-semibold text-raw-ivory">
                      {p.title}
                    </td>
                    <td className="p-4 capitalize text-raw-gold">{p.category?.name || p.categoryId}</td>
                    <td className="p-4 text-raw-muted">{p.gender}</td>
                    <td className="p-4 font-bold text-raw-ivory">₹{p.price.toLocaleString("en-IN")}</td>
                    <td className="p-4">
                      <span className="bg-raw-gold/20 border border-raw-gold/40 text-raw-gold text-[9px] px-2 py-0.5 uppercase tracking-widest font-bold">
                        {p.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <Link href={`/admin/products/${p.id}/information`} className="text-raw-muted hover:text-blue-400" title="Edit Rich Information">
                        <Info className="w-4 h-4 inline" />
                      </Link>
                      <button className="text-raw-muted hover:text-raw-gold" title="Edit Basic Info">
                        <Edit3 className="w-4 h-4 inline" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="text-raw-muted hover:text-red-400" title="Delete Product">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-raw-bg/80 backdrop-blur-sm" onClick={() => !isSubmitting && setIsAddModalOpen(false)} />
          <div className="relative bg-raw-card border border-raw-border w-full max-w-lg p-8 space-y-6 shadow-2xl z-10 my-8">
            <h3 className="text-lg font-serif-luxury uppercase tracking-[0.2em] text-raw-gold border-b border-raw-border pb-3">
              Add Atelier Product
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-raw-muted uppercase tracking-wider mb-1">Product Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-raw-bg border border-raw-border text-raw-ivory px-4 py-2.5 outline-none focus:border-raw-gold"
                />
              </div>

              <div>
                <label className="block text-raw-muted uppercase tracking-wider mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full bg-raw-bg border border-raw-border text-raw-ivory px-4 py-2.5 outline-none focus:border-raw-gold resize-none"
                />
              </div>

              <div>
                <label className="block text-raw-muted uppercase tracking-wider mb-1">Price in INR (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-raw-bg border border-raw-border text-raw-ivory px-4 py-2.5 outline-none focus:border-raw-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-raw-muted uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-raw-bg border border-raw-border text-raw-ivory px-4 py-2.5 outline-none focus:border-raw-gold capitalize"
                  >
                    <option value="outerwear">Outerwear</option>
                    <option value="tailored-suits">Tailored Suits</option>
                    <option value="leather-goods">Leather Goods</option>
                    <option value="footwear">Footwear</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-raw-muted uppercase tracking-wider mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-raw-bg border border-raw-border text-raw-ivory px-4 py-2.5 outline-none focus:border-raw-gold"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-raw-muted uppercase tracking-wider mb-1">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={isSubmitting}
                  className="w-full bg-raw-bg border border-raw-border text-raw-ivory px-4 py-2.5 outline-none focus:border-raw-gold file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-raw-gold file:text-raw-bg hover:file:bg-raw-goldHover"
                />
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 border border-raw-border text-raw-muted py-3 uppercase tracking-wider disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-raw-gold text-raw-bg font-bold py-3 uppercase tracking-wider disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{isSubmitting ? "Saving..." : "Save Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
