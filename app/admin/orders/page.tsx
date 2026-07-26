"use client";

import React, { useState } from "react";
import { ShoppingBag, CheckCircle, Truck, Package, XCircle } from "lucide-react";
import { toast } from "sonner";

/**
 * ============================================================================
 * THE RAW HOUSE - Admin Order Fulfillment & Status Manager
 * ============================================================================
 */

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([
    { id: "RWH-2026-901", customer: "Aarav Sharma", items: "Raw Silk Bomber (Size L)", amount: 84500, status: "PAID", paymentId: "pay_K9x811A" },
    { id: "RWH-2026-900", customer: "Priya Kapoor", items: "Monogram Weekender Tote", amount: 135000, status: "SHIPPED", paymentId: "pay_J72k90B" },
    { id: "RWH-2026-899", customer: "Devika Roy", items: "Double-Breasted Wool Blazer", amount: 112000, status: "PROCESSING", paymentId: "pay_M82x00C" },
    { id: "RWH-2026-898", customer: "Vikram Malhotra", items: "Horsebit Loafers (Size EU 42)", amount: 68000, status: "DELIVERED", paymentId: "pay_P10z99D" },
  ]);

  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order ${orderId} updated to ${newStatus}`, {
      description: "Resend shipping confirmation email queued automatically.",
    });
  };

  return (
    <div className="space-y-8 text-raw-ivory">
      <div className="border-b border-raw-border pb-6">
        <span className="text-xs uppercase tracking-[0.3em] text-raw-gold font-bold">
          CLIENT FULFILLMENT
        </span>
        <h1 className="text-2xl md:text-3xl font-serif-luxury text-raw-ivory tracking-[0.1em] uppercase">
          Atelier Order Pipeline
        </h1>
      </div>

      <div className="bg-raw-card border border-raw-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs tracking-wider">
            <thead>
              <tr className="bg-raw-bg border-b border-raw-border text-raw-muted uppercase text-[10px]">
                <th className="p-4">Order ID</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Items Ordered</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Razorpay Payment ID</th>
                <th className="p-4">Order Status</th>
                <th className="p-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-raw-border/40">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-raw-charcoal/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-raw-gold">{o.id}</td>
                  <td className="p-4 font-medium text-raw-ivory">{o.customer}</td>
                  <td className="p-4 text-raw-muted">{o.items}</td>
                  <td className="p-4 font-bold text-raw-ivory">₹{o.amount.toLocaleString("en-IN")}</td>
                  <td className="p-4 font-mono text-[11px] text-raw-muted">{o.paymentId}</td>
                  <td className="p-4">
                    <span
                      className={`text-[9px] px-2.5 py-1 uppercase tracking-widest font-bold border ${
                        o.status === "DELIVERED"
                          ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-400"
                          : o.status === "SHIPPED"
                          ? "bg-sky-950/80 border-sky-500/40 text-sky-400"
                          : "bg-raw-gold/20 border-raw-gold/40 text-raw-gold"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="bg-raw-bg border border-raw-border text-raw-ivory text-[11px] uppercase tracking-wider px-2 py-1 outline-none"
                    >
                      <option value="PAID">PAID</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
