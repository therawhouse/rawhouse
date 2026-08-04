"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, ShoppingBag, Package, Users, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/admin/analytics");
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          toast.error("Failed to load analytics");
        }
      } catch (error) {
        toast.error("Error loading dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-raw-gold">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const stats = [
    { title: "Total Revenue", value: `₹${(data?.totalRevenue || 0).toLocaleString("en-IN")}`, change: "All Time", icon: DollarSign },
    { title: "Total Orders", value: `${data?.totalOrders || 0} Orders`, change: "All Time", icon: ShoppingBag },
    { title: "Active Products", value: `${data?.activeProducts || 0} Items`, change: "In Stock", icon: Package },
    { title: "VIP Clients", value: `${data?.vipClients || 0} Registered`, change: "Total Users", icon: Users },
  ];

  const recentOrders = data?.recentOrders || [];

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
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-raw-muted">
                      No recent orders.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((o: any) => (
                    <tr key={o.id} className="hover:bg-raw-charcoal/50 transition-colors">
                      <td className="py-4 font-mono text-raw-gold">{o.id}</td>
                      <td className="py-4 font-medium text-raw-ivory">{o.customer}</td>
                      <td className="py-4 font-bold text-raw-ivory">₹{o.total?.toLocaleString("en-IN")}</td>
                      <td className="py-4">
                        <span className={`text-[9px] px-2 py-0.5 uppercase tracking-widest font-bold border ${
                          o.status === "DELIVERED"
                            ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-400"
                            : o.status === "SHIPPED"
                            ? "bg-sky-950/80 border-sky-500/40 text-sky-400"
                            : "bg-raw-gold/20 border-raw-gold/40 text-raw-gold"
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-4 text-raw-muted text-[11px]">{new Date(o.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Low Stock Alerts (Mock for now, could integrate later) */}
        <div className="lg:col-span-4 bg-raw-card border border-raw-border p-6 rounded-sm space-y-6">
          <div className="flex justify-between items-center border-b border-raw-border pb-4">
            <h3 className="text-sm font-serif-luxury uppercase tracking-[0.2em] text-raw-gold flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Inventory Threshold Alerts</span>
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <p className="text-raw-muted italic text-[11px]">Dynamic inventory alerts coming in Phase 3.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
