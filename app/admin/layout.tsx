"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Tag, BarChart3, ArrowLeft, ShieldCheck, LogOut } from "lucide-react";
import { toast } from "sonner";

/**
 * ============================================================================
 * THE RAW HOUSE - Luxury Concierge Admin Layout
 * ============================================================================
 */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      toast.success("Securely logged out.");
      // Redirect to login and force reload to clear cache
      window.location.href = "/admin/login";
    } catch (error) {
      toast.error("Error logging out.");
    }
  };

  if (pathname === "/admin/login") {
    return <main>{children}</main>;
  }

  return (
    <div className="min-h-screen bg-raw-bg text-raw-ivory flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-raw-card border-r border-raw-border p-6 flex flex-col justify-between space-y-8">
        <div className="space-y-8">
          {/* Logo */}
          <div className="border-b border-raw-border pb-6">
            <span className="text-raw-gold text-xl font-serif-luxury tracking-tighter">𝓡</span>
            <h2 className="text-lg font-serif-luxury tracking-[0.2em] text-raw-ivory uppercase">
              RAW HOUSE ADMIN
            </h2>
            <p className="text-[10px] text-raw-gold tracking-widest uppercase">
              Management Suite
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 text-xs uppercase tracking-widest font-semibold">
            <Link
              href="/admin"
              className="flex items-center space-x-3 px-4 py-3 rounded-sm bg-raw-gold/10 text-raw-gold border border-raw-gold/30 hover:bg-raw-gold/20 transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center space-x-3 px-4 py-3 rounded-sm hover:bg-raw-charcoal text-raw-muted hover:text-raw-ivory border border-transparent transition-all"
            >
              <Package className="w-4 h-4 text-raw-gold" />
              <span>Products & Stock</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center space-x-3 px-4 py-3 rounded-sm hover:bg-raw-charcoal text-raw-muted hover:text-raw-ivory border border-transparent transition-all"
            >
              <ShoppingCart className="w-4 h-4 text-raw-gold" />
              <span>Orders & Status</span>
            </Link>

            <Link
              href="/admin/analytics"
              className="flex items-center space-x-3 px-4 py-3 rounded-sm hover:bg-raw-charcoal text-raw-muted hover:text-raw-ivory border border-transparent transition-all"
            >
              <BarChart3 className="w-4 h-4 text-raw-gold" />
              <span>Revenue Analytics</span>
            </Link>
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-raw-border pt-6 space-y-4 text-xs">
          <div className="flex items-center space-x-2 text-raw-gold">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[11px] tracking-wider">Concierge Admin Role</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors text-[11px] tracking-wider w-full text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Secure Log Out</span>
          </button>
          <Link
            href="/"
            className="flex items-center space-x-2 text-raw-muted hover:text-raw-ivory transition-colors text-[11px] tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
