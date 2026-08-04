"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/user/orders");
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      toast.error("Error loading orders");
    } finally {
      setIsLoading(false);
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
          Order History
        </h1>
        <p className="text-xs text-raw-muted mt-1 uppercase tracking-wider">
          View your past atelier purchases
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-raw-card border border-raw-border p-12 rounded-sm text-center space-y-4">
          <Package className="w-12 h-12 text-raw-muted mx-auto" />
          <h2 className="text-raw-ivory font-serif-luxury text-lg uppercase tracking-widest">No Orders Yet</h2>
          <p className="text-raw-muted text-xs">You haven't placed any orders with The Raw House.</p>
          <div className="pt-4">
            <Link href="/catalog" className="inline-block bg-raw-gold text-raw-bg px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-raw-goldHover transition-colors">
              Explore Collection
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-raw-card border border-raw-border rounded-sm overflow-hidden">
              <div className="bg-raw-bg p-4 flex flex-col md:flex-row md:items-center justify-between border-b border-raw-border gap-4 text-xs">
                <div>
                  <p className="text-raw-muted uppercase tracking-wider">Order Number</p>
                  <p className="font-mono text-raw-gold font-bold">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-raw-muted uppercase tracking-wider">Date Placed</p>
                  <p className="text-raw-ivory">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-raw-muted uppercase tracking-wider">Total Amount</p>
                  <p className="text-raw-ivory font-bold">₹{order.totalAmount.toLocaleString("en-IN")}</p>
                </div>
                <div>
                  <p className="text-raw-muted uppercase tracking-wider">Status</p>
                  <span className="text-raw-gold font-bold tracking-widest uppercase">{order.status}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      {item.product.images?.[0]?.url ? (
                        <img src={item.product.images[0].url} alt={item.product.title} className="w-20 h-24 object-cover border border-raw-border" />
                      ) : (
                        <div className="w-20 h-24 bg-raw-bg border border-raw-border" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-serif-luxury text-raw-ivory">{item.product.title}</h4>
                        <p className="text-xs text-raw-muted mt-1 uppercase tracking-wider">
                          {item.color && `Color: ${item.color} | `} {item.size && `Size: ${item.size} | `} Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-raw-gold mt-2">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
