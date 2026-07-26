"use client";

import React from "react";
import { DollarSign, ShoppingBag, Package, Users, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

/**
 * ============================================================================
 * THE RAW HOUSE - Admin Overview Dashboard Page
 * ============================================================================
 */

export default function AdminOverviewPage() {
  const stats = [
    { title: "Total Revenue", value: "₹14,85,000", change: "+18.4%", icon: DollarSign },
    { title: "Total Orders", value: "142 Orders", change: "+12.1%", icon: ShoppingBag },
    { title: "Active Products", value: "48 Items", change: "In Stock", icon: Package },
    { title: "VIP Clients", value: "328 Registered", change: "+8 New Today", icon: Users },
  ];

  const recentOrders = [
    { id: "RWH-2026-901", customer: "Aarav Sharma", total: "₹1,96,500", status: "PAID", date: "Just now" },
    { id: "RWH-2026-900", customer: "Priya Kapoor", total: "₹84,500", status: "SHIPPED", date: "1 hour ago" },
    { id: "RWH-2026-899", customer: "Devika Roy", total: "₹1,35,000", status: "PROCESSING", date: "3 hours ago" },
    { id: "RWH-2026-898", customer: "Vikram Malhotra", total: "₹68,000", status: "DELIVERED", date: "Yesterday" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-[0.3em] text-raw-gold font-bold">
          ADMINISTRATION CONSOLE
        </span>
        <h1 className="text-2xl md:text-3xl font-serif-luxury text-raw-ivory tracking-[0.1em] uppercase">
          Atelier Performance Summary
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-raw-card border border-raw-border p-6 rounded-sm space-y-4 shadow-lg"
            >
              <div className="flex justify-between items-center text-raw-gold">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-raw-muted">
                  {item.title}
                </span>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-serif-luxury tracking-wide text-raw-ivory font-bold">
                {item.value}
              </div>
              <div className="text-[11px] text-raw-gold flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{item.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Stock Alert Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Orders */}
        <div className="lg:col-span-8 bg-raw-card border border-raw-border p-6 rounded-sm space-y-6">
          <div className="flex justify-between items-center border-b border-raw-border pb-4">
            <h3 className="text-sm font-serif-luxury uppercase tracking-[0.2em] text-raw-ivory">
              Recent High-Value Atelier Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs text-raw-gold hover:underline tracking-wider uppercase font-semibold"
            >
              View All Orders
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs tracking-wider">
              <thead>
                <tr className="border-b border-raw-border/60 text-raw-muted uppercase text-[10px]">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Payment Status</th>
                  <th className="pb-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-raw-border/40">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-raw-charcoal/50 transition-colors">
                    <td className="py-4 font-mono text-raw-gold">{o.id}</td>
                    <td className="py-4 font-medium text-raw-ivory">{o.customer}</td>
                    <td className="py-4 font-bold text-raw-ivory">{o.total}</td>
                    <td className="py-4">
                      <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[9px] px-2 py-0.5 uppercase tracking-widest font-bold">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 text-raw-muted text-[11px]">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Low Stock Alerts */}
        <div className="lg:col-span-4 bg-raw-card border border-raw-border p-6 rounded-sm space-y-6">
          <div className="flex justify-between items-center border-b border-raw-border pb-4">
            <h3 className="text-sm font-serif-luxury uppercase tracking-[0.2em] text-raw-gold flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Inventory Threshold Alerts</span>
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-raw-bg border border-raw-border rounded-sm space-y-1">
              <div className="flex justify-between text-raw-ivory font-bold">
                <span>Raw Silk Bomber Jacket</span>
                <span className="text-raw-gold font-mono">2 left</span>
              </div>
              <p className="text-[11px] text-raw-muted">Variant: Espresso Brown / Size L</p>
            </div>

            <div className="p-3 bg-raw-bg border border-raw-border rounded-sm space-y-1">
              <div className="flex justify-between text-raw-ivory font-bold">
                <span>Horsebit Loafers</span>
                <span className="text-raw-gold font-mono">1 left</span>
              </div>
              <p className="text-[11px] text-raw-muted">Variant: Antique Bronze / Size EU 42</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
