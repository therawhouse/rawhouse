"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/user/addresses");
      const json = await res.json();
      if (json.success) {
        setAddresses(json.data);
      } else {
        toast.error("Failed to load addresses");
      }
    } catch (error) {
      toast.error("Error loading addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      
      toast.success("Address added successfully");
      setIsAdding(false);
      setFormData({
        fullName: "",
        phone: "",
        streetAddress: "",
        apartment: "",
        city: "",
        state: "",
        postalCode: "",
        isDefault: false,
      });
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.message || "Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    try {
      const res = await fetch(`/api/user/addresses?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success("Address deleted");
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete address");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-raw-card border border-raw-border p-8 rounded-sm flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-raw-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-raw-border pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-serif-luxury text-raw-ivory tracking-widest uppercase">
            Address Book
          </h1>
          <p className="text-xs text-raw-muted mt-1 uppercase tracking-wider">
            Manage your delivery destinations
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-raw-gold hover:text-raw-goldHover transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-raw-card border border-raw-border p-6 rounded-sm mb-8">
          <h3 className="text-sm font-serif-luxury text-raw-gold uppercase tracking-widest mb-4">Add New Address</h3>
          <form onSubmit={handleAddAddress} className="space-y-4 text-xs text-raw-ivory">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-raw-bg border border-raw-border px-4 py-3 outline-none focus:border-raw-gold"
              />
              <input
                type="tel"
                required
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-raw-bg border border-raw-border px-4 py-3 outline-none focus:border-raw-gold"
              />
            </div>
            <input
              type="text"
              required
              placeholder="Street Address"
              value={formData.streetAddress}
              onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
              className="w-full bg-raw-bg border border-raw-border px-4 py-3 outline-none focus:border-raw-gold"
            />
            <input
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
              value={formData.apartment}
              onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
              className="w-full bg-raw-bg border border-raw-border px-4 py-3 outline-none focus:border-raw-gold"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input
                type="text"
                required
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-raw-bg border border-raw-border px-4 py-3 outline-none focus:border-raw-gold md:col-span-2"
              />
              <input
                type="text"
                required
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-raw-bg border border-raw-border px-4 py-3 outline-none focus:border-raw-gold"
              />
              <input
                type="text"
                required
                placeholder="PIN Code"
                pattern="[0-9]{6}"
                title="6 digit Pincode"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full bg-raw-bg border border-raw-border px-4 py-3 outline-none focus:border-raw-gold"
              />
            </div>
            
            <label className="flex items-center space-x-2 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="accent-raw-gold"
              />
              <span className="text-raw-muted">Set as default shipping address</span>
            </label>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-3 border border-raw-border text-raw-muted uppercase tracking-widest font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-raw-gold text-raw-bg uppercase tracking-widest font-bold hover:bg-raw-goldHover flex justify-center items-center"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.length === 0 && !isAdding ? (
          <p className="text-raw-muted text-xs col-span-2">You haven't saved any addresses yet.</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="bg-raw-card border border-raw-border p-6 rounded-sm relative group">
              {address.isDefault && (
                <span className="absolute top-4 right-4 text-[9px] bg-raw-gold/20 text-raw-gold px-2 py-0.5 uppercase tracking-widest font-bold border border-raw-gold/40">
                  Default
                </span>
              )}
              <h3 className="font-serif-luxury text-raw-ivory mb-2">{address.fullName}</h3>
              <div className="text-xs text-raw-muted space-y-1">
                <p>{address.streetAddress}</p>
                {address.apartment && <p>{address.apartment}</p>}
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p className="pt-2">{address.phone}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-raw-border">
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-widest flex items-center space-x-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
