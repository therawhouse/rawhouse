"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
      }
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      // Optimistic update
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success(`Order ${orderId.split("-")[0]} updated to ${newStatus}`, {
        description: "Status successfully synced to database.",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status");
      fetchOrders(); // Revert on failure
    }
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
                <th className="p-4">Order Number</th>
                <th className="p-4">Client</th>
                <th className="p-4">Items</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment ID</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-raw-border/40">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-raw-muted">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-raw-muted">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-raw-charcoal/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-raw-gold">{o.orderNumber || o.id.split("-")[0]}</td>
                    <td className="p-4 font-medium text-raw-ivory">
                      {o.user?.name || o.user?.email || "Guest"}
                    </td>
                    <td className="p-4 text-raw-muted">
                      {o.items?.map((i: any) => `${i.product?.title} (x${i.quantity})`).join(", ")}
                    </td>
                    <td className="p-4 font-bold text-raw-ivory">₹{o.totalAmount?.toLocaleString("en-IN") || o.total?.toLocaleString("en-IN")}</td>
                    <td className="p-4 font-mono text-[11px] text-raw-muted">{o.razorpayPaymentId || "N/A"}</td>
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
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="REFUNDED">REFUNDED</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
