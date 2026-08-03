"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        toast.success("Access Granted. Welcome to the Manager Suite.");
        // Redirect to admin overview and force a refresh to clear cached middleware
        window.location.href = "/admin";
      } else {
        const data = await response.json();
        toast.error(data.error || "Incorrect password. Access denied.");
        setPassword("");
      }
    } catch (error) {
      toast.error("An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0a09] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#140e0c] border border-gray-800 p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c69255] to-transparent" />

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center bg-black">
              <Lock className="w-5 h-5 text-[#c69255]" />
            </div>
          </div>
          <h1 className="text-2xl text-[#f9f6f0] font-serif-luxury tracking-[0.15em] uppercase mb-2">
            Restricted Access
          </h1>
          <p className="text-xs text-gray-500 tracking-widest uppercase">
            The Raw House • Management Suite
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest block">
              Administrative Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-800 text-[#f9f6f0] px-4 py-3 text-sm focus:outline-none focus:border-[#c69255] transition-colors"
              placeholder="••••••••••••"
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-[#c69255] hover:bg-[#b07b41] text-black text-xs font-bold uppercase tracking-[0.2em] py-4 px-4 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? "Authenticating..." : "Secure Login"}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-gray-800 pt-6">
          <p className="text-[10px] text-gray-600 tracking-widest uppercase">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}
