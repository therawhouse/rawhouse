"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AccountProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const json = await res.json();
      if (json.success) {
        setProfile(json.data);
      } else {
        toast.error("Failed to load profile");
      }
    } catch (error) {
      toast.error("Error loading profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Profile updated successfully");
      } else {
        throw new Error(json.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
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
      <div className="border-b border-raw-border pb-4">
        <h1 className="text-xl font-serif-luxury text-raw-ivory tracking-widest uppercase">
          Profile Details
        </h1>
        <p className="text-xs text-raw-muted mt-1 uppercase tracking-wider">
          Manage your personal information
        </p>
      </div>

      <div className="bg-raw-card border border-raw-border p-8 rounded-sm">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs text-raw-ivory">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-raw-muted uppercase tracking-wider">First Name</label>
              <input
                type="text"
                value={profile?.firstName || ""}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="w-full bg-raw-bg border border-raw-border px-4 py-3 outline-none focus:border-raw-gold transition-colors"
                placeholder="First Name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-raw-muted uppercase tracking-wider">Last Name</label>
              <input
                type="text"
                value={profile?.lastName || ""}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="w-full bg-raw-bg border border-raw-border px-4 py-3 outline-none focus:border-raw-gold transition-colors"
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-raw-muted uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={profile?.email || ""}
              disabled
              className="w-full bg-raw-charcoal/50 border border-raw-border px-4 py-3 outline-none text-raw-muted cursor-not-allowed"
            />
            <p className="text-[10px] text-raw-muted/70">Email cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-raw-muted uppercase tracking-wider">Phone Number</label>
            <input
              type="tel"
              value={profile?.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full bg-raw-bg border border-raw-border px-4 py-3 outline-none focus:border-raw-gold transition-colors"
              placeholder="+91"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-raw-gold text-raw-bg font-bold py-3 px-8 uppercase tracking-widest text-xs hover:bg-raw-goldHover transition-colors flex items-center justify-center space-x-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
