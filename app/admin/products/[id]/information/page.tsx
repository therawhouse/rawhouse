"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProductInformationEditor() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State - Core fields to get the CMS functional quickly.
  // We'll leave comments for where advanced matrix editors for Size Guide and Legal fields should be injected later.
  const [formData, setFormData] = useState({
    badge: "",
    descriptionHtml: "",
    fitType: "",
    length: "",
    sleeveLength: "",
    neckline: "",
    composition: "",
    careInstructions: "", // we'll split by newline
    deliveryTime: "",
    deliveryNoteHtml: "",
    returnsEligible: true,
    returnsNoteHtml: "",
  });

  useEffect(() => {
    fetch(`/api/admin/products/${id}/details`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          const d = json.data;
          setFormData({
            badge: d.badge || "",
            descriptionHtml: d.descriptionHtml || "",
            fitType: d.fitType || "",
            length: d.length || "",
            sleeveLength: d.sleeveLength || "",
            neckline: d.neckline || "",
            composition: d.composition || "",
            careInstructions: d.careInstructions?.join("\n") || "",
            deliveryTime: d.deliveryTime || "",
            deliveryNoteHtml: d.deliveryNoteHtml || "",
            returnsEligible: d.returnsEligible ?? true,
            returnsNoteHtml: d.returnsNoteHtml || "",
          });
        }
      })
      .catch(err => toast.error("Failed to load details"))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${id}/details`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          careInstructions: formData.careInstructions.split("\n").filter(Boolean),
        })
      });
      
      const json = await res.json();
      if (json.success) {
        toast.success("Product information saved successfully");
        router.push("/admin/products");
      } else {
        toast.error(json.error || "Failed to save");
      }
    } catch (err) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-raw-muted">Loading CMS...</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 space-y-8">
      <div className="flex items-center justify-between border-b border-raw-border pb-4">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products" className="text-raw-muted hover:text-raw-ivory">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-serif-luxury text-raw-ivory uppercase tracking-widest">
            Product Content Manager
          </h1>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-raw-gold hover:bg-raw-goldHover text-raw-bg px-6 py-2 uppercase tracking-widest text-xs font-bold flex items-center space-x-2 transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-12">
        {/* DESCRIPTION & FIT */}
        <section className="space-y-6">
          <h2 className="text-lg font-serif-luxury text-raw-gold uppercase tracking-[0.2em] border-b border-raw-border pb-2">
            Description & Fit
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-raw-muted">Badge (e.g. New Arrival)</label>
              <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full bg-raw-card border border-raw-border text-raw-ivory px-4 py-2" />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-raw-muted">Fit Type</label>
              <input type="text" value={formData.fitType} onChange={e => setFormData({...formData, fitType: e.target.value})} className="w-full bg-raw-card border border-raw-border text-raw-ivory px-4 py-2" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-raw-muted">Rich Description (HTML allowed)</label>
            <textarea value={formData.descriptionHtml} onChange={e => setFormData({...formData, descriptionHtml: e.target.value})} rows={5} className="w-full bg-raw-card border border-raw-border text-raw-ivory px-4 py-2" />
            <p className="text-[10px] text-raw-muted">Use standard HTML tags like &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;.</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-raw-muted">Length</label>
              <input type="text" value={formData.length} onChange={e => setFormData({...formData, length: e.target.value})} className="w-full bg-raw-card border border-raw-border text-raw-ivory px-4 py-2" />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-raw-muted">Sleeve</label>
              <input type="text" value={formData.sleeveLength} onChange={e => setFormData({...formData, sleeveLength: e.target.value})} className="w-full bg-raw-card border border-raw-border text-raw-ivory px-4 py-2" />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-raw-muted">Neckline</label>
              <input type="text" value={formData.neckline} onChange={e => setFormData({...formData, neckline: e.target.value})} className="w-full bg-raw-card border border-raw-border text-raw-ivory px-4 py-2" />
            </div>
          </div>
        </section>

        {/* MATERIAL & CARE */}
        <section className="space-y-6">
          <h2 className="text-lg font-serif-luxury text-raw-gold uppercase tracking-[0.2em] border-b border-raw-border pb-2">
            Material & Care
          </h2>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-raw-muted">Composition</label>
            <input type="text" value={formData.composition} onChange={e => setFormData({...formData, composition: e.target.value})} placeholder="e.g. 100% Mulberry Silk" className="w-full bg-raw-card border border-raw-border text-raw-ivory px-4 py-2" />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-raw-muted">Care Instructions (One per line)</label>
            <textarea value={formData.careInstructions} onChange={e => setFormData({...formData, careInstructions: e.target.value})} rows={4} className="w-full bg-raw-card border border-raw-border text-raw-ivory px-4 py-2" />
          </div>
        </section>

        {/* DELIVERY & RETURNS */}
        <section className="space-y-6">
          <h2 className="text-lg font-serif-luxury text-raw-gold uppercase tracking-[0.2em] border-b border-raw-border pb-2">
            Delivery & Returns
          </h2>
          <p className="text-xs text-raw-muted mb-4">Leave fields blank to automatically inherit global store defaults.</p>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-widest text-raw-muted">Override Delivery Time</label>
              <input type="text" value={formData.deliveryTime} onChange={e => setFormData({...formData, deliveryTime: e.target.value})} placeholder="e.g. Ships in 24 hours" className="w-full bg-raw-card border border-raw-border text-raw-ivory px-4 py-2" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center space-x-2 text-xs uppercase tracking-widest text-raw-ivory cursor-pointer">
                <input type="checkbox" checked={formData.returnsEligible} onChange={e => setFormData({...formData, returnsEligible: e.target.checked})} className="w-4 h-4 accent-raw-gold" />
                <span>Eligible for Returns</span>
              </label>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-raw-muted">Override Delivery Note (HTML)</label>
            <textarea value={formData.deliveryNoteHtml} onChange={e => setFormData({...formData, deliveryNoteHtml: e.target.value})} rows={3} className="w-full bg-raw-card border border-raw-border text-raw-ivory px-4 py-2" />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-raw-muted">Override Returns Note (HTML)</label>
            <textarea value={formData.returnsNoteHtml} onChange={e => setFormData({...formData, returnsNoteHtml: e.target.value})} rows={3} className="w-full bg-raw-card border border-raw-border text-raw-ivory px-4 py-2" />
          </div>
        </section>

        {/* 
          TODO FOR FUTURE: Add Size Guide matrix editor here 
          This requires a complex Handsontable or custom React grid component to edit the rows JSON array
        */}
        {/* 
          TODO FOR FUTURE: Add Legal Metrology fields editor here 
          This requires mapping over the ProductLegalField model
        */}

      </form>
    </div>
  );
}
